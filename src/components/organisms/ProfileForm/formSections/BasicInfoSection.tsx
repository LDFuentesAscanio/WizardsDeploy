'use client';

import FormInput from '@/components/atoms/FormInput';
import FormSelect from '@/components/atoms/FormSelect';
import { Country, Role } from '../types';

type Props = {
  countries: Country[];
  roles: Role[];
};

export function BasicInfoSection({ countries, roles }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <FormInput
        label="First Name"
        name="first_name"
        placeholder="Enter your first name"
      />

      <FormInput
        label="Last Name"
        name="last_name"
        placeholder="Enter your last name"
      />

      <FormSelect
        name="country_id"
        label="Country"
        options={countries.map((c) => ({ value: c.id, label: c.name }))}
      />

      <FormSelect
        name="role_id"
        label="Role"
        options={roles.map((r) => ({ value: r.id, label: r.name }))}
      />
      <FormInput name="linkedin_profile" label="LinkedIn Profile" />

      <FormInput name="other_link" label="Website" />
    </div>
  );
}
