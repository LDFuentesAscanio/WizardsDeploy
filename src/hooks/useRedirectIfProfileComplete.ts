'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';

interface ExpertData {
  bio: string | null;
  profession_id: string | null;
}

interface CustomerData {
  job_title: string | null;
  description: string | null;
  company_name: string | null;
}

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  country_id: string | null;
  role_id: string | null;
  user_role: { name: string | null } | null;
  experts: ExpertData | null;
  customers: CustomerData | null;
}

export function useRedirectIfProfileComplete() {
  const router = useRouter();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) return;

        const { data: profileData, error } = await supabase
          .from('users')
          .select(
            `
            first_name,
            last_name,
            country_id,
            role_id,
            user_role:role_id(name),
            experts (bio, profession_id),
            customers (job_title, description, company_name)
          `
          )
          .eq('id', user.id)
          .single<ProfileData>();

        if (error) {
          console.error('Profile query error:', error);
          return;
        }

        const basicComplete = Boolean(
          profileData?.first_name?.trim() &&
            profileData?.last_name?.trim() &&
            profileData?.country_id &&
            profileData?.role_id
        );

        let roleComplete = false;
        const roleName = profileData.user_role?.name?.toLowerCase();

        if (roleName === 'expert') {
          roleComplete = Boolean(
            profileData.experts?.bio?.trim() &&
              profileData.experts?.profession_id
          );
        } else if (roleName === 'customer') {
          roleComplete = Boolean(
            profileData.customers?.job_title?.trim() &&
              profileData.customers?.description?.trim() &&
              profileData.customers?.company_name?.trim()
          );
        }

        if (basicComplete && roleComplete) {
          router.replace('/dashboard');
        }
      } catch (err) {
        console.error('Profile check error:', err);
      }
    };

    checkProfile();
  }, [router]);
}
