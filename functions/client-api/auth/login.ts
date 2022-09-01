export async function onRequestGet(context: EventContext<{[k: string]: any}, any, any>): Promise<Response> {
  const { env, request } = context;
  const { hostname, protocol } = new URL(request.url);
  return Response.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${
      env.DISCORD_ID
    }&redirect_uri=${encodeURIComponent(
      `${protocol}//${hostname}/login`
    )}&response_type=code&scope=identify`
  );
}
