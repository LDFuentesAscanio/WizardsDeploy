// utils/fetchDashboardData.ts
import { supabase } from '@/utils/supabase/browserClient';
import {
  DashboardData,
  UserRow,
  AboutRow,
} from '@/components/organisms/dashboard/types';

export async function fetchDashboardData(
  userId: string
): Promise<DashboardData> {
  const [
    { data: userData },
    { data: aboutData },
    { data: mediaData },
    { data: docData },
    { data: skillsData },
    { data: toolsData },
    { data: expertiseData },
    { data: platformsData },
  ] = await Promise.all([
    supabase
      .from('users')
      .select('first_name, last_name, country_id, linkedin_profile, other_link')
      .eq('id', userId)
      .single<UserRow>(),

    supabase
      .from('about')
      .select('profession, bio')
      .eq('user_id', userId)
      .maybeSingle<AboutRow>(),

    supabase
      .from('user_media')
      .select('url_storage')
      .eq('user_id', userId)
      .maybeSingle(),

    supabase
      .from('user_documents')
      .select('url_storage')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1),

    supabase.from('skills').select('skill_name').eq('user_id', userId),

    supabase.from('tools').select('tool_name').eq('user_id', userId),

    supabase
      .from('user_expertise')
      .select('platform_id, rating, experience_time')
      .eq('user_id', userId),

    supabase.from('platforms').select('id, name'),
  ]);

  const skills = skillsData?.map((s) => s.skill_name) ?? [];
  const tools = toolsData?.map((t) => t.tool_name) ?? [];

  const experiences =
    expertiseData?.map((exp) => {
      const platformName =
        platformsData?.find((p) => p.id === exp.platform_id)?.name || 'Unknown';
      return {
        platform: platformName,
        rating: exp.rating ?? 0,
        experienceTime: exp.experience_time ?? 'less than 1 year',
      };
    }) ?? [];

  const missingFields: string[] = [];

  if (!userData?.first_name || !userData?.last_name) missingFields.push('Name');
  if (!userData?.country_id) missingFields.push('Country');
  if (!aboutData?.profession) missingFields.push('Profession');
  if (!aboutData?.bio) missingFields.push('Bio');
  if (!mediaData?.url_storage) missingFields.push('Profile Photo');
  if (!docData?.[0]?.url_storage) missingFields.push('CV');
  if (!userData?.linkedin_profile) missingFields.push('LinkedIn');

  const totalFields = 7;
  const completedFields = totalFields - missingFields.length;
  const completion = Math.round((completedFields / totalFields) * 100);

  return {
    firstName: userData?.first_name ?? '',
    lastName: userData?.last_name ?? '',
    profession: aboutData?.profession ?? '',
    avatarUrl: mediaData?.url_storage ?? '',
    bio: aboutData?.bio ?? '',
    skills,
    tools,
    experiences,
    linkedin: userData?.linkedin_profile ?? null,
    otherLink: userData?.other_link ?? null,
    completion,
    missingFields,
  };
}
