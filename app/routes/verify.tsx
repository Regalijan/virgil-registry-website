import {
  Button,
  Container,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Banned from "../../components/Banned";
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
      `${protocol}//${hostname}/link`,
    )}&response_type=code&scope=openid%20profile%20user.inventory-item%3Aread&state=${state}`,
  );
}

export async function loader({
  context,
}: {
  context: RequestContext;
}): Promise<{
  banned: boolean;
  clientId: string;
  email?: string;
  reason?: string;
}> {
  if (!context.data?.user?.id)
    throw new Response(null, {
      headers: {
        location: "/login",
      },
      status: 303,
    });

  if (
    await context.env.REGISTRY_DB.prepare(
      "SELECT id FROM verifications WHERE discord_id = ?;",
    )
      .bind(context.data.user.id)
      .first()
  )
    throw new Response(null, {
      headers: {
        location: "/me",
      },
      status: 303,
    });

  const banData: { [k: string]: any } | null = await context.env.BANS.get(
    context.data.user.id,
    { type: "json" },
  );
  const banned = Boolean(await context.env.BANS.get(context.data.user.id));

  return {
    banned,
    clientId: context.env.RBX_ID,
    email: banned ? context.env.CONTACT_EMAIL : undefined,
    reason: banData ? banData.reason : undefined,
  };
}

export default function () {
  const loaderData = useLoaderData<typeof loader>();
  const { isOpen, onClose, onOpen } = useDisclosure();

  return loaderData.banned ? (
    <Banned email={loaderData.email} reason={loaderData.reason} />
  ) : (
    <Container pt="40px" maxW="28em">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Secondary Account Verification</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>
        </ModalContent>
      </Modal>
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
        onClick={async () => await initiateRBXSignIn(loaderData.clientId)}
      >
        Verify with Roblox
      </Button>
    </Container>
  );
}
