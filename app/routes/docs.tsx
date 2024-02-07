import {
  Code,
  Container,
  Heading,
  Link,
  ListItem,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";

export default function () {
  return (
    <Container maxW="container.lg" textAlign="left">
      <Heading>Developer Documentation</Heading>
      <br />
      <Text>
        You may or may not need an API key depending on how you intend on
        operating, head to the{" "}
        <Link href="/developers" textColor="red" textDecorationColor="red">
          Developer Dashboard
        </Link>{" "}
        to get one.
      </Text>
      <br />
      <Text>
        We offer two API endpoints to retrieve information, as listed below:
      </Text>
      <br />
      <Heading size="md">Get user by Discord ID</Heading>
      <br />
      <Text>
        GET <Code>GET /api/discord/:discord_id</Code>
        <br />
        This endpoint supports the `server_id` query parameter to retrieve the
        user's verification information for the specified server (pass the 17-19
        server id)
      </Text>
      <br />
      <Text>
        Returns a{" "}
        <Link href="#user-object" textColor="red" textDecorationColor="red">
          User object
        </Link>
      </Text>
      <br />
      <Heading size="md">Get Discord IDs by Roblox ID</Heading>
      <br />
      <Text>
        <Code>GET /api/roblox/:roblox_id</Code>
      </Text>
      <br />
      <Text>
        Returns a{" "}
        <Link href="#snowflake-list" textColor="red" textDecorationColor="red">
          Snowflake List
        </Link>
        , or an empty array if the Roblox account is not connected.
      </Text>
      <br />
      <Heading size="lg">Reference</Heading>
      <br />
      <Heading id="user-object" size="md">
        User Object
      </Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Property</Th>
            <Th>Type</Th>
            <Th>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>id</Td>
            <Td>integer</Td>
            <Td>Roblox ID of verified account</Td>
          </Tr>
          <Tr>
            <Td>username</Td>
            <Td>string</Td>
            <Td>Roblox Username of verified account</Td>
          </Tr>
        </Tbody>
      </Table>
      <br />
      <Heading id="snowflake-list" size="md">
        Snowflake List
      </Heading>
      <br />
      <Text>A list of Discord IDs; example:</Text>
      <Code>[ "123456789123456789", "987654321987654321" ]</Code>
      <br />
      <br />
      <Heading size="md">Status Codes</Heading>
      <br />
      <Text>The list of possible status codes is as follows:</Text>
      <UnorderedList>
        <ListItem>200: All is well</ListItem>
        <ListItem>
          401: You tried accessing information that requires an API key, and
          provided an invalid API key
        </ListItem>
        <ListItem>
          403: You tried to access something you do not have permission to
          access (i.e a user has set their privacy level to API key required and
          you did not provide an API key)
        </ListItem>
        <ListItem>404: User is not verified</ListItem>
        <ListItem>500: Something is broken on our end</ListItem>
      </UnorderedList>
      <br />
      <Heading size="md">Authorization</Heading>
      <br />
      <Text>
        To send authenticated requests, you must pass the API key in the{" "}
        <Code>authorization</Code> header with the <Code>Bearer</Code> token
        type.
      </Text>
      <br />
      <Heading size="md">Rate Limiting</Heading>
      <br />
      <Text>
        There is no hard rate limiting as it would be more expensive in terms of
        performance and cost than not given our infrastructure. However, we
        expect you to send a reasonable number of requests. Do not spam requests
        for the fun of it. Abuse may get you blocked or permanently banned from
        the API.
      </Text>
    </Container>
  );
}
