export async function onRequestGet(
  context: EventContext<Env, string, { [k: string]: any }>
) {
  const locatedUser: User | null = await context.env.VERIFICATIONS.get(
    "",
    "json"
  );
  const { data } = context;

  if (!locatedUser) return makeResponse({ error: "User is not verified" }, 404);

  const userPrivacy = locatedUser.privacy;

  delete locatedUser.privacy;

  if (!userPrivacy?.discord || data.is_internal)
    return makeResponse(locatedUser, 200);

  if (!data.apiKeyInfo)
    return makeResponse({ error: "Resource requires API token" }, 401);

  if (data.apiKeyInfo.access_level > userPrivacy.discord)
    return makeResponse({ error: "You cannot access this user" }, 403);

  return makeResponse(locatedUser, 200);
}
