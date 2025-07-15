//Validations, types and interfaces
import { About, ProfileFormValues } from './types';
//Utilities
import { supabase } from '@/utils/supabase/client';

export async function fetchProfileFormData(userId: string) {
  const [
    { data: userData, error: userError },
    { data: countriesData, error: countriesError },
    { data: rolesData, error: rolesError },
    { data: aboutDataRaw, error: aboutError },
    { data: skillsData },
    { data: toolsData },
    { data: expertiseData, error: expertiseError },
    { data: mediaData }, // 👈 imagen de perfil
    { data: documentData },
  ] = await Promise.all([
    supabase
      .from('users')
      .select(
        'first_name, last_name, country_id, role_id, linkedin_profile, other_link'
      )
      .eq('id', userId)
      .single(),

    supabase.from('country').select('id, name'),
    supabase.from('user_role').select('id, name'),

    supabase
      .from('about')
      .select('bio, profession')
      .eq('user_id', userId)
      .maybeSingle<About>(),

    supabase.from('skills').select('skill_name').eq('user_id', userId),
    supabase.from('tools').select('tool_name').eq('user_id', userId),

    supabase
      .from('user_expertise')
      .select('platform_id, rating, experience_time')
      .eq('user_id', userId),
    supabase
      .from('user_media')
      .select('url_storage')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('user_documents')
      .select('url_storage, filename')
      .eq('user_id', userId)
      .order('id', { ascending: false }) // si hay más de uno, agarramos el último
      .limit(1),
  ]);

  if (
    userError ||
    countriesError ||
    rolesError ||
    aboutError ||
    expertiseError
  ) {
    throw new Error('Error loading profile data');
  }

  const aboutData = aboutDataRaw ?? { bio: '', profession: '' };

  const initialValues: ProfileFormValues = {
    first_name: userData?.first_name || '',
    last_name: userData?.last_name || '',
    country_id: userData?.country_id || '',
    role_id: userData?.role_id || '',
    linkedin_profile: userData?.linkedin_profile || '',
    other_link: userData?.other_link || '',
    bio: aboutData?.bio ?? '',
    profession: aboutData?.profession ?? '',
    expertise: expertiseData ?? [], // ✅ ahora sí traemos la data guardada
    skills: skillsData?.map((s) => s.skill_name) ?? [],
    tools: toolsData?.map((t) => t.tool_name) ?? [],
    photo_url: mediaData?.url_storage ?? '',
    cv_url: documentData?.[0]?.url_storage || '',
    filename: documentData?.[0]?.filename || '',
  };

  return {
    initialValues,
    countries: countriesData ?? [],
    roles: rolesData ?? [],
  };
}
