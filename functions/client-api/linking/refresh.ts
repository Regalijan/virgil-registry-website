import makeResponse from "functions/api/makeResponse";

export async function onRequestPost(
  context: EventContext<Env, string, { [k: string]: any }>,
) {
  const { user } = context.data.body;

  if (!user) return makeResponse({ error: "No user to refresh" }, 400);

  const existingVerification = await context.env.REGISTRY_DB.prepare(
    "SELECT id FROM verifications WHERE discord_id = ? AND roblox_id = ?;",
  )
    .bind(context.data.user.id, user)
    .first();

  if (!existingVerification)
    return new Response(JSON.stringify({ error: "You are not verified" }), {
      headers: {
        "content-type": "application/json",
      },
      status: 400,
    });

  const usernameCheckReq = await fetch(
    `https://users.roblox.com/v1/users/${user}`,
  );

  if (!usernameCheckReq.ok)
    return new Response(
      JSON.stringify({
        error: "Roblox returned an error when checking current username",
      }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 500,
      },
    );

  const rbxUserData: {
    id: number;
    name: string;
  } = await usernameCheckReq.json();

  const response_obj: { [k: string]: string } = { username: rbxUserData.name };

  if (existingVerification.username !== rbxUserData.name) {
    await context.env.REGISTRY_DB.prepare(
      "UPDATE verifications SET username = ? WHERE id = ?;",
    )
      .bind(rbxUserData.name, existingVerification.id)
      .run();
    await fetch(
      `https://discord.com/api/v10/users/@me/applications/${context.env.DISCORD_ID}/role-connection`,
      {
        body: JSON.stringify({
          metadata: {
            verified: true,
          },
          platform_name: "Roblox",
          platform_username: rbxUserData.name,
        }),
        headers: {
          authorization: `Bearer ${context.data.user.access_token}`,
          "content-type": "application/json",
        },
        method: "PUT",
      },
    );

    const thumbFetch = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar?userIds=${rbxUserData.id}&size=180x180&format=Png`,
    );

    if (thumbFetch.ok)
      response_obj.avatar = (
        (await thumbFetch.json()) as { data: { [k: string]: any }[] }
      ).data[0].imageUrl;
  }

  return new Response(JSON.stringify(response_obj), {
    headers: {
      "content-type": "application/json",
    },
  });
}
