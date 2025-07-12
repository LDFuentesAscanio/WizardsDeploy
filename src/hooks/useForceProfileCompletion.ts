'use client';
//External libraries
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
//Utilities
import { supabase } from '@/utils/supabase/client';

export let forcedToCompleteProfile = false;

export function useForceProfileCompletion() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (
        !pathname ||
        pathname === '/profile/edit' ||
        pathname === '/force-profile/edit' ||
        pathname === '/auth'
      )
        return;

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.warn('🔒 No session found or error:', userError);
          return;
        }

        try {
          const [userRes, aboutRes] = await Promise.all([
            supabase
              .from('users')
              .select('country_id')
              .eq('id', user.id)
              .single(),
            supabase
              .from('about')
              .select('bio, profession')
              .eq('user_id', user.id) // ✅ Correcto
              .single(),
          ]);

          // Si hay un error en la petición de about, asumimos que la tabla está vacía
          const countryId = userRes?.data?.country_id;
          const bio = aboutRes?.data?.bio ?? '';
          const profession = aboutRes?.data?.profession ?? '';

          const isIncomplete =
            !countryId || !bio?.trim() || !profession?.trim();

          if (isIncomplete && pathname !== '/force-profile/edit') {
            forcedToCompleteProfile = true;
            router.replace('/force-profile/edit');
          }
        } catch (err) {
          console.error('❌ Error while checking profile completion:', err);
        }
      } catch (err) {
        console.error('❌ Error while getting user:', err);
      }
    };

    checkProfileCompletion();
  }, [pathname, router]);
}
