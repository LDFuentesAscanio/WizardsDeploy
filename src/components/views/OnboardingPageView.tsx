// src/components/views/OnboardingPageView.tsx
'use client';
//Utilities
import { useRedirectIfProfileComplete } from '@/hooks/useRedirectIfProfileComplete';
//views
import OnboardingView from './OnboardingView';

export default function OnboardingPageView() {
  useRedirectIfProfileComplete();

  return <OnboardingView />;
}
