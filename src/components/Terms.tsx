import {
  Container,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

export default function () {
  return (
    <Container maxW="container.lg" textAlign="left">
      <Heading size="2xl">Terms of Service</Heading>
      <br />
      <br />
      <Heading>Content</Heading>
      <br />
      <Text>
        Nothing in these terms grant us ownership rights to any content that you
        submit to this site. Nothing in these terms grants you ownership rights
        to our intellectual property either.
      </Text>
      <br />
      <Heading>Warranty</Heading>
      <br />
      <Text>
        Except where required by law, no warranty is provided whatsoever.
      </Text>
      <br />
      <Heading>Termination</Heading>
      <br />
      <Text>
        We may suspend or terminate access to this service at any time, without
        prior notice or liability, under our sole discretion, for any reason
        whatsoever and without limitation, including but not limited to a breach
        of the Terms. The contract is fully terminated when all user data is
        deleted.
      </Text>
      <br />
      <Heading>Governing Law</Heading>
      <br />
      <Text>
        Except for residents of the European Economic Area (European Union,
        Iceland, Norway, Switzerland), these terms shall be governed and
        construed in accordance with the laws of the Commonwealth of
        Pennsylvania. Residents of the European Economic Area whom are provided
        a higher consumer protection standard by law shall have those higher
        standards applied, such residents may also seek legal recourse in a
        court closer to their location.
      </Text>
      <br />
      <Heading>Acceptable Use</Heading>
      <br />
      <Text>While using this service, you may not:</Text>
      <br />
      <UnorderedList>
        <ListItem>Make excessive requests to our API</ListItem>
        <ListItem>
          Participate in account theft or other illegal activites
        </ListItem>
        <ListItem>
          Abuse, defame, or harass the service, its users, or operators
        </ListItem>
        <ListItem>
          Attempt to tamper with or disrupt with the infrastructure in a manner
          that harms or places an undue burden on the service
        </ListItem>
        <ListItem>
          Violate{" "}
          <Link href="https://discord.com/terms">
            Discord's Terms of Service
          </Link>
        </ListItem>
        <ListItem>Impersonate the service or its operators</ListItem>
      </UnorderedList>
      <br />
      <Text>
        TL;DR don't be a jerk. This is not intended to be an exhaustive list,
        and we may suspend or terminate your access to the services if necessary
        to protect ourselves or others
      </Text>
      <br />
      <Heading>Enforcement</Heading>
      <br />
      <Text>
        We may investigate and prosecute violations of these terms to the
        fullest legal extent. We may notify and cooperate with law enforcement
        authorities in prosecuting violations of the law and these terms.
      </Text>
    </Container>
  );
}
