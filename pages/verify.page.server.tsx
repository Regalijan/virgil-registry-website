export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      pageProps: {
        redirect_to_login: !Boolean(pageContext.user),
        verified: pageContext.user
          ? Boolean(await pageContext.verifyKV.get(pageContext.user.id))
          : false,
      },
    },
  };
}
