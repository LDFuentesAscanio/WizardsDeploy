'use client';
//External libraries
import Image from 'next/image';
import { useEffect } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
//Validations, types and interfaces
import { onboardingSchema } from '@/validations/onboarding-validations';
//Utilities
import { supabase } from '@/utils/supabase/client';
import { useOnboarding } from '@/hooks/useOnboarding';
//UI global components
import FormInput from '@/components/atoms/FormInput';
import FormSelect from '@/components/atoms/FormSelect';

function GoogleAutofillHandler() {
  const { setFieldValue } = useFormikContext();

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

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#2c3d5a] px-4 text-[#e7e7e7]">
      <Formik
        initialValues={{
          first_name: '',
          last_name: '',
          role: '',
        }}
        validationSchema={onboardingSchema}
        onSubmit={async (values) => {
          await saveUserProfile(values);
        }}
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

            <div className="space-y-4 text-left">
              <FormInput name="first_name" placeholder="First Name" />
              <FormInput name="last_name" placeholder="Last Name" />
              <FormSelect
                name="role"
                options={[
                  { value: 'expert', label: 'Expert' },
                  { value: 'customer', label: 'Customer' },
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
