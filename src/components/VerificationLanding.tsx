import { Button, Container, Heading, Text, useToast } from "@chakra-ui/react";
import createChallenge from "../challenge";

async function initiateRBXSignIn() {
  let verifier = "";

  while (verifier.length < 128) {
    verifier += crypto.randomUUID().replace(/-/g, "");
  }

  sessionStorage.setItem("rbx-code-verifier", verifier);

  const challenge = await createChallenge(verifier);
  const { hostname, protocol } = new URL(window.location.href);

  const clientIdRequest = await fetch("/client-api/linking/initiate", {
    headers: {
      authorization: window.localStorage.getItem("registry-session") ?? "",
    },
  });

  const { client_id }: { client_id: string } = await clientIdRequest.json();

  if (!clientIdRequest.ok) {
    useToast()({
      title: "Uh oh!",
      status: "error",
      description:
        "We were unable to fetch the client id needed to verify you.",
      isClosable: true,
      duration: 10000,
    });
    return;
  }

  window.location.assign(
    `https://authorize.roblox.com/?client_id=${client_id}&code_challenge=${challenge}&code_challenge_method=S256&redirect_uri=${encodeURIComponent(
      `${protocol}//${hostname}/link`
    )}&response_type=code&scope=openid%20profile`
  );
}

export default function () {
  return (
    <Container pt="40px" maxW="28em">
      <Heading>Hello</Heading>
      <br />
      <Text fontSize="xl">This will be quick, we promise.</Text>
      <br />
      <br />
      <Text pb="10px" align="left" pl="15%">
        Click the button to verify your account
      </Text>
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
