'use client';
//External libraries
import { useState } from 'react';
import { useRouter } from 'next/navigation';
//Utilities
import { supabase } from '@/utils/supabase/client';
import { showError } from '@/utils/toastService';

interface FormValues {
  first_name: string;
  last_name: string;
  role: string;
}

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const saveUserProfile = async (values: FormValues) => {
    console.log('🧪 Role recibido:', values.role);
    setLoading(true);

    try {
      // 1. Obtener usuario
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error(userError?.message || 'No user found');
      }

      // 2. Consulta directa con el valor exacto
      const { data: roles, error: roleError } = await supabase
        .from('user_role')
        .select('id')
        .eq('name', values.role)
        .limit(1);

      console.log('Resultado consulta rol:', { roles, roleError });

      if (roleError || !roles?.[0]?.id) {
        throw new Error(roleError?.message || 'Rol no encontrado');
      }

      // 3. Upsert en users
      const { error: upsertError } = await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        first_name: values.first_name,
        last_name: values.last_name,
        role_id: roles[0].id,
      });

      if (upsertError) {
        throw new Error(upsertError.message);
      }

      router.push('/dashboard');
    } catch (error: unknown) {
      // <-- Especificamos que error es de tipo unknown
      let errorMessage = 'Error saving profile';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      console.error('Error en onboarding:', error);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    saveUserProfile,
    loading,
  };
}
