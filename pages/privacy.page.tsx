import {
  Container,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

export function Page() {
  return (
    <Container maxW="container.lg" textAlign="left">
      <Heading size="2xl">Privacy Policy</Heading>
      <br />
      <Text>
        Our policy is relatively simple, we only collect what is needed, and if
        it is no longer needed, we dispose of it. For details, continue reading
        below.
      </Text>
      <br />
      <br />
      <Heading>What do we collect/why?</Heading>
      <Text>
        We collect information necessary to operate the service, as listed
        below:
      </Text>
      <br />
      <UnorderedList>
        <ListItem>
          Discord Account Information: We need some basic information from your
          Discord account to provide you the service (i.e your 17-19 digit
          unique snowflake). This information makes up one half of your
          verification data, and is required to allow you to verify. Retention
          period: Not deleted automatically.
        </ListItem>
        <br />
        <ListItem>
          Roblox Account Information: In order to connect your Discord account
          with your Roblox account, we also need your Roblox user ID and
          username. Retention period: Not deleted automatically.
        </ListItem>
        <br />
        <ListItem>
          Settings: In order to provide you the service, we need to store the
          settings you select so that they actually take effect. Retention
          period: Not deleted automatically.
        </ListItem>
        <br />
        <ListItem>
          Browser Details: This includes information such as your operating
          system, set language, and the browser you are using. While we don't
          consider this to be necessary, this information is sent by your
          browser whether we request it or not, and we can't do anything about
          it. Retention period: Not stored.
        </ListItem>
        <br />
        <ListItem>
          IP Addresses: Your IP address is always visible to every site you
          visit, including this one. We may store it temporarily during the
          sign-in process for security reasons, we do not use it for any other
          purpose. Retention period: 5 minutes maximum.
        </ListItem>
      </UnorderedList>
      <br />
      <Heading>Third parties</Heading>
      <Text>
        While we have no interest in telling Mark Zuckerberg about what you've
        been up to, we do enlist the help of third-parties to help provide our
        service. Our third parties are as follows:
      </Text>
      <br />
      <UnorderedList>
        <ListItem>
          Discord: We receive your profile information to provide you our
          service.
        </ListItem>
        <ListItem>
          Roblox: We receive your profile information to provide you our
          service.
        </ListItem>
        <ListItem>
          Cloudflare: They provide hosting and storage services to us which
          allows us to provide this service to you. In turn they receive certain
          information about your browser for DDoS prevention and bot blocking,
          but do not sell or otherwise distribute it.
        </ListItem>
      </UnorderedList>
      <br />
      <Heading>Data Rights</Heading>
      <Text>
        Some jurisdictions provide privacy rights to their residents, in turn we
        allow you to exercise those rights. More information is below regarding
        these rights:
      </Text>
      <br />
      <UnorderedList>
        <ListItem>
          Right of Access: You have the right to access the data we have on your
          record. This information is available on the dashboard, via the api,
          and the bot.
        </ListItem>
        <br />
        <ListItem>
          Right of Erasure: You have the right to delete your data. This right
          can be exercised by unverifying your account and signing out.
        </ListItem>
        <br />
        <ListItem>
          Right of Export: You have the right to export your data in a portable
          format. See the developer documentation for information on how to do
          this.
        </ListItem>
        <br />
        <ListItem>
          Other rights: There are other rights that may be provided to you,
          although they are effectively irrelevant here because we do the bare
          minimum of collection and processing, or are covered by other rights,
          such as the right to request restrictions.
        </ListItem>
      </UnorderedList>
      <br />
      <Heading>Legal Basis</Heading>
      <Text>
        As stated earlier, we must process your data in order to provide you
        this service. That is the only reason we intentionally process your
        data.
      </Text>
      <br />
      <Heading>Disclosure</Heading>
      <Text>
        In order to provide this service, there are a few cases where we must
        disclose your data. These cases are:
      </Text>
      <br />
      <UnorderedList>
        <ListItem>
          Providing this service: We make verification data available via our
          API. You may restrict who can access this data in your settings.
        </ListItem>
        <br />
        <ListItem>
          Legal reasons: If we are served with a warrant or subpoenia, we are
          legally compelled to disclose certain data to law enforcement.
        </ListItem>
      </UnorderedList>
      <br />
      <Heading>Children</Heading>
      <Text>
        We are not intended for children under 13. You aren't even allowed to
        use Discord if you're under 13.
      </Text>
      <br />
      <Heading>Cookies</Heading>
      <Text>
        All "cookies" (we use local/session storage only) set by this site are
        necessary for operation. We do not set marketing or targeting cookies of
        any sort.
      </Text>
      <br />
      <Heading>Security</Heading>
      <Text>
        We make commercially reasonable efforts to protect our service, but
        nothing is ever 100% certain (except death and taxes). If we were to
        ever suffer a security breach, the risk would be generally low (we only
        permanently store basic profile information and settings), and it would
        be reported to authorities.
      </Text>
      <br />
      <Heading>Contact</Heading>
      <Text>
        We don't exactly have an official contact point, but can be reached in{" "}
        <Link
          href="https://discord.com/invite/carcrushers"
          target="_blank"
          color="red"
        >
          our server
        </Link>
      </Text>
    </Container>
  );
}
