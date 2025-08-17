import { ExperienceTimeEnum } from '@/supabase-types';

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
  profession: string;
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

// Tipos específicos para Customer
export interface CustomerSpecific {
  company_name: string;
  job_title: string;
  email: string;
  accepted_privacy_policy: boolean;
  accepted_terms_conditions: boolean;
  description?: string;
  company_url?: string;
  company_logo_url: string;
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
  rating: number;
  experience_time: ExperienceTimeEnum;
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

export interface Platform {
  id: string;
  name: string;
}

export interface ITProfession {
  id: string;
  profession_name: string;
  category?: string;
  description?: string;
}

// Tipos para las respuestas de Supabase
export interface SkillResponse {
  id: string;
  skill_name: string;
  skill_level?: number;
  expert_id: string;
  created_at: string;
  updated_at: string;
}

export interface ToolResponse {
  id: string;
  tool_name: string;
  expert_id: string;
  created_at: string;
  updated_at: string;
}

export interface ExpertiseResponse {
  id: string;
  platform_id: string;
  rating: number;
  experience_time: ExperienceTimeEnum;
  expert_id: string;
}

export interface ExpertMedia {
  id?: string;
  filename?: string;
  url_storage: string;
  expert_id?: string;
  type?: 'avatar' | 'company_logo';
  created_at?: string;
  updated_at?: string;
}

export interface CustomerMedia {
  id?: string;
  filename?: string;
  url_storage: string;
  customer_id?: string;
  type?: 'avatar' | 'company_logo';
  created_at?: string;
  updated_at?: string;
}

export interface ExpertDocument {
  id?: string;
  filename: string;
  url_storage?: string;
  expert_id?: string;
  created_at?: string;
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
  user_id?: string;
  company_name: string;
  job_title: string;
  email: string;
  accepted_privacy_policy: boolean;
  accepted_terms_conditions: boolean;
  description?: string;
  company_url?: string;
}

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
    skills: { skill_name: string }[];
    tools: { tool_name: string }[];
    expertises: { platform_id: string }[];
    it_professions: {
      profession_name: string | null;
    } | null;
  } | null;
  customers: {
    job_title: string;
    description: string | null;
    company_name: string;
    company_url: string | null;
  } | null;
}

// Type Guards
export function isCustomerProfile(
  values: ProfileFormValues
): values is BaseProfile & CustomerSpecific {
  const CUSTOMER_ROLE_ID = 'customer_role_id';
  return (
    values.role_id === CUSTOMER_ROLE_ID &&
    !!values.company_name &&
    !!values.job_title
  );
}

export function isExpertProfile(
  values: ProfileFormValues
): values is BaseProfile & ExpertSpecific {
  const EXPERT_ROLE_ID = 'expert_role_id';
  return (
    values.role_id === EXPERT_ROLE_ID && !!values.bio && !!values.profession
  );
}
