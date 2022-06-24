/* See https://github.com/cloudflare/workers-types/issues/164 */

type Params<P extends string = any> = Record<P, string | string[]>;

type EventContext<Env, P extends string, Data> = {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env & { ASSETS: { fetch: typeof fetch } };
  params: Params<P>;
  data: Data;
};

export type Context = EventContext<{[k: string]: string}, string, { [k: string]: any }>
  