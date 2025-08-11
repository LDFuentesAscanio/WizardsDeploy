'use client';
import { Formik, Form } from 'formik';
import { useState, useEffect } from 'react';
import { useProfileFormData } from './useProfileFormData';
import { getProfileSchema } from '@/validations/profile-validations';
import { useProfileSubmit } from '@/hooks/useProfileSubmit';
import { CommonSection } from './formSections/CommonSection';
import CustomerSections from './formSections/CustomerSections';
import { ExpertInfoSection } from './formSections/ExpertInfoSection';

export default function ProfileForm() {
  const { initialValues, countries, roles, loading, solutions, professions } =
    useProfileFormData();
  const [userRole, setUserRole] = useState<string | null>(null);
  const { handleSubmit } = useProfileSubmit();

  useEffect(() => {
    if (initialValues?.role_id) {
      const role = roles.find((r) => r.id === initialValues.role_id);
      setUserRole(role?.name || null);
    }
  }, [initialValues, roles]);

  if (loading) return <div>Loading...</div>;
  if (!initialValues) return <div>Error loading profile</div>;

  const isCustomer = userRole?.toLowerCase() === 'customer';
  const isExpert = userRole?.toLowerCase() === 'expert';

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getProfileSchema(userRole)}
      onSubmit={(values) =>
        handleSubmit(values, initialValues, isCustomer, isExpert)
      }
    >
      {({ isSubmitting, isValid }) => (
        <Form className="w-full max-w-xl bg-white/10 backdrop-blur p-8 rounded-2xl shadow-xl space-y-4">
          <h1 className="text-2xl font-display font-bold text-center">
            Profile
          </h1>
          <CommonSection countries={countries} roles={roles} />
          {isCustomer && <CustomerSections solutions={solutions} />}
          {isExpert && <ExpertInfoSection professions={professions} />}
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
