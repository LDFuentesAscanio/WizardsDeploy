'use client';

import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/browserClient';
import { showError, showInfo, showSuccess } from '@/utils/toastService';
import { CustomerInsert, ExpertInsert } from '@/supabase-types';
import {
  Expertise,
  ProfileFormValues,
} from '@/components/organisms/ProfileForm/types';

function sanitizeList(items?: string[]): string[] {
  if (!Array.isArray(items)) return [];
  const trimmed = items.map((s) => s.trim()).filter(Boolean);
  // Dedupe case-insensitive, pero preservando el valor original del primero
  const seen = new Set<string>();
  const result: string[] = [];
  for (const s of trimmed) {
    const key = s.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(s);
    }
  }
  return result;
}

export function useProfileSubmit() {
  const router = useRouter();
  const pathname = usePathname();

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

      // ✅ Sin cambios
      if (JSON.stringify(values) === JSON.stringify(initialValues)) {
        const basicComplete = Boolean(
          values.first_name?.trim() &&
            values.last_name?.trim() &&
            values.country_id &&
            values.role_id
        );

        const roleComplete = isCustomer
          ? Boolean(
              values.company_name?.trim() &&
                values.job_title?.trim() &&
                values.description?.trim()
            )
          : isExpert
            ? Boolean(
                values.bio?.trim() &&
                  (values.profession_id || values.profession?.trim())
              )
            : false;

        if (
          basicComplete &&
          roleComplete &&
          pathname === '/force-profile/edit'
        ) {
          localStorage.removeItem('forcedToCompleteProfile');
          router.replace('/dashboard');
        } else {
          showInfo('No changes detected');
        }
        return;
      }

      // 1) Users
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

      // 2) Customer
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

      // 3) Expert
      if (isExpert) {
        // Resolver profession_id si viene por nombre
        let professionId = values.profession_id || '';
        if (!professionId && values.profession) {
          const { data: profession, error: profError } = await supabase
            .from('it_professions')
            .select('id')
            .eq('profession_name', values.profession)
            .single();
          if (profError) throw profError;
          if (!profession) throw new Error('Selected profession not found');
          professionId = profession.id;
        }

        // Upsert expert
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

        // Avatar (opcional)
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

        // Expertise (replace)
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

        // ✅ Skills (replace) — SIN user_id
        const safeSkills = sanitizeList(values.skills);
        await supabase.from('skills').delete().eq('expert_id', expertId);
        if (safeSkills.length) {
          const { error } = await supabase.from('skills').insert(
            safeSkills.map((skill: string) => ({
              expert_id: expertId,
              skill_name: skill,
              // skill_level: null // no lo usamos ya, y no es NOT NULL
            }))
          );
          if (error) throw error;
        }

        // ✅ Tools (replace) — SIN user_id
        const safeTools = sanitizeList(values.tools);
        await supabase.from('tools').delete().eq('expert_id', expertId);
        if (safeTools.length) {
          const { error } = await supabase.from('tools').insert(
            safeTools.map((tool: string) => ({
              expert_id: expertId,
              tool_name: tool,
            }))
          );
          if (error) throw error;
        }

        // Document (opcional)
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

      const basicComplete = Boolean(
        values.first_name?.trim() &&
          values.last_name?.trim() &&
          values.country_id &&
          values.role_id
      );

      const roleComplete = isCustomer
        ? Boolean(
            values.company_name?.trim() &&
              values.job_title?.trim() &&
              values.description?.trim()
          )
        : isExpert
          ? Boolean(
              values.bio?.trim() &&
                (values.profession_id || values.profession?.trim())
            )
          : false;

      const profileComplete = basicComplete && roleComplete;

      localStorage.removeItem('forcedToCompleteProfile');

      if (profileComplete) {
        router.replace('/dashboard');
      } else if (pathname !== '/force-profile/edit') {
        router.replace('/force-profile/edit');
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
