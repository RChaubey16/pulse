'use client';

import LoginGate from '@/components/login-gate';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <LoginGate>{children}</LoginGate>;
}
