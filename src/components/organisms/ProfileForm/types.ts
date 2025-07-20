// Interfaces base compartidas
export interface CustomerSharedFields {
  company_name: string;
  actual_role: string;
  email: string;
  looking_for_expert: boolean;
  selected_solutions: string[];
  solution_description: string;
  accepted_privacy_policy: boolean;
  accepted_terms_conditions: boolean;
}

// Customer (para base de datos o API)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Customer extends CustomerSharedFields {}

// ProfileFormValues (para formulario completo del perfil)
export interface ProfileFormValues extends CustomerSharedFields {
  first_name: string;
  last_name: string;
  country_id: string;
  role_id: string;
  linkedin_profile?: string;
  other_link?: string;
  bio: string;
  profession: string;
  expertise: {
    platform_id: string;
    rating: number | string;
    experience_time: string;
  }[];
  skills: string[];
  tools: string[];
  photo_url?: string;
  cv_url?: string;
  filename?: string;
}

// Otros modelos auxiliares
export interface Platform {
  id: string;
  name: string;
}

export interface Country {
  id: string;
  name: string;
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
}
