'use client';

import { Suspense } from 'react';

import VerifyView from '@/components/views/VerifyView';
import Loader from '@/components/atoms/Loader';

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#2c3d5a] text-white px-4">
      <Suspense fallback={<Loader />}>
        <VerifyView />
      </Suspense>
    </main>
  );
}
