export interface TextDocument {
  id?: string;
  title: string;
  content: string;
  createdAt?: string;
}

export type TextDocumentInput = Pick<TextDocument, 'title' | 'content'>;

const BASE = '/api/texts';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const fetchAll = (): Promise<TextDocument[]> =>
  fetch(BASE).then(handleResponse);

export const fetchById = (id: string): Promise<TextDocument> =>
  fetch(`${BASE}/${id}`).then(handleResponse);

export const create = (doc: TextDocumentInput): Promise<TextDocument> =>
  fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc),
  }).then(handleResponse);

export const update = (id: string, doc: TextDocumentInput): Promise<TextDocument> =>
  fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc),
  }).then(handleResponse);

export const remove = (id: string): Promise<void> =>
  fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(handleResponse);

export const search = (q: string): Promise<TextDocument[]> =>
  fetch(`${BASE}/search?q=${encodeURIComponent(q)}`).then(handleResponse);
