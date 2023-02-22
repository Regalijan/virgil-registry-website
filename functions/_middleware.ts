import { renderPage } from "vite-plugin-ssr";

async function constructHTML(context: RequestContext) {
  const { pathname } = new URL(context.request.url);

  if (pathname.startsWith("/api/") || pathname.startsWith("/client-api/"))
    return await context.next();

  if (
    pathname.startsWith("/assets/") ||
    ["/app.webmanifest", "/favicon.ico", "/robots.txt"].includes(pathname) ||
    pathname.startsWith("/files/")
  )
    return await context.env.ASSETS.fetch(context.request);

  const { httpResponse, status } = await renderPage({
    current_user: context.data.current_user,
    kv: context.env.DATA,
    status: 200,
    urlOriginal: context.request.url,
  });

  return new Response(httpResponse?.getReadableWebStream(), {
    headers: {
      "content-type": httpResponse?.contentType ?? "text/html;charset=utf-8",
    },
    status: [200, 404, 500].includes(status)
      ? httpResponse?.statusCode
      : status,
  });
}

export const onRequest = [constructHTML];
