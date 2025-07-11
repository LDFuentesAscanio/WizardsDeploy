'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

interface Country {
  id: string;
  name: string;
  code: string;
}

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from('country')
        .select('id, name, code')
        .order('name', { ascending: true });

      if (!error && data) setCountries(data);
      setLoading(false);
    };

    fetchCountries();
  }, []);

  return { countries, loading };
}
