/// <reference types="vite/client" />

import { type PageContextBuiltIn } from "vite-plugin-ssr";

declare global {
  interface Env {
    ASSETS: Fetcher;
    SESSIONS: KVNamespace;
    verifyKV: KVNamespace;
    [k: string]: string;
  }

  type RequestContext = EventContext<Env, string, { [k: string]: any }>;
  interface PageContext extends PageContextBuiltIn {
    status: number;
    user?: { [k: string]: any };
  }
}
