import { TablesInsert, Enums } from '@/types/supabase'; // Ajustá el path si lo exportás desde otro lado

export type CustomerInsert = TablesInsert<'customers'>;
export type UserInsert = TablesInsert<'users'>;
export type AboutInsert = TablesInsert<'about'>;
export type UserMediaInsert = TablesInsert<'user_media'>;
export type ExpertiseInsert = TablesInsert<'user_expertise'>;
export type SkillInsert = TablesInsert<'skills'>;
export type ToolInsert = TablesInsert<'tools'>;
export type ContractedSolutionInsert = TablesInsert<'contracted_solutions'>;

export type ExperienceTimeEnum = Enums<'experience_time'>;
