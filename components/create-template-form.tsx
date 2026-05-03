'use client';

import { type FormEvent, useState } from 'react';
import { ApiError, clientApi } from '@/lib/client-api';
import type { UserTemplate } from '@/lib/types';

interface Props {
  onCreated: (template: UserTemplate) => void;
  onCancel: () => void;
}

export default function CreateTemplateForm({ onCreated, onCancel }: Props) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const created = await clientApi.userTemplates.create({ name, subject, html });
      onCreated(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create template.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-violet-200 p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-slate-900">New template</h3>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Cancel"
        >
          <CloseIcon />
        </button>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
        {/* Name + Subject row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-600">
              Name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              placeholder="Promo announcement"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-600">
              Subject <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              required
              maxLength={255}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-mono"
              placeholder="Hey {{name}}, check this out!"
            />
          </label>
        </div>

        {/* HTML body */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">
              HTML body <span className="text-red-500">*</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">
                Use <code className="font-mono bg-slate-100 px-1 rounded">{`{{varName}}`}</code> for
                variables
              </span>
              {html && (
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className="text-[10px] font-medium text-violet-600 hover:text-violet-800 transition-colors"
                >
                  {preview ? 'Hide preview' : 'Preview'}
                </button>
              )}
            </div>
          </div>
          <textarea
            required
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={10}
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-mono resize-y"
            placeholder={'<h1>Hello {{name}}!</h1>\n<p>Welcome to our platform.</p>'}
          />
        </div>

        {/* Inline preview */}
        {preview && html && (
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                HTML preview
              </span>
            </div>
            <iframe
              srcDoc={html}
              title="HTML preview"
              className="w-full border-0"
              style={{ height: '300px' }}
              sandbox="allow-same-origin"
            />
          </div>
        )}

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 justify-end pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {submitting && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Create template
          </button>
        </div>
      </form>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
