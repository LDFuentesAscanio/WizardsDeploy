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
      if (!user) throw new Error('No user found');

      // 2. Consulta MEJORADA con debug
      const { data: role, error: roleError } = await supabase
        .from('user_role')
        .select('id')
        .ilike('name', values.role) // <- Usamos ilike para case-insensitive
        .single(); // <- single() en lugar de limit(1)

      console.log('Consulta rol:', {
        role,
        error: roleError,
        query: `SELECT id FROM user_role WHERE name ILIKE '${values.role}'`,
      });

      if (roleError || !role?.id) {
        // Debug adicional
        const { data: allRoles } = await supabase.from('user_role').select('*');
        console.log('Roles disponibles:', allRoles);
        throw new Error(
          `Rol no válido. Roles existentes: ${
            allRoles?.map((r) => r.name).join(', ') || 'ninguno'
          }`
        );
      }

      // 3. Upsert
      const { error } = await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        first_name: values.first_name,
        last_name: values.last_name,
        role_id: role.id,
      });

      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completo:', error);
      showError(
        error instanceof Error ? error.message : 'Error guardando perfil'
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
