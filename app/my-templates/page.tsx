'use client';

import { useEffect, useState } from 'react';
import LoginGate from '@/components/login-gate';
import UserTemplateCard from '@/components/user-template-card';
import CreateTemplateForm from '@/components/create-template-form';
import { ApiError, clientApi } from '@/lib/client-api';
import type { UserTemplate } from '@/lib/types';

export default function MyTemplatesPage() {
  return (
    <LoginGate>
      <MyTemplates />
    </LoginGate>
  );
}

function MyTemplates() {
  const [templates, setTemplates] = useState<UserTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setTemplates(await clientApi.userTemplates.list());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load templates.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await clientApi.userTemplates.delete(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }

  function handleCreated(t: UserTemplate) {
    setTemplates((prev) => [t, ...prev]);
    setShowCreate(false);
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900">My Templates</h2>
          {!loading && !error && (
            <p className="text-sm text-slate-500 mt-0.5">
              {templates.length} template{templates.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <PlusIcon />
          New template
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <CreateTemplateForm onCreated={handleCreated} onCancel={() => setShowCreate(false)} />
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700 mb-1">Could not load templates</p>
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={() => void load()}
            className="mt-3 text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && templates.length === 0 && !showCreate && (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
            <TemplateIcon />
          </div>
          <p className="text-sm font-medium text-slate-700 mb-1">No templates yet</p>
          <p className="text-sm text-slate-400">
            Create your first custom email template above.
          </p>
        </div>
      )}

      {/* Template grid */}
      {!loading && templates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <UserTemplateCard key={t.id} template={t} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function TemplateIcon() {
  return (
    <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
