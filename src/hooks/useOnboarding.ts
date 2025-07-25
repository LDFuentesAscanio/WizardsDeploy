'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';
import { showError, showSuccess } from '@/utils/toastService';

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
      // 1. Obtener usuario autenticado
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      // 2. Buscar ID del rol seleccionado
      const { data: role, error: roleError } = await supabase
        .from('user_role')
        .select('id')
        .ilike('name', values.role)
        .single();

      if (roleError || !role?.id) throw new Error('Rol no encontrado');

      // 3. Actualizar perfil del usuario
      const { error: profileError } = await supabase.from('users').upsert(
        {
          id: user.id,
          email: user.email,
          first_name: values.first_name,
          last_name: values.last_name,
          role_id: role.id,
        },
        { onConflict: 'id' }
      );

      if (profileError) throw profileError;

      // 4. Marcar como nuevo usuario y redirigir
      localStorage.setItem('isNewUser', 'true');
      showSuccess('Onboarding completed successfully!');
      router.push('/dashboard'); // Será redirigido si faltan datos
    } catch (error) {
      console.error('Error en onboarding:', error);
      showError(
        error instanceof Error
          ? error.message
          : 'Error al guardar el perfil. Por favor intenta nuevamente.'
      );
      throw error; // Permite manejar el error en el componente
    } finally {
      setLoading(false);
    }
  };

  return {
    saveUserProfile,
    loading,
  };
}
