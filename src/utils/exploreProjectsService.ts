'use client';

import { supabase } from '@/utils/supabase/browserClient';
import type { Tables } from '@/types/supabase';

export type Project = Tables<'it_projects'>;

export type ExploreOfferCard = {
  id: string; // contracted_solutions.id
  project_id: string;
  project_name: string;
  project_description: string | null;
  project_status: Project['status'] | null;
  category_name: string | null;
  subcategory_name: string | null;
  description_solution: string | null;
};

export async function fetchExploreOffers(): Promise<ExploreOfferCard[]> {
  const { data, error } = await supabase
    .from('contracted_solutions')
    .select(
      `
      id,
      description_solution,
      is_active,
      it_projects:it_projects_id (
        id,
        project_name,
        description,
        status
      ),
      subcategories:subcategory_id (
        name,
        categories:category_id (name)
      )
    `
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const rows =
    (data as unknown as Array<{
      id: string;
      description_solution: string | null;
      is_active: boolean | null;
      it_projects: {
        id: string;
        project_name: string;
        description: string | null;
        status: Project['status'] | null;
      } | null;
      subcategories: {
        name: string | null;
        categories: { name: string | null } | null;
      } | null;
    }>) ?? [];

  return rows
    .filter((r) => !!r.it_projects)
    .map((r) => ({
      id: r.id,
      project_id: r.it_projects!.id,
      project_name: r.it_projects!.project_name,
      project_description: r.it_projects!.description ?? null,
      project_status: r.it_projects!.status ?? null,
      category_name: r.subcategories?.categories?.name ?? null,
      subcategory_name: r.subcategories?.name ?? null,
      description_solution: r.description_solution ?? null,
    }));
}
