'use client';

import { useState } from 'react';
import type { Template } from '@/lib/types';
import TemplateCard from './template-card';
import PreviewModal from './preview-modal';

interface Props {
  templates: Template[];
}

export default function TemplateGrid({ templates }: Props) {
  const [preview, setPreview] = useState<Template | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onPreview={() => setPreview(template)}
          />
        ))}
      </div>

      {preview && (
        <PreviewModal
          id={preview.id}
          name={preview.name}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}
