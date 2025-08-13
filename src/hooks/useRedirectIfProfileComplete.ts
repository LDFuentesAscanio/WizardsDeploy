'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';
import { ProfileData } from '@/components/organisms/ProfileForm/types';

export function useRedirectIfProfileComplete() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkProfile = async () => {
      if (pathname === '/dashboard' || pathname === '/force-profile/edit')
        return;

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('No user found or error in session:', userError);
        return router.replace('/auth');
      }

      try {
        // Consulta optimizada con tipos explícitos
        const { data: profileData, error: queryError } = await supabase
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

        if (queryError || !profileData) {
          console.error('Error fetching profile data:', queryError);
          return;
        }

        // Verificación básica
        const basicComplete = Boolean(
          profileData.first_name?.trim() &&
            profileData.last_name?.trim() &&
            profileData.country_id &&
            profileData.role_id
        );

        let profileComplete = basicComplete;

        if (basicComplete) {
          const roleName = profileData.user_role?.name?.toLowerCase();

          if (roleName === 'expert') {
            // Acceso seguro a datos de experto
            profileComplete = Boolean(
              profileData.experts?.bio?.trim() &&
                profileData.experts?.profession_id &&
                (profileData.experts?.skills?.length ?? 0) > 0 &&
                (profileData.experts?.tools?.length ?? 0) > 0 &&
                (profileData.experts?.expertises?.length ?? 0) > 0
            );

            console.log('Expert profile complete status:', {
              completed: profileComplete,
              details: {
                bio: !!profileData.experts?.bio,
                profession: !!profileData.experts?.profession_id,
                skills: profileData.experts?.skills?.length,
                tools: profileData.experts?.tools?.length,
                expertises: profileData.experts?.expertises?.length,
              },
            });
          } else if (roleName === 'customer') {
            // Acceso seguro a datos de cliente
            profileComplete = Boolean(
              profileData.customers?.job_title?.trim() &&
                profileData.customers?.description?.trim() &&
                profileData.customers?.company_name?.trim()
            );

            console.log('Customer profile complete status:', {
              completed: profileComplete,
              details: {
                job_title: !!profileData.customers?.job_title,
                description: !!profileData.customers?.description,
                company_name: !!profileData.customers?.company_name,
              },
            });
          }
        }

        if (profileComplete) {
          router.replace('/dashboard');
        }
      } catch (err) {
        console.error('Error checking profile completeness:', err);
      }
    };

    checkProfile();
  }, [router, pathname]);
}
