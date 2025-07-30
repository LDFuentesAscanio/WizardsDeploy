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
  profession: string;
  expertise: Expertise[];
  skills: string[];
  tools: string[];
  cv_url?: string;
  filename?: string;
}

// Tipos específicos para Customer
export interface CustomerSpecific {
  company_name: string;
  actual_role: string;
  solution_description: string;
  selected_solutions: string[];
  looking_for_expert: boolean;
  accepted_privacy_policy: boolean;
  accepted_terms_conditions: boolean;
  description?: string;
  company_logo_url: string;
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

export interface About {
  bio: string | null;
  profession: string | null;
}

export interface Solution {
  id: string;
  name: string;
  description?: string;
}

export type UserMedia = {
  url_storage: string;
};

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

export interface CustomerResponse extends CustomerSpecific {
  user_id: string;
  email: string;
}

// Type Guards mejorados
export function isCustomerProfile(
  values: ProfileFormValues
): values is BaseProfile & CustomerSpecific {
  return (
    values.role_id === 'customer_role_id' &&
    values.company_name !== undefined &&
    values.actual_role !== undefined
  );
}

export function isExpertProfile(
  values: ProfileFormValues
): values is BaseProfile & ExpertSpecific {
  return (
    values.role_id === 'expert_role_id' &&
    values.bio !== undefined &&
    values.profession !== undefined
  );
}
