import { supabase } from '@/utils/supabase/browserClient';

type SaveCustomerCategoriesParams = {
  user_id: string; // se mantiene por firma, no se usa en el insert
  projectId: string; // 🔴 requerido: it_projects_id
  selectedCategories: string[]; // aquí viene UN subcategory_id (tomamos el primero)
  description: string;
};

export async function saveCustomerCategories({
  user_id, // eslint-disable-line @typescript-eslint/no-unused-vars
  projectId,
  selectedCategories,
  description,
}: SaveCustomerCategoriesParams): Promise<string> {
  if (!projectId) throw new Error('Project is required');
  const [subcategory_id] = selectedCategories;
  if (!subcategory_id) throw new Error('Subcategory is required');

  // Buscar si ya existe una oferta con mismo proyecto + subcategoría
  const { data: existingRows, error: selErr } = await supabase
    .from('contracted_solutions')
    .select('id, subcategory_id, is_active, description_solution')
    .eq('it_projects_id', projectId)
    .eq('subcategory_id', subcategory_id);

  if (selErr) {
    throw new Error('Error fetching existing offers');
  }

  // ¿Existe una con la misma descripción? => reactivar
  const existingWithSameDesc = (existingRows ?? []).find(
    (r) => (r.description_solution ?? '') === (description ?? '')
  );

  if (existingWithSameDesc) {
    const { error } = await supabase
      .from('contracted_solutions')
      .update({
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingWithSameDesc.id);
    if (error) throw error;
    return projectId;
  }

  // Insertar nueva
  const { error: insErr } = await supabase.from('contracted_solutions').insert({
    it_projects_id: projectId,
    subcategory_id,
    description_solution: description,
    is_active: true,
    contract_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (insErr) throw insErr;

  return projectId;
}
