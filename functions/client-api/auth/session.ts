export async function onRequestDelete(
  context: EventContext<{ [k: string]: string }, string, { [k: string]: any }>
) {
  const { env, request } = context;
  const SESSIONS = env.SESSIONS as unknown as KVNamespace;
  const token = await request.headers.get("authorization");

  if (!token)
    return new Response('{"error":"Missing token"}', {
      headers: {
        "content-type": "application/json",
      },
      status: 401,
    });

  await SESSIONS.delete(token);
  return new Response(null, {
    status: 204,
  });
}

export async function onRequestGet(
  context: EventContext<{ [k: string]: string }, string, { [k: string]: any }>
) {
  const [body, status] = context.data.user
    ? [context.data.user, 200]
    : [{ error: "Unauthenticated" }, 401];

  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json",
    },
    status,
  });
}

export async function onRequestPost(
  context: EventContext<
    { [k: string]: string },
    string,
    { [k: number | string]: any }
  >
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

  if (!body.code || !body.verifier)
    return new Response(
      JSON.stringify({ error: '"code" or "verifier" property is missing' }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 400,
      }
    );

  const challenge = btoa(
    String.fromCharCode(
      ...new Uint8Array(
        await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(body.verifier)
        )
      )
    )
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const challengeIP = await SESSIONS.get(`challenge_${challenge}`);

  if (challengeIP !== request.headers.get("CF-Connecting-IP"))
    return new Response(
      JSON.stringify({
        error:
          "Your current IP address does not match the one used to generate the sign-in link.",
      }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 401,
      }
    );

  const { hostname, protocol } = new URL(request.url);
  const tokenRequest = await fetch("https://discord.com/api/oauth2/token", {
    body: new URLSearchParams({
      code: body.code,
      code_verifier: body.verifier,
      grant_type: "authorization_code",
      redirect_uri: `${protocol}//${hostname}/login`,
    }).toString(),
    headers: {
      authorization: btoa(`${env.DISCORD_ID}:${env.DISCORD_SECRET}`),
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
      }
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
  const sessionToken = btoa(
    String.fromCharCode(...new Uint8Array(sessionHash))
  );
  const tokenHash = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(sessionToken)
  );

  try {
    await SESSIONS.put(
      Array.from(new Uint8Array(tokenHash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
      await currentUserRequest.text(),
      { expirationTtl: 3600 }
    );
  } catch {
    return new Response('{"error":"Failed to create session"}', {
      headers: {
        "content-type": "application/json",
      },
      status: 500,
    });
  }

  await SESSIONS.delete(`challenge_${challenge}`);

  return new Response(JSON.stringify({ session: sessionToken }), {
    headers: {
      "content-type": "application/json",
    },
  });
}
