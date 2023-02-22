export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      pageProps: {
        redirect_to_login: !Boolean(pageContext.user),
      },
    },
  };
}
