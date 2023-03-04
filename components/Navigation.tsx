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

function getAvatarUrl(userData: { [k: string]: any }): string {
  const BASE = "https://cdn.discordapp.com/";

  if (!userData.id) return "";

  if (!userData.avatar)
    return BASE + `embed/avatars/${parseInt(userData.discriminator) % 5}.png`;

  return BASE + `avatars/${userData.id}/${userData.avatar}`;
}

export default function (props: {
  avatar?: string;
  discriminator?: string;
  hide?: boolean;
  id?: string;
  username?: string;
}) {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onClose, onOpen } = useDisclosure();

  async function revokeSession() {
    const revokeReq = await fetch("/client-api/auth/session", {
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

    location.assign("/");
  }

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
                    src="/files/logo44.png"
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
                  src="/files/logo44.png"
                  alt="Virgil Registry Logo"
                  style={{ width: "36px", borderRadius: "50%" }}
                />
              </a>
              <Flex justify="space-between" flex="1">
                <ButtonGroup variant="link" spacing="6">
                  <Button as="a" href="/premium">
                    Premium
                  </Button>
                  <Button as="a" href="https://discord.com/invite/carcrushers">
                    Support
                  </Button>
                  <Button as="a" href="/docs">
                    Docs
                  </Button>
                </ButtonGroup>
                <HStack display={props.hide ? "none" : "flex"} spacing="3">
                  <Button
                    onClick={() =>
                      window.location.assign(props.id ? "/me" : "/login")
                    }
                  >
                    {props.id ? "Manage" : "Sign In"}
                  </Button>
                  <Avatar
                    display={props.id ? "flex" : "none"}
                    src={getAvatarUrl(props)}
                  />
                  <Text>
                    {props.id ? `${props.username}#${props.discriminator}` : ""}
                  </Text>
                  <Button
                    style={{ display: props.id ? "block" : "none" }}
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
          <Link href={props.id ? "/me" : "/login"}>
            {props.id ? "Manage" : "Sign In"}
          </Link>
          <HStack display={props.hide ? "none" : "flex"} spacing="3">
            <Avatar
              display={props.id ? "" : "none"}
              src={getAvatarUrl(props)}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Text align="center" style={{ overflowWrap: "anywhere" }}>
              {props.id ? `${props.username}#${props.discriminator}` : ""}
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
                display: props.id ? "block" : "none",
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
