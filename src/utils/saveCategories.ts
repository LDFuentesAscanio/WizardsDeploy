import { supabase } from '@/utils/supabase/browserClient';
import type { PostgrestError } from '@supabase/supabase-js';

type ExistingCategory = {
  id: string;
  category_id: string;
  is_active: boolean;
  description_solution: string;
};

type SupabaseResponse = {
  error: PostgrestError | null;
};

type SaveCustomerCategoriesParams = {
  user_id: string;
  selectedCategories: string[];
  description: string;
};

export async function saveCustomerCategories({
  user_id,
  selectedCategories,
  description,
}: SaveCustomerCategoriesParams): Promise<string> {
  const { data: customerRow, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user_id)
    .single();

  if (customerError || !customerRow) {
    throw new Error('Customer not found');
  }

  const customer_id = customerRow.id;

  const { data: allCustomerCategoriesRaw, error: categoryError } =
    await supabase
      .from('contracted_solutions')
      .select('id, category_id, is_active, description_solution')
      .eq('customer_id', customer_id);

  if (categoryError) {
    throw new Error('Error fetching existing categories');
  }

  const allCustomerCategories: ExistingCategory[] =
    allCustomerCategoriesRaw?.map((s) => ({
      id: s.id,
      category_id: s.category_id,
      is_active: s.is_active ?? false,
      description_solution: s.description_solution ?? '',
    })) ?? [];

  const existingCategoriesMap = new Map<string, ExistingCategory[]>();
  for (const cat of allCustomerCategories) {
    const list = existingCategoriesMap.get(cat.category_id) ?? [];
    list.push(cat);
    existingCategoriesMap.set(cat.category_id, list);
  }

  const [category_id] = selectedCategories;
  const existingCategories = existingCategoriesMap.get(category_id) || [];

  const operations: Promise<SupabaseResponse>[] = [];

  const existingWithSameDesc = existingCategories.find(
    (s) => s.description_solution === description
  );

  if (existingWithSameDesc) {
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
    operations.push(
      supabase
        .from('contracted_solutions')
        .insert({
          customer_id,
          category_id,
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
    console.error('Errors in saveCustomerCategories:', errors);
    throw new Error('Failed to save some categories');
  }

  return customer_id;
}
