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

  const cookieList: { [k: string]: string } = {};

  for (const c of cookies.split(/; /)) {
    const [name, value] = c.split("=");

    cookieList[name] = value;
  }

  if (
    cookieList["chakra-ui-color-mode"] ||
    ["dark", "light"].includes(cookieList["chakra-ui-color-mode"])
  ) {
    context.data.theme = cookieList["chakra-ui-color-mode"];
  }

  if (cookieList.vrs) {
    const userData = await context.env.SESSIONS.get(
      await generateHash(cookieList.vrs),
    );

    if (userData) context.data.user = JSON.parse(userData);
  }

  return await context.next();
}

export const onRequest = [setUser, setHeaders, assetCheck];
