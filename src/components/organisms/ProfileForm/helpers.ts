import { showError, showInfo } from '@/utils/toastService';
import { About, CustomerResponse, ProfileFormValues, UserMedia } from './types';
import { supabase } from '@/utils/supabase/browserClient';

export async function fetchProfileFormData(userId: string) {
  try {
    showInfo('Loading profile data...');
    const [
      { data: userData, error: userError },
      { data: customersData, error: customersError },
      { data: countriesData, error: countriesError },
      { data: rolesData, error: rolesError },
      { data: aboutDataRaw, error: aboutError },
      { data: skillsData, error: skillsError },
      { data: toolsData, error: toolsError },
      { data: expertiseData, error: expertiseError },
      { data: avatarData, error: avatarError },
      { data: companyLogoData, error: companyLogoError },
      { data: documentData, error: documentError },
      { data: solutionsData, error: solutionsError },
    ] = await Promise.all([
      supabase
        .from('users')
        .select(
          'first_name, last_name, country_id, role_id, linkedin_profile, other_link'
        )
        .eq('id', userId)
        .single(),

      supabase
        .from('customers')
        .select(
          'company_name, actual_role, email, accepted_privacy_policy, accepted_terms_conditions'
        )
        .eq('user_id', userId)
        .maybeSingle<CustomerResponse>(),

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
        .eq('type', 'avatar')
        .maybeSingle<UserMedia>(),

      supabase
        .from('user_media')
        .select('url_storage')
        .eq('user_id', userId)
        .eq('type', 'company_logo')
        .maybeSingle<UserMedia>(),

      supabase
        .from('user_documents')
        .select('url_storage, filename')
        .eq('user_id', userId)
        .order('id', { ascending: false })
        .limit(1),

      supabase.from('solutions').select('id, name'),
    ]);

    const errors = [
      { name: 'userData', error: userError },
      { name: 'customersData', error: customersError },
      { name: 'countriesData', error: countriesError },
      { name: 'rolesData', error: rolesError },
      { name: 'aboutData', error: aboutError },
      { name: 'skillsData', error: skillsError },
      { name: 'toolsData', error: toolsError },
      { name: 'expertiseData', error: expertiseError },
      { name: 'avatarData', error: avatarError },
      { name: 'companyLogoData', error: companyLogoError },
      { name: 'documentData', error: documentError },
      { name: 'solutionsData', error: solutionsError },
    ].filter((item) => item.error);

    if (errors.length > 0) {
      const errorMessage = `Failed to load: ${errors
        .map((e) => e.name)
        .join(', ')}`;
      console.error('Errors in Supabase queries:', errors);
      showError('Profile loading error', {
        description: 'Some data could not be loaded. Please try again.',
      });
      throw new Error(errorMessage);
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
      expertise:
        expertiseData?.map((item) => ({
          ...item,
          rating: item.rating ?? 0,
          experience_time: item.experience_time ?? 'less than 1 year',
        })) ?? [],
      skills: skillsData?.map((s) => s.skill_name) ?? [],
      tools: toolsData?.map((t) => t.tool_name) ?? [],
      photo_url: avatarData?.url_storage ?? '',
      company_logo_url: companyLogoData?.url_storage ?? '',
      cv_url: documentData?.[0]?.url_storage || '',
      filename: documentData?.[0]?.filename || '',
      company_name: customersData?.company_name || '',
      actual_role: customersData?.actual_role || '',
      email: customersData?.email || '',
      solution_description: '',
      selected_solutions: [],
      looking_for_expert: false,
      accepted_privacy_policy: customersData?.accepted_privacy_policy ?? false,
      accepted_terms_conditions:
        customersData?.accepted_terms_conditions ?? false,
    };

    return {
      initialValues,
      countries: countriesData ?? [],
      roles: rolesData ?? [],
      solutions: solutionsData ?? [],
    };
  } catch (error) {
    console.error('Error in fetchProfileFormData:', error);
    showError('Profile error', {
      description: 'There was a problem loading your profile data.',
    });
    throw error;
  }
}
