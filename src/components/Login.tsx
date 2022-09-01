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
    if (!code) return window.location.assign("/client-api/auth/login");

    (async function () {
      const exchangeResponse = await fetch("/client-api/auth/session", {
        body: JSON.stringify({ code }),
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
          error =  errorData.error;
        } catch {}
        setError(error);
        return hasFailed(true);
      }

      const sessionData: { session: string } = await exchangeResponse.json();

      window.localStorage.setItem(
        "registry-session",
        sessionData.session
      );
      window.location.assign(redirect_to);
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
