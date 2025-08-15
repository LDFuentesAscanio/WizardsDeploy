import { showError } from '@/utils/toastService';
import {
  CustomerResponse,
  ProfileFormValues,
  ExpertMedia,
  ExpertResponse,
  CustomerMedia,
  Country,
  Role,
  Solution,
  ExpertDocument,
  ITProfession,
} from './types';
import { supabase } from '@/utils/supabase/browserClient';

export async function fetchProfileFormData(userId: string) {
  try {
    // Helper para obtener URL pública con bucket dinámico
    const getPublicUrl = (path?: string, bucket?: string) => {
      if (!path) return '';
      // Si ya es URL completa, la devolvemos tal cual
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
      }
      const bucketToUse = bucket || 'expert-documents';
      const publicUrl = supabase.storage.from(bucketToUse).getPublicUrl(path)
        .data.publicUrl;
      console.log(
        `📦 getPublicUrl -> bucket: ${bucketToUse} | path: ${path} | publicUrl: ${publicUrl}`
      );
      return publicUrl;
    };

    console.log('🔍 Iniciando fetchProfileFormData para userId:', userId);

    // 1. Obtener expert_id
    const { data: expertRecord, error: expertRecordError } = await supabase
      .from('experts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    const expertId = expertRecord?.id;
    console.log('🧑‍💼 expertId:', expertId);

    if (expertRecordError && expertRecordError.code !== 'PGRST116') {
      console.error('Error fetching expert record:', expertRecordError);
      throw expertRecordError;
    }

    // 1.1 Obtener customer_id
    const { data: customerRecord, error: customerRecordError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (customerRecordError && customerRecordError.code !== 'PGRST116') {
      throw customerRecordError;
    }

    const customerId = customerRecord?.id;
    console.log('🏢 customerId:', customerId);

    // 2. Consultas en paralelo
    const [
      { data: userData, error: userError },
      { data: expertData, error: expertError },
      { data: customerData, error: customerError },
      { data: countriesData, error: countriesError },
      { data: rolesData, error: rolesError },
      { data: solutionsData, error: solutionsError },
      { data: professionsData, error: professionsError },
      skillsQuery,
      toolsQuery,
      expertiseQuery,
      avatarQuery,
      companyLogoQuery,
      documentQuery,
    ] = await Promise.all([
      supabase
        .from('users')
        .select(
          'first_name, last_name, country_id, role_id, linkedin_profile, other_link'
        )
        .eq('id', userId)
        .single(),

      expertId
        ? supabase
            .from('experts')
            .select(
              'certified, anything_share_with_us, understand_subject_pp, is_currently_working, bio, profession_id'
            )
            .eq('user_id', userId)
            .maybeSingle<ExpertResponse>()
        : Promise.resolve({ data: null, error: null }),

      supabase
        .from('customers')
        .select(
          'company_name, job_title, email, accepted_privacy_policy, accepted_terms_conditions, description, company_url'
        )
        .eq('user_id', userId)
        .maybeSingle<CustomerResponse>(),

      supabase.from('country').select('id, name'),
      supabase.from('user_role').select('id, name'),
      supabase.from('solutions').select('id, name'),
      supabase.from('it_professions').select('id, profession_name'),

      expertId
        ? supabase.from('skills').select('skill_name').eq('expert_id', expertId)
        : Promise.resolve({ data: null, error: null }),
      expertId
        ? supabase.from('tools').select('tool_name').eq('expert_id', expertId)
        : Promise.resolve({ data: null, error: null }),
      expertId
        ? supabase
            .from('expert_expertise')
            .select('platform_id, rating, experience_time')
            .eq('expert_id', expertId)
        : Promise.resolve({ data: null, error: null }),

      expertId
        ? supabase
            .from('expert_media')
            .select('url_storage')
            .eq('expert_id', expertId)
            .eq('type', 'avatar')
            .maybeSingle<ExpertMedia>()
        : customerId
          ? supabase
              .from('customer_media')
              .select('url_storage')
              .eq('customer_id', customerId)
              .eq('type', 'avatar')
              .maybeSingle<CustomerMedia>()
          : Promise.resolve({ data: null, error: null }),

      expertId
        ? supabase
            .from('expert_media')
            .select('url_storage')
            .eq('expert_id', expertId)
            .eq('type', 'company_logo')
            .maybeSingle<ExpertMedia>()
        : customerId
          ? supabase
              .from('customer_media')
              .select('url_storage')
              .eq('customer_id', customerId)
              .eq('type', 'company_logo')
              .maybeSingle<CustomerMedia>()
          : Promise.resolve({ data: null, error: null }),

      expertId
        ? supabase
            .from('expert_documents')
            .select('url_storage, filename')
            .eq('expert_id', expertId)
            .order('id', { ascending: false })
            .limit(1)
            .maybeSingle<ExpertDocument>()
        : Promise.resolve({ data: null, error: null }),
    ]);

    const skillsData = skillsQuery.data;
    const toolsData = toolsQuery.data;
    const expertiseData = expertiseQuery.data;
    const avatarData = avatarQuery.data;
    const companyLogoData = companyLogoQuery.data;
    const documentData = documentQuery.data;

    console.log('🖼 avatarData:', avatarData);
    console.log('🏷 companyLogoData:', companyLogoData);
    console.log('📄 documentData:', documentData);

    let professionName = '';
    if (expertData?.profession_id) {
      const { data: professionData } = await supabase
        .from('it_professions')
        .select('profession_name')
        .eq('id', expertData.profession_id)
        .single();
      professionName = professionData?.profession_name || '';
    }

    const errors = [
      { name: 'userData', error: userError },
      { name: 'expertData', error: expertError },
      { name: 'customerData', error: customerError },
      { name: 'countriesData', error: countriesError },
      { name: 'rolesData', error: rolesError },
      { name: 'solutionsData', error: solutionsError },
      { name: 'professionsData', error: professionsError },
      { name: 'skillsData', error: skillsQuery.error },
      { name: 'toolsData', error: toolsQuery.error },
      { name: 'expertiseData', error: expertiseQuery.error },
      { name: 'avatarData', error: avatarQuery.error },
      { name: 'companyLogoData', error: companyLogoQuery.error },
      { name: 'documentData', error: documentQuery.error },
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

    const isExpert = !!expertId;
    const photoBucket = isExpert ? 'expert-documents' : 'customer_media';
    const logoBucket = isExpert ? 'expert-documents' : 'customer_media';

    const initialValues: ProfileFormValues = {
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      country_id: userData?.country_id || '',
      role_id: userData?.role_id || '',
      linkedin_profile: userData?.linkedin_profile || '',
      other_link: userData?.other_link || '',
      bio: expertData?.bio || '',
      profession_id: expertData?.profession_id || '',
      profession: professionName,
      certified: expertData?.certified || false,
      is_currently_working: expertData?.is_currently_working ?? true,
      expertise:
        expertiseData?.map((item) => ({
          platform_id: item.platform_id,
          rating: item.rating ?? 0,
          experience_time: item.experience_time ?? 'less than 1 year',
        })) ?? [],
      skills:
        skillsData?.map((s: { skill_name: string }) => s.skill_name) ?? [],
      tools: toolsData?.map((t: { tool_name: string }) => t.tool_name) ?? [],
      photo_url: getPublicUrl(avatarData?.url_storage, photoBucket),
      company_logo_url: getPublicUrl(companyLogoData?.url_storage, logoBucket),
      cv_url: getPublicUrl(documentData?.url_storage, 'expert-documents'),
      filename: documentData?.filename || '',
      company_name: customerData?.company_name || '',
      actual_role: customerData?.job_title || '',
      email: customerData?.email || '',
      solution_description: customerData?.description || '',
      selected_solutions: [],
      looking_for_expert: false,
      accepted_privacy_policy: customerData?.accepted_privacy_policy ?? false,
      accepted_terms_conditions:
        customerData?.accepted_terms_conditions ?? false,
    };

    console.log('✅ initialValues:', initialValues);

    return {
      initialValues,
      countries: (countriesData as Country[]) ?? [],
      roles: (rolesData as Role[]) ?? [],
      solutions: (solutionsData as Solution[]) ?? [],
      professions: (professionsData as ITProfession[]) ?? [],
    };
  } catch (error) {
    console.error('Error in fetchProfileFormData:', error);
    showError('Profile error', {
      description: 'There was a problem loading your profile data.',
    });
    throw error;
  }
}
