import type { UserTemplate, Template } from './types';

export const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(
  path: string,
  init?: Omit<RequestInit, 'headers'> & { headers?: Record<string, string> },
): Promise<T> {
  const { headers: extraHeaders, ...rest } = init ?? {};

  const res = await fetch(`${GATEWAY}${path}`, {
    ...rest,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    let message = text;
    try {
      const json = JSON.parse(text) as { message?: string };
      if (typeof json.message === 'string') message = json.message;
    } catch {
      // keep raw text
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const clientApi = {
  templates: {
    list: (): Promise<Template[]> => apiFetch('/templates'),
  },

  userTemplates: {
    list: (): Promise<UserTemplate[]> => apiFetch('/user-templates'),
    create: (data: {
      name: string;
      subject: string;
      html: string;
    }): Promise<UserTemplate> =>
      apiFetch('/user-templates', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      apiFetch(`/user-templates/${id}`, { method: 'DELETE' }),
  },

  notify: {
    send: (data: {
      templateId: string;
      to: string[];
      templateData: Record<string, string>;
    }): Promise<{ sent: number }> =>
      apiFetch('/notify/send', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
