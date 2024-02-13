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
