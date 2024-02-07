import makeResponse from "../makeResponse";

export async function onRequestGet(
  context: EventContext<Env, string, { [k: string]: any }>,
) {
  const serverId = new URLSearchParams(context.request.url).get("server_id");

  if (
    serverId &&
    (serverId.match(/\D/) || serverId.length > 19 || serverId.length < 17)
  )
    return makeResponse({ error: "Invalid Server ID" }, 400);

  const locatedUser = await context.env.REGISTRY_DB.prepare(
    "SELECT discord_privacy, roblox_id, username FROM verifications WHERE discord_id = ? AND server_id = ?;",
  )
    .bind(context.params.id, serverId)
    .first();

  const { data } = context;

  if (!locatedUser) return makeResponse({ error: "User is not verified" }, 404);

  const userPrivacy = locatedUser.discord_privacy;
  delete locatedUser.discord_privacy;

  if (!userPrivacy || data.is_internal) return makeResponse(locatedUser, 200);

  if (!data.apiKeyInfo)
    return makeResponse({ error: "Resource requires API token" }, 401);

  if (data.apiKeyInfo.access_level > userPrivacy)
    return makeResponse({ error: "You cannot access this user" }, 403);

  return makeResponse(locatedUser, 200);
}
