import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";

export default function () {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  return (
    <Box as="section" pb={{ base: "12" }}>
      <Box as="nav" justifyContent="center">
        <Container py={{ base: "6" }}>
          <HStack spacing={isDesktop ? "6" : "4"} justifyContent="left">
            <a href="/">
              <img
                src="/logo.png"
                alt="Virgil Registry Logo"
                style={{ width: "36px", borderRadius: "50%" }}
              />
            </a>
            <Flex justify="space-between" flex="1">
              <ButtonGroup variant="link" spacing="6">
                <Button>Premium</Button>
                <Button>Support</Button>
                <Button>Docs</Button>
              </ButtonGroup>
              <HStack spacing="3">
                <Button onClick={() => window.location.assign("/login")}>
                  Sign In
                </Button>
              </HStack>
            </Flex>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}
