export async function onRequestDelete(
  context: EventContext<Env, string, { [k: string]: any }>,
) {
  const db = context.env.REGISTRY_DB;

  await db
    .prepare("DELETE FROM verifications WHERE discord_id = ?;")
    .bind(context.data.user.id)
    .run();
  await fetch(
    `https://discord.com/api/v10/users/@me/applications/${context.env.DISCORD_ID}/role-connection`,
    {
      body: "{}",
      headers: {
        authorization: `Bearer ${context.data.user.access_token}`,
        "content-type": "application/json",
      },
      method: "PUT",
    },
  );

  return new Response(null, {
    status: 204,
  });
}
