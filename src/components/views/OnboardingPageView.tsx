// src/components/views/OnboardingPageView.tsx
'use client';

import { useRedirectIfProfileComplete } from '@/hooks/useRedirectIfProfileComplete';
import OnboardingView from './OnboardingView';

export default function OnboardingPageView() {
  useRedirectIfProfileComplete();

  return <OnboardingView />;
}
