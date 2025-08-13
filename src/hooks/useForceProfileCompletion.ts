'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';

interface ProfileData {
  experts?: Array<{ bio?: string; profession_id?: string }>;
  customers?: Array<{ company_name?: string }>;
}

export function useForceProfileCompletion() {
  const router = useRouter();

  useEffect(() => {
    const forceProfileCheck = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.replace('/login');
        return;
      }

      const { data } = await supabase
        .from('users')
        .select('experts(bio, profession_id), customers(company_name)')
        .eq('id', auth.user.id)
        .single<ProfileData>();

      const isExpertComplete =
        data?.experts?.length &&
        data.experts[0].bio &&
        data.experts[0].profession_id;

      const isCustomerComplete =
        data?.customers?.length && data.customers[0].company_name;

      if (!isExpertComplete && !isCustomerComplete) {
        localStorage.setItem('forcedToCompleteProfile', 'true');
        router.replace('/force-profile/edit');
      }
    };

    forceProfileCheck();
  }, [router]);
}
