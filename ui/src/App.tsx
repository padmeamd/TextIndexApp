import { useState } from 'react';
import {
  Container,
  Title,
  TextInput,
  Button,
  Group,
  Stack,
  SimpleGrid,
  Text,
  Center,
  Loader,
  Box,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { IconSearch, IconPlus, IconFileOff } from '@tabler/icons-react';
import * as api from './api/texts';
import type { TextDocument } from './api/texts';
import DocumentCard from './components/DocumentCard';
import DocumentModal from './components/DocumentModal';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debounced] = useDebouncedValue(searchTerm, 300);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TextDocument | null>(null);

  const isSearching = debounced.trim().length > 0;

  const { data: allDocs, isLoading: loadingAll } = useQuery({
    queryKey: ['texts'],
    queryFn: api.fetchAll,
    enabled: !isSearching,
  });

  const { data: searchResults, isLoading: loadingSearch } = useQuery({
    queryKey: ['texts', 'search', debounced],
    queryFn: () => api.search(debounced),
    enabled: isSearching,
  });

  const docs = isSearching ? searchResults : allDocs;
  const isLoading = isSearching ? loadingSearch : loadingAll;

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(doc: TextDocument) {
    setEditing(doc);
    setModalOpen(true);
  }

  return (
    <>
      <Box bg="dark.7" py="md" mb="xl">
        <Container size="lg">
          <Title order={2} c="white">
            Text Index
          </Title>
        </Container>
      </Box>

      <Container size="lg" pb="xl">
        <Stack gap="lg">
          <Group>
            <TextInput
              flex={1}
              placeholder="Search documents..."
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
            />
            <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
              New Document
            </Button>
          </Group>

          {isLoading ? (
            <Center py="xl">
              <Loader />
            </Center>
          ) : docs && docs.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
              {docs.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} onEdit={openEdit} />
              ))}
            </SimpleGrid>
          ) : (
            <Center py="xl">
              <Stack align="center" gap="xs">
                <IconFileOff size={40} color="gray" />
                <Text c="dimmed">
                  {isSearching ? 'No results found.' : 'No documents yet. Create one!'}
                </Text>
              </Stack>
            </Center>
          )}
        </Stack>
      </Container>

      <DocumentModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        document={editing}
      />
    </>
  );
}
