'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Block } from '../types';
import { CanvasBlock } from '../canvas-blocks';
import { useEditorStore } from '../store';

function SortableBlockItem({ block }: { block: Block }) {
  const { selectedBlockId, selectBlock, removeBlock } = useEditorStore();
  const isSelected = selectedBlockId === block.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { isNew: false, blockId: block.id },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative border-2 rounded transition-colors ${
        isSelected
          ? 'border-violet-400 ring-1 ring-violet-200'
          : 'border-transparent hover:border-slate-200'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(isSelected ? null : block.id);
      }}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-5 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={(e) => e.stopPropagation()}
        title="Drag to reorder"
      >
        <DragHandle />
      </div>

      {/* Block content */}
      <div className="pl-2">
        <CanvasBlock block={block} />
      </div>

      {/* Delete button */}
      <button
        className="absolute right-1 top-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
        onClick={(e) => {
          e.stopPropagation();
          removeBlock(block.id);
        }}
        title="Remove block"
      >
        ×
      </button>

      {/* Block type label */}
      {isSelected && (
        <div className="absolute -top-px -right-px bg-violet-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-br rounded-tl leading-none">
          {block.type}
        </div>
      )}
    </div>
  );
}

function DragHandle() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" className="text-slate-400 fill-current">
      <circle cx="2" cy="2" r="1.5" />
      <circle cx="8" cy="2" r="1.5" />
      <circle cx="2" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="2" cy="14" r="1.5" />
      <circle cx="8" cy="14" r="1.5" />
    </svg>
  );
}

export function Canvas() {
  const { blocks, selectBlock } = useEditorStore();
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-droppable' });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-full w-full transition-colors ${isOver ? 'bg-violet-50/50' : ''}`}
      onClick={() => selectBlock(null)}
    >
      {blocks.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center h-80 border-2 border-dashed rounded-xl transition-colors ${
            isOver ? 'border-violet-400 bg-violet-50' : 'border-slate-200 text-slate-400'
          }`}
        >
          <div className="text-3xl mb-2">📧</div>
          <p className="text-sm font-medium text-slate-500">Drag blocks here to build your email</p>
          <p className="text-xs text-slate-400 mt-1">or click a block type in the left panel</p>
        </div>
      ) : (
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-0">
            {blocks.map((block) => (
              <SortableBlockItem key={block.id} block={block} />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
