import { TablesInsert, Enums } from '@/types/supabase'; // Ajustá el path si lo exportás desde otro lado

export type CustomerInsert = TablesInsert<'customers'>;
export type UserInsert = TablesInsert<'users'>;
export type ExpertInsert = TablesInsert<'experts'>; // Nuevo
export type ExpertMediaInsert = TablesInsert<'expert_media'>; // Nuevo
export type ExpertiseInsert = TablesInsert<'expert_expertise'>; // Cambiado de user_expertise
export type SkillInsert = TablesInsert<'skills'>;
export type ToolInsert = TablesInsert<'tools'>;
export type ExpertDocumentInsert = TablesInsert<'expert_documents'>; // Nuevo
export type ContractedSolutionInsert = TablesInsert<'contracted_solutions'>;

export type ExperienceTimeEnum = Enums<'experience_time'>;
