'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

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
      // 1️⃣ Obtiene usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert('No user found');
        return;
      }

      // 2️⃣ Obtiene el role_id para "customer" o "expert"
      const { data: roleData, error: roleError } = await supabase
        .from('user_role')
        .select('id')
        .eq('name', values.role)
        .single();

      if (roleError || !roleData) {
        alert('Invalid role selected');
        return;
      }

      // 3️⃣ Inserta/actualiza datos en la tabla 'users'
      const { error } = await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        first_name: values.first_name,
        last_name: values.last_name,
        role_id: roleData.id,
      });

      if (error) {
        alert(`Error saving profile: ${error.message}`);
      } else {
        // Redirige al Dashboard
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    saveUserProfile,
    loading,
  };
}
