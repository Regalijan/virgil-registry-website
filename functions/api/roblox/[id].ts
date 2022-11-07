import makeResponse from "../makeResponse";

export async function onRequestGet(
  context: EventContext<Env, string, { [k: string]: any }>
) {
  const locatedUsers: string[] | null = await context.env.VERIFICATIONS.get(
    context.params.id as string,
    "json"
  );
  const { data } = context;

  if (!locatedUsers)
    return makeResponse(
      { error: "No Discord accounts linked to this Roblox account" },
      404
    );

  if (data.is_internal) return makeResponse(locatedUsers, 200);

  const usersToReturn = [];

  for (const userId of locatedUsers) {
    const user: User | null = await context.env.VERIFICATIONS.get(
      userId,
      "json"
    );

    if (!user) continue;

    if ((user.privacy?.discord as number) > data.apiKeyInfo?.access_level)
      continue;

    delete user.privacy;
    usersToReturn.push(userId);
  }

  if (!usersToReturn.length)
    return makeResponse(
      {
        error: data.apiKeyInfo
          ? "You cannot access the discord accounts of this user"
          : "Resource requires API key",
      },
      data.apiKeyInfo ? 403 : 401
    );

  return makeResponse(usersToReturn, 200);
}
