'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { ApiError, clientApi } from '@/lib/client-api';
import type { Template, UserTemplate } from '@/lib/types';

interface KV {
  key: string;
  value: string;
}

type TemplateOption =
  | { kind: 'system'; template: Template }
  | { kind: 'user'; template: UserTemplate };

export default function SendEmailForm() {
  const [systemTemplates, setSystemTemplates] = useState<Template[]>([]);
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  const [templateId, setTemplateId] = useState('');
  const [recipients, setRecipients] = useState('');
  const [pairs, setPairs] = useState<KV[]>([{ key: '', value: '' }]);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ sent: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.allSettled([
      clientApi.templates.list().then(setSystemTemplates),
      clientApi.userTemplates.list().then(setUserTemplates),
    ]).finally(() => setLoadingTemplates(false));
  }, []);

  // When a template is selected, pre-populate fields from its known variables
  function handleSelectTemplate(id: string) {
    setTemplateId(id);
    setResult(null);
    setError(null);

    const sysMatch = systemTemplates.find((t) => t.id === id);
    if (sysMatch) {
      setPairs(
        sysMatch.fields.length > 0
          ? sysMatch.fields.map((f) => ({ key: f.name, value: '' }))
          : [{ key: '', value: '' }],
      );
      return;
    }

    const userMatch = userTemplates.find((t) => t.id === id);
    if (userMatch) {
      const vars = [...new Set([...userMatch.html.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]))];
      setPairs(vars.length > 0 ? vars.map((v) => ({ key: v, value: '' })) : [{ key: '', value: '' }]);
    }
  }

  function addPair() {
    setPairs((p) => [...p, { key: '', value: '' }]);
  }

  function removePair(i: number) {
    setPairs((p) => p.filter((_, idx) => idx !== i));
  }

  function updatePair(i: number, field: 'key' | 'value', val: string) {
    setPairs((p) => p.map((kv, idx) => (idx === i ? { ...kv, [field]: val } : kv)));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const to = recipients
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (to.length === 0) {
      setError('At least one recipient is required.');
      return;
    }

    const templateData: Record<string, string> = {};
    for (const { key, value } of pairs) {
      if (key.trim()) templateData[key.trim()] = value;
    }

    setSubmitting(true);
    try {
      const res = await clientApi.notify.send({ templateId, to, templateData });
      setResult(res);
      setRecipients('');
      setPairs([{ key: '', value: '' }]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send email.');
    } finally {
      setSubmitting(false);
    }
  }

  const allOptions: TemplateOption[] = [
    ...systemTemplates.map((t): TemplateOption => ({ kind: 'system', template: t })),
    ...userTemplates.map((t): TemplateOption => ({ kind: 'user', template: t })),
  ];

  const selectedOption = allOptions.find((o) => o.template.id === templateId);

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-6 shadow-sm max-w-2xl"
    >
      {/* Template selector */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="template-select" className="text-xs font-medium text-slate-600">
          Template <span className="text-red-500">*</span>
        </label>

        {loadingTemplates ? (
          <div className="h-9 bg-slate-100 rounded-lg animate-pulse" />
        ) : (
          <select
            id="template-select"
            required
            value={templateId}
            onChange={(e) => handleSelectTemplate(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition bg-white"
          >
            <option value="">Choose a template…</option>
            {systemTemplates.length > 0 && (
              <optgroup label="System templates">
                {systemTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
            )}
            {userTemplates.length > 0 && (
              <optgroup label="My templates">
                {userTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        )}

        {selectedOption && (
          <p className="text-xs text-slate-400 font-mono mt-1">
            ID: {selectedOption.template.id} ·{' '}
            {selectedOption.kind === 'system' ? (
              <span className="text-slate-400">system template</span>
            ) : (
              <span className="text-violet-500">my template</span>
            )}
          </p>
        )}
      </div>

      {/* Recipients */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="recipients" className="text-xs font-medium text-slate-600">
          Recipients <span className="text-red-500">*</span>
        </label>
        <textarea
          id="recipients"
          required
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          rows={3}
          className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition resize-none"
          placeholder={'alice@example.com\nbob@example.com'}
        />
        <p className="text-[10px] text-slate-400">One email per line, or comma-separated.</p>
      </div>

      {/* Template data */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">Template variables</span>
          <button
            type="button"
            onClick={addPair}
            className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
          >
            + Add variable
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {pairs.map((kv, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={kv.key}
                onChange={(e) => updatePair(i, 'key', e.target.value)}
                placeholder="variable"
                className="flex-1 min-w-0 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-mono"
              />
              <span className="text-slate-300 shrink-0">→</span>
              <input
                type="text"
                value={kv.value}
                onChange={(e) => updatePair(i, 'value', e.target.value)}
                placeholder="value"
                className="flex-1 min-w-0 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
              {pairs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePair(i)}
                  aria-label="Remove"
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
                >
                  <RemoveIcon />
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-[10px] text-slate-400">
          Variables replace <code className="font-mono bg-slate-100 px-1 rounded">{`{{varName}}`}</code>{' '}
          in the template.
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          {error}
        </p>
      )}

      {result && (
        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
          <CheckIcon />
          <p className="text-sm text-emerald-700 font-medium">
            Sent to {result.sent} recipient{result.sent !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-end pt-1">
        <button
          type="submit"
          disabled={submitting || !templateId}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {submitting ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <SendIcon />
          )}
          Send email
        </button>
      </div>
    </form>
  );
}

function RemoveIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  );
}
