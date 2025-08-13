'use client';

import { useEffect, useState } from 'react';
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
  }> | null;
  customers: Array<{
    job_title: string | null;
    description: string | null;
    company_name: string | null;
  }> | null;
}

export default function DashboardGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
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
            experts (bio, profession_id),
            customers (job_title, description, company_name)
          `
          )
          .eq('id', user.id)
          .single<ProfileData>();

        if (error) throw error;

        console.log('DashboardGuard profile data:', profileData);

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
          roleComplete = Boolean(expert?.bio?.trim() && expert?.profession_id);
          console.log('DashboardGuard - Expert complete:', roleComplete);
        } else if (roleName === 'customer') {
          const customer = profileData.customers?.[0];
          roleComplete = Boolean(
            customer?.job_title?.trim() &&
              customer?.description?.trim() &&
              customer?.company_name?.trim()
          );
          console.log('DashboardGuard - Customer complete:', roleComplete);
        }

        if (!basicComplete || !roleComplete) {
          console.log(
            'DashboardGuard - Profile incomplete, redirecting to edit'
          );
          router.replace('/force-profile/edit');
        }
      } catch (err) {
        console.error('DashboardGuard error:', err);
        router.replace('/force-profile/edit');
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
