export async function onRequestDelete(
  context: EventContext<
    { [k: string]: string } & { VERIFICATIONS: KVNamespace },
    string,
    { [k: string]: any }
  >,
) {
  const verifyKV = context.env.VERIFICATIONS;
  const verifyData = await verifyKV.get(context.data.user.id);

  if (!verifyData)
    return new Response(JSON.stringify({ error: "You are not verified" }), {
      headers: {
        "content-type": "application/json",
      },
      status: 404,
    });

  await verifyKV.delete(context.data.user.id);

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

  const data = JSON.parse(verifyData);
  const reverseData: string[] = JSON.parse(
    (await verifyKV.get(data.id.toString())) ?? "[]",
  );
  const reverseIndex = reverseData.findIndex(
    (id) => id === context.data.user.id,
  );

  if (reverseIndex === -1)
    return new Response(null, {
      status: 204,
    });

  reverseData.splice(reverseIndex, 1);

  if (reverseData.length) {
    await verifyKV.put(data.id.toString(), JSON.stringify(reverseData));
  } else {
    await verifyKV.delete(data.id.toString());
  }

  return new Response(null, {
    status: 204,
  });
}
