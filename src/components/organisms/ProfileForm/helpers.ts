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
    // 1. Primero obtenemos el expert_id correspondiente al user_id
    const { data: expertRecord, error: expertRecordError } = await supabase
      .from('experts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    // No lanzar error si no hay registro de experto (podría ser un cliente)
    if (expertRecordError && expertRecordError.code !== 'PGRST116') {
      console.error('Error fetching expert record:', expertRecordError);
      throw expertRecordError;
    }

    const expertId = expertRecord?.id;

    // 1.1 Obtener customerId si existe (solo para imágenes de customer)
    const { data: customerRecord, error: customerRecordError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (customerRecordError && customerRecordError.code !== 'PGRST116') {
      throw customerRecordError;
    }

    const customerId = customerRecord?.id;

    // 2. Ejecutamos todas las consultas en paralelo
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
      // Consulta de datos básicos del usuario
      supabase
        .from('users')
        .select(
          'first_name, last_name, country_id, role_id, linkedin_profile, other_link'
        )
        .eq('id', userId)
        .single(),

      // Consulta de datos del experto (solo si existe expertId)
      expertId
        ? supabase
            .from('experts')
            .select(
              'certified, anything_share_with_us, understand_subject_pp, is_currently_working, bio, profession_id'
            )
            .eq('user_id', userId)
            .maybeSingle<ExpertResponse>()
        : Promise.resolve({ data: null, error: null }),

      // Consulta de datos del cliente
      supabase
        .from('customers')
        .select(
          'company_name, job_title, email, accepted_privacy_policy, accepted_terms_conditions, description, company_url'
        )
        .eq('user_id', userId)
        .maybeSingle<CustomerResponse>(),

      // Consultas de datos de referencia
      supabase.from('country').select('id, name'),
      supabase.from('user_role').select('id, name'),
      supabase.from('solutions').select('id, name'),
      supabase.from('it_professions').select('id, profession_name'),

      // Consultas relacionadas con el experto (solo si existe expertId)
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

      // Avatar
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

      // Company logo
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

      // Documentos (solo expert)
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

    // Extraer datos de las consultas condicionales
    const skillsData = skillsQuery.data;
    const toolsData = toolsQuery.data;
    const expertiseData = expertiseQuery.data;
    const avatarData = avatarQuery.data;
    const companyLogoData = companyLogoQuery.data;
    const documentData = documentQuery.data;

    // 3. Obtener nombre de la profesión
    let professionName = '';
    if (expertData?.profession_id) {
      const { data: professionData } = await supabase
        .from('it_professions')
        .select('profession_name')
        .eq('id', expertData.profession_id)
        .single();
      professionName = professionData?.profession_name || '';
    }

    // 4. Manejo de errores
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

    // 5. Construcción de los valores iniciales del formulario
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
      photo_url: avatarData?.url_storage ?? '',
      company_logo_url: companyLogoData?.url_storage ?? '',
      cv_url: documentData?.url_storage || '',
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
