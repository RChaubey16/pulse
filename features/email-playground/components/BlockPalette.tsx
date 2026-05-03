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
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-slate-200 bg-white cursor-grab active:cursor-grabbing select-none hover:border-violet-300 hover:bg-violet-50 hover:shadow-sm transition-all ${isDragging ? 'opacity-50 shadow-md' : ''}`}
    >
      <span className="text-sm w-5 text-center shrink-0 text-slate-400 font-mono">{icon}</span>
      <span className="text-xs font-medium text-slate-700">{label}</span>
    </div>
  );
}

export function BlockPalette() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
          Blocks
        </p>
      </div>
      <div className="flex flex-col gap-1.5 px-3 pb-4">
        {BLOCK_META.map((meta) => (
          <PaletteItem key={meta.type} type={meta.type} label={meta.label} icon={meta.icon} />
        ))}
      </div>
    </div>
  );
}
