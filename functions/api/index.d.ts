function makeResponse(body: { [k: string]: any }, status: number) {
  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json",
    },
    status,
  });
}

interface APIKey {
  access_level: number;
  created_at: number;
  creator: string;
}

interface Env {
  API_KEYS: KVNamespace;
  INTERNAL_KEY: string;
  VERIFICATIONS: KVNamespace;
  [k: string]: string;
}

interface User {
  id: number;
  username: string;
  privacy?: {
    discord: number;
    roblox: number;
  };
}
