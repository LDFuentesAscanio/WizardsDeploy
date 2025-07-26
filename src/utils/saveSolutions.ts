import { supabase } from '@/utils/supabase/browserClient';

export async function saveCustomerSolutions({
  user_id,
  selectedSolutions,
  description,
}: {
  user_id: string;
  selectedSolutions: string[];
  description: string;
}) {
  const { data: customerRow } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user_id)
    .single();

  if (!customerRow) throw new Error('Customer not found');

  const customer_id = customerRow.id;

  await supabase
    .from('contracted_solutions')
    .delete()
    .eq('customer_id', customer_id);

  if (selectedSolutions.length > 0) {
    await supabase.from('contracted_solutions').insert(
      selectedSolutions.map((solution_id) => ({
        customer_id,
        solution_id,
        description_solution: description,
        is_active: true,
        contract_date: new Date().toISOString(),
      }))
    );
  }

  return customer_id;
}
