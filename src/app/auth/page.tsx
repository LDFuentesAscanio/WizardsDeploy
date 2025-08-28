'use client';

import { Suspense } from 'react';
import AuthView from '@/components/views/AuthView';
import Loader from '@/components/atoms/Loader';

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-prim px-4">
      <Suspense fallback={<Loader />}>
        <AuthView />
      </Suspense>
    </main>
  );
}
