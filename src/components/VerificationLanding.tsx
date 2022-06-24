import {
  Button,
  Container,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

function validUsername(username: string): boolean {
  return !(
    username.length < 3 ||
    username.length > 20 ||
    username.match(/\W/) ||
    username.startsWith("_") ||
    username.endsWith("_") ||
    (username.match(/_/g)?.length as number) > 1
  );
}

export default function () {
  const toast = useToast();
  function handleSubmit(username: string): void {
    if (!validUsername(username)) {
      toast({
        description: "Please check the username and try again",
        isClosable: true,
        status: "error",
        title: "Invalid Username",
      });
      return;
    }
  }

  const [username, setUsername] = useState("");

  return (
    <Container pt="40px" maxW="28em">
      <Heading>Hello</Heading>
      <br />
      <Text fontSize="xl">This will be quick, we promise.</Text>
      <br />
      <Text pb="10px" align="left" pl="15%">
        What is your Roblox username?
      </Text>
      <Input
        placeholder="builderman"
        w="70%"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <Button
        alignSelf="center"
        mt="15px"
        w="70%"
        onClick={() => handleSubmit(username)}
      >
        Next
      </Button>
    </Container>
  );
}
