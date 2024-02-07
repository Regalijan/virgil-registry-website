export async function onRequestPost(
  context: EventContext<Env, string, { [k: string]: any }>,
) {
  const { discord, roblox, user } = context.data.body;

  if (typeof discord !== "number" || typeof roblox !== "number")
    return new Response(
      JSON.stringify({ error: "Missing required properties" }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 400,
      },
    );

  if (
    typeof discord !== "number" ||
    typeof roblox !== "number" ||
    discord < 0 ||
    discord > 2 ||
    roblox < 0 ||
    roblox > 2
  )
    return new Response(
      JSON.stringify({
        error: 'Values of "discord" and "roblox" must be between 0 and 2',
      }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 400,
      },
    );

  await context.env.REGISTRY_DB.prepare(
    "UPDATE verifications SET discord_privacy = ?, roblox_privacy = ? WHERE discord_id = ? AND roblox_id = ?",
  )
    .bind(discord, roblox, context.data.user.id, user)
    .run();

  return new Response(null, {
    status: 204,
  });
}
