'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';

interface Props {
  children: React.ReactNode;
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
        const [{ data: userData }, { data: aboutData }] = await Promise.all([
          supabase
            .from('users')
            .select('first_name, last_name, country_id, role_id')
            .eq('id', user.id)
            .single(),
          supabase
            .from('about')
            .select('bio')
            .eq('user_id', user.id)
            .maybeSingle(),
        ]);

        const isComplete =
          userData?.first_name?.trim() &&
          userData?.last_name?.trim() &&
          userData?.country_id &&
          userData?.role_id &&
          aboutData?.bio?.trim();

        if (!isComplete && isNewUser) {
          router.replace('/force-profile/edit');
          return;
        }

        // Si no es nuevo pero no completó perfil, aún así lo dejamos entrar (no forzamos redirect)
        // El user puede decidir ir a /profile/edit desde navbar si quiere

        if (isNewUser) {
          localStorage.removeItem('isNewUser');
        }

        setChecking(false);
      } catch (err) {
        console.error('Error checking profile completion:', err);
        if (isNewUser) {
          router.replace('/force-profile/edit');
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
