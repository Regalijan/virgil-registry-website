import { Component, type ReactNode } from "react";
import { Code, Container, Heading, Text } from "@chakra-ui/react";
import Navigation from "./Navigation";

interface ErrorState {
  error: string | null;
  errored: boolean;
}

type Props = {
  [k: string]: any;
  children: ReactNode;
};

export default class Fallback extends Component<Props, ErrorState> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, errored: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { error, errored: true };
  }

  render() {
    if (!this.state.errored)
      return this.props.children;
    return (
      <>
      <Navigation />
        <Container maxW="container.xl" pb="100px">
          <Heading>Oops! Something broke.</Heading>
          <Text fontSize="xl">See the details below</Text>
          <br />
          <Text>{this.state.error?.toString()}</Text>
        </Container>
        <Container maxW="container.xl">
          {/* @ts-expect-error The stack property should always exist */}
          <Code>{this.state.error.stack}</Code>
        </Container>
      </>
    );
  }
}
