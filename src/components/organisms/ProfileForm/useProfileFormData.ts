'use client';
import { useEffect, useState } from 'react';
import {
  ProfileFormValues,
  Country,
  Role,
  Category,
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
  const [categories, setCategories] = useState<Category[]>([]); // Cambiado de solutions a categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [professions, setProfessions] = useState<ITProfession[]>([]);
  const [roleName, setRoleName] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const { data: auth, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!auth?.user) throw new Error('No user found');

        // Obtener el rol del usuario primero
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role_id, user_role:role_id(name)')
          .eq('id', auth.user.id)
          .single();

        if (userError) throw userError;

        setRoleName(userData.user_role?.name ?? null);

        // Cargar datos según el rol
        const {
          initialValues,
          countries,
          roles,
          categories,
          professions,
        } = // Cambiado de solutions a categories
          await fetchProfileFormData(auth.user.id);

        let professionName = '';
        if (initialValues.profession_id) {
          const { data: profession } = await supabase
            .from('it_professions')
            .select('profession_name')
            .eq('id', initialValues.profession_id)
            .single();
          professionName = profession?.profession_name || '';
        }

        // Filtrar roles y establecer valores iniciales
        const filteredRoles = roles.filter((role) => role.name !== 'admin');

        setInitialValues({
          ...initialValues,
          role_id: userData.role_id,
          profession: professionName,
        });
        setCountries(countries);
        setRoles(filteredRoles);
        setCategories(categories); // Cambiado de setSolutions a setCategories
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
    categories, // Cambiado de solutions a categories
    professions,
    loading,
    error,
    roleName,
  };
}
