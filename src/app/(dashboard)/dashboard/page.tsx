'use client';

import { Suspense } from 'react';
import DashboardView from '@/components/views/DashboardView';
import DashboardGuard from '@/components/guards/DashboardGuard';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <DashboardGuard>
      <Suspense
        fallback={
          <Image
            src="/icons/carga.svg"
            alt="Loading"
            width={160}
            height={160}
            className="animate-pulse w-auto h-auto"
            priority
          />
        }
      >
        <DashboardView />
      </Suspense>
    </DashboardGuard>
  );
}
