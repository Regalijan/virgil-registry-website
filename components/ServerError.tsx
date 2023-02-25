import { Container, Heading, Link, Text } from "@chakra-ui/react";

export default function () {
  return (
    <Container maxW="container.xl" textAlign="left" pb="200px" mt="40px">
      <Heading size="4xl">500</Heading>
      <br />
      <br />
      <Text fontSize="xl">Something broke when loading the page</Text>
      <br />
      <Link color="red" onClick={() => location.reload()}>
        Refresh
      </Link>
    </Container>
  );
}
