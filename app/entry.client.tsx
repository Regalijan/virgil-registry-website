import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";
import { StrictMode } from "react";

hydrateRoot(
  document,
  <StrictMode>
    <RemixBrowser />
  </StrictMode>
);
