'use client';

import DashboardNavbar from '@/components/organisms/dashboard/DashboardNavbar';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardNavbar />
      <main className="px-4 py-8">{children}</main>
    </>
  );
}
