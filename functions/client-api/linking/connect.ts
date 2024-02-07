export async function onRequestPost(
  context: EventContext<Env, string, { [k: string]: any }>,
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
      },
    );

  if (
    data.body.server?.match(/\D/) ||
    data.body.server?.length > 19 ||
    data.body.server?.length < 17
  )
    return new Response(JSON.stringify({ error: "Invalid server ID" }));

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
    access_token,
    id_token,
    refresh_token,
  }: { access_token: string; id_token?: string; refresh_token: string } =
    await jwtFetch.json();

  if (!id_token)
    return new Response(
      JSON.stringify({ error: "Failed to verify information from Roblox" }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 500,
      },
    );

  const tokenPart = id_token.split(".")[1];

  let decodedToken: { [k: string]: string };

  try {
    decodedToken = JSON.parse(
      atob(tokenPart.replaceAll("-", "+").replaceAll("_", "/")),
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to decode ID token" }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 500,
      },
    );
  }

  const accessTokenExp = JSON.parse(
    access_token.split(".")[1].replaceAll("-", "+").replaceAll("_", "/"),
  ).exp;
  const banKV = env.BANS;
  const db = env.REGISTRY_DB;

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
        }),
      );
    } else if (!discordBan && robloxBan) {
      await banKV.put(
        data.user.id,
        JSON.stringify({
          reason: `Attempted to link banned Roblox account ${decodedToken.sub}`,
          time,
        }),
      );
    }

    return new Response(JSON.stringify({ error: "Account is banned" }), {
      headers: {
        "content-type": "application/json",
      },
      status: 403,
    });
  }

  if (
    await db
      .prepare(
        "SELECT id FROM verifications WHERE discord_id = ? AND roblox_id = ?;",
      )
      .bind(data.user.id, parseInt(decodedToken.sub))
      .first()
  )
    return new Response(
      JSON.stringify({
        error:
          "That Roblox account is already verified with this Discord account",
      }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 400,
      },
    );

  await db
    .prepare(
      "INSERT INTO verifications (discord_id, discord_privacy, id, roblox_id, roblox_privacy, server_id, username) VALUES (?, ?, ?, ?, ?, ?, ?);",
    )
    .bind(
      data.user.id,
      0,
      crypto.randomUUID(),
      parseInt(decodedToken.sub),
      1,
      data.body.server || null,
      decodedToken.preferred_username,
    )
    .run();

  await env.CREDENTIALS.put(
    decodedToken.sub,
    JSON.stringify({
      access_token,
      refresh_token,
    }),
  );

  if (!data.body.server) {
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
      },
    );
  }

  return new Response(null, {
    status: 204,
  });
}
