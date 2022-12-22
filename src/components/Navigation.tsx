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
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
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

  async function revokeSession() {
    const session = localStorage.getItem("registry-session");

    if (!session) return setUserData({});

    const revokeReq = await fetch("/client-api/auth/session", {
      headers: {
        authorization: session,
      },
      method: "DELETE",
    });

    if (revokeReq.status.toString().startsWith("5")) {
      useToast()({
        title: "Oops",
        description: "We were unable to log you out",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    localStorage.removeItem("registry-session");
    setUserData({});
  }

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
      else if (authCheckReq.status === 401)
        localStorage.removeItem("registry-session");
    })();
  }, []);

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
              <Center w="calc(100% - var(--chakra-space-8))">
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
                  src="/logo44.png"
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
                  <Button
                    onClick={() =>
                      window.location.assign(userData.id ? "/me" : "/login")
                    }
                  >
                    {userData.id ? "Manage" : "Sign In"}
                  </Button>
                  <Avatar
                    display={userData.id ? "flex" : "none"}
                    src={getAvatarUrl(userData)}
                  />
                  <Text>
                    {userData.id
                      ? `${userData.username}#${userData.discriminator}`
                      : ""}
                  </Text>
                  <Button
                    style={{ display: userData.id ? "block" : "none" }}
                    variant="ghost"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      onClick={async () => await revokeSession()}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                      />
                      <path
                        fillRule="evenodd"
                        d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                      />
                    </svg>
                  </Button>
                </HStack>
              </Flex>
            </HStack>
          </Container>
        </Box>
      </Box>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent gap="2vh" p="2vh">
          <CloseButton onClick={onClose} />
          <Link href="/premium">Premium</Link>
          <Link href="https://discord.com/invite/carcrushers">Support</Link>
          <Link href="/docs">Docs</Link>
          <Link href={userData.id ? "/me" : "/login"}>
            {userData.id ? "Manage" : "Sign In"}
          </Link>
          <HStack spacing="3">
            <Avatar
              display={userData.id ? "" : "none"}
              src={getAvatarUrl(userData)}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Text align="center" style={{ overflowWrap: "anywhere" }}>
              {userData.id
                ? `${userData.username}#${userData.discriminator}`
                : ""}
            </Text>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
              style={{
                cursor: "pointer",
                display: userData.id ? "block" : "none",
              }}
              onClick={async () => await revokeSession()}
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
              />
              <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
              />
            </svg>
          </HStack>
        </DrawerContent>
      </Drawer>
    </>
  );
}
