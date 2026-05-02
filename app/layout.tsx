import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3009'),
  title: 'Pulse',
  description: 'Browse and preview email notification templates for the Atlas platform.',
  keywords: ['email templates', 'notifications', 'transactional email', 'atlas'],
  authors: [{ name: 'Atlas' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Pulse',
    title: 'Pulse — Notification Templates',
    description: 'Browse and preview email notification templates for the Atlas platform.',
  },
  twitter: {
    card: 'summary',
    title: 'Pulse — Notification Templates',
    description: 'Browse and preview email notification templates for the Atlas platform.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
