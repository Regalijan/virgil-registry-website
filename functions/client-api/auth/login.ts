import { Context } from "../../..";

export async function onRequestGet(context: Context): Promise<Response> {
  const { env, request } = context;
  const { hostname, protocol } = new URL(request.url);
  return Response.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${
      env.DISCORD_CLIENT
    }&redirect_uri=${encodeURIComponent(
      `${protocol}//${hostname}/login`
    )}&response_type=code&scope=identify`
  );
}
