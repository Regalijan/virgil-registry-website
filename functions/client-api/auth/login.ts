import { Context } from "../../..";

export async function onRequestGet(context: Context) {
  const { env, request } = context;
  const { hostname, protocol } = new URL(request.url);
  return Response.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${
      env.DISCORD_CLIENT
    }&redirect_uri=${encodeURIComponent(
      `${protocol}//${hostname}/client-api/auth/callback`
    )}&response_type=code&scope=identify`
  );
}
