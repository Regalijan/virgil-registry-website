import { type PageContextBuiltIn } from "vite-plugin-ssr";

declare global {
  // Fix TS vomiting with named style imports
  module "*.css";

  interface Env {
    ASSETS: Fetcher;
    SESSIONS: KVNamespace;
    verifyKV: KVNamespace;
    [k: string]: string;
  }

  type RequestContext = EventContext<Env, string, { [k: string]: any }>;
  interface PageContext extends PageContextBuiltIn {
    pageProps: {
      [k: string]: any;
    };
    status: number;
    user?: { [k: string]: any };
    verifyKV: KVNamespace;
  }
}