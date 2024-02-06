import { CacheProvider } from "@emotion/react";
import { ClientStyleContext } from "./context";
import createEmotionCache from "./createEmotionCache";
import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";
import { type ReactNode, StrictMode, useState } from "react";

function ClientCacheProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState(createEmotionCache());

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

hydrateRoot(
  document,
  <StrictMode>
    <ClientCacheProvider>
      <RemixBrowser />
    </ClientCacheProvider>
  </StrictMode>,
);
