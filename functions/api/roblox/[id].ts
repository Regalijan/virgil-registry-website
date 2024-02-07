import makeResponse from "../makeResponse";

export async function onRequestGet(
  context: EventContext<Env, string, { [k: string]: any }>,
) {
  const locatedUsers = (
    await context.env.REGISTRY_DB.prepare(
      "SELECT discord_id, roblox_privacy FROM verifications WHERE roblox_id = ?;",
    )
      .bind(context.params.id)
      .all()
  ).results;
  const { data } = context;

  if (!locatedUsers.length)
    return makeResponse(
      { error: "No Discord accounts linked to this Roblox account" },
      404,
    );

  if (data.is_internal)
    return makeResponse(
      locatedUsers.map((u) => u.roblox_id),
      200,
    );

  const usersToReturn = [];

  for (const user of locatedUsers) {
    if ((user.roblox_privacy as number) <= data.apiKeyInfo?.access_level)
      usersToReturn.push(user.discord_id);
  }

  if (!usersToReturn.length)
    return makeResponse(
      {
        error: data.apiKeyInfo
          ? "You cannot access the discord accounts of this user"
          : "Resource requires API key",
      },
      data.apiKeyInfo ? 403 : 401,
    );

  return makeResponse(usersToReturn, 200);
}
