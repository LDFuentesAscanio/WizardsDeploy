'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import VerifyView from '@/components/views/VerifyView';

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#2c3d5a] text-white px-4">
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
        <VerifyView />
      </Suspense>
    </main>
  );
}
