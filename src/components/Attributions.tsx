import {
  Container,
  Heading,
  Link,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";

export default function () {
  return (
    <Container
      bg="blackAlpha.200"
      borderRadius="10px"
      maxW="container.lg"
      p="3em"
      textAlign="left"
    >
      <Heading>Fonts</Heading>
      <br />
      <UnorderedList>
        <ListItem>
          <Link
            href="https://www.tokotype.com/custom/plus-jakarta"
            target="_blank"
          >
            Plus Jakarta Sans by Tokotype
          </Link>
        </ListItem>
      </UnorderedList>
      <br />
      <Heading>Interface</Heading>
      <br />
      <UnorderedList>
        <ListItem>
          <Link href="https://reactjs.org" target="_blank">
            React
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://chakra-ui.com" target="_blank">
            Chakra UI
          </Link>
        </ListItem>
      </UnorderedList>
      <br />
      <Heading>Icons</Heading>
      <br />
      <UnorderedList>
        <ListItem>
          <Link
            href="https://icons.getbootstrap.com/icons/shield-shaded/"
            target="_blank"
          >
            Shield shaded by Bootstrap Icons
          </Link>
        </ListItem>
        <ListItem>
          <Link
            href="https://icons.getbootstrap.com/icons/lightning-charge/"
            target="_blank"
          >
            Lightning charge by Bootstrap Icons
          </Link>
        </ListItem>
        <ListItem>
          <Link
            href="https://icons.getbootstrap.com/icons/git/"
            target="_blank"
          >
            Git by Bootstrap Icons
          </Link>
        </ListItem>
        <ListItem>
          <Link
            href="https://icons.getbootstrap.com/icons/github/"
            target="_blank"
          >
            Github by Bootstrap Icons
          </Link>
        </ListItem>
      </UnorderedList>
      <br />
      <Heading>Original Logo</Heading>
      <br />
      <Link href="discord:///users/165047934113677312">Virt#0001</Link>
    </Container>
  );
}
