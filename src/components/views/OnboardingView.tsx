'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import { onboardingSchema } from '@/validations/onboarding-validations';
import { supabase } from '@/utils/supabase/client';
import { useOnboarding } from '@/hooks/useOnboarding';
import FormInput from '@/components/atoms/FormInput';
import FormSelect from '@/components/atoms/FormSelect';

interface OnboardingFormValues {
  first_name: string;
  last_name: string;
  role: string;
}

function GoogleAutofillHandler() {
  const { setFieldValue } = useFormikContext<OnboardingFormValues>();

  useEffect(() => {
    const autofill = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.user_metadata) {
        const { full_name } = user.user_metadata;
        if (full_name && typeof full_name === 'string') {
          const [first_name, ...rest] = full_name.split(' ');
          const last_name = rest.join(' ');

          setFieldValue('first_name', first_name);
          setFieldValue('last_name', last_name);
        }
      }
    };

    autofill();
  }, [setFieldValue]);

  return null;
}

export default function OnboardingView() {
  const { saveUserProfile, loading } = useOnboarding();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (values: OnboardingFormValues) => {
    setSubmitError(null);
    try {
      await saveUserProfile(values);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#2c3d5a] px-4 text-[#e7e7e7]">
      <Formik<OnboardingFormValues>
        initialValues={{
          first_name: '',
          last_name: '',
          role: '',
        }}
        validationSchema={onboardingSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="max-w-xl w-full bg-white/10 backdrop-blur p-10 rounded-3xl shadow-lg text-center">
            <GoogleAutofillHandler />

            <Image
              src="/icons/carga.svg"
              alt="Wizards logo"
              width={64}
              height={64}
              className="mx-auto mb-6"
            />

            <h1 className="text-3xl font-bold text-[#67ff94] mb-6">
              Complete your profile
            </h1>

            {submitError && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded-lg">
                {submitError}
              </div>
            )}

            <div className="space-y-4 text-left">
              <FormInput name="first_name" placeholder="First Name" />
              <FormInput name="last_name" placeholder="Last Name" />
              <FormSelect
                name="role"
                options={[
                  { value: 'Expert', label: 'Expert' },
                  { value: 'Customer', label: 'Customer' },
                ]}
              />
            </div>

            <button
              type="submit"
              disabled={loading || isSubmitting || !isValid}
              className="mt-6 w-full bg-[#67ff94] text-[#0F172A] py-3 rounded-xl font-semibold hover:bg-[#8effd2] transition-colors disabled:opacity-50"
            >
              {loading || isSubmitting ? 'Saving...' : 'Continue'}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}
