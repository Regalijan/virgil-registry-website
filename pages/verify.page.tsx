import { Button, Container, Heading, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import createChallenge from "../challenge";

async function initiateRBXSignIn() {
  const state = crypto.randomUUID();
  let verifier = "";

  while (verifier.length < 128) {
    verifier += crypto.randomUUID().replace(/-/g, "");
  }

  sessionStorage.setItem("rbx-code-verifier", verifier);
  sessionStorage.setItem("rbx-state", state);

  const challenge = await createChallenge(verifier);
  const { hostname, protocol } = new URL(window.location.href);

  window.location.assign(
    `https://apis.roblox.com/oauth/v1/authorize?client_id=${
      import.meta.env.VITE_ROBLOX_CLIENT_ID
    }&code_challenge=${challenge}&code_challenge_method=S256&redirect_uri=${encodeURIComponent(
      `${protocol}//${hostname}/link`
    )}&response_type=code&scope=openid%20profile&state=${state}`
  );
}

export function Page(pageProps: { verified: boolean }) {
  useEffect(() => {
    if (pageProps.verified) return location.assign("/me");
  });

  return (
    <Container pt="40px" maxW="28em">
      <Heading>Hello</Heading>
      <br />
      <Text fontSize="xl">This will be quick, we promise.</Text>
      <br />
      <br />
      <Text pb="10px">Click the button to verify your account</Text>
      <Button
        alignSelf="center"
        mt="15px"
        w="70%"
        onClick={async () => await initiateRBXSignIn()}
      >
        Verify with Roblox
      </Button>
    </Container>
  );
}
