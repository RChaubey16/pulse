'use client';

import { create } from 'zustand';
import { nanoid } from './nanoid';
import type { Block, BlockType } from './types';
import { BLOCK_META } from './types';

interface EditorStore {
  templateId: string | null;
  templateName: string;
  templateDescription: string;
  blocks: Block[];
  selectedBlockId: string | null;
  previewMode: 'desktop' | 'mobile';
  isDirty: boolean;

  setTemplateName: (name: string) => void;
  setTemplateDescription: (desc: string) => void;
  addBlock: (type: BlockType, afterIndex?: number) => void;
  removeBlock: (id: string) => void;
  updateBlockProps: (id: string, props: Record<string, unknown>) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  selectBlock: (id: string | null) => void;
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  loadTemplate: (t: {
    id: string;
    name: string;
    description: string;
    blocks: Block[];
  }) => void;
  markSaved: (id: string) => void;
  reset: () => void;
}

const initial = {
  templateId: null as string | null,
  templateName: 'Untitled Template',
  templateDescription: '',
  blocks: [] as Block[],
  selectedBlockId: null as string | null,
  previewMode: 'desktop' as 'desktop' | 'mobile',
  isDirty: false,
};

export const useEditorStore = create<EditorStore>((set) => ({
  ...initial,

  setTemplateName: (name) => set({ templateName: name, isDirty: true }),
  setTemplateDescription: (desc) => set({ templateDescription: desc, isDirty: true }),

  addBlock: (type, afterIndex) => {
    const meta = BLOCK_META.find((m) => m.type === type);
    if (!meta) return;
    const block: Block = { id: nanoid(), type, props: { ...meta.defaultProps } };
    set((s) => {
      const next = [...s.blocks];
      if (afterIndex !== undefined) {
        next.splice(afterIndex + 1, 0, block);
      } else {
        next.push(block);
      }
      return { blocks: next, selectedBlockId: block.id, isDirty: true };
    });
  },

  removeBlock: (id) =>
    set((s) => ({
      blocks: s.blocks.filter((b) => b.id !== id),
      selectedBlockId: s.selectedBlockId === id ? null : s.selectedBlockId,
      isDirty: true,
    })),

  updateBlockProps: (id, props) =>
    set((s) => ({
      blocks: s.blocks.map((b) =>
        b.id === id ? { ...b, props: { ...b.props, ...props } } : b,
      ),
      isDirty: true,
    })),

  moveBlock: (fromIndex, toIndex) =>
    set((s) => {
      const next = [...s.blocks];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      return { blocks: next, isDirty: true };
    }),

  selectBlock: (id) => set({ selectedBlockId: id }),

  setPreviewMode: (mode) => set({ previewMode: mode }),

  loadTemplate: ({ id, name, description, blocks }) =>
    set({
      templateId: id,
      templateName: name,
      templateDescription: description,
      blocks,
      selectedBlockId: null,
      isDirty: false,
    }),

  markSaved: (id) => set({ templateId: id, isDirty: false }),

  reset: () => set({ ...initial }),
}));
