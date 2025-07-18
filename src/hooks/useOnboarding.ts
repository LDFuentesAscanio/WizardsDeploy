'use client';
//External libraries
import { useState } from 'react';
import { useRouter } from 'next/navigation';
//Utilities
import { supabase } from '@/utils/supabase/client';
import { showError } from '@/utils/toastService';

interface FormValues {
  first_name: string;
  last_name: string;
  role: string;
}

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const saveUserProfile = async (values: FormValues) => {
    console.log('🧪 Role recibido en el submit:', values.role);
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
      const normalizedRole =
        values.role.charAt(0).toUpperCase() +
        values.role.slice(1).toLowerCase();
      // 2️⃣ Obtiene el role_id para "customer" o "expert"
      const { data, error: roleError } = await supabase
        .from('user_role')
        .select('id')
        .eq('name', normalizedRole)
        .limit(1); // <--- el cambio

      const roleData = data?.[0]; // <-- accedemos al primer resultado

      if (roleError) console.error('❌ Supabase role error:', roleError);
      if (!roleData)
        console.warn('⚠️ No se encontró role con:', normalizedRole);

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
        console.error('❌ Error saving profile:', error);
        showError('Error saving profile');
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
