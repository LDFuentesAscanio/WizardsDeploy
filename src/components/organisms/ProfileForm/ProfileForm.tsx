'use client';
import { Formik, Form } from 'formik';
import { useProfileFormData } from './useProfileFormData';
import { getProfileSchema } from '@/validations/profile-validations';
import { useProfileSubmit } from '@/hooks/useProfileSubmit';
import { CommonSection } from './formSections/CommonSection';
import CustomerSections from './formSections/CustomerSections';
import { ExpertInfoSection } from './formSections/ExpertInfoSection';

export default function ProfileForm() {
  const {
    initialValues,
    countries,
    roles,
    loading,
    professions,
    platforms,
    roleName,
  } = useProfileFormData();

  const { handleSubmit } = useProfileSubmit();

  if (loading) return <div>Loading...</div>;
  if (!initialValues) return <div>Error loading profile</div>;

  const isCustomer = roleName?.toLowerCase() === 'customer';
  const isExpert = roleName?.toLowerCase() === 'expert';

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getProfileSchema(roleName)}
      onSubmit={(values) =>
        handleSubmit(values, initialValues, isCustomer, isExpert)
      }
    >
      {({ isSubmitting }) => (
        <Form className="w-full max-w-xl bg-white/10 backdrop-blur p-8 rounded-2xl shadow-xl space-y-4">
          <h1 className="text-2xl font-display font-bold text-center">
            Profile
          </h1>

          <CommonSection
            countries={countries}
            roles={roles}
            roleName={roleName}
          />

          {isCustomer && <CustomerSections roleName={roleName} />}

          {isExpert && (
            <ExpertInfoSection
              professions={professions}
              platforms={platforms}
            />
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#67ff94] text-[#2c3d5a] py-3 rounded-xl font-semibold hover:bg-[#8effd2] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
