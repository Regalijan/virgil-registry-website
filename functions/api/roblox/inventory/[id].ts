import makeResponse from "functions/api/makeResponse";

export async function onRequestPost(context: RequestContext) {
  const robloxId = context.params.id as string;

  if (isNaN(parseInt(robloxId)))
    return makeResponse({ error: "Invalid Roblox ID" }, 400);

  let body;

  try {
    body = await context.request.json();
  } catch {
    return makeResponse({ error: "Malformed body" }, 400);
  }

  let { assets, badges, gamePasses, privateServers } = body as {
    [k: string]: number[] | undefined;
  };

  if (
    [assets, badges, gamePasses, privateServers].find((itemList) =>
      itemList?.find((item) => typeof item !== "number"),
    )
  )
    return makeResponse({ error: "Item lists must be integers" }, 400);

  const result = (await context.env.REGISTRY_DB.prepare(
    "SELECT roblox_privacy FROM verifications WHERE roblox_id = ? ORDER BY roblox_privacy DESC LIMIT 1;",
  )
    .bind(robloxId)
    .first()) as { roblox_privacy: number } | null;

  if (!result) return makeResponse({ error: "This user is not verified" }, 404);

  if (
    !context.data.is_internal &&
    (context.data.apiKeyInfo?.access_level ?? 0) < result.roblox_privacy
  )
    return makeResponse({ error: "Cannot access this user's inventory" }, 403);

  let oauthCredentials: { access_token: string; refresh_token: string } | null =
    await context.env.CREDENTIALS.get(robloxId, { type: "json" });

  if (!oauthCredentials)
    return makeResponse(
      {
        error: "Cannot check this user's inventory, OAuth credentials missing",
      },
      500,
    );

  const { exp } = JSON.parse(
    atob(
      oauthCredentials.access_token
        .split(".")[1]
        .replaceAll("-", "+")
        .replaceAll("_", "/"),
    ),
  );

  if (exp >= Math.floor(Date.now() / 1000)) {
    const refreshResp = await fetch("https://apis.roblox.com/oauth/v1/token", {
      body: new URLSearchParams({
        grant_type: "refresh_token",
        token: oauthCredentials.refresh_token,
      }),
      headers: {
        authorization:
          "Basic " + btoa(`${context.env.RBX_ID}:${context.env.RBX_SECRET}`),
      },
    });

    if (!refreshResp.ok) {
      console.log(await refreshResp.text());
      return makeResponse({ error: "Failed to refresh user credentials" }, 500);
    }

    const { access_token, refresh_token } = (await refreshResp.json()) as {
      access_token: string;
      refresh_token: string;
    };
    oauthCredentials.access_token = access_token;

    await context.env.CREDENTIALS.put(
      robloxId,
      JSON.stringify({ access_token, refresh_token }),
    );
  }

  const fullItemList = new Array()
    .concat(
      assets?.map((asset) => {
        return { id: asset, type: "asset" };
      }),
      badges?.map((badge) => {
        return { id: badge, type: "badge" };
      }),
      gamePasses?.map((gamePass) => {
        return { id: gamePass, type: "gamePass" };
      }),
      privateServers?.map((privateServer) => {
        return { id: privateServer, type: "privateServer" };
      }),
    )
    .filter((arr) => arr);

  if (fullItemList.length > 1000)
    return makeResponse({ error: "Too many items to check" }, 400);

  const groupCount = Math.ceil(fullItemList.length / 250);
  const arrayGroups = new Array(groupCount)
    .fill("")
    .map((_, i) => fullItemList.slice(i * groupCount, (i + 1) * groupCount));

  function itemArrayToFilter(
    items: { id: number; type: string }[],
    type: string,
  ): string {
    return items
      .filter((item) => item.type === type)
      .map((item) => item.id)
      .join("%2C");
  }

  async function checkInventory(items: { id: number; type: string }[]) {
    let finished = false;
    let pageToken = "";
    const filter = encodeURIComponent(
      `assetIds=${itemArrayToFilter(items, "asset")};badgeIds=${itemArrayToFilter(items, "badge")};gamePassIds=${itemArrayToFilter(items, "gamePass")};privateServerIds=${itemArrayToFilter(items, "privateServer")}`,
    );
    const ownedItems: { id: number; type: string }[] = [];

    while (!finished) {
      const inventoryRes = await fetch(
        `https://apis.roblox.com/cloud/v2/users/${robloxId}/inventory-items?filter=${filter}&maxPageSize=500&pageToken=${pageToken}`,
        {
          headers: {
            authorization: `Bearer ${oauthCredentials?.access_token}`,
          },
        },
      );

      if (!inventoryRes.ok) break;

      const inventoryData = (await inventoryRes.json()) as {
        inventoryItems: { assetDetails: { assetId: string } }[];
        nextPageToken: string;
      };

      ownedItems.push(
        ...items.filter((item) =>
          inventoryData.inventoryItems.find(
            (i) => i.assetDetails.assetId === item.id.toString(),
          ),
        ),
      );

      pageToken = inventoryData.nextPageToken;
      finished = Boolean(pageToken);
    }

    return ownedItems;
  }

  const itemPromises = [];

  for (const itemArray of arrayGroups)
    itemPromises.push(checkInventory(itemArray));

  return makeResponse(
    new Array()
      .concat(...(await Promise.allSettled(itemPromises)))
      .filter((promise) => promise.status === "fulfilled"),
    200,
  );
}
