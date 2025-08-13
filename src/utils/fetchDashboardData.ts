import { supabase } from '@/utils/supabase/browserClient';
import {
  DashboardData,
  UserRow,
  ExpertRow,
  ExpertMediaRow,
  ExpertDocumentRow,
  SkillRow,
  ToolRow,
  ExpertiseRow,
  PlatformRow,
  ProfessionRow,
  Experience,
} from '@/components/organisms/dashboard/types';

export async function fetchDashboardData(
  userId: string
): Promise<DashboardData> {
  // 1️⃣ Datos del usuario
  const { data: userData } = await supabase
    .from('users')
    .select('first_name, last_name, country_id, linkedin_profile, other_link')
    .eq('id', userId)
    .single<UserRow>();

  // 2️⃣ Datos del experto (incluye su ID para usar en relaciones)
  const { data: expertData } = await supabase
    .from('experts')
    .select('id, bio, profession_id')
    .eq('user_id', userId)
    .maybeSingle<Pick<ExpertRow, 'id' | 'bio' | 'profession_id'>>();

  const expertId = expertData?.id ?? null;

  // 3️⃣ Consultas en paralelo
  const [
    { data: avatarData },
    { data: docData },
    { data: skillsData },
    { data: toolsData },
    { data: expertiseData },
    { data: platformsData },
    { data: professionData },
  ] = await Promise.all([
    expertId
      ? supabase
          .from('expert_media')
          .select('url_storage')
          .eq('expert_id', expertId)
          .eq('type', 'avatar')
          .maybeSingle<ExpertMediaRow>()
      : Promise.resolve({ data: null }),

    expertId
      ? supabase
          .from('expert_documents')
          .select('url_storage')
          .eq('expert_id', expertId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle<ExpertDocumentRow>()
      : Promise.resolve({ data: null }),

    expertId
      ? supabase
          .from('skills')
          .select('skill_name')
          .eq('expert_id', expertId)
          .returns<SkillRow[]>()
      : Promise.resolve({ data: [] }),

    expertId
      ? supabase
          .from('tools')
          .select('tool_name')
          .eq('expert_id', expertId)
          .returns<ToolRow[]>()
      : Promise.resolve({ data: [] }),

    expertId
      ? supabase
          .from('expert_expertise')
          .select('platform_id, rating, experience_time')
          .eq('expert_id', expertId)
          .returns<ExpertiseRow[]>()
      : Promise.resolve({ data: [] }),

    supabase.from('platforms').select('id, name').returns<PlatformRow[]>(),

    expertData?.profession_id
      ? supabase
          .from('it_professions')
          .select('profession_name')
          .eq('id', expertData.profession_id)
          .single<ProfessionRow>()
      : Promise.resolve({ data: null }),
  ]);

  // 4️⃣ Procesar arrays
  const skills = skillsData?.map((s) => s.skill_name) ?? [];
  const tools = toolsData?.map((t) => t.tool_name) ?? [];

  const experiences: Experience[] =
    expertiseData?.map((exp) => {
      const platformName =
        platformsData?.find((p) => p.id === exp.platform_id)?.name || 'Unknown';
      return {
        platform: platformName,
        rating: exp.rating ?? 0,
        experienceTime: exp.experience_time ?? 'less than 1 year',
      };
    }) ?? [];

  // 5️⃣ Validar campos obligatorios
  const missingFields: string[] = [];
  const requiredFields = [
    { name: 'First Name', value: userData?.first_name },
    { name: 'Last Name', value: userData?.last_name },
    { name: 'Country', value: userData?.country_id },
    { name: 'Profession', value: professionData?.profession_name },
    { name: 'Bio', value: expertData?.bio },
    { name: 'Profile Photo', value: avatarData?.url_storage },
    { name: 'CV', value: docData?.url_storage },
    { name: 'LinkedIn', value: userData?.linkedin_profile },
  ];

  requiredFields.forEach((field) => {
    if (!field.value) missingFields.push(field.name);
  });

  const totalFields = requiredFields.length;
  const completedFields = totalFields - missingFields.length;
  const completion = Math.round((completedFields / totalFields) * 100);

  // 6️⃣ Retornar datos listos para el Dashboard
  return {
    firstName: userData?.first_name ?? '',
    lastName: userData?.last_name ?? '',
    profession: professionData?.profession_name ?? '',
    avatarUrl: avatarData?.url_storage ?? '',
    bio: expertData?.bio ?? '',
    skills,
    tools,
    experiences,
    linkedin: userData?.linkedin_profile ?? null,
    otherLink: userData?.other_link ?? null,
    completion,
    missingFields,
  };
}
