import { supabase } from '@/utils/supabase/client';
import {
  AboutRow,
  DashboardData,
  UserRow,
} from '@/components/organisms/dashboard/types';

export async function fetchDashboardData(
  userId: string
): Promise<DashboardData> {
  const [userRes, aboutRes, skillsRes, toolsRes, mediaRes, docRes] =
    await Promise.all([
      supabase
        .from('users')
        .select(
          'first_name, last_name, country_id, linkedin_profile, other_link'
        )
        .eq('id', userId)
        .maybeSingle<UserRow>(),

      supabase
        .from('about')
        .select('bio, profession')
        .eq('user_id', userId)
        .maybeSingle<AboutRow>(),

      supabase.from('skills').select('skill_name').eq('user_id', userId),
      supabase.from('tools').select('tool_name').eq('user_id', userId),
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
    ]);

  if (!userRes.data) throw new Error('No user data found');

  const user = userRes.data;
  const about = aboutRes.data ?? { bio: '', profession: '' };
  const skills = skillsRes.data ?? [];
  const tools = toolsRes.data ?? [];
  const media = mediaRes.data;
  const cv = docRes.data?.[0];

  const missingFields: string[] = [];

  if (!user.first_name || !user.last_name) missingFields.push('Name');
  if (!user.country_id) missingFields.push('Country');
  if (!about.profession) missingFields.push('Profession');
  if (!about.bio) missingFields.push('Bio');
  if (!media?.url_storage) missingFields.push('Profile Photo');
  if (!cv?.url_storage) missingFields.push('CV');
  if (!user.linkedin_profile) missingFields.push('LinkedIn');

  const totalFields = 7;
  const completedFields = totalFields - missingFields.length;
  const completionPercentage = Math.round(
    (completedFields / totalFields) * 100
  );

  return {
    firstName: user.first_name,
    lastName: user.last_name,
    profession: about.profession ?? '',
    avatarUrl: media?.url_storage || '',
    bio: about.bio ?? '',
    skills: skills.map((s) => s.skill_name),
    tools: tools.map((t) => t.tool_name),
    experiences: [],
    linkedin: user.linkedin_profile ?? null,
    otherLink: user.other_link ?? null,
    completion: completionPercentage,
    missingFields,
  };
}
