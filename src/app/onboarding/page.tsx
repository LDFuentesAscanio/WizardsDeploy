'use client';

import { Suspense } from 'react';
import OnboardingView from '@/components/views/OnboardingView';

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <OnboardingView />
    </Suspense>
  );
}
