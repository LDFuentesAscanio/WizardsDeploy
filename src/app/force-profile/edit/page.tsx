'use client';

import { Suspense } from 'react';
import ProfileForm from '@/components/organisms/ProfileForm/ProfileForm';
import { AuthCheckClient } from '@/components/auth/AuthCheckClient';
import { useRedirectIfProfileComplete } from '@/hooks/useRedirectIfProfileComplete';
import Loader from '@/components/atoms/Loader';

export default function ForceProfileEditPage() {
  useRedirectIfProfileComplete(); // 🚀 si ya está completo → redirige

  return (
    <AuthCheckClient>
      <main className="min-h-screen flex items-center justify-center bg-[#2c3d5a] px-4 text-white">
        <Suspense fallback={<Loader />}>
          <ProfileForm />
        </Suspense>
      </main>
    </AuthCheckClient>
  );
}
