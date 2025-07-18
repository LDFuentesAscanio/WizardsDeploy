'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export let forcedToCompleteProfile = false;

export function useForceProfileCompletion() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkProfileCompletion = async () => {
      // Excluir rutas que no necesitan verificación
      if (
        !pathname ||
        pathname.startsWith('/profile') ||
        pathname.startsWith('/auth')
      ) {
        return;
      }

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.warn('No session found:', userError);
          return router.replace('/auth');
        }

        // Verificar solo los campos esenciales
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

        if (!isProfileComplete && !pathname.startsWith('/onboarding')) {
          forcedToCompleteProfile = true;
          return router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Error checking profile completion:', error);
      }
    };

    checkProfileCompletion();
  }, [pathname, router]);
}
