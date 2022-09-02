function makeError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    headers: {
      "content-type": "application/json",
    },
    status,
  });
}

export async function onRequest(context: EventContext<{[k:string]:string},string,{[k:string]:any}>) {
  const { request } = context;
  const sessionStore = context.env.SESSIONS as unknown as KVNamespace;
  const authToken = request.headers.get("authorization");

  if (authToken) {
    const tokenHash = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(authToken))
    const session = await sessionStore.get(Array.from(new Uint8Array(tokenHash)).map((b) => b.toString(16).padStart(2, "0")).join(""))
    if (session)
      context.data.user = JSON.parse(session);
  }

  if (request.method === "POST") {
    if (request.headers.get("content-type") !== "application/json")
      return makeError("Content-Type must be application/json", 400);

    try {
      context.data.body = await request.json();
    } catch {
      return makeError("Invalid JSON", 400)
    }
  }

  return await context.next();
}