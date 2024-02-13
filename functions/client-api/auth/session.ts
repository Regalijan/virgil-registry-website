import generateHash from "../../generate_hash";

export async function onRequestDelete(context: RequestContext) {
  const { env, request } = context;
  const SESSIONS = env.SESSIONS;
  const cookies = await request.headers.get("cookie")?.split("; ");

  if (!cookies)
    return new Response('{"error":"Not logged in"}', {
      headers: {
        "content-type": "application/json",
      },
      status: 401,
    });

  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");

    if (name !== "vrs") continue;

    await SESSIONS.delete(await generateHash(value));

    return new Response(null, {
      headers: {
        "set-cookie": "vsr=; Max-Age=0",
      },
      status: 204,
    });
  }

  return new Response(null, {
    status: 204,
  });
}

export async function onRequestPost(
  context: EventContext<
    { [k: string]: string },
    string,
    { [k: number | string]: any }
  >,
) {
  const { env, request } = context;
  const SESSIONS = env.SESSIONS as unknown as KVNamespace;

  let body: { code?: string; verifier?: string };

  try {
    if (request.headers.get("content-type") !== "application/json")
      throw new Error("Invalid JSON");
    body = await request.json();
  } catch {
    return new Response('{"error":"Invalid JSON"}', {
      headers: {
        "content-type": "application/json",
      },
      status: 400,
    });
  }

  if (!body.code)
    return new Response(
      JSON.stringify({ error: "Authorization code is missing" }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 400,
      },
    );

  const { hostname, protocol } = new URL(request.url);
  const tokenRequest = await fetch("https://discord.com/api/oauth2/token", {
    body: new URLSearchParams({
      code: body.code,
      grant_type: "authorization_code",
      redirect_uri: `${protocol}//${hostname}/login`,
    }).toString(),
    headers: {
      authorization: "Basic " + btoa(`${env.DISCORD_ID}:${env.DISCORD_SECRET}`),
      "content-type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!tokenRequest.ok)
    return new Response(
      `{"error":"Failed to redeem code. Details:\n${await tokenRequest.text()}"}`,
      {
        headers: {
          "content-type": "application/json",
        },
        status: 500,
      },
    );

  const {
    access_token,
    token_type,
  }: {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
  } = await tokenRequest.json();

  const currentUserRequest = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${token_type} ${access_token}`,
    },
  });

  if (!currentUserRequest.ok)
    return new Response('{"error":"Failed to fetch logged-in user"}', {
      headers: {
        "content-type": "application/json",
      },
      status: 500,
    });

  const randomValues = crypto.getRandomValues(new Uint32Array(1024));
  const sessionHash = await crypto.subtle.digest("SHA-512", randomValues);
  const sessionToken = btoa(String.fromCharCode(...new Uint8Array(sessionHash)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  try {
    await SESSIONS.put(
      await generateHash(sessionToken),
      JSON.stringify({
        ...((await currentUserRequest.json()) as { [k: string]: any }),
        access_token,
      }),
      { expirationTtl: 3600 },
    );
  } catch {
    return new Response('{"error":"Failed to create session"}', {
      headers: {
        "content-type": "application/json",
      },
      status: 500,
    });
  }

  return new Response(null, {
    headers: {
      "set-cookie": `vrs=${sessionToken}; HttpOnly; Max-Age=3600; Path=/; SameSite=Lax; Secure`,
    },
    status: 204,
  });
}
