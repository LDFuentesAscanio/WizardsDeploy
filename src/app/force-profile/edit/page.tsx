'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import ProfileForm from '@/components/organisms/ProfileForm/ProfileForm';
import CustomerProfileForm from '@/components/organisms/ProfileForm/CustomerProfileForm';

export default function ForceProfilePage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('role_id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching role:', error);
        return;
      }

      const { data: roleData } = await supabase
        .from('user_role')
        .select('name')
        .eq('id', data.role_id)
        .single();

      setRole(roleData?.name);
      setLoading(false);
    };

    fetchRole();
  }, []);

  if (loading) return <p className="text-white">Loading...</p>;

  if (role === 'Expert') {
    return <ProfileForm />;
  }

  if (role === 'Customer') {
    return <CustomerProfileForm />;
  }

  return <p className="text-white">Unauthorized</p>;
}
