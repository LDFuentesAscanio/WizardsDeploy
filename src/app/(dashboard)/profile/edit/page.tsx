'use client';

import { Suspense, lazy } from 'react';
const ProfileForm = lazy(
  () => import('@/components/organisms/ProfileForm/ProfileForm')
);
import Loader from '@/components/atoms/Loader';

export default function ProfileEditPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#2c3d5a] px-4 text-white">
      <Suspense fallback={<Loader />}>
        <ProfileForm />
      </Suspense>
    </main>
  );
}
