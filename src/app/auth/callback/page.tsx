'use client';

import AuthCallbackView from '@/components/views/AuthCallbackView';
import Loader from '@/components/atoms/Loader';

export default function AuthCallbackPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-prim text-white">
      <Loader />
      <AuthCallbackView />
    </main>
  );
}
