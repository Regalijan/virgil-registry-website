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
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";

export async function loader({ context }: { context: RequestContext }) {
  if (!context.data?.user?.id)
    throw new Response(null, {
      headers: {
        location: "/login",
      },
      status: 303,
    });

  const userData: null | {
    avatar: string;
    discord_privacy: number;
    roblox_id: number;
    roblox_privacy: number;
    username: string;
  } = await context.env.REGISTRY_DB.prepare(
    "SELECT discord_privacy, roblox_id, roblox_privacy, username FROM verifications WHERE discord_id = ? AND server_id IS NULL;",
  )
    .bind(context.data.user.id)
    .first();

  if (!userData)
    throw new Response(null, {
      headers: {
        location: "/verify",
      },
      status: 303,
    });

  const thumbnailFetch = await fetch(
    `https://thumbnails.roblox.com/v1/users/avatar?format=Png&size=180x180&userIds=${userData.roblox_id}`,
  );

  if (!thumbnailFetch.ok) return userData;

  const { data: thumbData }: { data: { imageUrl: string }[] } =
    await thumbnailFetch.json();

  userData.avatar = thumbData[0].imageUrl;

  return userData;
}

export default function () {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const [data, setData] = useState(useLoaderData<typeof loader>());

  async function refreshUsername() {
    const refreshReq = await fetch("/client-api/linking/refresh", {
      body: JSON.stringify({ user: data.roblox_id }),
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
      const updatedData: { avatar?: string; username: string } =
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
      "discord-privacy",
    ) as unknown as HTMLSelectElement;
    const rbxElem = document.getElementById(
      "rbx-privacy",
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
      setData({ ...data, discord_privacy: discord, roblox_privacy: roblox });
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
              <option value={0} selected={data.discord_privacy === 0}>
                Everyone
              </option>
              <option value={1} selected={data.discord_privacy === 1}>
                Anyone with an API key
              </option>
              <option value={2} selected={data.discord_privacy === 2}>
                Only official bots
              </option>
            </Select>
            <br />
            <Text>Roblox-to-Discord Visibility</Text>
            <Select id="rbx-privacy">
              <option selected={data.roblox_privacy === 0}>Everyone</option>
              <option selected={data.roblox_privacy === 1}>
                Anyone with an API key
              </option>
              <option selected={data.roblox_privacy === 2}>
                Only official bots
              </option>
            </Select>
            <br />
            <Button
              mb="16px"
              onClick={async () => {
                await updatePrivacy();
                onClose();
              }}
            >
              Save
            </Button>
            <br />
            <Link
              href="/client-api/export"
              pt="16px"
              textColor="red"
              textDecorationColor="red"
            >
              Download your Data
            </Link>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Image
        alt="Your Roblox avatar"
        boxSize="180px"
        display="initial"
        src={data.avatar}
      />
      <br />
      <Heading>Hello {data.username}!</Heading>
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
