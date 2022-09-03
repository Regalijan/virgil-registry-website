import { Container, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function () {
  const [errored, hasErrored] = useState(false);
  const [loading, isLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const session = localStorage.getItem("registry-session");

      if (!session) return window.location.assign("/login");

      const registryDataReq = await fetch("/client-api/linking/current", {
        headers: {
          authorization: session,
        },
      });

      if (registryDataReq.status.toString().startsWith("4"))
        return window.location.assign("/login");
    })();
  });

  if (loading) return <Loading />;

  return errored ? (
    <Container textAlign="center">
      <Heading>Oops!</Heading>
      <br />
      <Text>We were unable to load your profile; refresh to try again.</Text>
    </Container>
  ) : (
    <Container></Container>
  );
}
