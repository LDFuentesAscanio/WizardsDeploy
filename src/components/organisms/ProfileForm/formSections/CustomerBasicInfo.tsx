'use client';

import FormInput from '@/components/atoms/FormInput';
import ImageUploader from '@/components/molecules/ImageUpload';
import { useFormikContext } from 'formik';
import type { ProfileFormValues } from '../types';

type Props = {
  roleName: string | null;
};

export function CustomerBasicInfo({ roleName }: Props) {
  const { values } = useFormikContext<ProfileFormValues>();

  return (
    <section className="grid gap-4">
      <ImageUploader
        label="Company Logo"
        type="company_logo"
        initialUrl={values.company_logo_url}
        roleName={roleName}
      />

      <FormInput
        label="Your company's name?"
        name="company_name"
        placeholder="Company name"
      />

      <FormInput
        label="What's your Job Title?"
        name="job_title"
        placeholder="Your current position"
      />

      <FormInput
        label="What's the email address of your company?"
        name="email"
        placeholder="Company email"
        type="email"
      />

      <FormInput
        name="description"
        label="Description of your company"
        as="textarea"
        placeholder="Briefly describe what your company does"
        rows={5}
      />
    </section>
  );
}
