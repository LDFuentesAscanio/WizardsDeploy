'use client';

import { Suspense } from 'react';
import OnboardingView from '@/components/views/OnboardingView';
import { AuthCheckClient } from '@/components/auth/AuthCheckClient';
import Loader from '@/components/atoms/Loader';

export default function OnboardingPage() {
  return (
    <AuthCheckClient>
      <Suspense fallback={<Loader />}>
        <OnboardingView />
      </Suspense>
    </AuthCheckClient>
  );
}
