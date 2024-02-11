import {
  Button,
  Container,
  Heading,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

export async function loader({ context }: { context: RequestContext }) {
  if (!context.data.user?.id)
    throw new Response(null, {
      headers: {
        location: "/login",
      },
      status: 303,
    });

  if (
    await context.env.REGISTRY_DB.prepare(
      "SELECT id FROM verifications WHERE discord_id = ? AND server_id IS NULL;",
    )
      .bind(context.data.user.id)
      .first()
  )
    throw new Response(null, {
      headers: {
        location: "/verify",
      },
      status: 303,
    });

  return (
    await context.env.REGISTRY_DB.prepare(
      "SELECT created_at, key_name FROM api_keys WHERE user = ?;",
    )
      .bind(context.data.user.id)
      .all()
  ).results;
}

export default function () {
  const [selectedKey, selectKey] = useState(
    {} as { [k: string]: number | string },
  );
  const { isOpen, onClose, onOpen } = useDisclosure();
  const data = useLoaderData<typeof loader>();

  return (
    <Container maxW="container.lg" textAlign="start">
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Key</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading size="sm">Name</Heading>
            <Input
              maxLength={32}
              onChange={(e) => {
                selectKey({ ...selectedKey, key_name: e.target.value });
              }}
              value={selectedKey.key_name}
            />
          </ModalBody>
          <ModalFooter>
            <Button textColor="red" variant="ghost" mr="8px">
              Delete Key
            </Button>
            <Button variant="ghost" mr="8px">
              Rotate Key
            </Button>
            <Button colorScheme="red">Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Heading pb="16px">API Keys</Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Creation Time</Th>
              <Th>Modify</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((key: { [k: string]: any }) => {
              return (
                <Tr>
                  <Td>{key.key_name}</Td>
                  <Td>{new Date(key.created_at).toUTCString()}</Td>
                  <Td>
                    <Link onClick={onOpen}>Modify</Link>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}
