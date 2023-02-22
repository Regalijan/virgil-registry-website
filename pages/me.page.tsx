import {
  Button,
  CloseButton,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Image,
  Link,
  Select,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { type Dispatch, type SetStateAction, useState } from "react";

export function Page(pageProps: {
  privacy?: {
    discord: number;
    roblox: number;
  };
  roblox_avatar?: string;
  roblox_username?: string;
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const [data, setData]: [
    typeof pageProps,
    Dispatch<SetStateAction<typeof pageProps>>
  ] = useState(pageProps);

  async function refreshUsername() {
    const refreshReq = await fetch("/client-api/linking/refresh", {
      body: "{}",
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    if (refreshReq.status === 401) return window.location.assign("/login");

    if (!refreshReq.ok) {
      toast({
        title: "Oops",
        description: "We were unable to refresh your username",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      const updatedData: { roblox_avatar?: string; roblox_username: string } =
        await refreshReq.json();

      toast({
        title: "Success",
        description: "We have refreshed your username",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setData({ ...data, ...updatedData });
    }
  }

  async function unverify() {
    const unverifyReq = await fetch("/client-api/linking/current", {
      method: "DELETE",
    });

    if (unverifyReq.status === 401) return window.location.assign("/login");

    if (!unverifyReq.ok) {
      toast({
        title: "Oops",
        description: "We were unable to unverify you",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: "We have unverified you",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      await new Promise((p) => setTimeout(p, 5500));
      window.location.assign("/verify");
    }
  }

  async function updatePrivacy() {
    const discordElem = document.getElementById(
      "discord-privacy"
    ) as unknown as HTMLSelectElement;
    const rbxElem = document.getElementById(
      "rbx-privacy"
    ) as unknown as HTMLSelectElement;
    const discord = discordElem.selectedIndex;
    const roblox = rbxElem.selectedIndex;
    const privacyUpdateReq = await fetch("/client-api/linking/privacy", {
      body: JSON.stringify({ discord, roblox }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    if (privacyUpdateReq.status === 401)
      return window.location.assign("/login");

    if (!privacyUpdateReq.ok) {
      toast({
        title: "Oops",
        description: "We were unable to update your privacy settings",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: "We have updated your privacy settings",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setData({ ...data, privacy: { discord, roblox } });
    }
  }

  return (
    <Container pt="5vh">
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <CloseButton onClick={onClose} />
          <DrawerHeader>Privacy Settings</DrawerHeader>
          <DrawerBody>
            <Text>
              These settings control who is able to access your data via our
              API.
              <br />
              <Link
                href="/about-privacy-settings"
                target="_blank"
                textDecor="underline"
              >
                Read more about these settings.
              </Link>
            </Text>
            <br />
            <Text>Discord-to-Roblox Visibility</Text>
            <Select id="discord-privacy">
              <option value={0} selected={data.privacy?.discord === 0}>
                Everyone
              </option>
              <option value={1} selected={data.privacy?.discord === 1}>
                Anyone with an API key
              </option>
              <option value={2} selected={data.privacy?.discord === 2}>
                Only official bots
              </option>
            </Select>
            <br />
            <Text>Roblox-to-Discord Visibility</Text>
            <Select id="rbx-privacy">
              <option selected={data.privacy?.roblox === 0}>Everyone</option>
              <option selected={data.privacy?.roblox === 1}>
                Anyone with an API key
              </option>
              <option selected={data.privacy?.roblox === 2}>
                Only official bots
              </option>
            </Select>
            <br />
            <Button
              onClick={async () => {
                await updatePrivacy();
                onClose();
              }}
            >
              Save
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Image
        alt="Your Roblox avatar"
        boxSize="180px"
        display="initial"
        src={data.roblox_avatar}
      />
      <br />
      <Heading>Hello {data.roblox_username}!</Heading>
      <br />
      <br />
      <br />
      <Tooltip
        bg="gray"
        hasArrow
        label="If you have recently changed your username, use this button to update it in our systems."
      >
        <Button size="lg" onClick={async () => await refreshUsername()}>
          Refresh
        </Button>
      </Tooltip>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button
        size="lg"
        colorScheme="red"
        onClick={async () => await unverify()}
      >
        Unverify
      </Button>
      <br />
      <br />
      <Link
        onClick={onOpen}
        textDecoration="underline"
        textColor="red"
        textDecorationColor="red"
      >
        Manage your privacy settings
      </Link>
    </Container>
  );
}
