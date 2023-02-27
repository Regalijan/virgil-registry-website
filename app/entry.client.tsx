import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";
import { StrictMode } from "react";

if (
  !document.cookie.match(/chakra-ui-color-mode=(dark|light)/) &&
  typeof window.matchMedia === "function"
) {
  document.cookie = `chakra-ui-color-mode=${
    matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }; Path=/; SameSite=Lax`;
}

hydrateRoot(
  document,
  <StrictMode>
    <RemixBrowser />
  </StrictMode>
);
