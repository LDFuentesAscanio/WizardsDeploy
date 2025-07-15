'use client';

import { Suspense } from 'react';
import ProfileForm from '@/components/organisms/ProfileForm/ProfileForm';
import Image from 'next/image';

export default function ProfileEditPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#2c3d5a] px-4 text-white">
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
        <ProfileForm />
      </Suspense>
    </main>
  );
}
