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

export async function fetchProjectsByRole(
  userId: string,
  role: string | null
): Promise<Project[]> {
  let query = supabase.from('it_projects').select('*');

  if (role === 'customer') {
    const customerId = await getCustomerIdByUser(userId);
    if (customerId) query = query.eq('customer_id', customerId);
  }

  // admin → ve todos
  // expert → (pendiente) join con contracted_solutions si lo necesitas

  const { data, error } = await query;
  if (error) throw error;
  return (data as Project[]) || [];
}

export async function updateProject(
  projectId: string,
  updates: Partial<Project>
) {
  const { error } = await supabase
    .from('it_projects')
    .update({ ...updates, id: projectId })
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

export async function deactivateOffer(offerId: string) {
  const { error } = await supabase
    .from('contracted_solutions')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', offerId);
  if (error) throw error;
}
