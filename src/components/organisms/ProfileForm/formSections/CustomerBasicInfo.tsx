'use client';

import FormInput from '@/components/atoms/FormInput';

export function CustomerBasicInfo() {
  return (
    <section className="grid gap-4">
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
