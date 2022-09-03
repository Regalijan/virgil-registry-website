export async function onRequestPost(
  context: EventContext<{ [k: string]: string }, string, { [k: string]: any }>
) {
  const { data, env } = context;

  if (!data.body?.code || !data.body.verifier)
    return new Response(
      JSON.stringify({ error: 'Missing "code" or "verifier"' }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 400,
      }
    );

  const jwtFetch = await fetch("https://apis.roblox.com/oauth/v1/token", {
    headers: {
      authorization: `Basic ${btoa(env.RBX_ID + ":" + env.RBX_SECRET)}`,
      "content-type": "application/x-www-form-urlencoded",
    },
  });

  if (!jwtFetch.ok)
    return new Response(JSON.stringify({ error: "Failed to redeem code" }), {
      headers: {
        "content-type": "application/json",
      },
      status: 500,
    });

  const {
    access_token,
    id_token,
  }: { access_token: string; id_token?: string } = await jwtFetch.json();

  if (!id_token)
    return new Response(
      JSON.stringify({ error: "Failed to verify information from Roblox" }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 500,
      }
    );

  const decodedToken: { [k: string]: string } = JSON.parse(
    atob(id_token.replaceAll("-", "+").replaceAll("_", "/"))
  );
  const verifyKV = env.VERIFICATIONS as unknown as KVNamespace;

  await verifyKV.put(
    data.user.id,
    JSON.stringify({
      id: parseInt(decodedToken.sub),
      username: decodedToken.name,
    })
  );

  const reverseData: string[] = JSON.parse(
    (await verifyKV.get(decodedToken.sub)) ?? "[]"
  );

  reverseData.push(data.user.id);
  await verifyKV.put(decodedToken.sub, JSON.stringify(reverseData));

  await fetch("https://apis.roblox.com/oauth/v1/token/revoke", {
    body: `token=${access_token}`,
    headers: {
      authorization: `Basic ${btoa(env.RBX_ID + ":" + env.RBX_SECRET)}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  return new Response(null, {
    status: 204,
  });
}
