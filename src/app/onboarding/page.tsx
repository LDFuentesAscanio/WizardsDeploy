'use client';

import { Suspense } from 'react';
import OnboardingView from '@/components/views/OnboardingView';
import Image from 'next/image';
import { AuthCheckClient } from '@/components/auth/AuthCheckClient';

export default function OnboardingPage() {
  return (
    <AuthCheckClient>
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
    </AuthCheckClient>
  );
}
