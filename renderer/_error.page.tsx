import { Container, Heading, Link, Text } from "@chakra-ui/react";

export function Page(pageCtx: PageContext) {
  return (
    <Container maxW="container.xl" textAlign="left" pb="200px" mt="40px">
      <Heading size="4xl">{pageCtx.is404 ? "404" : "500"}</Heading>
      <br />
      <br />
      <Text fontSize="xl">
        {pageCtx.is404
          ? "We couldn't find that page"
          : "Something broke when loading the page"}
      </Text>
      <br />
      <Link
        color="red"
        onClick={pageCtx.is404 ? () => history.back() : () => location.reload()}
      >
        {pageCtx.is404 ? "Go back" : "Refresh"}
      </Link>
    </Container>
  );
}
