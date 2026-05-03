'use client';

import { useEditorStore } from '../store';
import type { Block, SocialLink } from '../types';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400"
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400 resize-none"
    />
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400"
    />
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-400 font-mono"
      />
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-400 bg-white"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

const ALIGN_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

function str(v: unknown, fb: string): string {
  return typeof v === 'string' ? v : fb;
}
function num(v: unknown, fb: number): number {
  const x = Number(v);
  return isFinite(x) ? x : fb;
}

function HeadingProps({ block }: { block: Block }) {
  const { updateBlockProps } = useEditorStore();
  const p = block.props;
  const upd = (k: string) => (v: unknown) => updateBlockProps(block.id, { [k]: v });
  return (
    <div className="space-y-3">
      <Field label="Text">
        <Textarea value={str(p.text, '')} onChange={upd('text')} />
      </Field>
      <Field label="Level">
        <Select
          value={String(num(p.level, 2))}
          onChange={(v) => upd('level')(Number(v))}
          options={[1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `H${n}` }))}
        />
      </Field>
      <Field label="Align">
        <Select value={str(p.align, 'center')} onChange={upd('align')} options={ALIGN_OPTIONS} />
      </Field>
      <Field label="Color">
        <ColorInput value={str(p.color, '#111827')} onChange={upd('color')} />
      </Field>
      <Field label="Font Size (px)">
        <NumberInput value={num(p.fontSize, 28)} onChange={upd('fontSize')} min={12} max={72} />
      </Field>
    </div>
  );
}

function ParagraphProps({ block }: { block: Block }) {
  const { updateBlockProps } = useEditorStore();
  const p = block.props;
  const upd = (k: string) => (v: unknown) => updateBlockProps(block.id, { [k]: v });
  return (
    <div className="space-y-3">
      <Field label="Text">
        <Textarea value={str(p.text, '')} onChange={upd('text')} rows={5} />
      </Field>
      <Field label="Align">
        <Select value={str(p.align, 'left')} onChange={upd('align')} options={ALIGN_OPTIONS} />
      </Field>
      <Field label="Color">
        <ColorInput value={str(p.color, '#374151')} onChange={upd('color')} />
      </Field>
      <Field label="Font Size (px)">
        <NumberInput value={num(p.fontSize, 16)} onChange={upd('fontSize')} min={10} max={32} />
      </Field>
    </div>
  );
}

function ImageProps({ block }: { block: Block }) {
  const { updateBlockProps } = useEditorStore();
  const p = block.props;
  const upd = (k: string) => (v: unknown) => updateBlockProps(block.id, { [k]: v });
  return (
    <div className="space-y-3">
      <Field label="Image URL">
        <TextInput value={str(p.url, '')} onChange={upd('url')} placeholder="https://..." />
      </Field>
      <Field label="Alt Text">
        <TextInput value={str(p.alt, '')} onChange={upd('alt')} />
      </Field>
      <Field label="Width (px)">
        <NumberInput value={num(p.width, 600)} onChange={upd('width')} min={100} max={600} />
      </Field>
      <Field label="Align">
        <Select value={str(p.align, 'center')} onChange={upd('align')} options={ALIGN_OPTIONS} />
      </Field>
      <Field label="Link URL (optional)">
        <TextInput value={str(p.link, '')} onChange={upd('link')} placeholder="https://..." />
      </Field>
    </div>
  );
}

function ButtonProps({ block }: { block: Block }) {
  const { updateBlockProps } = useEditorStore();
  const p = block.props;
  const upd = (k: string) => (v: unknown) => updateBlockProps(block.id, { [k]: v });
  return (
    <div className="space-y-3">
      <Field label="Button Text">
        <TextInput value={str(p.text, '')} onChange={upd('text')} />
      </Field>
      <Field label="URL">
        <TextInput value={str(p.url, '')} onChange={upd('url')} placeholder="https://..." />
      </Field>
      <Field label="Background Color">
        <ColorInput value={str(p.backgroundColor, '#6366f1')} onChange={upd('backgroundColor')} />
      </Field>
      <Field label="Text Color">
        <ColorInput value={str(p.textColor, '#ffffff')} onChange={upd('textColor')} />
      </Field>
      <Field label="Border Radius (px)">
        <NumberInput value={num(p.borderRadius, 6)} onChange={upd('borderRadius')} min={0} max={32} />
      </Field>
      <Field label="Font Size (px)">
        <NumberInput value={num(p.fontSize, 16)} onChange={upd('fontSize')} min={10} max={24} />
      </Field>
      <Field label="Align">
        <Select value={str(p.align, 'center')} onChange={upd('align')} options={ALIGN_OPTIONS} />
      </Field>
    </div>
  );
}

function DividerProps({ block }: { block: Block }) {
  const { updateBlockProps } = useEditorStore();
  const p = block.props;
  const upd = (k: string) => (v: unknown) => updateBlockProps(block.id, { [k]: v });
  return (
    <div className="space-y-3">
      <Field label="Color">
        <ColorInput value={str(p.color, '#e5e7eb')} onChange={upd('color')} />
      </Field>
      <Field label="Thickness (px)">
        <NumberInput value={num(p.thickness, 1)} onChange={upd('thickness')} min={1} max={8} />
      </Field>
    </div>
  );
}

function SpacerProps({ block }: { block: Block }) {
  const { updateBlockProps } = useEditorStore();
  const p = block.props;
  return (
    <Field label="Height (px)">
      <NumberInput
        value={num(p.height, 32)}
        onChange={(v) => updateBlockProps(block.id, { height: v })}
        min={4}
        max={200}
      />
    </Field>
  );
}

function HeroProps({ block }: { block: Block }) {
  const { updateBlockProps } = useEditorStore();
  const p = block.props;
  const upd = (k: string) => (v: unknown) => updateBlockProps(block.id, { [k]: v });
  return (
    <div className="space-y-3">
      <Field label="Title">
        <TextInput value={str(p.title, '')} onChange={upd('title')} />
      </Field>
      <Field label="Subtitle">
        <Textarea value={str(p.subtitle, '')} onChange={upd('subtitle')} />
      </Field>
      <Field label="Background Color">
        <ColorInput value={str(p.backgroundColor, '#6366f1')} onChange={upd('backgroundColor')} />
      </Field>
      <Field label="Text Color">
        <ColorInput value={str(p.textColor, '#ffffff')} onChange={upd('textColor')} />
      </Field>
      <Field label="Button Text">
        <TextInput value={str(p.buttonText, '')} onChange={upd('buttonText')} placeholder="Leave empty to hide" />
      </Field>
      <Field label="Button URL">
        <TextInput value={str(p.buttonUrl, '')} onChange={upd('buttonUrl')} placeholder="https://..." />
      </Field>
      <Field label="Button Background">
        <ColorInput value={str(p.buttonColor, '#ffffff')} onChange={upd('buttonColor')} />
      </Field>
      <Field label="Button Text Color">
        <ColorInput value={str(p.buttonTextColor, '#6366f1')} onChange={upd('buttonTextColor')} />
      </Field>
    </div>
  );
}

function LogoProps({ block }: { block: Block }) {
  const { updateBlockProps } = useEditorStore();
  const p = block.props;
  const upd = (k: string) => (v: unknown) => updateBlockProps(block.id, { [k]: v });
  return (
    <div className="space-y-3">
      <Field label="Logo URL">
        <TextInput value={str(p.url, '')} onChange={upd('url')} placeholder="https://..." />
      </Field>
      <Field label="Alt Text">
        <TextInput value={str(p.alt, '')} onChange={upd('alt')} />
      </Field>
      <Field label="Width (px)">
        <NumberInput value={num(p.width, 150)} onChange={upd('width')} min={50} max={300} />
      </Field>
      <Field label="Align">
        <Select value={str(p.align, 'center')} onChange={upd('align')} options={ALIGN_OPTIONS} />
      </Field>
      <Field label="Link URL (optional)">
        <TextInput value={str(p.link, '')} onChange={upd('link')} placeholder="https://..." />
      </Field>
    </div>
  );
}

function FooterProps({ block }: { block: Block }) {
  const { updateBlockProps } = useEditorStore();
  const p = block.props;
  const upd = (k: string) => (v: unknown) => updateBlockProps(block.id, { [k]: v });
  return (
    <div className="space-y-3">
      <Field label="Text">
        <Textarea value={str(p.text, '')} onChange={upd('text')} rows={4} />
      </Field>
      <Field label="Color">
        <ColorInput value={str(p.color, '#9ca3af')} onChange={upd('color')} />
      </Field>
      <Field label="Font Size (px)">
        <NumberInput value={num(p.fontSize, 12)} onChange={upd('fontSize')} min={10} max={16} />
      </Field>
      <Field label="Align">
        <Select value={str(p.align, 'center')} onChange={upd('align')} options={ALIGN_OPTIONS} />
      </Field>
    </div>
  );
}

function SocialProps({ block }: { block: Block }) {
  const { updateBlockProps } = useEditorStore();
  const p = block.props;
  const links = Array.isArray(p.links) ? (p.links as SocialLink[]) : [];

  const updateLink = (index: number, key: string, value: string) => {
    const next = links.map((l, i) => (i === index ? { ...l, [key]: value } : l));
    updateBlockProps(block.id, { links: next });
  };

  const addLink = () => {
    updateBlockProps(block.id, {
      links: [...links, { platform: 'website', url: 'https://', label: 'Website' }],
    });
  };

  const removeLink = (index: number) => {
    updateBlockProps(block.id, { links: links.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <Field label="Align">
        <Select
          value={str(p.align, 'center')}
          onChange={(v) => updateBlockProps(block.id, { align: v })}
          options={ALIGN_OPTIONS}
        />
      </Field>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Links</p>
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="border border-slate-100 rounded-lg p-2 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Link {i + 1}</span>
                <button
                  onClick={() => removeLink(i)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              <TextInput value={link.label} onChange={(v) => updateLink(i, 'label', v)} placeholder="Label" />
              <TextInput value={link.url} onChange={(v) => updateLink(i, 'url', v)} placeholder="https://..." />
            </div>
          ))}
          <button
            onClick={addLink}
            className="w-full py-1.5 text-xs text-violet-600 border border-dashed border-violet-300 rounded-lg hover:bg-violet-50 transition-colors"
          >
            + Add Link
          </button>
        </div>
      </div>
    </div>
  );
}

export function PropertiesPanel() {
  const { blocks, selectedBlockId } = useEditorStore();
  const block = blocks.find((b) => b.id === selectedBlockId);

  if (!block) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-2xl mb-2">👆</div>
        <p className="text-sm text-slate-500">Select a block to edit its properties</p>
      </div>
    );
  }

  const title = block.type.charAt(0).toUpperCase() + block.type.slice(1);

  return (
    <div className="p-3 overflow-y-auto">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
        {title} Properties
      </p>
      {block.type === 'heading' && <HeadingProps block={block} />}
      {block.type === 'paragraph' && <ParagraphProps block={block} />}
      {block.type === 'image' && <ImageProps block={block} />}
      {block.type === 'button' && <ButtonProps block={block} />}
      {block.type === 'divider' && <DividerProps block={block} />}
      {block.type === 'spacer' && <SpacerProps block={block} />}
      {block.type === 'hero' && <HeroProps block={block} />}
      {block.type === 'logo' && <LogoProps block={block} />}
      {block.type === 'footer' && <FooterProps block={block} />}
      {block.type === 'social' && <SocialProps block={block} />}
    </div>
  );
}
