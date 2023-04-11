import createCache from "@emotion/cache";

export default function createEmotionCache() {
  // The browser throws when calling .default, but the server throws if we don't call .default
  // Of course!
  return typeof document === "undefined"
    ? // @ts-expect-error
      createCache.default({ key: "cha" })
    : createCache({ key: "cha" });
}
