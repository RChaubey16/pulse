'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './providers';

const TABS = [
  { href: '/templates', label: 'Templates' },
  { href: '/my-templates', label: 'My Templates' },
  { href: '/send', label: 'Send Email' },
] as const;

export default function Nav() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo */}
          <Link href="/templates" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <BellIcon />
            </div>
            <span className="font-semibold text-slate-900 text-sm">Pulse</span>
          </Link>

          {/* Tabs */}
          <nav className="flex items-center gap-0.5">
            {TABS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Auth status */}
          {!isLoading && (
            <div className="shrink-0">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
                >
                  Sign out
                </button>
              ) : (
                <span className="text-xs text-slate-400">Not signed in</span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function BellIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}
