'use client';

import { Suspense } from 'react';
import OnboardingView from '@/components/views/OnboardingView';
import Image from 'next/image';

export default function OnboardingPage() {
  return (
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
      <OnboardingView />
    </Suspense>
  );
}
