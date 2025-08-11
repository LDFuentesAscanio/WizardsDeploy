'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';
import { showError, showInfo, showSuccess } from '@/utils/toastService';

import { CustomerInsert, ExpertInsert } from '@/supabase-types';
import {
  Expertise,
  ProfileFormValues,
} from '@/components/organisms/ProfileForm/types';

export function useProfileSubmit() {
  const router = useRouter();

  const handleSubmit = async (
    values: ProfileFormValues,
    initialValues: ProfileFormValues,
    isCustomer: boolean,
    isExpert: boolean
  ) => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw authError;

      if (JSON.stringify(values) === JSON.stringify(initialValues)) {
        showInfo('No changes detected');
        return;
      }

      // 1. Update base user
      const { error: userError } = await supabase.from('users').upsert(
        {
          id: user.id,
          first_name: values.first_name,
          last_name: values.last_name,
          country_id: values.country_id,
          role_id: values.role_id,
          linkedin_profile: values.linkedin_profile,
          other_link: values.other_link,
        },
        { onConflict: 'id' }
      );
      if (userError) throw userError;

      // 2. Customer update
      if (isCustomer) {
        const customerData: CustomerInsert = {
          user_id: user.id,
          company_name: values.company_name || '',
          job_title: values.actual_role || '',
          email: values.email || '',
          accepted_privacy_policy: values.accepted_privacy_policy ?? false,
          accepted_terms_conditions: values.accepted_terms_conditions ?? false,
          description: values.solution_description || '',
        };

        const { error: customerError } = await supabase
          .from('customers')
          .upsert(customerData, { onConflict: 'user_id' });
        if (customerError) throw customerError;
      }

      // 3. Expert update
      if (isExpert) {
        try {
          // Obtener profession_id - ahora con valor por defecto
          let professionId = ''; // Valor por defecto como string vacío
          if (values.profession) {
            const { data: profession } = await supabase
              .from('it_professions')
              .select('id')
              .eq('profession_name', values.profession)
              .single();
            professionId = profession?.id || '';
          }

          // Upsert expert data
          const expertData: ExpertInsert = {
            user_id: user.id,
            bio: values.bio || null,
            profession_id: professionId, // Ahora siempre es string
            certified: values.certified || false,
            is_currently_working: values.is_currently_working ?? true,
            understand_subject_pp: true,
            anything_share_with_us: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { error: expertError } = await supabase
            .from('experts')
            .upsert(expertData, { onConflict: 'user_id' });
          if (expertError) throw expertError;

          // Profile picture
          if (values.photo_url) {
            await supabase.from('expert_media').upsert(
              {
                expert_id: user.id,
                url_storage: values.photo_url,
                filename: values.photo_url.split('/').pop() || 'profile.jpg',
                type: 'avatar',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'expert_id,type' }
            );
          }

          // Expertise
          await supabase
            .from('expert_expertise')
            .delete()
            .eq('expert_id', user.id);
          const expertise: Expertise[] = values.expertise ?? [];
          if (expertise.length > 0) {
            const { error } = await supabase.from('expert_expertise').insert(
              expertise.map((e: Expertise) => ({
                expert_id: user.id,
                platform_id: e.platform_id,
                rating: Number(e.rating),
                experience_time: e.experience_time,
                created_at: new Date().toISOString(),
              }))
            );
            if (error) throw error;
          }

          // Skills
          await supabase.from('skills').delete().eq('expert_id', user.id);
          if (values.skills?.length) {
            await supabase.from('skills').insert(
              values.skills.map((skill: string) => ({
                expert_id: user.id,
                user_id: user.id,
                skill_name: skill,
                skill_level: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }))
            );
          }

          // Tools
          await supabase.from('tools').delete().eq('expert_id', user.id);
          if (values.tools?.length) {
            await supabase.from('tools').insert(
              values.tools.map((tool: string) => ({
                expert_id: user.id,
                user_id: user.id,
                tool_name: tool,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }))
            );
          }

          // Documents
          if (values.cv_url) {
            await supabase.from('expert_documents').upsert(
              {
                expert_id: user.id,
                url_storage: values.cv_url,
                filename: values.filename || 'document.pdf',
                created_at: new Date().toISOString(),
              },
              { onConflict: 'expert_id' }
            );
          }
        } catch (expertError) {
          console.error('Error updating expert data:', expertError);
          throw expertError;
        }
      }

      showSuccess('Profile updated successfully');

      const wasForced =
        localStorage.getItem('forcedToCompleteProfile') === 'true';
      if (wasForced) {
        localStorage.removeItem('forcedToCompleteProfile');
        router.replace('/dashboard');
      }
    } catch (error: unknown) {
      console.error('❌ Error submitting profile:', error);
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError('Unexpected error updating profile');
      }
      throw error;
    }
  };

  return { handleSubmit };
}
