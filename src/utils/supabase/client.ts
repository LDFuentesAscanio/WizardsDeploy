'use client';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

// Cliente del navegador
export const supabase = createPagesBrowserClient<Database>();

// Cliente del servidor
export const createServerClient = () =>
  createServerComponentClient<Database>({
    cookies,
  });
