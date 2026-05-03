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

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const canvasWidth = previewMode === 'mobile' ? 375 : 640;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-slate-800 text-sm">Email Preview</h2>
          <div className="flex rounded-lg overflow-hidden border border-slate-200">
            <button
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${previewMode === 'desktop' ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              onClick={() => setPreviewMode('desktop')}
            >
              Desktop
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${previewMode === 'mobile' ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>

          {/* Close button — prominent × */}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Close preview"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto px-6 py-8 flex justify-center">
        {loading ? (
          <div className="flex items-center justify-center w-full">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-slate-400">Rendering preview…</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center w-full">
            <div className="text-sm text-red-300 bg-red-950/40 border border-red-800/30 px-5 py-4 rounded-xl max-w-sm text-center">
              {error}
            </div>
          </div>
        ) : (
          <div
            style={{ width: canvasWidth }}
            className="transition-all duration-300 shadow-2xl rounded-xl overflow-hidden"
          >
            {/* Fake browser chrome */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              <span className="flex-1 text-center text-[10px] text-slate-500 font-medium pr-8">
                {previewMode === 'mobile' ? 'iPhone' : 'Gmail — inbox'}
              </span>
            </div>
            <iframe
              srcDoc={html}
              style={{ width: '100%', height: 600, border: 'none', background: '#fff', display: 'block' }}
              title="Email Preview"
              sandbox="allow-same-origin"
            />
          </div>
        )}
      </div>
    </div>
  );
}
