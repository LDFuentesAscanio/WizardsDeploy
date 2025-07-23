'use client';
//External libraries
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
//Utilities
import { supabase } from '@/utils/supabase/client';

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

      // Verificar si viene de onboarding (perfil recién creado)
      const isNewUser = localStorage.getItem('isNewUser') === 'true';

      // Obtener todos los datos necesarios en una sola consulta
      const { data: profileData, error } = await supabase
        .from('profiles_complete_view') // 👈 Crear esta vista en Supabase
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !profileData) {
        console.error('Error checking profile:', error);
        router.replace(isNewUser ? '/force-profile/edit' : '/profile/edit');
        return;
      }

      const isComplete =
        profileData.first_name &&
        profileData.last_name &&
        profileData.country_id &&
        profileData.bio &&
        (isNewUser ? profileData.role_id : true);

      if (!isComplete) {
        router.replace(isNewUser ? '/force-profile/edit' : '/profile/edit');
      } else {
        if (isNewUser) localStorage.removeItem('isNewUser');
        setChecking(false);
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
