import { Container, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";

export default function () {
  const [isLoading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);

  useEffect(() => {
    (async function () {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");
      const state = searchParams.get("state") as string;
      const storedState = sessionStorage.getItem("rbx-state");
      const verifier = sessionStorage.getItem("rbx-code-verifier");

      if (!code)
        return location.assign("/verify");

      if (state !== storedState || !verifier) {
        sessionStorage.clear();
        setSuccess(false);
        setLoading(false);
        return;
      }

      const rbxConnectRequest = await fetch("/client-api/linking/connect", {
        body: JSON.stringify({ code, verifier }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });

      sessionStorage.clear();
      setSuccess(rbxConnectRequest.ok);
      setLoading(false);
      return location.assign(rbxConnectRequest.ok ? "/me" : "/");
    })();
  }, []);

  return isLoading ? (
    <Loading />
  ) : success ? (
    <Container
      centerContent
      maxW="container.lg"
      paddingTop="15vh"
      textAlign="center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="128"
        height="128"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
      </svg>
      <br />
      <Text>You have successfully verified!</Text>
      <Text size="xs">Redirecting in 5 seconds...</Text>
    </Container>
  ) : (
    <Container
      centerContent
      maxW="container.lg"
      paddingTop="15vh"
      textAlign="center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="128"
        height="128"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
      </svg>
      <br />
      <Text>Oops! We were unable to verify your account; try again later.</Text>
      <Text size="s">Redirecting in 5 seconds...</Text>
    </Container>
  );
}
