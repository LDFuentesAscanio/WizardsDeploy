export interface ProfileFormValues {
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
  company_name: string;
  actual_role: string;
  email: string;
}
export interface Customer {
  company_name: string;
  actual_role: string;
  email: string;
}

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
