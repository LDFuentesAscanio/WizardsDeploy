'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export function AuthCheckClient({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace(`/auth?redirect=${window.location.pathname}`);
      } else {
        setChecking(false);
      }
    };

    checkSession();
  }, [router]);

  if (checking) return null;

  return <>{children}</>;
}
