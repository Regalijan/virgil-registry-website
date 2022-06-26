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

export type Context = EventContext<
  { [k: string]: string },
  string,
  { [k: string]: any }
>;

interface KVNamespace<K extends string = string> {
  get(
    key: K,
    options?: Partial<KVNamespaceGetOptions<undefined>>
  ): Promise<string | null>;
  get(key: K, type: "text"): Promise<string | null>;
  get<ExpectedValue = unknown>(
    key: K,
    type: "json"
  ): Promise<ExpectedValue | null>;
  get(key: K, type: "arrayBuffer"): Promise<ArrayBuffer | null>;
  get(key: K, type: "stream"): Promise<ReadableStream | null>;
  get(key: K, options: KVNamespaceGetOptions<"text">): Promise<string | null>;
  get<ExpectedValue = unknown>(
    key: string,
    options: KVNamespaceGetOptions<"json">
  ): Promise<ExpectedValue | null>;
  get(
    key: K,
    options: KVNamespaceGetOptions<"arrayBuffer">
  ): Promise<ArrayBuffer | null>;
  get(
    key: K,
    options: KVNamespaceGetOptions<"stream">
  ): Promise<ReadableStream | null>;
  list<Metadata = unknown>(
    options?: KVNamespaceListOptions
  ): Promise<KVNamespaceListResult<Metadata>>;
  /**
   * Creates a new key-value pair, or updates the value for a particular key.
   * @param key key to associate with the value. A key cannot be empty, `.` or `..`. All other keys are valid.
   * @param value value to store. The type is inferred. The maximum size of a value is 25MB.
   * @returns Returns a `Promise` that you should `await` on in order to verify a successful update.
   * @example
   * await NAMESPACE.put(key, value);
   */
  put(
    key: K,
    value: string | ArrayBuffer | ArrayBufferView | ReadableStream,
    options?: KVNamespacePutOptions
  ): Promise<void>;
  getWithMetadata<Metadata = unknown>(
    key: K,
    options?: Partial<KVNamespaceGetOptions<undefined>>
  ): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>;
  getWithMetadata<Metadata = unknown>(
    key: K,
    type: "text"
  ): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>;
  getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(
    key: K,
    type: "json"
  ): Promise<KVNamespaceGetWithMetadataResult<ExpectedValue, Metadata>>;
  getWithMetadata<Metadata = unknown>(
    key: K,
    type: "arrayBuffer"
  ): Promise<KVNamespaceGetWithMetadataResult<ArrayBuffer, Metadata>>;
  getWithMetadata<Metadata = unknown>(
    key: K,
    type: "stream"
  ): Promise<KVNamespaceGetWithMetadataResult<ReadableStream, Metadata>>;
  getWithMetadata<Metadata = unknown>(
    key: K,
    options: KVNamespaceGetOptions<"text">
  ): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>;
  getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(
    key: K,
    options: KVNamespaceGetOptions<"json">
  ): Promise<KVNamespaceGetWithMetadataResult<ExpectedValue, Metadata>>;
  getWithMetadata<Metadata = unknown>(
    key: K,
    options: KVNamespaceGetOptions<"arrayBuffer">
  ): Promise<KVNamespaceGetWithMetadataResult<ArrayBuffer, Metadata>>;
  getWithMetadata<Metadata = unknown>(
    key: K,
    options: KVNamespaceGetOptions<"stream">
  ): Promise<KVNamespaceGetWithMetadataResult<ReadableStream, Metadata>>;
  delete(name: string): Promise<void>;
}

interface KVNamespaceGetOptions<Type> {
  type: Type;
  cacheTtl?: number;
}

interface KVNamespaceListKey<Metadata> {
  name: string;
  expiration?: number;
  metadata?: Metadata;
}

interface KVNamespaceListOptions {
  limit?: number;
  prefix?: string | null;
  cursor?: string | null;
}

interface KVNamespaceListResult<Metadata> {
  keys: KVNamespaceListKey<Metadata>[];
  list_complete: boolean;
  cursor?: string;
}

interface KVNamespaceGetWithMetadataResult<Value, Metadata> {
  value: Value | null;
  metadata: Metadata | null;
}

interface KVNamespacePutOptions {
  expiration?: number;
  expirationTtl?: number;
  metadata?: any | null;
}
