import { useEffect } from 'react';
import { Modal, TextInput, Textarea, Button, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import * as api from '../api/texts';
import type { TextDocument, TextDocumentInput } from '../api/texts';

interface Props {
  opened: boolean;
  onClose: () => void;
  document: TextDocument | null;
}

export default function DocumentModal({ opened, onClose, document }: Props) {
  const qc = useQueryClient();
  const isEdit = !!document?.id;

  const form = useForm<TextDocumentInput>({
    initialValues: { title: '', content: '' },
  });

  useEffect(() => {
    if (opened) {
      form.setValues(
        document ? { title: document.title, content: document.content } : { title: '', content: '' }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, document]);

  const mutation = useMutation({
    mutationFn: (values: TextDocumentInput) =>
      isEdit ? api.update(document!.id!, values) : api.create(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['texts'] });
      notifications.show({
        color: 'green',
        message: isEdit ? 'Document updated.' : 'Document created.',
      });
      onClose();
    },
    onError: () => {
      notifications.show({ color: 'red', message: 'Something went wrong.' });
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? 'Edit Document' : 'New Document'}
      size="lg"
    >
      <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
        <Stack>
          <TextInput
            label="Title"
            placeholder="Enter title"
            required
            {...form.getInputProps('title')}
          />
          <Textarea
            label="Content"
            placeholder="Enter content"
            required
            minRows={5}
            autosize
            {...form.getInputProps('content')}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
