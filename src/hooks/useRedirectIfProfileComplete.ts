'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';

export function useRedirectIfProfileComplete() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkProfile = async () => {
      // No redirigir si ya estamos en estas rutas
      if (pathname === '/dashboard' || pathname === '/force-profile/edit')
        return;

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('No user found or error in session:', userError);
        router.replace('/auth');
        return;
      }

      try {
        // Obtenemos datos básicos del usuario y su rol
        const { data: userData } = await supabase
          .from('users')
          .select('first_name, last_name, role_id')
          .eq('id', user.id)
          .single();

        if (!userData) {
          console.error('User data not found');
          return;
        }

        // Verificamos si es experto o cliente
        const isExpert = userData.role_id === 'expert_role_id'; // Ajusta este ID
        const isCustomer = userData.role_id === 'customer_role_id'; // Ajusta este ID

        let profileComplete = false;

        if (isExpert) {
          // Para expertos: verificamos bio y profession de la tabla experts
          const { data: expertData } = await supabase
            .from('experts')
            .select('bio, profession_id')
            .eq('user_id', user.id)
            .single();

          profileComplete = Boolean(
            userData.first_name?.trim() &&
              userData.last_name?.trim() &&
              expertData?.bio?.trim() &&
              expertData?.profession_id
          );

          console.log('Expert profile complete:', profileComplete, {
            first_name: userData.first_name,
            last_name: userData.last_name,
            bio: expertData?.bio,
            profession_id: expertData?.profession_id,
          });
        } else if (isCustomer) {
          // Para clientes: verificamos job_title y description de customers
          const { data: customerData } = await supabase
            .from('customers')
            .select('job_title, description')
            .eq('user_id', user.id)
            .single();

          profileComplete = Boolean(
            userData.first_name?.trim() &&
              userData.last_name?.trim() &&
              customerData?.job_title?.trim() &&
              customerData?.description?.trim()
          );

          console.log('Customer profile complete:', profileComplete, {
            first_name: userData.first_name,
            last_name: userData.last_name,
            job_title: customerData?.job_title,
            description: customerData?.description,
          });
        }

        // Redirigir si el perfil está completo
        if (profileComplete) {
          router.replace('/dashboard');
        }
      } catch (err) {
        console.error('Error checking profile completeness:', err);
      }
    };

    checkProfile();
  }, [router, pathname]);
}
