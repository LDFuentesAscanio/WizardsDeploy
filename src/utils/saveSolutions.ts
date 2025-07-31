import { supabase } from '@/utils/supabase/browserClient';

type ExistingSolution = {
  id: string;
  solution_id: string;
  is_active: boolean;
  description_solution: string;
};

export async function saveCustomerSolutions({
  user_id,
  selectedSolutions,
  description,
}: {
  user_id: string;
  selectedSolutions: string[];
  description: string;
}) {
  // 1. Obtener el ID del cliente
  const { data: customerRow } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user_id)
    .single();

  if (!customerRow) throw new Error('Customer not found');
  const customer_id = customerRow.id;

  // 2. Obtener todas las soluciones contratadas con sus descripciones
  const { data: allCustomerSolutions } = await supabase
    .from('contracted_solutions')
    .select('id, solution_id, is_active, description_solution')
    .eq('customer_id', customer_id);

  // 3. Preparar operaciones batch
  const operations = [];

  // 4. Clasificar soluciones existentes
  const existingSolutionsMap = new Map<string, ExistingSolution[]>();

  allCustomerSolutions?.forEach((sol) => {
    if (!existingSolutionsMap.has(sol.solution_id)) {
      existingSolutionsMap.set(sol.solution_id, []);
    }
    existingSolutionsMap.get(sol.solution_id)?.push({
      id: sol.id,
      solution_id: sol.solution_id,
      is_active: sol.is_active ?? false, // Valor por defecto false si es null
      description_solution: sol.description_solution ?? '', // Cadena vacía si es null
    });
  });

  // 5. Procesar cada solución seleccionada
  for (const solution_id of selectedSolutions) {
    const existingSolutions = existingSolutionsMap.get(solution_id) || [];

    // Buscar si existe una solución con la misma descripción
    const existingWithSameDesc = existingSolutions.find(
      (s) => s.description_solution === description
    );

    if (existingWithSameDesc) {
      // Actualizar solución existente con misma descripción
      operations.push(
        supabase
          .from('contracted_solutions')
          .update({
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingWithSameDesc.id)
      );
    } else {
      // Insertar nueva solución (aunque tenga mismo solution_id pero distinta descripción)
      operations.push(
        supabase.from('contracted_solutions').insert({
          customer_id,
          solution_id,
          description_solution: description,
          is_active: true,
          contract_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      );
    }
  }

  // 6. Marcar soluciones no seleccionadas como inactivas
  const selectedSolutionIds = [...new Set(selectedSolutions)];

  if (allCustomerSolutions && allCustomerSolutions.length > 0) {
    for (const existingSol of allCustomerSolutions) {
      if (!selectedSolutionIds.includes(existingSol.solution_id)) {
        operations.push(
          supabase
            .from('contracted_solutions')
            .update({
              is_active: false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingSol.id)
        );
      }
    }
  }

  // 7. Ejecutar todas las operaciones
  const results = await Promise.all(operations);
  const hasErrors = results.some((result) => result.error);

  if (hasErrors) {
    const errors = results
      .filter((result) => result.error)
      .map((result) => result.error);
    console.error('Errors in saveCustomerSolutions:', errors);
    throw new Error('Failed to save some solutions');
  }

  return customer_id;
}
