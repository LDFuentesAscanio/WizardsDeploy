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

type Option = { value: string; label: string };

export function useProfileFormData() {
  const [initialValues, setInitialValues] = useState<ProfileFormValues | null>(
    null
  );
  const [countries, setCountries] = useState<Country[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [professions, setProfessions] = useState<ITProfession[]>([]);
  const [platforms, setPlatforms] = useState<Option[]>([]);
  const [roleName, setRoleName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const { data: auth, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!auth?.user) throw new Error('No user found');

        // Obtener rol del usuario
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role_id, user_role:role_id(name)')
          .eq('id', auth.user.id)
          .single();
        if (userError) throw userError;

        setRoleName(userData.user_role?.name ?? null);

        // Cargar datos del formulario (helper centraliza la mayor parte)
        const {
          initialValues: iv,
          countries,
          roles,
          categories,
          professions,
        } = await fetchProfileFormData(auth.user.id);

        // Nombre de la profesión si aplica
        let professionName = '';
        if (iv.profession_id) {
          const { data: profession } = await supabase
            .from('it_professions')
            .select('profession_name')
            .eq('id', iv.profession_id)
            .single();
          professionName = profession?.profession_name || '';
        }

        // Filtrar roles (sin admin)
        const filteredRoles = roles.filter((r) => r.name !== 'admin');

        setInitialValues({
          ...iv,
          role_id: userData.role_id,
          profession: professionName,
        });
        setCountries(countries);
        setRoles(filteredRoles);
        setCategories(categories);
        setProfessions(professions);

        // 🔽 Cargar plataformas (options para ExpertiseSection)
        const { data: platformsRows, error: platformsErr } = await supabase
          .from('platforms')
          .select('id, name');
        if (platformsErr) throw platformsErr;

        const platformOptions: Option[] = (platformsRows ?? []).map(
          (p: { id: string; name: string }) => ({
            value: p.id,
            label: p.name,
          })
        );
        setPlatforms(platformOptions);
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
    categories,
    professions,
    platforms,
    loading,
    error,
    roleName,
  };
}
