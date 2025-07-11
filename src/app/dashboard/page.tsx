'use client';

import { Suspense } from 'react';
import DashboardView from '@/components/views/DashboardView';
import DashboardGuard from '@/components/guards/DashboardGuard';

export default function DashboardPage() {
  return (
    <DashboardGuard>
      <Suspense
        fallback={
          <div className="text-white text-center mt-10">
            Loading dashboard...
          </div>
        }
      >
        <DashboardView />
      </Suspense>
    </DashboardGuard>
  );
}
