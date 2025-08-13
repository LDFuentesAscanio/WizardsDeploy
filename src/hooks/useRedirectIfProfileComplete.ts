'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';

type ExpertRow = {
  id: string;
  bio: string | null;
  profession_id: string | null;
};
type CustomerRow = { id: string; company_name: string | null };

interface ProfileData {
  experts?: ExpertRow[];
  customers?: CustomerRow[];
}

const DEBUG = process.env.NEXT_PUBLIC_DEBUG_PROFILE === 'true';
const log = (...args: Parameters<typeof console.log>) =>
  DEBUG && console.log('[RedirectProfile]', ...args);
const hasText = (v?: string | null) => !!(v && v.trim().length > 0);

export function useRedirectIfProfileComplete() {
  const router = useRouter();

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth?.user) return;

        const { data, error } = await supabase
          .from('users')
          .select(
            `
            id,
            experts:experts!experts_user_id_fkey ( id, bio, profession_id ),
            customers:customers!customers_user_id_fkey ( id, company_name )
          `
          )
          .eq('id', auth.user.id)
          .single<ProfileData>();

        if (error) log('users select error:', error);
        log('users row:', data);

        let expert = data?.experts?.[0] ?? null;
        let customer = data?.customers?.[0] ?? null;

        // Fallback directo si hace falta
        if (!expert) {
          const { data: directExpert } = await supabase
            .from('experts')
            .select('id, bio, profession_id')
            .eq('user_id', auth.user.id)
            .maybeSingle<ExpertRow>();
          if (directExpert) expert = directExpert;
        }
        if (!customer) {
          const { data: directCustomer } = await supabase
            .from('customers')
            .select('id, company_name')
            .eq('user_id', auth.user.id)
            .maybeSingle<CustomerRow>();
          if (directCustomer) customer = directCustomer;
        }

        const isExpertComplete =
          !!expert && hasText(expert.bio) && hasText(expert.profession_id);
        const isCustomerComplete = !!customer && hasText(customer.company_name);

        log('computed ->', {
          isExpertComplete,
          isCustomerComplete,
          expert,
          customer,
        });

        if (isExpertComplete || isCustomerComplete) {
          log('Redirect -> /dashboard');
          router.replace('/dashboard');
        }
      } catch (e) {
        console.error('[RedirectProfile] unexpected error:', e);
        // si falla algo acá, no redirigimos (para evitar loops)
      }
    };

    checkProfileCompletion();
  }, [router]);
}
