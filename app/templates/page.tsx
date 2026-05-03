import { api, ApiError } from '@/lib/api';
import type { Template } from '@/lib/types';
import TemplateGrid from '@/components/template-grid';

export default async function TemplatesPage() {
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

  return error ? (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <p className="text-sm font-medium text-red-700 mb-1">Could not load templates</p>
      <p className="text-sm text-red-500">{error}</p>
    </div>
  ) : templates.length === 0 ? (
    <div className="text-center py-20">
      <p className="text-sm text-slate-500">No system templates registered.</p>
    </div>
  ) : (
    <>
      <p className="text-sm text-slate-500 mb-6">
        {templates.length} system template{templates.length !== 1 ? 's' : ''}
      </p>
      <TemplateGrid templates={templates} />
    </>
  );
}
