// src/utils/saveCategories.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { Database, TablesInsert } from '@/types/supabase';

type NewSolution = TablesInsert<'contracted_solutions'>;
type NewSkill = TablesInsert<'contracted_skills'>;
type NewTool = TablesInsert<'contracted_tools'>;

export async function saveCustomerCategories(params: {
  supabase: SupabaseClient<Database>;
  userId: string;
  projectId: string;
  subcategoryId: string;
  description: string;
  contracted_profession_id: string;
  contracted_expertise_id: string;
  // ← skills solo con nombre
  skills: { skill_name: string }[];
  tools: { tool_name: string }[];
}) {
  const {
    supabase,
    userId,
    projectId,
    subcategoryId,
    description,
    contracted_profession_id,
    contracted_expertise_id,
    skills,
    tools,
  } = params;

  // 1) Validar que el proyecto pertenezca al customer autenticado
  const { data: project, error: projectErr } = await supabase
    .from('it_projects')
    .select('id, customer_id, customers(user_id)')
    .eq('id', projectId)
    .maybeSingle();

  if (projectErr) throw projectErr;
  if (!project?.customers || project.customers.user_id !== userId) {
    throw new Error('You are not allowed to publish offers for this project.');
  }

  // 2) Insertar contracted_solution
  const newSolution: NewSolution = {
    it_projects_id: projectId,
    subcategory_id: subcategoryId,
    description_solution: description,
    is_active: true,
    contracted_profession_id,
    contracted_expertise_id,
  };

  const { data: inserted, error: insertErr } = await supabase
    .from('contracted_solutions')
    .insert(newSolution)
    .select('id')
    .maybeSingle();

  if (insertErr) throw insertErr;
  if (!inserted?.id) throw new Error('Failed to create contracted_solution.');

  const contracted_solutions_id = inserted.id;

  // 3) Insertar skills (solo nombre; level queda null)
  if (skills?.length) {
    const rows: NewSkill[] = skills.map((s) => ({
      skill_name: s.skill_name,
      // skill_level: null, // opcional; al no enviarlo queda NULL
      contracted_solutions_id,
    }));
    const { error: skillErr } = await supabase
      .from('contracted_skills')
      .insert(rows);
    if (skillErr) throw skillErr;
  }

  // 4) Insertar tools
  if (tools?.length) {
    const rows: NewTool[] = tools.map((t) => ({
      tool_name: t.tool_name,
      contracted_solutions_id,
    }));
    const { error: toolErr } = await supabase
      .from('contracted_tools')
      .insert(rows);
    if (toolErr) throw toolErr;
  }

  return { id: contracted_solutions_id };
}
