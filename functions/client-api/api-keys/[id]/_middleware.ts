import makeResponse from "functions/api/makeResponse";

export async function onRequest(context: RequestContext) {
  const id = context.params.id as string;

  if (id === "new") return await context.next();

  if (
    !(await context.env.REGISTRY_DB.prepare(
      "SELECT key_id WHERE key_id = ? AND user = ?;",
    )
      .bind(id, context.data.user.id)
      .first())
  )
    return makeResponse({ error: "You cannot manage that API key" }, 403);

  return await context.next();
}
