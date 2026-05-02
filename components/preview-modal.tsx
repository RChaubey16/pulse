'use client';

import { useEffect, useState } from 'react';

interface Props {
  id: string;
  name: string;
  onClose: () => void;
}

type FetchState =
  | { status: 'loading' }
  | { status: 'ready'; html: string }
  | { status: 'error'; message: string };

export default function PreviewModal({ id, name, onClose }: Props) {
  const [state, setState] = useState<FetchState>({ status: 'loading' });

  // Fetch the preview JSON and extract the html field
  useEffect(() => {
    setState({ status: 'loading' });
    fetch(`/api/preview/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json() as Promise<{ html: string }>;
      })
      .then(({ html }) => setState({ status: 'ready', html }))
      .catch((err: unknown) =>
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Failed to load preview',
        }),
      );
  }, [id]);

  // Close on Escape, lock body scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-3xl h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
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

        {/* Body */}
        {state.status === 'loading' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {state.status === 'error' && (
          <div className="flex-1 flex items-center justify-center px-6">
            <p className="text-sm text-red-500 text-center">{state.message}</p>
          </div>
        )}

        {state.status === 'ready' && (
          <iframe
            srcDoc={state.html}
            title={`${name} email preview`}
            className="flex-1 w-full border-0"
            sandbox="allow-same-origin"
          />
        )}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
