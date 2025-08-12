import { showError } from '@/utils/toastService';
import {
  CustomerResponse,
  ProfileFormValues,
  ExpertMedia,
  ExpertResponse,
  Country,
  Role,
  Solution,
} from './types';
import { supabase } from '@/utils/supabase/browserClient';

export async function fetchProfileFormData(userId: string) {
  try {
    const [
      { data: userData, error: userError },
      { data: expertData, error: expertError },
      { data: customerData, error: customerError },
      { data: countriesData, error: countriesError },
      { data: rolesData, error: rolesError },
      { data: skillsData, error: skillsError },
      { data: toolsData, error: toolsError },
      { data: expertiseData, error: expertiseError },
      { data: avatarData, error: avatarError },
      { data: companyLogoData, error: companyLogoError },
      { data: documentData, error: documentError },
      { data: solutionsData, error: solutionsError },
      { data: professionsData, error: professionsError },
    ] = await Promise.all([
      supabase
        .from('users')
        .select(
          'first_name, last_name, country_id, role_id, linkedin_profile, other_link'
        )
        .eq('id', userId)
        .single(),

      supabase
        .from('experts')
        .select(
          'certified, anything_share_with_us, understand_subject_pp, is_currently_working, bio, profession_id'
        )
        .eq('user_id', userId)
        .maybeSingle<ExpertResponse>(),

      supabase
        .from('customers')
        .select(
          'company_name, job_title, email, accepted_privacy_policy, accepted_terms_conditions, description, company_url'
        )
        .eq('user_id', userId)
        .maybeSingle<CustomerResponse>(),

      supabase.from('country').select('id, name'),
      supabase.from('user_role').select('id, name'),
      supabase.from('skills').select('skill_name').eq('expert_id', userId),
      supabase.from('tools').select('tool_name').eq('expert_id', userId),
      supabase
        .from('expert_expertise')
        .select('platform_id, rating, experience_time')
        .eq('expert_id', userId),

      supabase
        .from('expert_media')
        .select('url_storage')
        .eq('expert_id', userId)
        .eq('type', 'avatar')
        .maybeSingle<ExpertMedia>(),

      supabase
        .from('expert_media')
        .select('url_storage')
        .eq('expert_id', userId)
        .eq('type', 'company_logo')
        .maybeSingle<ExpertMedia>(),

      supabase
        .from('expert_documents')
        .select('url_storage, filename')
        .eq('expert_id', userId)
        .order('id', { ascending: false })
        .limit(1),

      supabase.from('solutions').select('id, name'),
      supabase.from('it_professions').select('id, profession_name'),
    ]);

    let professionName = '';
    if (expertData?.profession_id) {
      const { data: professionData } = await supabase
        .from('it_professions')
        .select('profession_name')
        .eq('id', expertData.profession_id)
        .single();
      professionName = professionData?.profession_name ?? '';
    }

    const errors = [
      { name: 'userData', error: userError },
      { name: 'expertData', error: expertError },
      { name: 'customerData', error: customerError },
      { name: 'countriesData', error: countriesError },
      { name: 'rolesData', error: rolesError },
      { name: 'skillsData', error: skillsError },
      { name: 'toolsData', error: toolsError },
      { name: 'expertiseData', error: expertiseError },
      { name: 'avatarData', error: avatarError },
      { name: 'companyLogoData', error: companyLogoError },
      { name: 'documentData', error: documentError },
      { name: 'solutionsData', error: solutionsError },
      { name: 'professionsData', error: professionsError },
    ].filter((item) => item.error);

    if (errors.length > 0) {
      console.error('Errors in Supabase queries:', errors);
      showError('Profile loading error', {
        description: 'Some data could not be loaded. Please try again.',
      });
      throw new Error(
        `Failed to load: ${errors.map((e) => e.name).join(', ')}`
      );
    }

    const initialValues: ProfileFormValues = {
      /** Datos generales */
      first_name: userData?.first_name ?? '',
      last_name: userData?.last_name ?? '',
      country_id: userData?.country_id ?? '',
      role_id: userData?.role_id ?? '',
      linkedin_profile: userData?.linkedin_profile ?? '',
      other_link: userData?.other_link ?? '',

      /** Datos Expert */
      bio: expertData?.bio ?? '',
      profession_id: expertData?.profession_id ?? '',
      profession: professionName ?? '',
      certified: expertData?.certified ?? false,
      is_currently_working: expertData?.is_currently_working ?? true,
      expertise:
        expertiseData?.map((item) => ({
          ...item,
          rating: item.rating ?? 0,
          experience_time: item.experience_time ?? 'less than 1 year',
        })) ?? [],
      skills: skillsData?.map((s) => s.skill_name) ?? [],
      tools: toolsData?.map((t) => t.tool_name) ?? [],
      cv_url: documentData?.[0]?.url_storage ?? '',
      filename: documentData?.[0]?.filename ?? '',

      /** Multimedia */
      photo_url: avatarData?.url_storage ?? '',
      company_logo_url: companyLogoData?.url_storage ?? '',

      /** Datos Customer */
      company_name: customerData?.company_name ?? '',
      actual_role: customerData?.job_title ?? '',
      email: customerData?.email ?? '',
      description: customerData?.description ?? '',
      company_url: customerData?.company_url ?? '',
      solution_description: customerData?.description ?? '',
      selected_solutions: [],
      looking_for_expert: false,
      accepted_privacy_policy: customerData?.accepted_privacy_policy ?? false,
      accepted_terms_conditions:
        customerData?.accepted_terms_conditions ?? false,
    };

    return {
      initialValues,
      countries: (countriesData as Country[]) ?? [],
      roles: (rolesData as Role[]) ?? [],
      solutions: (solutionsData as Solution[]) ?? [],
      professions: professionsData ?? [],
    };
  } catch (error) {
    console.error('Error in fetchProfileFormData:', error);
    showError('Profile error', {
      description: 'There was a problem loading your profile data.',
    });
    throw error;
  }
}
