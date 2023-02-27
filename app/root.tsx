import { Links, LiveReload, Outlet, Scripts, useCatch } from "@remix-run/react";
import theme from "../theme";
import { StrictMode } from "react";
import fontStyle from "@fontsource/plus-jakarta-sans/index.css";
import globalStyles from "../index.css";
import appStyles from "../App.css";
import { useLoaderData } from "@remix-run/react";
import { ChakraProvider, cookieStorageManagerSSR } from "@chakra-ui/react";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { type LinksFunction } from "@remix-run/cloudflare";
import NotFound from "../components/NotFound";
import ServerError from "../components/ServerError";

export function CatchBoundary() {
  const { status } = useCatch();

  switch (status) {
    case 303:
      return "";

    case 404:
      return <NotFound />;

    default:
      return <ServerError />;
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
  let data: { [k: string]: string } = {};

  if (context.data.user) data = { ...context.data.user };
  if (context.data.theme) data.theme = context.data.theme;

  return data;
}

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  const colorMode = loaderData.theme;

  return (
    <html
      lang="en-US"
      {...(colorMode && {
        "data-theme": colorMode,
        style: { colorScheme: colorMode },
      })}
    >
      <head>
        <Links />
        <meta charSet="UTF-8" />
        <meta name="description" content="Verification registry for Virgil" />
        <meta
          name="og:description"
          content="Verification registry for Virgil"
        />
        <meta name="theme-color" content="#ff0000" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Virgil Registry</title>
      </head>
      <body {...(colorMode && { className: `chakra-ui-${colorMode}` })}>
        <StrictMode>
          <ChakraProvider
            colorModeManager={cookieStorageManagerSSR(typeof document === "undefined" ? "" : document.cookie)}
            theme={theme}
          >
            <div className="App">
              <ErrorBoundary>
                <Navigation {...loaderData} />
                <Outlet />
                <Footer />
                <Scripts />
                <LiveReload />
              </ErrorBoundary>
            </div>
          </ChakraProvider>
        </StrictMode>
      </body>
    </html>
  );
}
