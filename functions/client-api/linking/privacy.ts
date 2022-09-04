export async function onRequestPost(
  context: EventContext<
    { [k: string]: string } & { VERIFICATIONS: KVNamespace },
    string,
    { [k: string]: any }
  >
) {
  const { discord, roblox } = context.data;

  if (!discord || !roblox)
    return new Response(
      JSON.stringify({ error: "Missing required properties" }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 400,
      }
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
      }
    );

  const verifyKey = await context.env.VERIFICATIONS.get(context.data.user.id);

  if (!verifyKey)
    return new Response(JSON.stringify({ error: "You are not verified" }), {
      headers: {
        "content-type": "application/json",
      },
      status: 400,
    });

  const verifyData = JSON.parse(verifyKey);
  verifyData.privacy = { discord, roblox };

  await context.env.VERIFICATIONS.put(
    context.data.user.id,
    JSON.stringify(verifyData)
  );
  return new Response(null, {
    status: 204,
  });
}
