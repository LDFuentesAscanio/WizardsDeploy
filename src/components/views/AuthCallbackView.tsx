'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export default function AuthCallbackView() {
  const router = useRouter();

  useEffect(() => {
    const checkUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile, error } = await supabase
        .from('users')
        .select('first_name, last_name, role_id')
        .eq('id', user.id)
        .single();

      if (
        !profile ||
        error ||
        !profile.first_name ||
        !profile.last_name ||
        !profile.role_id
      ) {
        router.replace('/onboarding');
      } else {
        router.replace('/dashboard');
      }
    };

    checkUserProfile();
  }, [router]);

  return null;
}
