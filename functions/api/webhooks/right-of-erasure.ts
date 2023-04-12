function makeResponse(body: string, status: number): Response {
  return new Response(body, {
    headers: {
      "content-type": "application/json",
    },
    status,
  });
}

export async function onRequestPost(
  context: EventContext<Env, string, { [k: string]: any }>
) {
  if (!context.env.ROBLOX_WEBHOOK_SECRET)
    return makeResponse('{"error":"This endpoint is currently disabled"}', 503);

  const robloxSig = context.request.headers.get("roblox-signature");

  if (!robloxSig)
    return makeResponse('{"error":"No signature header provided"}', 400);

  const [timestamp, sig] = robloxSig.split(",");

  if (!sig) return makeResponse('{"error":"Missing signature"}', 400);

  if (parseInt(timestamp.replace("t=", "")) < Date.now() - 600000)
    return makeResponse('{"error":"This request is stale"}', 406);

  const body = await context.request.text();
  const textEncode = new TextEncoder().encode;

  const key = await crypto.subtle.importKey(
    "raw",
    textEncode(context.env.ROBLOX_WEBHOOK_SECRET),
    {
      hash: "SHA-256",
      name: "HMAC",
    },
    false,
    ["verify"]
  );

  if (
    !(await crypto.subtle.verify(
      "HMAC",
      key,
      Uint8Array.from(atob(sig.replace("v1=", "")), (c) => c.charCodeAt(0)),
      textEncode(`${timestamp.replace("t=", "")}.${body}`)
    ))
  )
    return makeResponse('{"error":"Invalid signature"}', 403);

  const data = JSON.parse(body);

  if (data.EventType === "SampleNotification")
    return new Response(null, { status: 204 });

  if (data.EventType !== "RightToErasureRequest")
    return makeResponse('{"error":"Invalid event type"}', 400);

  const { UserId: user }: { UserId: number } = data.EventPayload;

  const reverseData = await context.env.VERIFICATIONS.get(user.toString());

  if (!reverseData) return new Response(null, { status: 204 });

  for (const user of JSON.parse(reverseData))
    await context.env.VERIFICATIONS.delete(user);

  await context.env.VERIFICATIONS.delete(user.toString());

  return new Response(null, { status: 204 });
}
