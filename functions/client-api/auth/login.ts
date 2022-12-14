export async function onRequestGet(
  context: EventContext<{ [k: string]: string }, string, { [k: string]: any }>
): Promise<Response> {
  const { env, request } = context;
  const { hostname, protocol } = new URL(request.url);

  return new Response(
    JSON.stringify({
      url: `https://discord.com/oauth2/authorize?client_id=${
        env.DISCORD_ID
      }&redirect_uri=${encodeURIComponent(
        `${protocol}//${hostname}/login`
      )}&response_type=code&scope=identify%20role_connections.write`,
    })
  );
}
