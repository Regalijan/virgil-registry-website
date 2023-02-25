import { Button, Container, Heading, Text } from "@chakra-ui/react";
import createChallenge from "../../challenge";
import { useLoaderData } from "@remix-run/react";

async function initiateRBXSignIn(clientId: string) {
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
    `https://apis.roblox.com/oauth/v1/authorize?client_id=${clientId}&code_challenge=${challenge}&code_challenge_method=S256&redirect_uri=${encodeURIComponent(
      `${protocol}//${hostname}/link`
    )}&response_type=code&scope=openid%20profile&state=${state}`
  );
}

export async function loader({
  context,
}: {
  context: RequestContext;
}): Promise<string> {
  if (!context.data?.user?.id)
    throw new Response(null, {
      headers: {
        location: "/login",
      },
      status: 303,
    });

  if (await context.env.VERIFICATIONS.get(context.data.user.id))
    throw new Response(null, {
      headers: {
        location: "/me",
      },
      status: 303,
    });

  return context.env.RBX_ID;
}

export default function () {
  const clientId = useLoaderData<typeof loader>();

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
        onClick={async () => await initiateRBXSignIn(clientId)}
      >
        Verify with Roblox
      </Button>
    </Container>
  );
}
