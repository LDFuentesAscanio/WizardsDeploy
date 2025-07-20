'use client';
// External libraries
import Image from 'next/image';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
// Utilities
import { supabase } from '@/utils/supabase/client';
import { useProfileFormData } from './useProfileFormData';
import { forcedToCompleteProfile } from '@/hooks/useForceProfileCompletion';
import { showSuccess, showError, showInfo } from '@/utils/toastService';
// Validations, types and interfaces
import { profileSchema } from '@/validations/profile-validations';
// UI local components
import ExpertiseSection from './ExpertiseSection';
import SkillsSection from './SkillsSection';
import ToolsSection from './ToolsSection';
// UI global components
import FormInput from '@/components/atoms/FormInput';
import FormSelect from '@/components/atoms/FormSelect';
import ProfileImageUpload from '@/components/molecules/ProfileImageUpload';
import UploadDocumentField from '@/components/molecules/UploadDocumentField';
import { ProfileFormValues } from './types';
import { BasicInfoSection } from './formSections/BasicInfoSection';
import { CustomerBasicInfo } from './formSections/CustomerBasicInfo';

export default function ProfileForm() {
  const { initialValues, countries, roles, loading } = useProfileFormData();
  const router = useRouter();

  const handleSubmit = async (values: ProfileFormValues) => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return;
    }

    if (JSON.stringify(values) === JSON.stringify(initialValues)) {
      showInfo('No changes detected');
      return;
    }

    try {
      // 1. Actualizar datos básicos del usuario
      const { error: userError } = await supabase.from('users').upsert({
        id: user.id,
        first_name: values.first_name,
        last_name: values.last_name,
        country_id: values.country_id,
        role_id: values.role_id,
        linkedin_profile: values.linkedin_profile,
        other_link: values.other_link,
      });

      if (userError) throw userError;

      // 2. Actualizar about
      const { error: aboutError } = await supabase.from('about').upsert(
        {
          user_id: user.id,
          bio: values.bio || 'Not provided',
          profession: values.profession || 'Not provided',
        },
        { onConflict: 'user_id' }
      );

      if (aboutError) throw aboutError;

      // 3. Actualizar user_media (foto de perfil)
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

      // 4. Manejo de expertise (eliminar y recrear)
      await supabase.from('user_expertise').delete().eq('user_id', user.id);
      if (values.expertise?.length > 0) {
        const { error: expertiseError } = await supabase
          .from('user_expertise')
          .insert(
            values.expertise.map((e) => ({
              user_id: user.id,
              platform_id: e.platform_id,
              rating: Number(e.rating),
              experience_time: e.experience_time,
            }))
          );

        if (expertiseError) throw expertiseError;
      }

      // 5. Manejo de skills (eliminar y recrear)
      await supabase.from('skills').delete().eq('user_id', user.id);
      if (values.skills?.length > 0) {
        const { error: skillsError } = await supabase.from('skills').insert(
          values.skills.map((skill) => ({
            user_id: user.id,
            skill_name: skill,
          }))
        );

        if (skillsError) throw skillsError;
      }

      // 6. Manejo de tools (eliminar y recrear)
      await supabase.from('tools').delete().eq('user_id', user.id);
      if (values.tools?.length > 0) {
        const { error: toolsError } = await supabase.from('tools').insert(
          values.tools.map((tool) => ({
            user_id: user.id,
            tool_name: tool,
          }))
        );

        if (toolsError) throw toolsError;
      }

      // 7. Manejo de documentos (CV)
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

      showSuccess('Profile updated successfully');

      if (forcedToCompleteProfile) {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Error saving profile:', error);
      const message =
        error instanceof Error ? error.message : 'Error updating profile';
      showError(message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!initialValues) return <div>Error loading profile</div>;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={profileSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form className="w-full max-w-xl bg-white/10 backdrop-blur p-8 rounded-2xl shadow-xl space-y-4">
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/icons/carga.svg"
              alt="Profile logo"
              width={64}
              height={64}
              className="mb-2"
            />
            <h1 className="text-2xl font-display font-bold text-center mb-4">
              Profile
            </h1>
          </div>
          <ProfileImageUpload />
          <BasicInfoSection countries={countries} roles={roles} />
          <CustomerBasicInfo />
          <FormInput name="first_name" label="First Name" />
          <FormInput name="last_name" label="Last Name" />
          <FormSelect
            name="country_id"
            label="Country"
            options={countries.map((c) => ({ value: c.id, label: c.name }))}
          />
          <FormSelect
            name="role_id"
            label="Role"
            options={roles.map((r) => ({ value: r.id, label: r.name }))}
          />
          <UploadDocumentField />
          <FormInput name="linkedin_profile" label="LinkedIn Profile" />
          <FormInput name="other_link" label="Other Link" />
          <FormInput name="profession" label="Profession" />
          <FormInput
            name="bio"
            label="Bio"
            as="textarea"
            placeholder="Write a short bio"
            rows={5}
          />
          <ExpertiseSection />
          <SkillsSection />
          <ToolsSection />
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full bg-[#67ff94] text-[#2c3d5a] py-3 rounded-xl font-semibold hover:bg-[#8effd2] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
