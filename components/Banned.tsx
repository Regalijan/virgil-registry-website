import { Container, Heading, Link, Text } from "@chakra-ui/react";

export default function (props: { email?: string; reason?: string }) {
  return (
    <Container maxW="container.md" textAlign="left">
      <Heading size="4xl">0xB</Heading>
      <br />
      <br />
      <Text fontSize="xl">
        This account is banned from the registry{" "}
        {props.reason ? `for the following reason: ${props.reason}` : ""}.
      </Text>
      <br />
      <Link color="red" href={"mailto:" + props.email}>
        Reach out to discuss or appeal your ban
      </Link>
    </Container>
  );
}
