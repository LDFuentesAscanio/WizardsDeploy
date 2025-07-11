'use client';

import { Formik, Form } from 'formik';
import FormInput from '@/components/atoms/FormInput';
import FormSelect from '@/components/atoms/FormSelect';
import { profileSchema } from '@/validations/profile-validations';
import { useProfileFormData } from './useProfileFormData';
import { supabase } from '@/utils/supabase/client';
import { ProfileFormValues } from './types';
import Image from 'next/image';
import ExpertiseSection from './ExpertiseSection';
import SkillsSection from './SkillsSection';
import ToolsSection from './ToolsSection';
import ProfileImageUpload from '@/components/molecules/ProfileImageUpload';
import UploadDocumentField from '@/components/molecules/UploadDocumentField';

export default function ProfileForm() {
  const { initialValues, countries, roles, loading } = useProfileFormData();

  const handleSubmit = async (values: ProfileFormValues) => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return;

    // ✅ Verificar si hubo cambios antes de enviar
    if (JSON.stringify(values) === JSON.stringify(initialValues)) {
      alert('No hay cambios para guardar.');
      return;
    }

    // 🧩 Actualizar datos del usuario
    const { error: userError } = await supabase.from('users').upsert({
      id: user.id,
      first_name: values.first_name,
      last_name: values.last_name,
      country_id: values.country_id,
      role_id: values.role_id,
      linkedin_profile: values.linkedin_profile,
      other_link: values.other_link,
    });
    await supabase.from('user_media').upsert(
      {
        user_id: user.id,
        url_storage: values.photo_url,
        filename: values.photo_url?.split('/').pop() || '',
      },
      { onConflict: 'user_id' }
    );

    // ✅ Upsert en la tabla about para evitar error 409
    const { error: aboutError } = await supabase.from('about').upsert(
      {
        user_id: user.id,
        bio: values.bio,
        profession: values.profession,
      },
      { onConflict: 'user_id' }
    );

    // 🔄 Reemplazar toda la experticia
    await supabase.from('user_expertise').delete().eq('user_id', user.id);

    const insertExpertise = values.expertise.map((e) => ({
      user_id: user.id,
      platform_id: e.platform_id,
      rating: Number(e.rating),
      experience_time: e.experience_time,
    }));

    const { error: expertiseError } = await supabase
      .from('user_expertise')
      .insert(insertExpertise);

    // 🔄 Reemplazar skills y tools
    await supabase.from('skills').delete().eq('user_id', user.id);
    await supabase.from('tools').delete().eq('user_id', user.id);

    const skillsPayload = values.skills.map((skill) => ({
      user_id: user.id,
      skill_name: skill,
    }));

    const toolsPayload = values.tools.map((tool) => ({
      user_id: user.id,
      tool_name: tool,
    }));

    const { error: skillsError } = await supabase
      .from('skills')
      .insert(skillsPayload);
    const { error: toolsError } = await supabase
      .from('tools')
      .insert(toolsPayload);

    // ✅ Manejo de errores
    if (
      userError ||
      aboutError ||
      expertiseError ||
      skillsError ||
      toolsError
    ) {
      console.error({
        userError,
        aboutError,
        expertiseError,
        skillsError,
        toolsError,
      });
      alert('Error al guardar el perfil');
    } else {
      alert('¡Perfil actualizado con éxito!');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#2c3d5a] text-white">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (!initialValues) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#2c3d5a] text-white">
        <p>Error loading profile. Please refresh.</p>
      </main>
    );
  }

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
            <h1 className="text-2xl font-bold text-center mb-4">
              Edit Your Profile
            </h1>
          </div>
          <ProfileImageUpload />
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
