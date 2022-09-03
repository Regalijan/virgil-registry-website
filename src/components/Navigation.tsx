import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  CloseButton,
  Container,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Link,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

function getAvatarUrl(userData: { [k: string]: any }): string {
  const BASE = "https://cdn.discordapp.com/";

  if (!userData.id) return "";

  if (!userData.avatar)
    return BASE + `embed/avatars/${parseInt(userData.discriminator) % 5}.png`;

  return BASE + `avatars/${userData.id}/${userData.avatar}`;
}

export default function () {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const [userData, setUserData]: [
    { [k: string]: any },
    React.Dispatch<React.SetStateAction<{ [k: string]: any }>>
  ] = useState({});
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    (async function () {
      const session = localStorage.getItem("registry-session");

      if (!session) return;

      const authCheckReq = await fetch("/client-api/auth/session", {
        headers: {
          authorization: session,
        },
      });

      if (authCheckReq.ok) setUserData(await authCheckReq.json());
    })();
  });

  return (
    <>
      <Box as="section" pb={{ base: "12" }}>
        <Box as="nav" justifyContent="center">
          <Container maxW="container.lg" py={{ base: "6" }}>
            <Container
              alignItems="center"
              display={isDesktop ? "none" : "flex"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                onClick={onOpen}
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                />
              </svg>
              <Center w="100%">
                <a href="/">
                  <img
                    src="/logo44.png"
                    alt="Virgil Registry Logo"
                    style={{ width: "36px", borderRadius: "50%" }}
                  />
                </a>
              </Center>
            </Container>
            <HStack
              display={isDesktop ? "flex" : "none"}
              justifyContent="left"
              spacing="6"
            >
              <a href="/">
                <img
                  src="/logo.png"
                  alt="Virgil Registry Logo"
                  style={{ width: "36px", borderRadius: "50%" }}
                />
              </a>
              <Flex justify="space-between" flex="1">
                <ButtonGroup variant="link" spacing="6">
                  <Button onClick={() => window.location.assign("/premium")}>
                    Premium
                  </Button>
                  <Button
                    onClick={() =>
                      window.location.assign(
                        "https://discord.com/invite/carcrushers"
                      )
                    }
                  >
                    Support
                  </Button>
                  <Button onClick={() => window.location.assign("/docs")}>
                    Docs
                  </Button>
                </ButtonGroup>
                <HStack spacing="3">
                  <Avatar
                    display={userData.id ? "flex" : "none"}
                    name={userData.username}
                    src={getAvatarUrl(userData)}
                  />
                  {userData.id
                    ? `${userData.username}#${userData.discriminator}`
                    : ""}
                  <Button
                    onClick={() =>
                      window.location.assign(userData.id ? "/me" : "/login")
                    }
                  >
                    {userData.id ? "Manage" : "Sign In"}
                  </Button>
                </HStack>
              </Flex>
            </HStack>
          </Container>
        </Box>
      </Box>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent p="2vh">
          <CloseButton onClick={onClose} />
          <br />
          <Link href="/premium">Premium</Link>
          <br />
          <Link href="https://discord.com/invite/carcrushers">Support</Link>
          <br />
          <Link href="/docs">Docs</Link>
          <br />
          <Link href={userData.id ? "/me" : "/login"}>
            {userData.id ? "Manage" : "Sign In"}
          </Link>
          <br />
          <Avatar
            display={userData.id ? "" : "none"}
            name={userData.username}
            src={getAvatarUrl(userData)}
          />
          {userData.id ? `${userData.username}#${userData.discriminator}` : ""}
        </DrawerContent>
      </Drawer>
    </>
  );
}
