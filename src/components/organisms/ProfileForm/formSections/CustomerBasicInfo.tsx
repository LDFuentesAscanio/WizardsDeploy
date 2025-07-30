'use client';

import FormInput from '@/components/atoms/FormInput';
import ImageUploader from '@/components/molecules/ImageUpload';
import { useFormikContext } from 'formik';
import type { ProfileFormValues } from '../types';

export function CustomerBasicInfo() {
  const { values } = useFormikContext<ProfileFormValues>();

  return (
    <section className="grid gap-4">
      <ImageUploader
        label="Company Logo"
        type="company_logo"
        initialUrl={values.company_logo_url}
      />
      <FormInput
        label="Your company's name?"
        name="company_name"
        placeholder="Company name"
      />

      <FormInput
        label="What's your actual role?"
        name="actual_role"
        placeholder="Your current position"
      />

      <FormInput
        label="Email"
        name="email"
        placeholder="Company email"
        type="email"
      />

      <FormInput
        name="bio"
        label="Description of your company"
        as="textarea"
        placeholder="Briefly describe what your company does"
        rows={5}
      />
    </section>
  );
}
