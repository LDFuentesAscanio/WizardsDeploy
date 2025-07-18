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
    setLoading(true);
    try {
      // 1. Obtener usuario
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user)
        throw new Error(userError?.message || 'Usuario no autenticado');

      // 2. Consulta CORREGIDA (sin duplicar 'public')
      const roleQuery = await supabase
        .from('user_role') // <- Solo el nombre de la tabla, sin esquema
        .select('id')
        .eq('name', values.role.trim())
        .maybeSingle();

      console.log('Consulta corregida:', {
        query: `SELECT id FROM user_role WHERE name = '${values.role.trim()}'`,
        results: roleQuery.data,
        error: roleQuery.error,
      });

      if (roleQuery.error) throw roleQuery.error;
      if (!roleQuery.data?.id) throw new Error('Rol no encontrado');

      // 3. Upsert
      const { error } = await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        role_id: roleQuery.data.id,
      });

      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error en registro';
      console.error('Error:', error);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    saveUserProfile,
    loading,
  };
}
