import makeResponse from "functions/api/makeResponse";

export async function onRequest(context: RequestContext) {
  if (!context.data.user)
    return makeResponse({ error: "You are not logged in" }, 401);

  const verification = await context.env.REGISTRY_DB.prepare(
    "SELECT * FROM verifications WHERE discord_id = ? AND server_id IS NULL;",
  )
    .bind(context.data.user.id)
    .first();

  if (!verification)
    return makeResponse({ error: "You are not verified" }, 403);

  return await context.next();
}
