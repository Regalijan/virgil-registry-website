import type { EmotionCache } from "@emotion/utils";

declare global {
  module "*.css";

  interface Env {
    API_KEYS: KVNamespace;
    ASSETS: Fetcher;
    BANS: KVNamespace;
    SESSIONS: KVNamespace;
    VERIFICATIONS: KVNamespace;
    [k: string]: string;
  }

  type RequestContext = EventContext<Env, string, { [k: string]: any }>;

  interface EmotionCriticalToChunks {
    html: string;
    styles: { key: string; ids: string[]; css: string }[];
  }

  interface EmotionServer {
    constructStyleTagsFromChunks: (
      criticalData: EmotionCriticalToChunks
    ) => string;
    extractCriticalToChunks: (html: string) => EmotionCriticalToChunks;
  }

  export function createEmotionServer(cache: EmotionCache): EmotionServer;
}

export {};
