'use client';
//External libraries
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
//Utilities
import { supabase } from '@/utils/supabase/client';

export function useRedirectIfProfileComplete() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkProfile = async () => {
      if (
        pathname === '/dashboard' ||
        pathname === '/profile/edit' ||
        pathname === '/force-profile/edit'
      )
        return;

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('No user found or error in session:', userError);
        router.replace('/auth');
        return;
      }

      try {
        const [{ data: userData }, { data: aboutData }] = await Promise.all([
          supabase
            .from('users')
            .select('first_name, last_name, role_id')
            .eq('id', user.id)
            .single(),
          supabase
            .from('about')
            .select('bio, profession')
            .eq('user_id', user.id) // 👈 esta línea estaba mal antes, ahora está correcta
            .single(),
        ]);

        // 🔍 Registro para depurar
        console.log('🔍 Profile data check:', {
          first_name: userData?.first_name,
          last_name: userData?.last_name,
          role_id: userData?.role_id,
          bio: aboutData?.bio,
          profession: aboutData?.profession,
        });

        const isComplete =
          userData?.first_name?.trim() &&
          userData?.last_name?.trim() &&
          userData?.role_id &&
          aboutData?.bio?.trim() &&
          aboutData?.profession?.trim();

        if (isComplete) {
          router.replace('/dashboard');
        }
      } catch (err) {
        console.error('Error checking profile completeness:', err);
      }
    };

    checkProfile();
  }, [router, pathname]);
}
