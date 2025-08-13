'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';
import Image from 'next/image';

interface Props {
  children: React.ReactNode;
}

interface ProfileResponse {
  first_name: string | null;
  last_name: string | null;
  country_id: string | null;
  role_id: string | null;
  user_role: {
    name: string | null;
  } | null;
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

export default function DashboardGuard({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace('/auth');
        return;
      }

      const isNewUser = localStorage.getItem('isNewUser') === 'true';

      try {
        // Consulta optimizada con tipado explícito
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
          .single<ProfileResponse>();

        if (profileError || !profileData) {
          throw profileError || new Error('Profile data not found');
        }

        // Verificación básica común
        const basicComplete = Boolean(
          profileData.first_name?.trim() &&
            profileData.last_name?.trim() &&
            profileData.country_id &&
            profileData.role_id
        );

        let roleSpecificComplete = true;
        const roleName = profileData.user_role?.name?.toLowerCase();

        if (roleName === 'expert') {
          // Accedemos al primer elemento del array de experts
          const expert = profileData.experts?.[0];
          roleSpecificComplete = Boolean(
            expert?.bio?.trim() &&
              expert?.profession_id &&
              (expert?.skills?.length ?? 0) > 0 &&
              (expert?.tools?.length ?? 0) > 0 &&
              (expert?.expertises?.length ?? 0) > 0
          );

          console.log('Expert profile check:', {
            bio: expert?.bio,
            profession_id: expert?.profession_id,
            skills: expert?.skills?.length,
            tools: expert?.tools?.length,
            expertises: expert?.expertises?.length,
          });
        } else if (roleName === 'customer') {
          // Accedemos al primer elemento del array de customers
          const customer = profileData.customers?.[0];
          roleSpecificComplete = Boolean(
            customer?.job_title?.trim() &&
              customer?.description?.trim() &&
              customer?.company_name?.trim()
          );

          console.log('Customer profile check:', {
            job_title: customer?.job_title,
            description: customer?.description,
            company_name: customer?.company_name,
          });
        }

        const isComplete = basicComplete && roleSpecificComplete;

        if (!isComplete && isNewUser) {
          router.replace('/force-profile/edit');
          return;
        }

        if (isNewUser) {
          localStorage.removeItem('isNewUser');
        }

        setChecking(false);
      } catch (err) {
        console.error('Error checking profile completion:', err);
        if (isNewUser) {
          router.replace('/force-profile/edit');
        } else {
          setChecking(false);
        }
      }
    };

    checkProfileCompletion();
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#2c3d5a]">
        <Image
          src="/icons/carga.svg"
          alt="Verificando"
          width={160}
          height={160}
          className="animate-pulse"
        />
      </main>
    );
  }

  return <>{children}</>;
}
