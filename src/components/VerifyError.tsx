import { Container, Text } from "@chakra-ui/react";
import { useEffect } from "react";

export default function () {
  useEffect(() => {
    (async function () {
      await new Promise((p) => setTimeout(p, 5000));
      window.location.assign("/");
    })();
  });

  return (
    <Container
      centerContent
      maxW="container.lg"
      paddingTop="15vh"
      textAlign="center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="128"
        height="128"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
      </svg>
      <br />
      <Text>Oops! We were unable to verify your account; try again later.</Text>
      <Text size="s">Redirecting in 5 seconds...</Text>
    </Container>
  );
}
