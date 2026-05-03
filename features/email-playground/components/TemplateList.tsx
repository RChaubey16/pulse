'use client';

import { useCallback, useEffect, useState } from 'react';
import { useEditorStore } from '../store';
import { playgroundApi } from '../api';
import type { EmailTemplateListItem, EmailTemplateFull, Block } from '../types';

interface TemplateListProps {
  onClose: () => void;
}

function Skeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-xl border border-slate-100 animate-pulse">
          <div className="h-3.5 w-40 bg-slate-200 rounded mb-2" />
          <div className="h-2.5 w-24 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}

function TemplateRow({
  template,
  isActive,
  onLoad,
  onDelete,
  loadingId,
}: {
  template: EmailTemplateListItem;
  isActive: boolean;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  loadingId: string | null;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div
      className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all cursor-pointer ${
        isActive
          ? 'border-violet-200 bg-violet-50'
          : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
      }`}
      onClick={() => !confirmingDelete && onLoad(template.id)}
    >
      {/* Icon */}
      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-violet-100' : 'bg-slate-100'}`}>
        <svg className={`w-4 h-4 ${isActive ? 'text-violet-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-slate-800 truncate">{template.name}</p>
          {isActive && (
            <span className="shrink-0 text-[10px] font-semibold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded-full">
              Open
            </span>
          )}
        </div>
        {template.description && (
          <p className="text-xs text-slate-400 truncate mt-0.5">{template.description}</p>
        )}
        <p className="text-[10px] text-slate-300 mt-1">
          v{template.version} · Updated {new Date(template.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        {loadingId === template.id ? (
          <span className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
        ) : confirmingDelete ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onDelete(template.id)}
              className="text-[11px] font-semibold text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="text-[11px] font-medium text-slate-500 hover:text-slate-700 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
            title="Delete template"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function TemplateList({ onClose }: TemplateListProps) {
  const { loadTemplate, templateId } = useEditorStore();
  const [templates, setTemplates] = useState<EmailTemplateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      setTemplates(await playgroundApi.list());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTemplates();
  }, [fetchTemplates]);

  const handleLoad = async (id: string) => {
    setLoadingId(id);
    try {
      const full = await playgroundApi.get(id) as EmailTemplateFull;
      loadTemplate({
        id: full.id,
        name: full.name,
        description: full.description,
        blocks: (full.blocksJson as Block[]) ?? [],
      });
      onClose();
    } catch {
      // silent
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await playgroundApi.delete(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch {
      // silent
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Saved Templates</h2>
            {!loading && (
              <p className="text-xs text-slate-400 mt-0.5">
                {templates.length} template{templates.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <Skeleton />
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-600">No saved templates</p>
              <p className="text-xs text-slate-400 mt-1">
                Build something in the editor and hit Save.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {templates.map((t) => (
                <TemplateRow
                  key={t.id}
                  template={t}
                  isActive={t.id === templateId}
                  onLoad={handleLoad}
                  onDelete={handleDelete}
                  loadingId={loadingId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
