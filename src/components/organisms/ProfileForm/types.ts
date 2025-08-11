import { ExperienceTimeEnum } from '@/supabase-types';
import { TablesInsert } from '@/types/supabase';

// Tipos base comunes a todos los usuarios
export interface BaseProfile {
  first_name: string;
  last_name: string;
  country_id: string;
  role_id: string | null;
  linkedin_profile?: string;
  other_link?: string;
  photo_url?: string;
  email?: string;
}

// Tipos específicos para Expert
export interface ExpertSpecific {
  bio: string;
  profession_id: string;
  profession: string; // Ahora es el nombre, no el ID
  certified: boolean;
  is_currently_working: boolean;
  anything_share_with_us?: string;
  understand_subject_pp: boolean;
  expertise: Expertise[];
  skills: string[];
  tools: string[];
  cv_url?: string;
  filename?: string;
}

export interface ITProfession {
  id: string;
  profession_name: string;
  category?: string;
  description?: string;
}

// Tipos específicos para Customer
export interface CustomerSpecific {
  company_name: string;
  actual_role: string; // job_title en la DB
  email: string;
  accepted_privacy_policy: boolean;
  accepted_terms_conditions: boolean;
  description?: string;
  company_url?: string;
  company_logo_url: string;
  solution_description: string;
  selected_solutions: string[];
  looking_for_expert: boolean;
}

// Tipo combinado que incluye TODOS los campos de forma segura
export type ProfileFormValues = BaseProfile &
  Partial<ExpertSpecific> &
  Partial<CustomerSpecific>;

// Tipos auxiliares
export interface Expertise {
  platform_id: string;
  rating: number | string;
  experience_time: ExperienceTimeEnum; // 👈 usar el enum correcto
}

export type SkillInsert = Omit<
  TablesInsert<'skills'>,
  'id' | 'created_at' | 'updated_at'
> & {
  created_at?: string;
  updated_at?: string;
};

export type ToolInsert = Omit<
  TablesInsert<'tools'>,
  'id' | 'created_at' | 'updated_at'
> & {
  created_at?: string;
  updated_at?: string;
};

export type ExpertInsert = Omit<
  TablesInsert<'experts'>,
  'id' | 'created_at' | 'updated_at'
> & {
  created_at?: string;
  updated_at?: string;
};

export interface Platform {
  id: string;
  name: string;
}

export interface Country {
  id: string;
  name: string;
  code?: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface Solution {
  id: string;
  name: string;
  description?: string;
}

export type UserMedia = {
  url_storage: string;
};

export interface ExpertMedia {
  id: string;
  filename: string;
  url_storage: string;
  expert_id: string;
  type: 'avatar' | 'company_logo';
  created_at: string;
  updated_at: string;
}

export interface ITProfession {
  id: string;
  profession_name: string;
  category?: string;
  description?: string;
}

export interface ExpertDocument {
  id: string;
  filename: string;
  url_storage?: string;
  expert_id: string;
}

export interface ExpertMedia {
  id: string;
  filename: string;
  url_storage: string;
  expert_id: string;
  type: 'avatar' | 'company_logo';
}

// Tipos para respuestas de Supabase
export type UserResponse = Pick<
  BaseProfile,
  | 'first_name'
  | 'last_name'
  | 'country_id'
  | 'role_id'
  | 'linkedin_profile'
  | 'other_link'
>;

export interface ExpertResponse {
  certified: boolean;
  anything_share_with_us?: string;
  understand_subject_pp: boolean;
  is_currently_working: boolean;
  bio?: string;
  profession_id: string;
}

export interface CustomerResponse {
  user_id: string;
  company_name: string;
  job_title: string;
  email: string;
  accepted_privacy_policy: boolean;
  accepted_terms_conditions: boolean;
  description?: string;
  company_url?: string;
}

// 📌 Tipo para la respuesta del hook useForceProfileCompletion
export interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  country_id: string | null;
  role_id: string | null;
  user_role: {
    name: string | null;
  } | null;
  experts: {
    bio: string | null;
    profession_id: string | null;
    it_professions: {
      profession_name: string | null;
    } | null;
  } | null;
  customers: {
    job_title: string | null;
    description: string | null;
  } | null;
}

// Type Guards mejorados
export function isCustomerProfile(
  values: ProfileFormValues
): values is BaseProfile & CustomerSpecific {
  const CUSTOMER_ROLE_ID = 'customer_role_id'; // Debería venir de una constante

  // Validación básica de rol
  if (values.role_id !== CUSTOMER_ROLE_ID) return false;

  // Validación de campos mínimos requeridos
  return !!values.company_name && !!values.actual_role;
}

export function isExpertProfile(
  values: ProfileFormValues
): values is BaseProfile & ExpertSpecific {
  const EXPERT_ROLE_ID = 'expert_role_id'; // Debería venir de una constante

  // Validación básica de rol
  if (values.role_id !== EXPERT_ROLE_ID) return false;

  // Validación de campos mínimos requeridos
  return !!values.bio && !!values.profession;
}
