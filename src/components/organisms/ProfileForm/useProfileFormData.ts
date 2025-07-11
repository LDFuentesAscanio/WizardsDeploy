'use client';
import { useEffect, useState } from 'react';
import { fetchProfileFormData } from './helpers';
import { ProfileFormValues, Country, Role } from './types';
import { supabase } from '@/utils/supabase/client';

export function useProfileFormData() {
  const [initialValues, setInitialValues] = useState<ProfileFormValues | null>(
    null
  );
  const [countries, setCountries] = useState<Country[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        const user = auth?.user;
        if (!user) throw new Error('No user found');

        const { initialValues, countries, roles } = await fetchProfileFormData(
          user.id
        );
        const filteredRoles = roles.filter((role) => role.name !== 'admin');

        setInitialValues(initialValues);
        setCountries(countries);
        setRoles(filteredRoles);
      } catch (err) {
        console.error('❌ Error loading profile form:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { initialValues, countries, roles, loading };
}
