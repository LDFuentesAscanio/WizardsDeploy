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

  // En tu hook useOnboarding.ts
  const saveUserProfile = async (values: FormValues) => {
    setLoading(true);
    try {
      // 1. Obtener usuario
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // 2. Consulta de rol
      const { data: role } = await supabase
        .from('user_role')
        .select('id')
        .ilike('name', values.role)
        .single();

      if (!role?.id) throw new Error('Rol no encontrado');

      // 3. Upsert CORREGIDO (sin 'returning')
      const { error } = await supabase.from('users').upsert(
        {
          id: user.id,
          email: user.email,
          first_name: values.first_name,
          last_name: values.last_name,
          role_id: role.id,
        },
        {
          onConflict: 'id', // Solo esta opción es válida
        }
      );

      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completo:', error);
      showError(
        error instanceof Error
          ? error.message
          : 'Error guardando perfil. Contacta al soporte.'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    saveUserProfile,
    loading,
  };
}
