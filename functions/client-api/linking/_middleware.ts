function makeErrorResponse(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    headers: {
      "content-type": "application/json",
    },
    status,
  });
}

export async function onRequestPost(
  context: EventContext<{ [k: string]: string }, string, { [k: string]: any }>
) {
  if (!context.data.user) return makeErrorResponse("Unauthenticated", 401);

  return await context.next();
}
