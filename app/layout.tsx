import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers';
import Nav from '@/components/nav';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3009'),
  title: 'Pulse — Notification Templates',
  description: 'Browse, build, and send email notification templates for the Atlas platform.',
  keywords: ['email templates', 'notifications', 'transactional email', 'atlas'],
  authors: [{ name: 'Atlas' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Pulse',
    title: 'Pulse — Notification Templates',
    description: 'Browse, build, and send email notification templates for the Atlas platform.',
  },
  twitter: {
    card: 'summary',
    title: 'Pulse — Notification Templates',
    description: 'Browse, build, and send email notification templates for the Atlas platform.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        <AuthProvider>
          <Nav />
          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
