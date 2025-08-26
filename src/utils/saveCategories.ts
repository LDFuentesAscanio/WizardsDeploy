import { supabase } from '@/utils/supabase/browserClient';
import type { PostgrestError } from '@supabase/supabase-js';

export type SaveCustomerCategoriesParams = {
  user_id: string;
  projectId: string; // ← obligatorio ahora
  selectedCategories: string[]; // ← contiene 1 subcategory_id
  description: string;
};

type SupabaseResponse = { error: PostgrestError | null };

/**
 * Inserta/activa una oferta (contracted_solutions) asociada a:
 *   it_projects_id + subcategory_id + description_solution
 * Devuelve el customer_id del dueño del project para compatibilidad con llamadas previas.
 */
export async function saveCustomerCategories({
  user_id,
  projectId,
  selectedCategories,
  description,
}: SaveCustomerCategoriesParams): Promise<string> {
  if (!projectId) throw new Error('Project is required');
  if (!selectedCategories?.length) throw new Error('Subcategory is required');
  const subcategory_id = selectedCategories[0];

  // 1) Obtener customer_id del usuario
  const { data: customerRow, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user_id)
    .maybeSingle();

  if (customerError || !customerRow?.id) {
    throw new Error('Customer not found for this user');
  }
  const customer_id = customerRow.id;

  // 2) Validar que el proyecto pertenezca a este customer
  const { data: projectRow, error: projErr } = await supabase
    .from('it_projects')
    .select('id, customer_id')
    .eq('id', projectId)
    .maybeSingle();

  if (projErr) throw projErr;
  if (!projectRow?.id || projectRow.customer_id !== customer_id) {
    throw new Error('Project does not belong to current customer');
  }

  // 3) ¿Existe una fila con misma combinación y misma descripción?
  const { data: existingRow, error: existErr } = await supabase
    .from('contracted_solutions')
    .select('id, is_active')
    .eq('it_projects_id', projectId)
    .eq('subcategory_id', subcategory_id)
    .eq('description_solution', description)
    .maybeSingle();

  if (existErr && existErr.code !== 'PGRST116') throw existErr;

  let op: PromiseLike<SupabaseResponse>;

  if (existingRow?.id) {
    // Reactivar si estaba inactiva
    op = supabase
      .from('contracted_solutions')
      .update({
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingRow.id)
      .then(({ error }): SupabaseResponse => ({ error }));
  } else {
    // Crear nueva
    op = supabase
      .from('contracted_solutions')
      .insert({
        it_projects_id: projectId,
        subcategory_id,
        description_solution: description,
        is_active: true,
        contract_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .then(({ error }): SupabaseResponse => ({ error }));
  }

  const { error } = await op;
  if (error) {
    console.error('Error in saveCustomerCategories:', error);
    throw new Error('Failed to save the offer');
  }

  // ⚠️ Compatibilidad: algunos llamados antiguos esperaban customer_id
  return customer_id;
}
