'use client';
//External libraries
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
//Utilities
import { supabase } from '@/utils/supabase/browserClient';
//UI global components
import LoginCard from '@/components/organisms/LoginCard';
import { showError } from '@/utils/toastService';

export default function AuthView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signOut();

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://wizards-deploy.vercel.app/auth/callback',
      },
    });

    setLoading(false);
  };

  const handleEmailSubmit = async (email: string) => {
    setLoading(true);
    await supabase.auth.signOut();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify`,
      },
    });

    setLoading(false);

    if (error) {
      console.error('❌ Error sending magic link:', error);
      showError('Error al enviar Magic Link');
    } else {
      router.push('/auth/verify');
    }
  };

  return (
    <LoginCard
      mode={mode}
      loading={loading}
      onGoogleLogin={handleGoogleLogin}
      onEmailSubmit={handleEmailSubmit}
    />
  );
}
