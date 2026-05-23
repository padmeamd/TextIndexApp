import { Card, Text, Group, ActionIcon, Badge, Stack } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import * as api from '../api/texts';
import type { TextDocument } from '../api/texts';

interface Props {
  doc: TextDocument;
  onEdit: (doc: TextDocument) => void;
}

export default function DocumentCard({ doc, onEdit }: Props) {
  const qc = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => api.remove(doc.id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['texts'] });
      notifications.show({ color: 'red', message: 'Document deleted.' });
    },
  });

  const formattedDate = doc.createdAt
    ? new Date(doc.createdAt).toLocaleDateString()
    : null;

  return (
    <Card withBorder shadow="sm" radius="md" padding="md">
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Text fw={600} size="md" lineClamp={1}>
            {doc.title}
          </Text>
          <Group gap="xs" wrap="nowrap">
            <ActionIcon variant="subtle" onClick={() => onEdit(doc)}>
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={3}>
          {doc.content}
        </Text>

        {formattedDate && (
          <Badge variant="light" color="gray" size="sm" w="fit-content">
            {formattedDate}
          </Badge>
        )}
      </Stack>
    </Card>
  );
}
