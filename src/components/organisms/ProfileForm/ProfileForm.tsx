'use client';
// External libraries
import Image from 'next/image';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// Utilities
import { supabase } from '@/utils/supabase/client';
import { useProfileFormData } from './useProfileFormData';
import { forcedToCompleteProfile } from '@/hooks/useForceProfileCompletion';
import { showSuccess, showError, showInfo } from '@/utils/toastService';
// Validations, types and interfaces
import { isCustomerProfile, isExpertProfile, ProfileFormValues } from './types';
// UI local components
import { BasicInfoSection } from './formSections/BasicInfoSection';
import { CustomerBasicInfo } from './formSections/CustomerBasicInfo';
import CustomerSolutionsSection from './formSections/CustomerSolutionsSection';
import { ExpertInfoSection } from './formSections/ExpertInfoSection';
// UI global components
import ProfileImageUpload from '@/components/molecules/ProfileImageUpload';
import { getProfileSchema } from '@/validations/profile-validations';

export default function ProfileForm() {
  const { initialValues, countries, roles, loading, solutions } =
    useProfileFormData();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues?.role_id) {
      // Suponiendo que roles es un array de {id: string, name: string}
      const role = roles.find((r) => r.id === initialValues.role_id);
      setUserRole(role?.name || null);
    }
  }, [initialValues, roles]);

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
      console.log('🧪 ¿Es customer profile?', isCustomerProfile(values));
      // 2. Actualizar según rol usando type guards
      if (isCustomer) {
        console.log('🛠️ Enviando datos de Customer:', {
          company_name: values.company_name,
          actual_role: values.actual_role,
          accepted_privacy_policy: values.accepted_privacy_policy,
          accepted_terms_conditions: values.accepted_terms_conditions,
          selected_solutions: values.selected_solutions,
          solution_description: values.solution_description,
        });
        // Actualizar datos de customer
        const { error: customerError } = await supabase
          .from('customers')
          .upsert({
            user_id: user.id,
            company_name: values.company_name,
            actual_role: values.actual_role,
            accepted_privacy_policy: values.accepted_privacy_policy,
            accepted_terms_conditions: values.accepted_terms_conditions,
          });
        if (customerError) throw customerError;
        // 1. Obtener customer_id
        const { data: customerRow, error: customerIdError } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (customerIdError || !customerRow) {
          throw new Error('Customer ID not found');
        }

        const customer_id = customerRow.id;

        // 2. Eliminar soluciones anteriores
        await supabase
          .from('contracted_solutions')
          .delete()
          .eq('customer_id', customer_id);

        // 3. Insertar nuevas soluciones seleccionadas
        const selectedSolutions = values.selected_solutions ?? [];

        if (selectedSolutions.length > 0) {
          const { error: solutionInsertError } = await supabase
            .from('contracted_solutions')
            .insert(
              selectedSolutions.map((solution_id) => ({
                customer_id,
                solution_id,
                description_solution: values.solution_description || '',
                is_active: true,
                contract_date: new Date().toISOString().split('T')[0],
              }))
            );

          if (solutionInsertError) throw solutionInsertError;
        }
      }

      if (isExpert) {
        // Actualizar datos de expert
        const { error: aboutError } = await supabase.from('about').upsert(
          {
            user_id: user.id,
            bio: values.bio || '',
            profession: isExpertProfile(values)
              ? values.profession || ''
              : null,
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

        const expertise = values.expertise ?? [];
        if (expertise.length > 0) {
          const { error: expertiseError } = await supabase
            .from('user_expertise')
            .insert(
              expertise.map((e) => ({
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
        const skills = values.skills ?? [];
        if (skills.length > 0) {
          const { error: skillsError } = await supabase.from('skills').insert(
            skills.map((skill) => ({
              user_id: user.id,
              skill_name: skill,
            }))
          );
          if (skillsError) throw skillsError;
        }

        // 6. Manejo de tools (eliminar y recrear)
        await supabase.from('tools').delete().eq('user_id', user.id);
        const tools = values.tools ?? [];
        if (tools.length > 0) {
          const { error: toolsError } = await supabase.from('tools').insert(
            tools.map((tool) => ({
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

  const isExpert = userRole === 'expert';
  const isCustomer = userRole === 'customer';

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getProfileSchema(userRole)}
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

          {/* Secciones comunes a todos los roles */}
          <ProfileImageUpload />
          <BasicInfoSection countries={countries} roles={roles} />

          {/* Secciones específicas para Customer */}
          {isCustomer && (
            <>
              <CustomerBasicInfo />
              <CustomerSolutionsSection solutions={solutions} />
            </>
          )}

          {/* Secciones específicas para Expert */}
          {isExpert && <ExpertInfoSection />}

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
