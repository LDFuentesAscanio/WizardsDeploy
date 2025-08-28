// utils/projectsService.ts
'use client';

import { supabase } from '@/utils/supabase/browserClient';
import type { Tables } from '@/types/supabase';

export type Project = Tables<'it_projects'>;

export type ContractedRow = {
  id: string;
  subcategory_id: string | null;
  it_projects_id: string | null;
  description_solution: string | null;
  is_active: boolean | null;
  contract_date: string | null;
  subcategories: {
    name: string | null; // subcategory name
    category_id: string | null;
    categories: { name: string | null } | null; // category name
  } | null;
};

export type ExpertProjectItem = {
  project: {
    id: string;
    project_name: string;
    description: string | null;
    status: Project['status'];
  };
  offer: {
    id: string;
    description_solution: string | null;
    category_name: string | null;
    subcategory_name: string | null;
  };
};

export async function getUserAndRole() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error('Not authenticated');

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role_id, user_role:role_id(name)')
    .eq('id', user.id)
    .single();
  if (profileError) throw profileError;

  const role =
    (profile?.user_role as { name?: string } | null)?.name?.toLowerCase() ??
    null;

  return { userId: user.id, role };
}

export async function getCustomerIdByUser(userId: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}

/**
 * Customer → solo sus proyectos
 * Admin → todos
 * Expert → [] (la vista de experto usa fetchProjectsForExpert)
 */
export async function fetchProjectsByRole(
  userId: string,
  role: string | null
): Promise<Project[]> {
  if (!role) return [];

  if (role === 'customer') {
    const customerId = await getCustomerIdByUser(userId);
    if (!customerId) return [];
    const { data, error } = await supabase
      .from('it_projects')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as Project[]) ?? [];
  }

  if (role === 'admin') {
    const { data, error } = await supabase
      .from('it_projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as Project[]) ?? [];
  }

  // expert → la vista usa fetchProjectsForExpert
  return [];
}

/**
 * Expert → por ahora no hay asignación explícita.
 * Mostramos proyectos que tienen ofertas activas (read-only).
 * Nota: _userId intencionalmente no usado (para futuros filtros),
 * se mantiene con prefijo "_" para evitar warning de ESLint.
 */
export async function fetchProjectsForExpert(
  userId: string
): Promise<ExpertProjectItem[]> {
  // Reservado para cuando haya asignación explícita expert<->project.
  // Silencia @typescript-eslint/no-unused-vars sin afectar el runtime.
  void userId;

  const { data, error } = await supabase
    .from('contracted_solutions')
    .select(
      `
      id,
      description_solution,
      is_active,
      subcategories:subcategory_id (
        name,
        categories:category_id (name)
      ),
      it_projects:it_projects_id (
        id,
        project_name,
        description,
        status
      )
    `
    )
    .eq('is_active', true);

  if (error) throw error;

  const rows =
    (data as unknown as Array<{
      id: string;
      description_solution: string | null;
      is_active: boolean | null;
      subcategories: {
        name: string | null;
        categories: { name: string | null } | null;
      } | null;
      it_projects: {
        id: string;
        project_name: string;
        description: string | null;
        status: Project['status'];
      } | null;
    }>) ?? [];

  return rows
    .filter((r) => !!r.it_projects)
    .map((r) => ({
      project: {
        id: r.it_projects!.id,
        project_name: r.it_projects!.project_name,
        description: r.it_projects!.description,
        status: r.it_projects!.status,
      },
      offer: {
        id: r.id,
        description_solution: r.description_solution,
        category_name: r.subcategories?.categories?.name ?? null,
        subcategory_name: r.subcategories?.name ?? null,
      },
    }));
}

export async function updateProject(
  projectId: string,
  updates: Partial<Project>
) {
  const { error } = await supabase
    .from('it_projects')
    .update({ ...updates }) // no mandamos "id" en el update
    .eq('id', projectId);
  if (error) throw error;
}

export async function deleteProject(projectId: string) {
  // 1) borrar ofertas hijas (por FK)
  const { error: delOffersErr } = await supabase
    .from('contracted_solutions')
    .delete()
    .eq('it_projects_id', projectId);
  if (delOffersErr) throw delOffersErr;

  // 2) borrar proyecto
  const { error } = await supabase
    .from('it_projects')
    .delete()
    .eq('id', projectId);
  if (error) throw error;
}

export async function fetchProjectOffers(
  projectId: string
): Promise<ContractedRow[]> {
  const { data, error } = await supabase
    .from('contracted_solutions')
    .select(
      `
      id,
      subcategory_id,
      it_projects_id,
      description_solution,
      is_active,
      contract_date,
      subcategories:subcategory_id (
        name,
        category_id,
        categories:category_id (name)
      )
    `
    )
    .eq('it_projects_id', projectId)
    .eq('is_active', true);
  if (error) throw error;
  return (data as ContractedRow[]) || [];
}

export async function updateOffer(
  offerId: string,
  updates: {
    subcategory_id?: string | null;
    description_solution?: string | null;
  }
) {
  // Solo enviamos campos presentes y actualizamos updated_at
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.subcategory_id !== undefined) {
    payload.subcategory_id = updates.subcategory_id;
  }
  if (updates.description_solution !== undefined) {
    payload.description_solution = updates.description_solution;
  }

  const { error } = await supabase
    .from('contracted_solutions')
    .update(payload)
    .eq('id', offerId);

  if (error) throw error;
}

export async function deactivateOffer(offerId: string) {
  const { error } = await supabase
    .from('contracted_solutions')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', offerId);
  if (error) throw error;
}
