'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { BlockPalette } from '@/features/email-playground/components/BlockPalette';
import { Canvas } from '@/features/email-playground/components/Canvas';
import { PropertiesPanel } from '@/features/email-playground/components/PropertiesPanel';
import { PreviewModal } from '@/features/email-playground/components/PreviewModal';
import { SendTestModal } from '@/features/email-playground/components/SendTestModal';
import { TemplateList } from '@/features/email-playground/components/TemplateList';
import { useEditorStore } from '@/features/email-playground/store';
import type { BlockType } from '@/features/email-playground/types';
import { BLOCK_META } from '@/features/email-playground/types';
import { playgroundApi } from '@/features/email-playground/api';

function DragOverlayContent({ blockType }: { blockType: BlockType | null }) {
  if (!blockType) return null;
  const meta = BLOCK_META.find((m) => m.type === blockType);
  if (!meta) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-violet-300 bg-violet-50 shadow-lg">
      <span className="text-sm w-5 text-center font-mono text-violet-400">{meta.icon}</span>
      <span className="text-xs font-medium text-violet-700">{meta.label}</span>
    </div>
  );
}

export default function EmailPlaygroundPage() {
  const {
    templateId,
    templateName,
    templateDescription,
    blocks,
    isDirty,
    setTemplateName,
    setTemplateDescription,
    addBlock,
    moveBlock,
    reset,
    markSaved,
  } = useEditorStore();

  const [showPreview, setShowPreview] = useState(false);
  const [showSendTest, setShowSendTest] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeDragType, setActiveDragType] = useState<BlockType | null>(null);
  const [editingName, setEditingName] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as { isNew?: boolean; blockType?: BlockType } | undefined;
    if (data?.isNew && data.blockType) {
      setActiveDragType(data.blockType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragType(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as { isNew?: boolean; blockType?: BlockType; blockId?: string } | undefined;

    if (activeData?.isNew && activeData.blockType) {
      // Dropped from palette → add block
      addBlock(activeData.blockType);
      return;
    }

    // Reordering within canvas
    if (!activeData?.isNew && activeData?.blockId) {
      const currentBlocks = useEditorStore.getState().blocks;
      const fromIndex = currentBlocks.findIndex((b) => b.id === activeData.blockId);
      const toIndex = currentBlocks.findIndex((b) => b.id === over.id);
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        moveBlock(fromIndex, toIndex);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      if (templateId) {
        await playgroundApi.update(templateId, {
          name: templateName,
          description: templateDescription,
          blocks,
        });
        markSaved(templateId);
      } else {
        const saved = await playgroundApi.create({
          name: templateName,
          description: templateDescription,
          blocks,
        }) as { id: string };
        markSaved(saved.id);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 top-14 flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {editingName ? (
            <input
              autoFocus
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
              className="text-sm font-semibold text-slate-800 border-b border-violet-400 outline-none bg-transparent min-w-0 max-w-48"
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="text-sm font-semibold text-slate-800 hover:text-violet-700 transition-colors truncate max-w-48 text-left"
              title="Click to rename"
            >
              {templateName}
            </button>
          )}
          {isDirty && (
            <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-medium shrink-0">
              Unsaved
            </span>
          )}
          {saveError && (
            <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded shrink-0">
              {saveError}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowTemplates(true)}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            My Templates
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            New
          </button>
          <button
            onClick={() => setShowPreview(true)}
            disabled={blocks.length === 0}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            Preview
          </button>
          <button
            onClick={() => setShowSendTest(true)}
            disabled={!templateId}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40"
            title={!templateId ? 'Save the template first' : ''}
          >
            Send Test
          </button>
          <button
            onClick={() => void handleSave()}
            disabled={saving || (!isDirty && !!templateId)}
            className="px-4 py-1.5 text-xs font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40"
          >
            {saving ? 'Saving…' : templateId ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {/* Template description input (compact) */}
      <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100 shrink-0">
        <input
          type="text"
          value={templateDescription}
          onChange={(e) => setTemplateDescription(e.target.value)}
          placeholder="Add a description (optional)"
          className="w-full text-xs text-slate-500 bg-transparent outline-none placeholder-slate-300"
        />
      </div>

      {/* Editor layout */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar — Block Palette */}
          <div className="w-48 shrink-0 border-r border-slate-200 bg-slate-50 overflow-y-auto">
            <BlockPalette />
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-y-auto bg-slate-100 p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm min-h-full overflow-hidden">
              <Canvas />
            </div>
          </div>

          {/* Right sidebar — Properties */}
          <div className="w-64 shrink-0 border-l border-slate-200 bg-white overflow-y-auto">
            <PropertiesPanel />
          </div>
        </div>

        <DragOverlay>
          <DragOverlayContent blockType={activeDragType} />
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      {showPreview && <PreviewModal onClose={() => setShowPreview(false)} />}
      {showSendTest && <SendTestModal onClose={() => setShowSendTest(false)} />}
      {showTemplates && <TemplateList onClose={() => setShowTemplates(false)} />}
    </div>
  );
}
