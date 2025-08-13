'use client';

import { useEffect, useState } from 'react';
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

        console.log('Perfil completo:', profileData);

        const basicComplete = Boolean(
          profileData?.first_name?.trim() &&
            profileData?.last_name?.trim() &&
            profileData?.country_id &&
            profileData?.role_id
        );

        if (!basicComplete) {
          router.replace('/force-profile/edit');
          return;
        }

        const roleName = profileData.user_role?.name?.toLowerCase();

        if (roleName === 'expert') {
          const expertComplete = Boolean(
            profileData.experts?.bio?.trim() &&
              profileData.experts?.profession_id
          );

          console.log('Verificación experto:', expertComplete);
          if (!expertComplete) {
            router.replace('/force-profile/edit');
            return;
          }
        } else if (roleName === 'customer') {
          const customerComplete = Boolean(
            profileData.customers?.job_title?.trim() &&
              profileData.customers?.description?.trim() &&
              profileData.customers?.company_name?.trim()
          );

          console.log('Verificación cliente:', customerComplete);
          if (!customerComplete) {
            router.replace('/force-profile/edit');
            return;
          }
        } else {
          router.replace('/force-profile/edit');
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error('Error verificando perfil:', err);
        router.replace('/force-profile/edit');
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
