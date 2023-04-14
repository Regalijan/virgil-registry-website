export async function onRequestPost(
  context: EventContext<{ [k: string]: string }, string, { [k: string]: any }>
) {
  const { data, env } = context;

  if (!data.body?.code || !data.body.verifier)
    return new Response(
      JSON.stringify({ error: 'Missing "code" or "verifier"' }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 400,
      }
    );

  const { hostname, protocol } = new URL(context.request.url);

  const jwtFetch = await fetch("https://apis.roblox.com/oauth/v1/token", {
    body: new URLSearchParams({
      code: data.body.code,
      code_verifier: data.body.verifier,
      grant_type: "authorization_code",
      redirect_uri: `${protocol}//${hostname}/link`,
    }).toString(),
    headers: {
      authorization: `Basic ${btoa(env.RBX_ID + ":" + env.RBX_SECRET)}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!jwtFetch.ok)
    return new Response(JSON.stringify({ error: "Failed to redeem code" }), {
      headers: {
        "content-type": "application/json",
      },
      status: 500,
    });

  const {
    id_token,
    refresh_token,
  }: { id_token?: string; refresh_token: string } = await jwtFetch.json();

  if (!id_token)
    return new Response(
      JSON.stringify({ error: "Failed to verify information from Roblox" }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 500,
      }
    );

  const tokenPart = id_token.split(".")[1];

  let decodedToken: { [k: string]: string };

  try {
    decodedToken = JSON.parse(
      atob(tokenPart.replaceAll("-", "+").replaceAll("_", "/"))
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to decode ID token" }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 500,
      }
    );
  }

  const banKV = env.BANS as unknown as KVNamespace;
  const verifyKV = env.VERIFICATIONS as unknown as KVNamespace;

  const discordBan = await banKV.get(data.user.id);
  const robloxBan = await banKV.get(decodedToken.sub);

  if (discordBan || robloxBan) {
    const time = Date.now();

    if (discordBan && !robloxBan) {
      await banKV.put(
        decodedToken.sub,
        JSON.stringify({
          reason: `Attempted to link banned Discord account ${data.user.id}`,
          time,
        })
      );
    } else if (!discordBan && robloxBan) {
      await banKV.put(
        data.user.id,
        JSON.stringify({
          reason: `Attempted to link banned Roblox account ${decodedToken.sub}`,
          time,
        })
      );
    }

    return new Response(JSON.stringify({ error: "Account is banned" }), {
      headers: {
        "content-type": "application/json",
      },
      status: 403,
    });
  }

  await verifyKV.put(
    data.user.id,
    JSON.stringify({
      id: parseInt(decodedToken.sub),
      username: decodedToken.preferred_username,
      privacy: {
        discord: 0,
        roblox: 1,
      },
    })
  );

  const reverseData: string[] = JSON.parse(
    (await verifyKV.get(decodedToken.sub)) ?? "[]"
  );

  reverseData.push(data.user.id);
  await verifyKV.put(decodedToken.sub, JSON.stringify(reverseData));

  await fetch("https://apis.roblox.com/oauth/v1/token/revoke", {
    body: `token=${refresh_token}`,
    headers: {
      authorization: `Basic ${btoa(env.RBX_ID + ":" + env.RBX_SECRET)}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  await fetch(
    `https://discord.com/api/v10/users/@me/applications/${env.DISCORD_ID}/role-connection`,
    {
      body: JSON.stringify({
        metadata: {
          verified: 1,
        },
        platform_name: "Roblox",
        platform_username: decodedToken.preferred_username,
      }),
      headers: {
        authorization: `Bearer ${data.user.access_token}`,
        "content-type": "application/json",
      },
      method: "PUT",
    }
  );

  return new Response(null, {
    status: 204,
  });
}
