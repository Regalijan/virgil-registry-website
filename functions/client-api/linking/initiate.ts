export async function onRequestGet(
  context: EventContext<{ [k: string]: string }, string, { [k: string]: any }>
) {
  return new Response(JSON.stringify({ client_id: context.env.RBX_ID }), {
    headers: {
      "content-type": "application/json",
    },
  });
}
