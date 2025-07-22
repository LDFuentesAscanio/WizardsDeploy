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
  bio: string;
  company_logo?: string;
  solutions: string[];
}

export interface ContractedSolution {
  solution_id: string;
  solutions: { name: string }[] | null; // Ahora acepta array
}
