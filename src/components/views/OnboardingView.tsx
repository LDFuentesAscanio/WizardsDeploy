'use client';

import { Formik, Form, useFormikContext } from 'formik';
import { useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { onboardingSchema } from '@/validations/onboarding-validations';
import { useOnboarding } from '@/hooks/useOnboarding';
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

  return null; // 👈 No renderiza nada visible
}

export default function OnboardingView() {
  const { saveUserProfile, loading } = useOnboarding();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4 text-white">
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
          <Form className="max-w-md w-full bg-white/10 backdrop-blur p-8 rounded-2xl shadow-xl">
            {/* Autofill invisible logic */}
            <GoogleAutofillHandler />

            <h1 className="text-2xl font-bold mb-6 text-center">
              Complete your profile
            </h1>

            <div className="space-y-4">
              <FormInput name="first_name" placeholder="First Name" />
              <FormInput name="last_name" placeholder="Last Name" />
              <FormSelect
                name="role"
                options={[
                  { value: 'expert', label: 'Expert' },
                  { value: 'customer', label: 'Customer' },
                ]}
              />
              <button
                type="submit"
                disabled={loading || isSubmitting || !isValid}
                className="w-full bg-green-500 py-3 rounded-xl font-semibold hover:bg-green-400 disabled:opacity-50"
              >
                {loading || isSubmitting ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
}
