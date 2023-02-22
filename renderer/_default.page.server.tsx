import { renderToString } from "react-dom/server";
import { StrictMode } from "react";
import { dangerouslySkipEscape, escapeInject } from "vite-plugin-ssr";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

export const passToClient = ["user", "pageProps"];

export async function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext;
  const html = Page
    ? renderToString(
        <StrictMode>
          <ChakraProvider theme={theme}>
            <div className="App">
              <ErrorBoundary>
                <Navigation {...pageContext.user} />
                <Page {...pageProps} />
                <Footer />
              </ErrorBoundary>
            </div>
          </ChakraProvider>
        </StrictMode>
      )
    : "";

  return escapeInject`<!DOCTYPE html>
    <html lang="en-US">
      <head>
        <meta charset="UTF-8" />
        <meta name="theme-color" content="#ff0000" />
        <link rel="icon" href="/logo44.png" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <meta name="description" content="Verification registry for Virgil" />
        <meta name="og:description" content="Verification registry for Virgil" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Virgil Registry</title>
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(html)}</div>
      </body>
    </html>`;
}
