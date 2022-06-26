import { Context, KVNamespace } from "../../..";

export async function onRequestDelete(context: Context) {
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

export async function onRequestPost(context: Context) {
  const { env, request } = context;
  const SESSIONS = env.SESSIONS as unknown as KVNamespace;

  let body: { code: string };

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

  const { hostname, protocol } = new URL(request.url);
  const tokenRequest = await fetch("https://discord.com/api/oauth2/token", {
    body: new URLSearchParams({
      code: body.code,
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
    return new Response('{"error":"Failed to redeem code"}', {
      headers: {
        "content-type": "application/json",
      },
      status: 500,
    });

  const { access_token, token_type } = await tokenRequest.json();

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
      await currentUserRequest.text()
    );
  } catch {
    return new Response('{"error":"Failed to create session"}', {
      headers: {
        "content-type": "application/json",
      },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ session: sessionToken }), {
    headers: {
      "content-type": "application/json",
    },
  });
}
