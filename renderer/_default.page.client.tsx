import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import "../index.css";
import "@fontsource/plus-jakarta-sans";
import "../App.css";
import theme from "../theme";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

export async function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext;
  const root = document.getElementById("root") as HTMLElement;
  const reactHTML = (
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
  );

  root.innerHTML
    ? createRoot(root).render(reactHTML)
    : hydrateRoot(root, reactHTML);
}
