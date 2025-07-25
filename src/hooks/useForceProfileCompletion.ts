'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';

export function useForceProfileCompletion() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (
        !pathname ||
        pathname.startsWith('/profile') ||
        pathname.startsWith('/auth') ||
        pathname.startsWith('/onboarding') ||
        pathname.startsWith('/force-profile/edit') // Evitar bucle infinito
      ) {
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn('No session found:', userError);
        return router.replace('/auth');
      }

      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('first_name, last_name, country_id, role_id')
        .eq('id', user.id)
        .single();

      if (userDataError) {
        console.error('Error fetching user data:', userDataError);
        return;
      }

      const isProfileComplete =
        userData?.first_name &&
        userData?.last_name &&
        userData?.country_id &&
        userData?.role_id;

      if (!isProfileComplete) {
        localStorage.setItem('forcedToCompleteProfile', 'true');
        return router.replace('/force-profile/edit');
      }
    };

    checkProfileCompletion();
  }, [pathname, router]);
}
