'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';
import { ProfileData } from '@/components/organisms/ProfileForm/types';

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
        pathname.startsWith('/force-profile/edit')
      ) {
        return;
      }

      // 1️⃣ Sesión de usuario
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn('No session found:', userError);
        return router.replace('/auth');
      }

      // 2️⃣ Consulta única optimizada
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select(
          `
          first_name,
          last_name,
          country_id,
          role_id,
          user_role:role_id(name),
          experts (
            bio,
            profession_id,
            it_professions:profession_id(profession_name)
          ),
          customers (
            job_title,
            description
          )
        `
        )
        .eq('id', user.id)
        .single<ProfileData>(); // ← Aquí le pasamos el tipo

      if (profileError) {
        console.error('Error fetching profile data:', profileError);
        return;
      }

      const basicComplete =
        !!profileData?.first_name &&
        !!profileData?.last_name &&
        !!profileData?.country_id &&
        !!profileData?.role_id;

      let isProfileComplete = basicComplete;

      if (basicComplete) {
        const roleName = profileData.user_role?.name?.toLowerCase();

        if (roleName === 'expert') {
          isProfileComplete =
            !!profileData.experts?.bio && !!profileData.experts?.profession_id;

          // Solo para debug o usar en otro lado
          const professionName =
            profileData.experts?.it_professions?.profession_name || '';
          console.log('Profession:', professionName);
        } else if (roleName === 'customer') {
          isProfileComplete =
            !!profileData.customers?.job_title &&
            !!profileData.customers?.description;
        }
      }

      if (!isProfileComplete) {
        localStorage.setItem('forcedToCompleteProfile', 'true');
        return router.replace('/force-profile/edit');
      }
    };

    checkProfileCompletion();
  }, [pathname, router]);
}
