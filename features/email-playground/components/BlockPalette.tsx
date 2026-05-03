'use client';

import { useDraggable } from '@dnd-kit/core';
import type { BlockType } from '../types';
import { BLOCK_META } from '../types';

interface PaletteItemProps {
  type: BlockType;
  label: string;
  icon: string;
}

function PaletteItem({ type, label, icon }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { isNew: true, blockType: type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white cursor-grab active:cursor-grabbing select-none hover:border-violet-300 hover:bg-violet-50 transition-colors ${isDragging ? 'opacity-50' : ''}`}
    >
      <span className="text-sm w-5 text-center shrink-0 text-slate-400 font-mono">{icon}</span>
      <span className="text-xs font-medium text-slate-700">{label}</span>
    </div>
  );
}

export function BlockPalette() {
  return (
    <div className="flex flex-col gap-1.5 p-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1">
        Blocks
      </p>
      {BLOCK_META.map((meta) => (
        <PaletteItem key={meta.type} type={meta.type} label={meta.label} icon={meta.icon} />
      ))}
    </div>
  );
}
