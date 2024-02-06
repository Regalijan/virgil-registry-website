import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function () {
  return (
    <>
      <style>
        {`
          .lg-display-flex {
            @media (max-width: 899px) {
              flex-direction: column;
            }
          }

          .lg-display-flex-reverse {
            @media (max-width: 899px) {
              flex-direction: column-reverse;
            }
          }

          .lg-display-pb {
            @media (min-width: 900px) {
              padding-bottom: 40px;
            }
          }
        `}
      </style>
      <Box alignContent="left">
        <Container maxW="container.xl" textAlign="left" paddingTop="8vh">
          <Heading>Roblox and Discord are better together</Heading>
          <br />
          <Text fontSize="xl">
            Connect your Roblox account with Discord - Integrated with Virgil
          </Text>
          <br />
          <br />
          <Button
            alignSelf="left"
            background="red.700"
            color="white"
            size="lg"
            onClick={() => window.location.assign("/me")}
          >
            Get Started
          </Button>
        </Container>
      </Box>
      <br />
      <br />
      <br />
      <br />
      <Box w="100%" bg="red.700" color="white" pb="40px">
        <Container
          maxW="container.xl"
          pt="40px"
          alignSelf="center"
          textAlign="left"
        >
          <Heading pb="40px">Why Virgil?</Heading>
          <br />
        </Container>
        <br />
        <Container maxW="container.xl">
          <Flex>
            <VStack>
              <HStack
                className="lg-display-flex"
                w="100%"
                paddingBottom="120px"
              >
                <Container
                  className="lg-display-pb"
                  display="flex"
                  justifyContent="center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="168"
                    height="168"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 14.933a.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067v13.866zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"
                    />
                  </svg>
                </Container>
                <Container maxW="container.xl" textAlign="left">
                  <Heading pb="20px">Better Privacy</Heading>
                  <Text fontSize="xl">
                    We allow you to make your data as public or private as you
                    want. We also don't collect unnecessary data or display
                    advertisements.
                  </Text>
                </Container>
              </HStack>
              <HStack
                className="lg-display-flex-reverse"
                w="100%"
                paddingBottom="120px"
              >
                <Container className="lg-display-pb" textAlign="left">
                  <Heading pb="20px">Integration</Heading>
                  <Text fontSize="xl">
                    Utilize Virgil's moderation features with Roblox
                    verification to extend your server.
                  </Text>
                </Container>
                <Container
                  className="lg-display-pb"
                  display="flex"
                  justifyContent="center"
                  maxW="container.xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="168"
                    height="168"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    display="flex"
                  >
                    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41 4.157 8.5z" />
                  </svg>
                </Container>
              </HStack>
              <HStack className="lg-display-flex" display="flex" w="100%">
                <Container
                  className="lg-display-pb"
                  display="flex"
                  justifyContent="center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="168"
                    height="168"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.698 7.287 8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025 1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.03 1.03 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.031 1.031 0 0 0 0-1.457" />
                  </svg>
                </Container>
                <Container
                  className="lg-display-pb"
                  maxW="container.xl"
                  textAlign="left"
                >
                  <Heading pb="20px">Open Source</Heading>
                  <Text fontSize="xl">
                    Our code is readily available on GitHub for anyone to view
                    and contribute.
                  </Text>
                </Container>
              </HStack>
            </VStack>
          </Flex>
        </Container>
      </Box>
    </>
  );
}
