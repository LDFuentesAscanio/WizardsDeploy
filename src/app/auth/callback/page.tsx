'use client';

import Image from 'next/image';
import AuthCallbackView from '@/components/views/AuthCallbackView';

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-prim text-white gap-6">
      {/* Logo de carga mientras se valida la sesión */}
      <Image
        src="/icons/carga.svg"
        alt="Loading Logo"
        width={160}
        height={160}
        className="animate-pulse w-auto h-auto"
        priority
      />

      {/* Vista lógica que redirige automáticamente */}
      <AuthCallbackView />
    </main>
  );
}
