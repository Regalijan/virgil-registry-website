export async function onRequestGet(
  context: EventContext<
    { [k: string]: string } & { VERIFICATIONS: KVNamespace },
    string,
    { [k: string]: any }
  >
) {
  const verifyData = await context.env.VERIFICATIONS.get(context.data.user.id);

  if (!verifyData)
    return new Response(JSON.stringify({ error: "You are not verified" }), {
      headers: {
        "content-type": "application/json",
      },
      status: 404,
    });

  const data = JSON.parse(verifyData);
  const thumbnailRequest = await fetch(
    `https://thumbnails.roblox.com/v1/users/avatar?userIds=${data.id}&size=180x180&format=Png`
  );

  if (thumbnailRequest.ok) {
    const thumbnailData: {
      data: { targetId: number; state: string; imageUrl: string }[];
    } = await thumbnailRequest.json();
    data.avatar = thumbnailData.data[0].imageUrl;
  }

  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
    },
  });
}
