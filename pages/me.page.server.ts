export async function onBeforeRender(pageContext: PageContext) {
  if (!pageContext.user)
    return {
      pageContext: {
        pageProps: {
          redirect_to_login: true,
        },
      },
    };

  const verifyData = (await pageContext.verifyKV.get(pageContext.user.id, {
    type: "json",
  })) as {
    id: number;
    username: string;
    privacy: {
      discord: number;
      roblox: number;
    };
  } | null;

  const pageProps = {
    privacy: verifyData?.privacy,
    roblox_username: verifyData?.username,
  };

  if (verifyData) {
    const thumbnailFetch = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar?userIds=${verifyData.id}&size=180x180&format=Png`
    );

    if (thumbnailFetch.ok) {
      const thumbnailData: {
        data: { targetId: number; state: string; imageUrl: string }[];
      } = await thumbnailFetch.json();
      Object.defineProperty(pageProps, "roblox_avatar", {
        value: thumbnailData.data[0].imageUrl,
      });
    }

    return {
      pageContext: {
        pageProps,
      },
    };
  }
}
