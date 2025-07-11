'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import LoginCard from '@/components/organisms/LoginCard';

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
      console.error('❌ Error al enviar Magic Link:', error);
      alert(`Error al enviar Magic Link: ${error.message}`);
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
