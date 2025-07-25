'use client';
//External libraries
import { useEffect, useState } from 'react';
//Utilities
import { supabase } from '@/utils/supabase/browserClient';

interface UserData {
  first_name: string;
  last_name: string;
  role_name: string;
}

export function useDashboardUser() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      type UserWithRole = {
        first_name: string;
        last_name: string;
        user_role: { name: string };
      };

      const { data, error } = await supabase
        .from('users')
        .select(
          `
          first_name,
          last_name,
          user_role:role_id (
            name
          )
        `
        )
        .eq('id', user.id)
        .single<UserWithRole>();

      if (error || !data) {
        console.error('Error fetching user data:', error);
        setLoading(false);
        return;
      }

      setUserData({
        first_name: data.first_name,
        last_name: data.last_name,
        role_name: data.user_role?.name ?? 'Unknown',
      });

      setLoading(false);
    };

    fetchUserData();
  }, []);

  return { userData, loading };
}
