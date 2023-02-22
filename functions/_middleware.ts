import { renderPage } from "vite-plugin-ssr";
import generateHash from "./generate_hash";

async function constructHTML(context: RequestContext) {
  const { host, pathname, protocol } = new URL(context.request.url);

  if (pathname.startsWith("/api/")) return await context.next();

  if (
    pathname.startsWith("/assets/") ||
    ["/app.webmanifest", "/favicon.ico", "/robots.txt"].includes(pathname) ||
    pathname.startsWith("/files/")
  )
    return await context.env.ASSETS.fetch(context.request);

  const { httpResponse, redirect_to_login, status } = await renderPage({
    user: context.data.user,
    redirect_to_login: false,
    status: 200,
    urlOriginal: context.request.url,
    verifyKV: context.env.VERIFICATIONS,
  });

  if (redirect_to_login) return Response.redirect(`${protocol}//${host}/login`);

  return new Response(httpResponse?.getReadableWebStream(), {
    headers: {
      "content-type": httpResponse?.contentType ?? "text/html;charset=utf-8",
    },
    status: [200, 404, 500].includes(status)
      ? httpResponse?.statusCode
      : status,
  });
}

async function setUser(context: RequestContext) {
  if (new URL(context.request.url).pathname.startsWith("/api/"))
    return await context.next();

  const cookies = context.request.headers.get("cookie");

  if (!cookies) return await context.next();

  const cookieList = cookies.split(/; /);

  for (const c of cookieList) {
    const [name, value] = c.split("=");

    if (name !== "vrs") continue;

    const userData = await context.env.SESSIONS.get(
      `auth_${await generateHash(value)}`
    );

    if (userData) context.data.user = JSON.parse(userData);

    break;
  }

  return await context.next();
}

export const onRequest = [setUser, constructHTML];
