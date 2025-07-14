'use client';

import { Suspense } from 'react';
import ProfileForm from '@/components/organisms/ProfileForm/ProfileForm';

export default function ProfileEditPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-prim px-4 text-white">
      <Suspense
        fallback={<div className="text-white">Loading profile form...</div>}
      >
        <ProfileForm />
      </Suspense>
    </main>
  );
}
