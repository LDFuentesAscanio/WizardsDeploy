'use client';

import { supabase } from '@/utils/supabase/browserClient';
import type { Tables } from '@/types/supabase';

// Tipos base de tus tablas
type ExpertMediaRow = Tables<'expert_media'>;

// Estructura que consumirá tu UI
export type ExpertCardData = {
  id: string;
  user_id: string;
  profession: string; // viene de it_professions.profession_name
  profession_category: string | null; // it_professions.category
  bio: string | null;
  skills: string[]; // skills.skill_name[]
  tools: string[]; // tools.tool_name[]
  expertises: string[]; // nombres de platforms asociados (opcional)
  avatarUrl: string | null; // expert_media (type='avatar')
  created_at: string | null;
  is_currently_working: boolean | null;
};

// Resultado tipado del SELECT con embeddings
type ExpertSelect = {
  id: string;
  user_id: string;
  bio: string | null;
  created_at: string | null;
  is_currently_working: boolean | null;
  // join a it_professions
  profession: {
    id: string;
    profession_name: string;
    category: string | null;
  } | null;
  // hijos 1:N
  skills: { skill_name: string }[] | null;
  tools: { tool_name: string }[] | null;
};

export async function fetchExperts(): Promise<ExpertCardData[]> {
  // 1) expertos + profesión + skills + tools
  const { data, error } = await supabase
    .from('experts')
    .select(
      `
      id,
      user_id,
      bio,
      created_at,
      is_currently_working,
      profession:profession_id (
        id,
        profession_name,
        category
      ),
      skills:skills (
        skill_name
      ),
      tools:tools (
        tool_name
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) throw error;

  const experts = (data as unknown as ExpertSelect[]) ?? [];
  if (!experts.length) return [];

  const ids = experts.map((e) => e.id);

  // 2) media (avatar)
  const { data: media, error: mErr } = await supabase
    .from('expert_media')
    .select('expert_id, url_storage, type')
    .in('expert_id', ids)
    .eq('type', 'avatar');

  if (mErr) throw mErr;

  const avatarMap = new Map<string, string>();
  (media as ExpertMediaRow[] | null)?.forEach((m) => {
    if (m.url_storage) avatarMap.set(m.expert_id, m.url_storage);
  });

  // 3) expertises (plataformas) → opcional
  const { data: exps, error: exErr } = await supabase
    .from('expert_expertise')
    .select('expert_id, platform:platform_id (name)')
    .in('expert_id', ids);

  if (exErr) throw exErr;

  const expMap = new Map<string, string[]>();
  (
    exps as
      | { expert_id: string; platform: { name: string | null } | null }[]
      | null
  )?.forEach((row) => {
    const arr = expMap.get(row.expert_id) ?? [];
    const name = row.platform?.name ?? null;
    if (name) arr.push(name);
    expMap.set(row.expert_id, arr);
  });

  // 4) map a la forma que usa la UI
  return experts.map((e) => ({
    id: e.id,
    user_id: e.user_id,
    profession: e.profession?.profession_name ?? '—',
    profession_category: e.profession?.category ?? null,
    bio: e.bio,
    skills: (e.skills ?? []).map((s) => s.skill_name),
    tools: (e.tools ?? []).map((t) => t.tool_name),
    expertises: expMap.get(e.id) ?? [],
    avatarUrl: avatarMap.get(e.id) ?? null,
    created_at: e.created_at,
    is_currently_working: e.is_currently_working ?? null,
  }));
}
