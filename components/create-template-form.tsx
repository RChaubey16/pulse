'use client';

import { type FormEvent, useState } from 'react';
import { ApiError, clientApi } from '@/lib/client-api';
import type { UserTemplate } from '@/lib/types';

const STARTER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#4f46e5;padding:28px 40px;text-align:center;">
              <span style="color:#ffffff;font-size:22px;font-weight:700;">Atlas</span>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 20px;font-size:24px;font-weight:700;color:#0f172a;">Hello {{name}}!</h1>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#475569;">{{message}}</p>
              <p style="margin:0;font-size:15px;color:#64748b;">— The Atlas Team</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #e2e8f0;background-color:#f8fafc;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">© 2025 Atlas</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

interface Props {
  onCreated: (template: UserTemplate) => void;
  onCancel: () => void;
}

export default function CreateTemplateForm({ onCreated, onCancel }: Props) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState(STARTER_HTML);
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
    <div className="bg-white rounded-xl border border-violet-200 mb-6 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">New template</h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Cancel"
        >
          <CloseIcon />
        </button>
      </div>

      <div className={html ? 'grid lg:grid-cols-2 lg:divide-x lg:divide-slate-100' : ''}>
        {/* Form */}
        <form onSubmit={(e) => void handleSubmit(e)} className="p-6 flex flex-col gap-4">
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

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                HTML body <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] text-slate-400">
                Use{' '}
                <code className="font-mono bg-slate-100 px-1 rounded">{`{{varName}}`}</code> for
                variables
              </span>
            </div>
            <textarea
              required
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={12}
              className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-mono resize-y"
              placeholder={'<h1>Hello {{name}}!</h1>\n<p>Welcome to our platform.</p>'}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

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

        {/* Live email preview */}
        {html && <EmailPreview subject={subject} html={html} />}
      </div>
    </div>
  );
}

function EmailPreview({ subject, html }: { subject: string; html: string }) {
  return (
    <div className="flex flex-col bg-slate-50 border-t border-slate-100 lg:border-t-0">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-200 bg-white">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Live preview
        </span>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        {/* Email client window */}
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          {/* macOS-style window chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 border-b border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="flex-1 text-center text-[10px] text-slate-400 font-medium pr-8">
              New Message
            </span>
          </div>

          {/* Email headers */}
          <div className="px-4 py-3 space-y-2 border-b border-slate-100 bg-white">
            <div className="flex items-baseline gap-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-14 shrink-0">
                From
              </span>
              <span className="text-xs text-slate-600">Atlas &lt;no-reply@atlas.app&gt;</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-14 shrink-0">
                To
              </span>
              <span className="text-xs text-slate-400 italic">recipient@example.com</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-14 shrink-0">
                Subject
              </span>
              {subject ? (
                <span className="text-xs text-slate-800 font-medium">{subject}</span>
              ) : (
                <span className="text-xs text-slate-300 italic">no subject yet</span>
              )}
            </div>
          </div>

          {/* Rendered HTML body */}
          <iframe
            srcDoc={html}
            title="Email body preview"
            className="w-full border-0 block"
            style={{ height: '400px' }}
            sandbox="allow-same-origin"
          />
        </div>

        <p className="mt-3 text-[10px] text-slate-400 text-center">
          Variables like{' '}
          <code className="font-mono">{'{{name}}'}</code> won&apos;t be substituted in preview
        </p>
      </div>
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
