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
    </section>
  );
}
