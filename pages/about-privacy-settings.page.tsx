import {
  Container,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

export function Page() {
  return (
    <Container maxW="container.lg" textAlign="left">
      <Heading>About Privacy Settings</Heading>
      <br />
      <Text>
        We offer three privacy settings for Discord-to-Roblox and
        Roblox-to-Discord; each of which are explained below.
      </Text>
      <br />
      <Text>
        Note: These settings apply to others utilizing our API, not other users
        using our official bots.
      </Text>
      <br />
      <br />
      <UnorderedList>
        <ListItem>
          Everyone: This allows all users to access your information via our
          API.
        </ListItem>
        <br />
        <ListItem>
          Anyone with an API key: All users with an API key can access your
          information via our API. Users with an API key have gone through a
          vetting process which scrutinizes their use case and operating
          practices.
        </ListItem>
        <br />
        <ListItem>
          Official bots only: Only our verified bots can access your
          information.
        </ListItem>
      </UnorderedList>
      <br />
      <Text>
        The default privacy levels (set to Everyone for Discord-to-Roblox and
        API key for Roblox-to-Discord) are applied when you verify your account.
      </Text>
    </Container>
  );
}
