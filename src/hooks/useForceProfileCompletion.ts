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

      // 1. Verificar sesión de usuario
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn('No session found:', userError);
        return router.replace('/auth');
      }

      // 2. Consulta optimizada con todas las relaciones necesarias
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
            skills:skills(skill_name),
            tools:tools(tool_name),
            expertises:expert_expertise(platform_id),
            it_professions:profession_id(profession_name)
          ),
          customers (
            job_title,
            description,
            company_name,
            company_url
          )
        `
        )
        .eq('id', user.id)
        .single<ProfileData>();

      if (profileError) {
        console.error('Error fetching profile data:', profileError);
        return;
      }

      // 3. Verificación básica de campos obligatorios
      const basicComplete = Boolean(
        profileData?.first_name?.trim() &&
          profileData?.last_name?.trim() &&
          profileData?.country_id &&
          profileData?.role_id
      );

      let isProfileComplete = basicComplete;

      if (basicComplete) {
        const roleName = profileData.user_role?.name?.toLowerCase();

        if (roleName === 'expert') {
          // Verificación para perfiles de experto (acceso directo a objeto)
          isProfileComplete = Boolean(
            profileData.experts?.bio?.trim() &&
              profileData.experts?.profession_id &&
              (profileData.experts?.skills?.length ?? 0) > 0 &&
              (profileData.experts?.tools?.length ?? 0) > 0 &&
              (profileData.experts?.expertises?.length ?? 0) > 0
          );

          console.log('Expert profile complete check:', {
            bio: !!profileData.experts?.bio,
            profession: !!profileData.experts?.profession_id,
            skills: profileData.experts?.skills?.length,
            tools: profileData.experts?.tools?.length,
            expertises: profileData.experts?.expertises?.length,
          });
        } else if (roleName === 'customer') {
          // Verificación para perfiles de cliente (acceso directo a objeto)
          isProfileComplete = Boolean(
            profileData.customers?.job_title?.trim() &&
              profileData.customers?.description?.trim() &&
              profileData.customers?.company_name?.trim()
          );

          console.log('Customer profile complete check:', {
            job_title: !!profileData.customers?.job_title,
            description: !!profileData.customers?.description,
            company_name: !!profileData.customers?.company_name,
          });
        }
      }

      // 4. Redirección según estado del perfil
      if (!isProfileComplete) {
        localStorage.setItem('forcedToCompleteProfile', 'true');
        router.replace('/force-profile/edit');
      }
    };

    checkProfileCompletion();
  }, [pathname, router]);
}
