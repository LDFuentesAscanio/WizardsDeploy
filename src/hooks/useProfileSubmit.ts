'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';
import { showError, showInfo, showSuccess } from '@/utils/toastService';

import { CustomerInsert } from '@/supabase-types';
import {
  Expertise,
  isExpertProfile,
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

      // 2. Customer
      if (isCustomer) {
        const customerData: CustomerInsert = {
          user_id: user.id,
          company_name: values.company_name || '',
          actual_role: values.actual_role || '',
          email: values.email || '',
          accepted_privacy_policy: values.accepted_privacy_policy ?? false,
          accepted_terms_conditions: values.accepted_terms_conditions ?? false,
        };

        const { error: customerError } = await supabase
          .from('customers')
          .upsert(customerData, { onConflict: 'user_id' });
        if (customerError) throw customerError;
      }

      // 3. About section (common)
      const { error: aboutError } = await supabase.from('about').upsert(
        {
          user_id: user.id,
          bio: values.bio || '',
          profession: isExpertProfile(values) ? values.profession || '' : null,
        },
        { onConflict: 'user_id' }
      );
      if (aboutError) throw aboutError;

      // 4. Expert
      if (isExpert) {
        // profile picture
        if (values.photo_url) {
          await supabase.from('user_media').upsert(
            {
              user_id: user.id,
              url_storage: values.photo_url,
              filename: values.photo_url.split('/').pop() || 'profile.jpg',
            },
            { onConflict: 'user_id' }
          );
        }

        // expertise
        await supabase.from('user_expertise').delete().eq('user_id', user.id);
        const expertise: Expertise[] = values.expertise ?? [];
        if (expertise.length > 0) {
          const { error } = await supabase.from('user_expertise').insert(
            expertise.map((e: Expertise) => ({
              user_id: user.id,
              platform_id: e.platform_id,
              rating: Number(e.rating),
              experience_time: e.experience_time,
            }))
          );
          if (error) throw error;
        }

        // skills
        await supabase.from('skills').delete().eq('user_id', user.id);
        if (values.skills?.length) {
          await supabase.from('skills').insert(
            values.skills.map((skill: string) => ({
              user_id: user.id,
              skill_name: skill,
            }))
          );
        }

        // tools
        await supabase.from('tools').delete().eq('user_id', user.id);
        if (values.tools?.length) {
          await supabase.from('tools').insert(
            values.tools.map((tool: string) => ({
              user_id: user.id,
              tool_name: tool,
            }))
          );
        }

        // documents
        if (values.cv_url) {
          await supabase.from('user_documents').upsert(
            {
              user_id: user.id,
              url_storage: values.cv_url,
              filename: values.filename || 'document.pdf',
            },
            { onConflict: 'user_id' }
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
    }
  };

  return { handleSubmit };
}
