'use client';
//External libraries
import { useEffect, useState } from 'react';
//Validations, types and interfaces
import { ProfileFormValues, Country, Role, Solution } from './types';
//Utilities
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

  useEffect(() => {
    const load = async () => {
      try {
        const { data: auth, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        const user = auth?.user;
        if (!user) throw new Error('No user found');

        console.log('Fetching profile data for user:', user.id);
        const { initialValues, countries, roles, solutions } =
          await fetchProfileFormData(user.id);
        console.log('Data fetched:', {
          initialValues,
          countries,
          roles,
          solutions,
        });

        const filteredRoles = roles.filter((role) => role.name !== 'admin');

        setInitialValues(initialValues);
        setCountries(countries);
        setRoles(filteredRoles);
        setSolutions(solutions);
      } catch (err) {
        console.error('❌ Error loading profile form:', err);
        if (err instanceof Error) {
          console.error('Error details:', {
            message: err.message,
            stack: err.stack,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { initialValues, countries, roles, solutions, loading };
}
