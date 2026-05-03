'use client';

import { useState } from 'react';
import type { UserTemplate } from '@/lib/types';

interface Props {
  template: UserTemplate;
  onDelete: (id: string) => Promise<void>;
}

export default function UserTemplateCard({ template, onDelete }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${template.name}"?`)) return;
    setDeleting(true);
    await onDelete(template.id);
  }

  const vars = [...new Set([...template.html.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]))];

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 hover:border-slate-300 transition-colors">
        {/* Name */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{template.name}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono truncate">{template.id}</p>
          </div>
          <button
            onClick={() => void handleDelete()}
            disabled={deleting}
            aria-label="Delete template"
            className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {deleting ? (
              <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin block" />
            ) : (
              <TrashIcon />
            )}
          </button>
        </div>

        {/* Subject */}
        <div className="bg-slate-50 rounded-lg px-3 py-2.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Subject
          </span>
          <p className="text-sm text-slate-700 font-mono leading-snug">{template.subject}</p>
        </div>

        {/* Variables detected */}
        {vars.length > 0 && (
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Variables
            </span>
            <div className="flex flex-wrap gap-1.5">
              {vars.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100 font-mono"
                >
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Preview button */}
        <button
          onClick={() => setShowPreview(true)}
          className="mt-auto flex items-center justify-center gap-2 w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <EyeIcon />
          Preview HTML
        </button>
      </div>

      {/* Inline preview modal */}
      {showPreview && (
        <HtmlPreviewModal
          name={template.name}
          html={template.html}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}

function HtmlPreviewModal({
  name,
  html,
  onClose,
}: {
  name: string;
  html: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-3xl h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
            <span className="text-sm font-semibold text-slate-900">{name}</span>
            <span className="text-xs text-slate-400 font-mono">preview</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
        <iframe
          srcDoc={html}
          title={`${name} preview`}
          className="flex-1 w-full border-0"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
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
