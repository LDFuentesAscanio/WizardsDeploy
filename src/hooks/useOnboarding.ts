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

      // 2. Consulta CON esquema público y debug extendido
      const roleQuery = await supabase
        .from('public.user_role')
        .select('id')
        .eq('name', values.role.trim()) // Limpieza adicional
        .maybeSingle(); // <- Método óptimo para buscar 1 registro

      console.log('DEBUG - Consulta de rol:', {
        query: `SELECT id FROM public.user_role WHERE name = '${values.role.trim()}'`,
        results: roleQuery.data,
        error: roleQuery.error,
        status: roleQuery.status,
      });

      if (roleQuery.error) throw roleQuery.error;
      if (!roleQuery.data?.id) {
        // Consulta de emergencia para listar TODOS los roles
        const { data: allRoles } = await supabase
          .from('public.user_role')
          .select('name');
        throw new Error(
          `Rol inválido. Opciones válidas: ${
            allRoles?.map((r) => `"${r.name}"`).join(', ') ||
            'Ningún rol encontrado'
          }`
        );
      }

      // 3. Upsert con transacción
      const { error } = await supabase.from('users').upsert(
        {
          id: user.id,
          email: user.email,
          first_name: values.first_name.trim(),
          last_name: values.last_name.trim(),
          role_id: roleQuery.data.id,
        },
        { onConflict: 'id' }
      );

      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error completo:', error);
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
