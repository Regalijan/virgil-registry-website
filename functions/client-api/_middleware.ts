function makeError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    headers: {
      "content-type": "application/json",
    },
    status,
  });
}

export async function onRequest(context: RequestContext) {
  const { request } = context;

  if (request.method === "POST") {
    if (request.headers.get("content-type") !== "application/json")
      return makeError("Content-Type must be application/json", 400);

    try {
      context.data.body = await request.json();
    } catch {
      return makeError("Invalid JSON", 400);
    }
  }

  return await context.next();
}
