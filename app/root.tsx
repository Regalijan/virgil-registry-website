import { Links, LiveReload, Outlet, Scripts, useCatch } from "@remix-run/react";
import theme from "../theme";
import { lazy, StrictMode } from "react";
import fontStyle from "@fontsource/plus-jakarta-sans/index.css";
import globalStyles from "../index.css";
import appStyles from "../App.css";
import { useLoaderData } from "@remix-run/react";
import { ChakraProvider } from "@chakra-ui/react";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { LinksFunction } from "@remix-run/cloudflare";
const NotFound = lazy(() => import("../components/NotFound"));
const ServerError = lazy(() => import("../components/ServerError"));

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
  if (!context.data?.user) return {};

  return context.data.user as {
    avatar?: string;
    discriminator?: string;
    id?: string;
    username?: string;
  };
}

export default function App() {
  return (
    <html lang="en-US">
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
      <body>
        <StrictMode>
          <ChakraProvider theme={theme}>
            <div className="App">
              <ErrorBoundary>
                <Navigation {...useLoaderData<typeof loader>()} />
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
