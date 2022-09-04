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
    name: string;
  } = await usernameCheckReq.json();

  if (verifyData.username !== rbxUserData.name) {
    verifyData.username = rbxUserData.name;
    await verifyKV.put(context.data.user.id, JSON.stringify(verifyData));
  }

  return new Response(null, {
    status: 204,
  });
}
