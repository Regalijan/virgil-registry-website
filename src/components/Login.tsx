import { useEffect, useState } from "react";
import { Container, Heading, Text } from "@chakra-ui/react";
import Loading from "./Loading";
import createChallenge from "../challenge";

export default function () {
  const [failed, hasFailed] = useState(false);
  const [error, setError] = useState("");
  const { searchParams } = new URL(window.location.href);
  const code = searchParams.get("code");

  useEffect(() => {
    if (localStorage.getItem("registry-session"))
      return window.location.assign("/me");
    (async function () {
      if (searchParams.get("code")) {
        if (!sessionStorage.getItem("code-verifier")) {
          setError("Code verifier missing");
          return hasFailed(true);
        }

        const exchangeResponse = await fetch("/client-api/auth/session", {
          body: JSON.stringify({
            code,
            verifier: sessionStorage.getItem("code-verifier"),
          }),
          cache: "no-cache",
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
        });

        if (!exchangeResponse.ok) {
          let error: string = "Unknown error";
          try {
            const errorData: { error: string } = await exchangeResponse.json();
            error = errorData.error;
          } catch {}
          setError(error);
          return hasFailed(true);
        }

        const sessionData: { session: string } = await exchangeResponse.json();

        localStorage.setItem("registry-session", sessionData.session);
        sessionStorage.removeItem("code-verifier");
        return window.location.assign("/me");
      }

      sessionStorage.setItem("__test__", "__test__");

      if (!sessionStorage.getItem("__test__")) {
        setError(
          'Storage is unavailable on this browser. If you are using a safari custom window, please tap the safari icon at the bottom. If you are using a chrome or other custom tab on android, please open the tab menu and tap on "Open in Browser".'
        );
        hasFailed(true);
        return;
      }

      sessionStorage.removeItem("__test__");

      let verifier = "";

      while (verifier.length < 128) {
        verifier += crypto.randomUUID().replace(/-/g, "");
      }

      sessionStorage.setItem("code-verifier", verifier);

      const challenge = await createChallenge(verifier);

      const urlRequest = await fetch("/client-api/auth/login", {
        body: JSON.stringify({ challenge }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });

      let url: string | undefined;

      try {
        url = ((await urlRequest.json()) as { url?: string }).url;
      } catch {}

      if (!url) {
        setError("Failed to retrieve sign-in URL");
        return hasFailed(true);
      }

      window.location.assign(url);
    })();
  }, []);

  switch (failed) {
    case false:
      return <Loading />;
    case true:
      return (
        <Container maxW="container.xl" pt="10vh" textAlign="center">
          <Heading pb="10px">We could not sign you in</Heading>
          <Text fontSize="xl">See the details below:</Text>
          <br />
          <Text>{error}</Text>
        </Container>
      );
  }
}
