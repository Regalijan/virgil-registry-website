import { Container, Heading, Link, Text } from "@chakra-ui/react";

export default function () {
  return (
    <Container maxW="container.xl" textAlign="left" pb="200px" mt="40px">
      <Heading size="4xl">404</Heading>
      <br />
      <br />
      <Text fontSize="xl">We couldn't find that page</Text>
      <br />
      <Link color="red" onClick={() => history.back()}>
        Go back
      </Link>
    </Container>
  );
}
