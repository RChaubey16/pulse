'use client';

import type { Template } from '@/lib/types';

interface Props {
  template: Template;
  onPreview: () => void;
}

export default function TemplateCard({ template, onPreview }: Props) {
  const required = template.fields.filter((f) => f.required);
  const optional = template.fields.filter((f) => !f.required);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 hover:border-slate-300 transition-colors">
      {/* Name + description */}
      <div>
        <h2 className="font-semibold text-slate-900">{template.name}</h2>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{template.description}</p>
      </div>

      {/* Subject */}
      <div className="bg-slate-50 rounded-lg px-3 py-2.5">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          Subject
        </span>
        <p className="text-sm text-slate-700 font-mono leading-snug">{template.subject}</p>
      </div>

      {/* Fields */}
      {template.fields.length > 0 && (
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Fields
          </span>
          <div className="flex flex-wrap gap-1.5">
            {required.map((f) => (
              <span
                key={f.name}
                title={`${f.description} (required)`}
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-medium bg-violet-100 text-violet-700"
              >
                {f.name}
                <span className="text-violet-400 ml-0.5">*</span>
              </span>
            ))}
            {optional.map((f) => (
              <span
                key={f.name}
                title={`${f.description} (optional)`}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border border-violet-200 text-violet-500"
              >
                {f.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preview button */}
      <button
        onClick={onPreview}
        className="mt-auto flex items-center justify-center gap-2 w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <EyeIcon />
        Preview
      </button>
    </div>
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
