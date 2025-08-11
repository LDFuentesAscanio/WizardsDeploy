'use client';
import { useEffect, useState } from 'react';
import {
  ProfileFormValues,
  Country,
  Role,
  Solution,
  ITProfession,
} from './types';
import { supabase } from '@/utils/supabase/browserClient';
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
  const [professions, setProfessions] = useState<ITProfession[]>([]);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const { data: auth, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!auth?.user) throw new Error('No user found');

        // Obtener el rol del usuario primero
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role_id')
          .eq('id', auth.user.id)
          .single();

        if (userError) throw userError;

        // Cargar datos según el rol
        const { initialValues, countries, roles, solutions, professions } =
          await fetchProfileFormData(auth.user.id);

        // Filtrar roles y establecer valores iniciales
        const filteredRoles = roles.filter((role) => role.name !== 'admin');

        setInitialValues({
          ...initialValues,
          role_id: userData.role_id, // Asegurar que el role_id esté actualizado
        });
        setCountries(countries);
        setRoles(filteredRoles);
        setSolutions(solutions);
        setProfessions(professions);
      } catch (err) {
        console.error('Profile data loading error:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load profile data'
        );
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
    professions,
    loading,
    error,
  };
}
