import { useEffect, useState } from "react";
import { Container, Heading, Text } from "@chakra-ui/react";
import Loading from "./Loading";

export default function () {
  const [failed, hasFailed] = useState(false);
  const [error, setError] = useState("");
  const { searchParams } = new URL(window.location.href);
  const code = searchParams.get("code");
  const redirect_to = searchParams.get("state") ?? "/";

  useEffect(() => {
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
        sessionStorage.removeItem("code-verifier")
        return window.location.assign(redirect_to);
      }

      let verifier = "";

      while (verifier.length < 128) {
        verifier += crypto.randomUUID().replace(/-/g, "");
      }

      sessionStorage.setItem("code-verifier", verifier);

      const challenge = btoa(
        String.fromCharCode(
          ...new Uint8Array(
            await crypto.subtle.digest(
              "SHA-256",
              new TextEncoder().encode(verifier)
            )
          )
        )
      )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

      const urlRequest = await fetch("/client-api/auth/login", {
        body: JSON.stringify({ challenge }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });

      const { url }: { url?: string } = await urlRequest.json();

      if (!url) {
        setError("Failed to retrieve sign-in URL");
        return hasFailed(true);
      }

      window.location.assign(url);
    })();
  });

  switch (failed) {
    case false:
      return <Loading />;
    case true:
      return (
        <Container maxW="container.xl" textAlign="center">
          <Heading pb="10px">We could not sign you in</Heading>
          <Text fontSize="xl">See the details below:</Text>
          <br />
          <Text>{error}</Text>
        </Container>
      );
  }
}
