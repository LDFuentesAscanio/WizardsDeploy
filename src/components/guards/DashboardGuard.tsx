'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';

interface Props {
  children: React.ReactNode;
}

export default function DashboardGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
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

      const [userRes, aboutRes] = await Promise.all([
        supabase
          .from('users')
          .select('country_id')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('about')
          .select('bio, profession')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

      const countryId = userRes?.data?.country_id;
      const bio = aboutRes?.data?.bio ?? '';
      const profession = aboutRes?.data?.profession ?? '';

      const incomplete = !countryId || !bio.trim() || !profession.trim();

      if (incomplete) {
        router.replace('/profile/edit');
        return;
      }

      setChecking(false); // ✅ Perfil completo, puede continuar
    };

    checkProfileCompletion();
  }, [router, pathname]);

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
