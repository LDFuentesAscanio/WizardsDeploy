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
  DEBUG && console.log('[ForceProfile]', ...args);

const hasText = (v?: string | null) => !!(v && v.trim().length > 0);

export function useForceProfileCompletion() {
  const router = useRouter();

  useEffect(() => {
    const forceProfileCheck = async () => {
      try {
        const { data: auth, error: authErr } = await supabase.auth.getUser();
        if (authErr) log('auth error:', authErr);
        if (!auth?.user) {
          log('No user -> /login');
          router.replace('/login');
          return;
        }

        // 1) Intento con relaciones explícitas (ajusta el nombre de la FK si no coincide)
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

        // 2) Fallback si el join vino vacío (útil si la relación no está registrada en el esquema)
        if (!expert) {
          const { data: directExpert, error: dErr } = await supabase
            .from('experts')
            .select('id, bio, profession_id')
            .eq('user_id', auth.user.id)
            .maybeSingle<ExpertRow>();

          if (dErr) log('direct expert error:', dErr);
          log('direct expert row:', directExpert);
          if (directExpert) expert = directExpert;
        }

        if (!customer) {
          const { data: directCustomer, error: cErr } = await supabase
            .from('customers')
            .select('id, company_name')
            .eq('user_id', auth.user.id)
            .maybeSingle<CustomerRow>();

          if (cErr) log('direct customer error:', cErr);
          log('direct customer row:', directCustomer);
          if (directCustomer) customer = directCustomer;
        }

        // 3) Reglas de “completitud”
        const isExpertComplete =
          !!expert && hasText(expert.bio) && hasText(expert.profession_id);

        const isCustomerComplete = !!customer && hasText(customer.company_name);

        log('computed ->', {
          isExpertComplete,
          isCustomerComplete,
          expert,
          customer,
        });

        if (!isExpertComplete && !isCustomerComplete) {
          localStorage.setItem('forcedToCompleteProfile', 'true');
          log('Redirect -> /force-profile/edit');
          router.replace('/force-profile/edit');
        }
      } catch (e) {
        console.error('[ForceProfile] unexpected error:', e);
        // En caso de error inesperado, mejor forzar edición que dejar pasar
        localStorage.setItem('forcedToCompleteProfile', 'true');
        router.replace('/force-profile/edit');
      }
    };

    forceProfileCheck();
  }, [router]);
}
