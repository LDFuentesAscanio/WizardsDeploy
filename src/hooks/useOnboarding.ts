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

// UUID exacto del registro "Other" en it_professions
const DEFAULT_PROFESSION_ID = '8470973c-7bf7-4ea4-9529-f754dc9c042e';

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

      // 2. Buscar ID del rol seleccionado (case-insensitive)
      const { data: role, error: roleError } = await supabase
        .from('user_role')
        .select('id, name')
        .ilike('name', values.role)
        .single();

      if (roleError || !role?.id) throw new Error('Rol no encontrado');

      // 3. Actualizar perfil del usuario en users
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

      // 4. Si es Expert, crear registro en tabla experts con profesión "Other" si no existe
      if (values.role.toLowerCase() === 'expert') {
        // use maybeSingle para evitar errores cuando no hay rows
        const { data: existingExpert, error: expertQueryError } = await supabase
          .from('experts')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (expertQueryError) throw expertQueryError;

        if (!existingExpert) {
          // Insertamos el expert con profession_id default
          const { error: insertExpertError } = await supabase
            .from('experts')
            .insert({
              user_id: user.id,
              profession_id: DEFAULT_PROFESSION_ID,
            });

          if (insertExpertError) throw insertExpertError;
        }
      }

      // 5. Marcar como nuevo usuario y redirigir
      localStorage.setItem('isNewUser', 'true');
      showSuccess('Onboarding completed successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error en onboarding:', error);
      showError(
        error instanceof Error
          ? error.message
          : 'Error al guardar el perfil. Por favor intenta nuevamente.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    saveUserProfile,
    loading,
  };
}
