import {
  ButtonGroup,
  Container,
  Divider,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function () {
  return (
    <Container as="footer" role="contentinfo" pt="100px" maxW="container.xl">
      <Stack
        spacing="8"
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        py={{ base: "12", md: "16" }}
      >
        <Stack spacing={{ base: "6", md: "8" }} align="start">
          <img
            src="/logo128.png"
            width="128"
            height="128"
            alt="Virgil Registry Logo"
          />
          <Text>Lorem Ipsum blah blah blah whatever skilledon is noob</Text>
        </Stack>
        <Stack
          direction={{ base: "column-reverse", md: "column", lg: "row" }}
          spacing={{ base: "12", md: "8" }}
        >
          <Stack direction="row" spacing="8">
            <Stack spacing="4" minW="36" flex="1">
              <Text fontSize="sm" fontWeight="semibold" color="subtle">
                Product
              </Text>
              <Stack spacing="3" shouldWrapChildren>
                <Link href="https://discord.com/invite/carcrushers">
                  <b>Support</b>
                </Link>
                <Link href="https://virgil.gg">
                  <b>Virgil</b>
                </Link>
                <Link>
                  <b>Developers</b>
                </Link>
              </Stack>
            </Stack>
            <Stack spacing="4" minW="36" flex="1">
              <Text fontSize="sm" fontWeight="semibold" color="subtle">
                Legal
              </Text>
              <Stack spacing="3" shouldWrapChildren>
                <Link href="/privacy">
                  <b>Privacy</b>
                </Link>
                <Link href="/terms">
                  <b>Terms</b>
                </Link>
                <Link href="/aup">
                  <b>Acceptable Use Policy</b>
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      <Stack
        pt="8"
        pb="4"
        justify="space-between"
        direction={{ base: "column-reverse", md: "row" }}
        align="center"
      >
        <Text fontSize="sm" color="subtle">
          &copy; {new Date().getFullYear()} Wolftallemo
        </Text>
        <ButtonGroup variant="ghost">
          <IconButton
            as="a"
            href="https://github.com/Wolftallemo?tab=repositories"
            aria-label="GitHub"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            }
          />
        </ButtonGroup>
      </Stack>
      <Stack
        pt="4"
        direction={{ base: "column-reverse", md: "row" }}
        align="center"
      >
        <Link fontSize="sm" href="/attributions">
          Attributions
        </Link>
      </Stack>
    </Container>
  );
}
