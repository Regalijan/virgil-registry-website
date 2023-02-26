import generateHash from "./generate_hash";

async function assetCheck(context: RequestContext) {
  const { pathname } = new URL(context.request.url);

  if (pathname.startsWith("/api/")) return await context.next();

  if (
    pathname.startsWith("/build/") ||
    ["/app.webmanifest", "/favicon.ico", "/robots.txt"].includes(pathname) ||
    pathname.startsWith("/files/")
  )
    return await context.env.ASSETS.fetch(context.request);

  return await context.next();
}

async function setHeaders(context: RequestContext) {
  context.request.headers.set("X-Frame-Options", "DENY");
  context.request.headers.set("X-XSS-Protection", "1;mode=block");

  return await context.next();
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

    const userData = await context.env.SESSIONS.get(await generateHash(value));

    if (userData) context.data.user = JSON.parse(userData);

    break;
  }

  return await context.next();
}

export const onRequest = [setUser, setHeaders, assetCheck];
