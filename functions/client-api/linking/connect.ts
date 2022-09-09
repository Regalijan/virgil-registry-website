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

  const { hostname, protocol } = new URL(context.request.url);

  const jwtFetch = await fetch("https://apis.roblox.com/oauth/v1/token", {
    body: new URLSearchParams({
      code: data.body.code,
      code_verifier: data.body.verifier,
      grant_type: "authorization_code",
      redirect_uri: `${protocol}//${hostname}/link`,
    }).toString(),
    headers: {
      authorization: `Basic ${btoa(env.RBX_ID + ":" + env.RBX_SECRET)}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!jwtFetch.ok)
    return new Response(JSON.stringify({ error: "Failed to redeem code" }), {
      headers: {
        "content-type": "application/json",
      },
      status: 500,
    });

  const {
    id_token,
    refresh_token,
  }: { id_token?: string; refresh_token: string } = await jwtFetch.json();

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

  const tokenPart = id_token.split(".")[1];

  let decodedToken: { [k: string]: string };

  try {
    decodedToken = JSON.parse(
      atob(tokenPart.replaceAll("-", "+").replaceAll("_", "/"))
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to decode ID token" }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 500,
      }
    );
  }

  const verifyKV = env.VERIFICATIONS as unknown as KVNamespace;

  await verifyKV.put(
    data.user.id,
    JSON.stringify({
      id: parseInt(decodedToken.sub),
      username: decodedToken.preferred_username,
      privacy: {
        discord: 0,
        roblox: 1,
      },
    })
  );

  const reverseData: string[] = JSON.parse(
    (await verifyKV.get(decodedToken.sub)) ?? "[]"
  );

  reverseData.push(data.user.id);
  await verifyKV.put(decodedToken.sub, JSON.stringify(reverseData));

  await fetch("https://apis.roblox.com/oauth/v1/token/revoke", {
    body: `token=${refresh_token}`,
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
