'use client';
import { useEffect, useState } from 'react';
import { ProfileFormValues, Country, Role, Solution } from './types';
import { supabase } from '@/utils/supabase/client';
import { fetchProfileFormData } from './helpers';

export function useProfileFormData() {
  const [initialValues, setInitialValues] = useState<ProfileFormValues | null>(
    null
  );
  const [countries, setCountries] = useState<Country[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // 1. Verificar autenticación
        const { data: auth, error: authError } = await supabase.auth.getUser();
        if (authError)
          throw new Error(`Authentication failed: ${authError.message}`);
        if (!auth?.user) throw new Error('User session not found');

        // 2. Cargar datos del perfil
        const { initialValues, countries, roles, solutions } =
          await fetchProfileFormData(auth.user.id);

        // 3. Filtrar roles (eliminar admin)
        const filteredRoles = roles.filter((role) => role.name !== 'admin');

        // 4. Actualizar estado
        setInitialValues(initialValues);
        setCountries(countries);
        setRoles(filteredRoles);
        setSolutions(solutions);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load profile data';
        setError(errorMessage);
        console.error('Profile data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  return {
    initialValues,
    countries,
    roles,
    solutions,
    loading,
    error,
  };
}
