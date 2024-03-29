export async function onRequest(
  context: EventContext<Env, string, { [k: string]: any }>,
) {
  const authToken = context.request.headers.get("authorization");

  if (!authToken) return await context.next();

  if (!authToken.startsWith("Bearer "))
    return new Response('{"error":"Malformed token"}', {
      headers: {
        "content-type": "application/json",
      },
      status: 400,
    });

  if (authToken.split(" ")[1] === context.env.INTERNAL_KEY) {
    context.data.is_internal = true;
    return await context.next();
  }

  const apiKeyHash = Array.from(
    new Uint8Array(
      await crypto.subtle.digest(
        "SHA-512",
        new TextEncoder().encode(authToken.split(" ")[1]),
      ),
    ),
  )
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  context.data.apiKeyInfo = await context.env.REGISTRY_DB.prepare(
    "SELECT access_level FROM api_keys WHERE key_hash = ?;",
  )
    .bind(apiKeyHash)
    .first();

  if (!context.data.apiKeyInfo)
    return new Response('{"error":"Invalid token"}', {
      headers: {
        "content-type": "application/json",
      },
      status: 401,
    });

  return await context.next();
}
