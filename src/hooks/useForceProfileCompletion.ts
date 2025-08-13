'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  country_id: string | null;
  role_id: string | null;
  user_role: { name: string | null } | null;
  experts: Array<{
    bio: string | null;
    profession_id: string | null;
    skills: Array<{ skill_name: string }>;
    tools: Array<{ tool_name: string }>;
    expertises: Array<{ platform_id: string }>;
  }> | null;
  customers: Array<{
    job_title: string | null;
    description: string | null;
    company_name: string | null;
  }> | null;
}

export function useForceProfileCompletion() {
  const router = useRouter();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          console.log('No user found, redirecting to login');
          router.replace('/login');
          return;
        }

        const { data: profileData, error } = await supabase
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
              expertises:expert_expertise(platform_id)
            ),
            customers (
              job_title,
              description,
              company_name
            )
          `
          )
          .eq('id', user.id)
          .single<ProfileData>();

        if (error) {
          console.error('Profile query error:', error);
          return;
        }

        console.log('Profile data:', profileData);

        // Verificación básica común
        const basicComplete = Boolean(
          profileData?.first_name?.trim() &&
            profileData?.last_name?.trim() &&
            profileData?.country_id &&
            profileData?.role_id
        );

        let roleComplete = false;
        const roleName = profileData?.user_role?.name?.toLowerCase();

        if (roleName === 'expert') {
          const expert = profileData.experts?.[0];
          roleComplete = Boolean(
            expert?.bio?.trim() &&
              expert?.profession_id &&
              (expert?.skills?.length ?? 0) > 0 &&
              (expert?.tools?.length ?? 0) > 0 &&
              (expert?.expertises?.length ?? 0) > 0
          );
          console.log('Expert complete:', roleComplete, expert);
        } else if (roleName === 'customer') {
          const customer = profileData.customers?.[0];
          roleComplete = Boolean(
            customer?.job_title?.trim() &&
              customer?.description?.trim() &&
              customer?.company_name?.trim()
          );
          console.log('Customer complete:', roleComplete, customer);
        }

        if (!basicComplete || !roleComplete) {
          console.log('Profile incomplete, redirecting to edit');
          localStorage.setItem('forcedToCompleteProfile', 'true');
          router.replace('/force-profile/edit');
        }
      } catch (err) {
        console.error('Profile check error:', err);
        localStorage.setItem('forcedToCompleteProfile', 'true');
        router.replace('/force-profile/edit');
      }
    };

    checkProfile();
  }, [router]);
}
