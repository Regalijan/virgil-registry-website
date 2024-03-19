export async function onRequestPost(context: RequestContext) {
  if (!context.data.user)
    return new Response('{"error":"Not logged in"}', {
      headers: {
        "content-type": "application/json",
      },
      status: 401,
    });

  const verificationData = await context.env.REGISTRY_DB.prepare(
    "SELECT * FROM verifications WHERE discord_id = ?;",
  )
    .bind(context.data.user.id)
    .all();
  const keyData = await context.env.REGISTRY_DB.prepare(
    "SELECT * FROM api_keys WHERE user = ?;",
  )
    .bind(context.data.user.id)
    .all();

  if (verificationData.error || keyData.error)
    return new Response('{"error":"Failed to generate export"}', {
      headers: {
        "content-type": "application/json",
      },
      status: 500,
    });

  const obj = {
    api_keys: keyData.results,
    current_user_session: context.data.user,
    verifications: verificationData.results,
  };

  delete obj.current_user_session.access_token;

  return new Response(JSON.stringify(obj), {
    headers: {
      "content-disposition": `attachment; filename=virgil-registry-export-${Date.now()}.json`,
      "content-type": "application/json",
    },
  });
}
