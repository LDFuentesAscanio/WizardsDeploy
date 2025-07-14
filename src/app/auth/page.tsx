'use client';

import { Suspense } from 'react';
import AuthView from '@/components/views/AuthView';

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-prim px-4">
      <Suspense fallback={<p className="text-white">Cargando formulario...</p>}>
        <AuthView />
      </Suspense>
    </main>
  );
}
