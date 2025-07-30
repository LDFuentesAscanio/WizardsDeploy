'use client';

import FormInput from '@/components/atoms/FormInput';
import FormSelect from '@/components/atoms/FormSelect';
import { Country, Role } from '../types';
import ImageUploader from '@/components/molecules/ImageUpload';
import { useFormikContext } from 'formik';
import type { ProfileFormValues } from '../types';

type Props = {
  countries: Country[];
  roles: Role[];
};

export function CommonSection({ countries, roles }: Props) {
  const { values } = useFormikContext<ProfileFormValues>();
  return (
    <>
      <ImageUploader
        label="Profile Photo"
        type="avatar"
        initialUrl={values.photo_url}
      />
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

        <div>
          <FormSelect
            name="role_id"
            label="Role"
            options={roles.map((r) => ({ value: r.id, label: r.name }))}
            disabled={true}
          />
          <p className="text-xs text-gray-400 mt-1">
            To request a role change, please email us at{' '}
            <a
              href="mailto:support@wizards.lat"
              className="underline text-blue-300 hover:text-blue-400"
            >
              support@wizards.lat
            </a>
          </p>
        </div>

        <FormInput name="linkedin_profile" label="LinkedIn Profile" />

        <FormInput name="other_link" label="Website" />
      </div>
    </>
  );
}
