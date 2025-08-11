// Tipos básicos para datos de experiencia
export interface Experience {
  platform: string;
  rating: number;
  experienceTime: string;
}

// Tipos para datos del dashboard principal
export interface DashboardData {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  profession: string;
  linkedin: string | null;
  otherLink: string | null;
  bio: string;
  skills: string[];
  tools: string[];
  experiences: Experience[];
  completion: number;
  missingFields: string[];
}

// Tipos para filas de Supabase
export interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  country_id: string | null;
  linkedin_profile: string | null;
  other_link: string | null;
  role_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpertRow {
  id: string;
  user_id: string;
  bio: string | null;
  profession_id: string | null;
  certified: boolean | null;
  is_currently_working: boolean | null;
  understand_subject_pp: boolean | null;
  anything_share_with_us: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerRow {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  email: string | null;
  description: string | null;
  company_url: string | null;
  accepted_privacy_policy: boolean;
  accepted_terms_conditions: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos para media
export interface ExpertMediaRow {
  id: string;
  expert_id: string;
  url_storage: string;
  filename: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerMediaRow {
  id: string;
  customer_id: string;
  url_storage: string;
  filename: string;
  type: string;
  created_at: string;
  updated_at: string;
}

// Tipos para documentos
export interface ExpertDocumentRow {
  id: string;
  expert_id: string;
  url_storage: string | null;
  filename: string;
  created_at: string;
}

// Tipos para el dashboard de cliente
export interface CustomerDashboardData {
  first_name: string;
  last_name: string;
  linkedin_profile: string | null;
  other_link: string | null;
  company_name: string;
  job_title: string;
  description: string;
  avatar?: string | null;
  company_logo?: string | null;
  solutions: string[];
}

// Tipos para soluciones contratadas
export type FrontendContractedSolution = {
  id: string;
  solution_id: string;
  customer_id: string;
  description_solution?: string | null;
  is_active: boolean;
  contract_date?: string | null;
  solutions: { name: string } | null;
};

// Tipos para profesiones
export interface ProfessionRow {
  id: string;
  profession_name: string;
  category: string | null;
  description: string | null;
}

// Tipos para habilidades y herramientas
export interface SkillRow {
  id: string;
  expert_id: string;
  user_id: string;
  skill_name: string;
  skill_level: number | null;
}

export interface ToolRow {
  id: string;
  expert_id: string;
  user_id: string;
  tool_name: string;
}

// Tipos para plataformas de experiencia
export interface PlatformRow {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// Tipos para experiencia de expertos
export interface ExpertiseRow {
  id: string;
  expert_id: string;
  platform_id: string;
  rating: number | null;
  experience_time: string | null;
}
