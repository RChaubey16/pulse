'use client';

import { useCallback, useEffect, useState } from 'react';
import { useEditorStore } from '../store';
import { playgroundApi } from '../api';
import type { EmailTemplateListItem, EmailTemplateFull, Block } from '../types';

interface TemplateListProps {
  onClose: () => void;
}

export function TemplateList({ onClose }: TemplateListProps) {
  const { loadTemplate, templateId } = useEditorStore();
  const [templates, setTemplates] = useState<EmailTemplateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const list = await playgroundApi.list();
      setTemplates(list);
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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this template?')) return;
    try {
      await playgroundApi.delete(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch {
      // silent
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">My Templates</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-sm">Loading templates…</div>
          ) : templates.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <div className="text-3xl mb-2">📭</div>
              <p className="text-sm">No saved templates yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {templates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => void handleLoad(t.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    t.id === templateId
                      ? 'border-violet-300 bg-violet-50'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-slate-800 truncate">{t.name}</p>
                      {t.id === templateId && (
                        <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded font-medium shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                    {t.description && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{t.description}</p>
                    )}
                    <p className="text-[10px] text-slate-300 mt-1">
                      v{t.version} · {new Date(t.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {loadingId === t.id && (
                      <span className="text-xs text-slate-400">Loading…</span>
                    )}
                    <button
                      onClick={(e) => void handleDelete(t.id, e)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors px-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
