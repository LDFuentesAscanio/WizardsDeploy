'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';
import { showError } from '@/utils/toastService';

interface ProfileData {
  role_id: string;
  experts?: Array<{ bio?: string; profession_id?: string }>;
  customers?: Array<{ company_name?: string }>;
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
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) {
          router.replace('/login');
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select(
            'role_id, experts(bio, profession_id), customers(company_name)'
          )
          .eq('id', auth.user.id)
          .single<ProfileData>();

        if (error) throw error;

        const isExpertComplete =
          data.experts?.length &&
          data.experts[0].bio &&
          data.experts[0].profession_id;

        const isCustomerComplete =
          data.customers?.length && data.customers[0].company_name;

        if (!isExpertComplete && !isCustomerComplete) {
          router.replace('/force-profile/edit');
          return;
        }
      } catch (err) {
        console.error(err);
        showError('Error checking profile');
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  return <>{children}</>;
}
