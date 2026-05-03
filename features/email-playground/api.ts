import type { Block, EmailTemplateListItem } from './types';

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost:3000';

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${GATEWAY}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    let msg = text;
    try {
      const j = JSON.parse(text) as { message?: string };
      if (typeof j.message === 'string') msg = j.message;
    } catch { /* empty */ }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const playgroundApi = {
  list: (): Promise<EmailTemplateListItem[]> =>
    req('/email-templates'),

  get: (id: string): Promise<unknown> =>
    req(`/email-templates/${id}`),

  create: (data: { name: string; description: string; blocks: Block[] }): Promise<unknown> =>
    req('/email-templates', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: { name?: string; description?: string; blocks?: Block[] }): Promise<unknown> =>
    req(`/email-templates/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id: string): Promise<void> =>
    req(`/email-templates/${id}`, { method: 'DELETE' }),

  render: (data: { blocks: Block[]; variables?: Record<string, string> }): Promise<{ html: string }> =>
    req('/email-templates/render', { method: 'POST', body: JSON.stringify(data) }),

  sendTest: (data: { templateId: string; to: string; variables?: Record<string, string> }): Promise<{ sent: boolean }> =>
    req('/email-templates/send-test', { method: 'POST', body: JSON.stringify(data) }),
};
