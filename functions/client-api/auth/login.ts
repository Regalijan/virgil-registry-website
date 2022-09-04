export async function onRequestPost(
  context: EventContext<{ [k: string]: string }, string, { [k: string]: any }>
): Promise<Response> {
  const { env, request } = context;
  const { hostname, protocol } = new URL(request.url);
  let body: { challenge: string };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      headers: {
        "content-type": "application/json",
      },
      status: 400,
    });
  }

  if (!body.challenge)
    return new Response(JSON.stringify({ error: "Missing challenge" }), {
      headers: {
        "content-type": "application/json",
      },
      status: 400,
    });

  const kvstore = env.SESSIONS as unknown as KVNamespace;

  await kvstore.put(
    `challenge_${body.challenge}`,
    request.headers.get("CF-Connecting-IP") as string,
    { expirationTtl: 300 }
  );

  return new Response(
    JSON.stringify({
      url: `https://discord.com/oauth2/authorize?client_id=${
        env.DISCORD_ID
      }&code_challenge=${
        body.challenge
      }&code_challenge_method=S256&redirect_uri=${encodeURIComponent(
        `${protocol}//${hostname}/login`
      )}&response_type=code&scope=identify`,
    })
  );
}
