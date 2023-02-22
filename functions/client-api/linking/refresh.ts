export async function onRequestPost(
  context: EventContext<
    { [k: string]: string } & { VERIFICATIONS: KVNamespace },
    string,
    { [k: string]: any }
  >
) {
  const verifyKV = context.env.VERIFICATIONS;
  const verifyKey = await verifyKV.get(context.data.user.id);

  if (!verifyKey)
    return new Response(JSON.stringify({ error: "You are not verified" }), {
      headers: {
        "content-type": "application/json",
      },
      status: 400,
    });

  const verifyData = JSON.parse(verifyKey);
  const usernameCheckReq = await fetch(
    `https://users.roblox.com/v1/users/${verifyData.id}`
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
      }
    );

  const rbxUserData: {
    id: number;
    name: string;
  } = await usernameCheckReq.json();

  const response_obj = { roblox_username: rbxUserData.name };

  if (verifyData.username !== rbxUserData.name) {
    verifyData.username = rbxUserData.name;
    await verifyKV.put(context.data.user.id, JSON.stringify(verifyData));

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
      }
    );

    const thumbFetch = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar?userIds=${rbxUserData.id}&size=180x180&format=Png`
    );

    if (thumbFetch.ok)
      Object.defineProperty(response_obj, "roblox_avatar", {
        value: ((await thumbFetch.json()) as { data: { [k: string]: any }[] })
          .data[0].imageUrl,
      });
  }

  return new Response(JSON.stringify(response_obj), {
    headers: {
      "content-type": "application/json",
    },
  });
}
