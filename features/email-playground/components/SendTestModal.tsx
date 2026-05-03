'use client';

import { useState } from 'react';
import { useEditorStore } from '../store';
import { playgroundApi } from '../api';

interface SendTestModalProps {
  onClose: () => void;
}

export function SendTestModal({ onClose }: SendTestModalProps) {
  const { templateId, templateName } = useEditorStore();
  const [to, setTo] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<'sent' | 'error' | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSend = async () => {
    if (!templateId || !to) return;
    setSending(true);
    setResult(null);
    try {
      await playgroundApi.sendTest({ templateId, to });
      setResult('sent');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send email');
      setResult('error');
    } finally {
      setSending(false);
    }
  };

  const canSend = !!templateId && to.includes('@') && !sending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h2 className="font-semibold text-slate-800 text-base mb-1">Send Test Email</h2>
        <p className="text-sm text-slate-500 mb-4">
          Send <span className="font-medium text-slate-700">{templateName}</span> to a test address.
        </p>

        {!templateId && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
            Save the template first before sending a test email.
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="test@example.com"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-400"
            />
          </div>

          {result === 'sent' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              Test email sent successfully!
            </div>
          )}
          {result === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errorMsg}
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => void handleSend()}
            disabled={!canSend}
            className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending…' : 'Send Test'}
          </button>
        </div>
      </div>
    </div>
  );
}
