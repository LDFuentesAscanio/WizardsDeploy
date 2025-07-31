export interface Experience {
  platform: string;
  rating: number;
  experienceTime: string;
}

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

export interface UserRow {
  first_name: string;
  last_name: string;
  country_id: string | null;
  linkedin_profile: string | null;
  other_link: string | null;
}

export interface AboutRow {
  bio: string | null;
  profession: string | null;
}

export interface CustomerDashboardData {
  first_name: string;
  last_name: string;
  linkedin_profile: string | null;
  other_link: string | null;
  company_name: string;
  bio: string;
  avatar?: string | null;
  company_logo?: string | null;
  solutions: string[];
}

export type SupabaseContractedSolution = {
  id: string;
  solution_id: string;
  description_solution?: string | null;
  solutions: { name: string } | null;
};
