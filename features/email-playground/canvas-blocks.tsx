'use client';

import React from 'react';
import type { Block, SocialLink } from './types';

function s(v: unknown, fallback: string): string {
  return typeof v === 'string' ? v : fallback;
}
function n(v: unknown, fallback: number): number {
  const x = Number(v);
  return isFinite(x) ? x : fallback;
}

export function CanvasBlock({ block }: { block: Block }) {
  const p = block.props;

  switch (block.type) {
    case 'hero': {
      const bg = s(p.backgroundColor, '#6366f1');
      const fg = s(p.textColor, '#ffffff');
      return (
        <div
          style={{ backgroundColor: bg, color: fg }}
          className="px-6 py-12 text-center rounded-sm"
        >
          <h1 style={{ color: fg }} className="text-3xl font-bold mb-3 m-0">
            {s(p.title, 'Hero Title')}
          </h1>
          {!!p.subtitle && (
            <p style={{ color: fg, opacity: 0.85 }} className="text-lg mb-5 m-0">
              {s(p.subtitle, '')}
            </p>
          )}
          {!!p.buttonText && (
            <span
              style={{
                backgroundColor: s(p.buttonColor, '#ffffff'),
                color: s(p.buttonTextColor, '#6366f1'),
              }}
              className="inline-block px-6 py-3 rounded font-semibold text-sm"
            >
              {s(p.buttonText, 'Button')}
            </span>
          )}
        </div>
      );
    }

    case 'heading': {
      const align = s(p.align, 'center') as 'left' | 'center' | 'right';
      const color = s(p.color, '#111827');
      const fontSize = n(p.fontSize, 28);
      const level = Math.min(Math.max(n(p.level, 2), 1), 6);
      return (
        <div className="px-6 py-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(React.createElement as any)(
            `h${level}`,
            { style: { textAlign: align, color, fontSize, margin: 0, fontWeight: 700, lineHeight: 1.3 } },
            s(p.text, 'Heading'),
          )}
        </div>
      );
    }

    case 'paragraph': {
      const align = s(p.align, 'left') as 'left' | 'center' | 'right';
      const color = s(p.color, '#374151');
      const fontSize = n(p.fontSize, 16);
      return (
        <div className="px-6 py-2">
          <p style={{ textAlign: align, color, fontSize, margin: 0, lineHeight: 1.6 }}>
            {s(p.text, '')}
          </p>
        </div>
      );
    }

    case 'image': {
      const align = s(p.align, 'center');
      const width = n(p.width, 600);
      return (
        <div className={`px-6 py-3 flex ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s(p.url, '')}
            alt={s(p.alt, '')}
            style={{ maxWidth: '100%', width: Math.min(width, 560), height: 'auto', display: 'block', borderRadius: 4 }}
          />
        </div>
      );
    }

    case 'button': {
      const align = s(p.align, 'center');
      const bg = s(p.backgroundColor, '#6366f1');
      const fg = s(p.textColor, '#ffffff');
      const radius = n(p.borderRadius, 6);
      const fontSize = n(p.fontSize, 16);
      return (
        <div className={`px-6 py-3 flex ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <span
            style={{
              backgroundColor: bg,
              color: fg,
              borderRadius: radius,
              fontSize,
              padding: '10px 24px',
              fontWeight: 600,
              display: 'inline-block',
            }}
          >
            {s(p.text, 'Button')}
          </span>
        </div>
      );
    }

    case 'divider': {
      const color = s(p.color, '#e5e7eb');
      const thickness = n(p.thickness, 1);
      return (
        <div className="px-6 py-2">
          <hr style={{ border: 'none', borderTop: `${thickness}px solid ${color}`, margin: 0 }} />
        </div>
      );
    }

    case 'spacer': {
      const height = n(p.height, 32);
      return <div style={{ height }} />;
    }

    case 'logo': {
      const align = s(p.align, 'center');
      const width = n(p.width, 150);
      return (
        <div className={`px-6 py-4 flex ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s(p.url, '')}
            alt={s(p.alt, 'Logo')}
            style={{ width, height: 'auto', maxWidth: '100%', display: 'block' }}
          />
        </div>
      );
    }

    case 'footer': {
      const align = s(p.align, 'center') as 'left' | 'center' | 'right';
      const color = s(p.color, '#9ca3af');
      const fontSize = n(p.fontSize, 12);
      return (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p style={{ textAlign: align, color, fontSize, margin: 0, lineHeight: 1.5 }}>
            {s(p.text, '')}
          </p>
        </div>
      );
    }

    case 'social': {
      const links = Array.isArray(p.links) ? (p.links as SocialLink[]) : [];
      const align = s(p.align, 'center');
      return (
        <div className={`px-6 py-3 flex gap-4 flex-wrap ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
          {links.map((l, i) => (
            <span key={i} className="text-violet-600 text-sm font-medium hover:underline cursor-pointer">
              {l.label || l.platform}
            </span>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}
