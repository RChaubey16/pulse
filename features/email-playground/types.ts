export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'hero'
  | 'logo'
  | 'footer'
  | 'social';

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
}

export interface EmailTemplateListItem {
  id: string;
  name: string;
  description: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplateFull extends EmailTemplateListItem {
  blocksJson: Block[];
}

export interface BlockMeta {
  type: BlockType;
  label: string;
  icon: string;
  defaultProps: Record<string, unknown>;
}

export const BLOCK_META: BlockMeta[] = [
  {
    type: 'hero',
    label: 'Hero',
    icon: '🎯',
    defaultProps: {
      title: 'Welcome to Atlas',
      subtitle: "We're glad you're here.",
      backgroundColor: '#6366f1',
      textColor: '#ffffff',
      buttonText: 'Get Started',
      buttonUrl: 'https://example.com',
      buttonColor: '#ffffff',
      buttonTextColor: '#6366f1',
    },
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: 'H',
    defaultProps: {
      text: 'Your Heading Here',
      level: 2,
      align: 'center',
      color: '#111827',
      fontSize: 28,
    },
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    icon: '¶',
    defaultProps: {
      text: 'Write your message here. Edit this text to add any content you want to share with your readers.',
      align: 'left',
      color: '#374151',
      fontSize: 16,
    },
  },
  {
    type: 'button',
    label: 'Button',
    icon: '→',
    defaultProps: {
      text: 'Click Here',
      url: 'https://example.com',
      backgroundColor: '#6366f1',
      textColor: '#ffffff',
      borderRadius: 6,
      align: 'center',
      fontSize: 16,
    },
  },
  {
    type: 'image',
    label: 'Image',
    icon: '🖼',
    defaultProps: {
      url: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=600&q=80',
      alt: 'Image',
      width: 600,
      align: 'center',
      link: '',
    },
  },
  {
    type: 'logo',
    label: 'Logo',
    icon: '◈',
    defaultProps: {
      url: 'https://via.placeholder.com/150x50/6366f1/ffffff?text=LOGO',
      alt: 'Logo',
      width: 150,
      align: 'center',
      link: '',
    },
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: '—',
    defaultProps: { color: '#e5e7eb', thickness: 1 },
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: '↕',
    defaultProps: { height: 32 },
  },
  {
    type: 'social',
    label: 'Social Links',
    icon: '⬡',
    defaultProps: {
      links: [
        { platform: 'twitter', url: 'https://twitter.com', label: 'Twitter' },
        { platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
      ],
      align: 'center',
    },
  },
  {
    type: 'footer',
    label: 'Footer',
    icon: '▼',
    defaultProps: {
      text: '© 2026 Atlas. All rights reserved.\nYou are receiving this because you signed up for Atlas.',
      color: '#9ca3af',
      fontSize: 12,
      align: 'center',
    },
  },
];
