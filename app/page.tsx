import { api, ApiError } from '@/lib/api';
import type { Template } from '@/lib/types';
import TemplateGrid from '@/components/template-grid';

export default async function HomePage() {
  let templates: Template[] = [];
  let error: string | null = null;

  try {
    templates = await api.templates.list();
  } catch (err) {
    error =
      err instanceof ApiError
        ? `Gateway returned ${err.status}: ${err.message}`
        : 'Could not connect to the Atlas gateway. Make sure it is running on port 3000.';
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shrink-0">
            <BellIcon />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 leading-none">Pulse</h1>
            <p className="text-xs text-slate-500 mt-0.5">Notification templates · Atlas platform</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700 mb-1">Could not load templates</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <BellIcon className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">No templates registered.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-6">
              {templates.length} template{templates.length !== 1 ? 's' : ''} available
            </p>
            <TemplateGrid templates={templates} />
          </>
        )}
      </main>
    </div>
  );
}

function BellIcon({ className = 'text-white' }: { className?: string }) {
  return (
    <svg
      className={`w-5 h-5 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}
