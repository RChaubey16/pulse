'use client';

import { useCallback, useEffect, useState } from 'react';
import { useEditorStore } from '../store';
import { playgroundApi } from '../api';

interface PreviewModalProps {
  onClose: () => void;
}

export function PreviewModal({ onClose }: PreviewModalProps) {
  const { blocks, previewMode, setPreviewMode } = useEditorStore();
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await playgroundApi.render({ blocks });
      setHtml(result.html);
    } catch {
      setError('Failed to render preview. Make sure the gateway is running.');
    } finally {
      setLoading(false);
    }
  }, [blocks]);

  useEffect(() => {
    void fetchPreview();
  }, [fetchPreview]);

  const canvasWidth = previewMode === 'mobile' ? 375 : 640;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-slate-800 text-sm">Email Preview</h2>
          <div className="flex rounded-lg overflow-hidden border border-slate-200">
            <button
              className={`px-3 py-1 text-xs font-medium transition-colors ${previewMode === 'desktop' ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              onClick={() => setPreviewMode('desktop')}
            >
              Desktop
            </button>
            <button
              className={`px-3 py-1 text-xs font-medium transition-colors ${previewMode === 'mobile' ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              onClick={() => setPreviewMode('mobile')}
            >
              Mobile
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void fetchPreview()}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Refresh
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto p-6 flex justify-center">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white/70 text-sm">Rendering preview...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-300 text-sm bg-red-900/30 px-4 py-3 rounded-lg">{error}</div>
          </div>
        ) : (
          <div
            style={{ width: canvasWidth }}
            className="transition-all duration-300 shadow-2xl rounded-lg overflow-hidden"
          >
            <iframe
              srcDoc={html}
              style={{ width: '100%', height: 600, border: 'none', background: '#fff' }}
              title="Email Preview"
              sandbox="allow-same-origin"
            />
          </div>
        )}
      </div>
    </div>
  );
}
