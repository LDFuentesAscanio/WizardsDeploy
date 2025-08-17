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

      // 1️⃣ Update base user
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

      // 2️⃣ Customer update
      if (isCustomer) {
        const customerData: CustomerInsert = {
          user_id: user.id,
          company_name: values.company_name || '',
          job_title: values.job_title || '',
          email: values.email || '',
          accepted_privacy_policy: values.accepted_privacy_policy ?? false,
          accepted_terms_conditions: values.accepted_terms_conditions ?? false,
          description: values.description || '',
        };

        const { error: customerError } = await supabase
          .from('customers')
          .upsert(customerData, { onConflict: 'user_id' });
        if (customerError) throw customerError;
      }

      // 3️⃣ Expert update
      if (isExpert) {
        // Obtener profession_id basado en el nombre de la profesión
        let professionId = '';
        if (values.profession) {
          // Ahora usamos values.profession directamente
          const { data: profession, error: profError } = await supabase
            .from('it_professions')
            .select('id')
            .eq('profession_name', values.profession)
            .single();

          if (profError) {
            console.error('Error fetching profession:', profError);
            throw profError;
          }

          if (!profession) {
            throw new Error('Selected profession not found');
          }

          professionId = profession.id;
        }

        // Upsert expert y obtener su ID real
        const { data: expertRecord, error: expertError } = await supabase
          .from('experts')
          .upsert(
            {
              user_id: user.id,
              bio: values.bio || null,
              profession_id: professionId,
              certified: values.certified || false,
              is_currently_working: values.is_currently_working ?? true,
              understand_subject_pp: true,
              anything_share_with_us: null,
            } as ExpertInsert,
            { onConflict: 'user_id' }
          )
          .select('id')
          .single();

        if (expertError) throw expertError;
        const expertId = expertRecord.id;

        // Profile picture
        if (values.photo_url) {
          await supabase.from('expert_media').upsert(
            {
              expert_id: expertId,
              url_storage: values.photo_url,
              filename: values.photo_url.split('/').pop() || 'profile.jpg',
              type: 'avatar',
            },
            { onConflict: 'expert_id,type' }
          );
        }

        // Expertise
        await supabase
          .from('expert_expertise')
          .delete()
          .eq('expert_id', expertId);
        if (values.expertise?.length) {
          const { error } = await supabase.from('expert_expertise').insert(
            values.expertise.map((e: Expertise) => ({
              expert_id: expertId,
              platform_id: e.platform_id,
              rating: Number(e.rating),
              experience_time: e.experience_time,
            }))
          );
          if (error) throw error;
        }

        // Skills
        await supabase.from('skills').delete().eq('expert_id', expertId);
        if (values.skills?.length) {
          await supabase.from('skills').insert(
            values.skills.map((skill: string) => ({
              expert_id: expertId,
              user_id: user.id,
              skill_name: skill,
              skill_level: null,
            }))
          );
        }

        // Tools
        await supabase.from('tools').delete().eq('expert_id', expertId);
        if (values.tools?.length) {
          await supabase.from('tools').insert(
            values.tools.map((tool: string) => ({
              expert_id: expertId,
              user_id: user.id,
              tool_name: tool,
            }))
          );
        }

        // Documents
        if (values.cv_url) {
          await supabase.from('expert_documents').upsert(
            {
              expert_id: expertId,
              url_storage: values.cv_url,
              filename: values.filename || 'document.pdf',
            },
            { onConflict: 'expert_id' }
          );
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
