import { Container, Heading, Text } from "@chakra-ui/react";

export function Page() {
  return (
    <Container maxW="container.md" pb="100px" textAlign="left">
      <Heading textAlign="center">Acceptable Use Policy</Heading>
      <br />
      <Text fontSize="lg">
        This policy applies to all users of the registry, and is enforced in
        conjunction with the Terms of Service. Violators of these rules may have
        their access to the registry or the bot revoked.
      </Text>
      <br />
      <Heading textAlign="center" size="md">
        General Rules
      </Heading>
      <br />
      <Text fontSize="lg">
        <ul>
          <li>
            <b>Only use your own account</b>: In the event that we receive
            notice of a stolen account, you will be permanently banned from the
            registry.
          </li>
          <br />
          <li>
            <b>Respect the privacy of other users</b>: Do not use the registry
            to stalk or otherwise track other users.
          </li>
          <br />
          <li>
            <b>Follow Discord's Terms of Service</b>: We intend on staying
            compliant with Discord's terms and so should you.
          </li>
        </ul>
      </Text>
      <br />
      <Heading size="md" textAlign="center">
        Developer Guidelines
      </Heading>
      <br />
      <Text fontSize="lg">
        <ul>
          <li>
            <b>Do not spam requests</b>: While we do not have any hard
            rate-limiting, we ask that you do not abuse our service. Making
            requests for the sake of making them may get you blocked from the
            API, repeat offenders will be permanently banned from accessing the
            API.
          </li>
          <br />
          <li>
            <b>Do not attempt to bypass access restrictions</b>: Users expect
            the privacy settings they choose are accurate. Do not attempt to
            circumvent user privacy settings or otherwise bypass any
            restrictions on the API.
          </li>
          <br />
          <li>
            <b>Do not proxy the API</b>: Do not lease, resell, relicense, or
            otherwise proxy responses from the API without written approval.
          </li>
        </ul>
      </Text>
    </Container>
  );
}
