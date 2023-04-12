import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Outlet,
  Scripts,
  useRouteError,
} from "@remix-run/react";
import theme from "../theme";
import { type ReactNode, StrictMode, useContext, useEffect } from "react";
import fontStyle from "@fontsource/plus-jakarta-sans/index.css";
import globalStyles from "../index.css";
import appStyles from "../App.css";
import { ClientStyleContext, ServerStyleContext } from "./context";
import { useLoaderData } from "@remix-run/react";
import { ChakraProvider, cookieStorageManagerSSR } from "@chakra-ui/react";
import { withEmotionCache } from "@emotion/react";
import ReactErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { type LinksFunction } from "@remix-run/cloudflare";
import NotFound from "../components/NotFound";
import ServerError from "../components/ServerError";
import { type ErrorResponse } from "@remix-run/router";
import MobileDetect from "mobile-detect";

export function ErrorBoundary() {
  const error = useRouteError() as ErrorResponse;

  if (!isRouteErrorResponse(error))
    return getMarkup({ hide: true }, <ServerError />);

  const { status } = error;

  switch (status) {
    case 303:
      return "";

    case 404:
      return getMarkup({ hide: true }, <NotFound />);

    default:
      return getMarkup({ hide: true }, <ServerError />);
  }
}

export const links: LinksFunction = () => {
  return [
    { href: "/files/logo44.png", rel: "icon" },
    { href: "/files/logo192.png", rel: "apple-touch-icon" },
    { href: fontStyle, rel: "stylesheet" },
    { href: globalStyles, rel: "stylesheet" },
    { href: appStyles, rel: "stylesheet" },
  ];
};

export async function loader({
  context,
}: {
  context: RequestContext;
}): Promise<{ [k: string]: any }> {
  let data: { [k: string]: any } = {};

  if (context.data.user) data = { ...context.data.user };
  if (context.data.theme) data.theme = context.data.theme;

  const ua = context.request.headers.get("user-agent");

  if (!ua) data.desktop = false;
  else data.desktop = !Boolean(new MobileDetect(ua).mobile());

  return data;
}

function getMarkup(
  loaderData: { [k: string]: any },
  child: ReactNode
): JSX.Element {
  const Document = withEmotionCache(
    ({ children }: { children: ReactNode }, emotionCache) => {
      const serverStyleData = useContext(ServerStyleContext);
      const clientStyleData = useContext(ClientStyleContext);

      useEffect(() => {
        emotionCache.sheet.container = document.head;

        const tags = emotionCache.sheet.tags;
        emotionCache.sheet.flush();
        tags.forEach((tag) => {
          (emotionCache.sheet as any)._insertTag(tag);
        });

        clientStyleData?.reset();
      }, []);

      return (
        <html
          lang="en-US"
          {...(loaderData.theme && {
            "data-theme": loaderData.theme,
            style: { colorScheme: loaderData.theme },
          })}
        >
          <head>
            <Links />
            {serverStyleData?.map(({ key, ids, css }) => (
              <style
                key={key}
                data-emotion={`${key} ${ids.join(" ")}`}
                dangerouslySetInnerHTML={{ __html: css }}
              />
            ))}
            <meta charSet="UTF-8" />
            <meta
              name="description"
              content="Verification registry for Virgil"
            />
            <meta
              name="og:description"
              content="Verification registry for Virgil"
            />
            <meta name="theme-color" content="#ff0000" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>Virgil Registry</title>
          </head>
          <body>
            <StrictMode>
              <ChakraProvider
                colorModeManager={cookieStorageManagerSSR(
                  typeof document === "undefined" ? "" : document.cookie
                )}
                theme={theme}
              >
                <div className="App">
                  <ReactErrorBoundary>
                    <Navigation {...loaderData} />
                    {child}
                    <Footer />
                    <Scripts />
                    <LiveReload />
                  </ReactErrorBoundary>
                </div>
              </ChakraProvider>
            </StrictMode>
          </body>
        </html>
      );
    }
  );

  return <Document>{child}</Document>;
}

export default function App() {
  const loaderData = useLoaderData<typeof loader>();

  return getMarkup(loaderData, <Outlet />);
}
