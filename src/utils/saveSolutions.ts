import { supabase } from '@/utils/supabase/browserClient';
import type { PostgrestError } from '@supabase/supabase-js';

type ExistingSolution = {
  id: string;
  solution_id: string;
  is_active: boolean;
  description_solution: string;
};

type SupabaseResponse = {
  error: PostgrestError | null;
};

type SaveCustomerSolutionsParams = {
  user_id: string;
  selectedSolutions: string[]; // ✅ selección única permitida
  description: string;
};

export async function saveCustomerSolutions({
  user_id,
  selectedSolutions,
  description,
}: SaveCustomerSolutionsParams): Promise<string> {
  const { data: customerRow, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user_id)
    .single();

  if (customerError || !customerRow) {
    throw new Error('Customer not found');
  }

  const customer_id = customerRow.id;

  const { data: allCustomerSolutionsRaw, error: solutionError } = await supabase
    .from('contracted_solutions')
    .select('id, solution_id, is_active, description_solution')
    .eq('customer_id', customer_id);

  if (solutionError) {
    throw new Error('Error fetching existing solutions');
  }

  const allCustomerSolutions: ExistingSolution[] =
    allCustomerSolutionsRaw?.map((s) => ({
      id: s.id,
      solution_id: s.solution_id,
      is_active: s.is_active ?? false,
      description_solution: s.description_solution ?? '',
    })) ?? [];

  // Agrupar por solution_id
  const existingSolutionsMap = new Map<string, ExistingSolution[]>();
  for (const sol of allCustomerSolutions) {
    const list = existingSolutionsMap.get(sol.solution_id) ?? [];
    list.push(sol);
    existingSolutionsMap.set(sol.solution_id, list);
  }

  const [solution_id] = selectedSolutions;
  const existingSolutions = existingSolutionsMap.get(solution_id) || [];

  const operations: Promise<SupabaseResponse>[] = [];

  const existingWithSameDesc = existingSolutions.find(
    (s) => s.description_solution === description
  );

  if (existingWithSameDesc) {
    // ✅ Reactivar si ya existe
    operations.push(
      supabase
        .from('contracted_solutions')
        .update({
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingWithSameDesc.id)
        .then(({ error }) => ({ error })) as Promise<SupabaseResponse>
    );
  } else {
    // ✅ Crear nueva entrada activa con descripción distinta
    operations.push(
      supabase
        .from('contracted_solutions')
        .insert({
          customer_id,
          solution_id,
          description_solution: description,
          is_active: true,
          contract_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => ({ error })) as Promise<SupabaseResponse>
    );
  }

  const results = await Promise.all(operations);
  const hasErrors = results.some((r) => r.error);

  if (hasErrors) {
    const errors = results.filter((r) => r.error).map((r) => r.error);
    console.error('Errors in saveCustomerSolutions:', errors);
    throw new Error('Failed to save some solutions');
  }

  return customer_id;
}
