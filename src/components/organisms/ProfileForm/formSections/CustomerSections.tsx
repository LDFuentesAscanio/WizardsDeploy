'use client';

import FormCheckbox from '@/components/atoms/FormCheckbox';
import { CustomerBasicInfo } from './CustomerBasicInfo';

type Props = {
  roleName: string | null;
};

export default function CustomerSections({ roleName }: Props) {
  return (
    <>
      <CustomerBasicInfo roleName={roleName} />

      <div className="pt-4 space-y-3">
        <FormCheckbox
          name="accepted_terms_conditions"
          label={
            <>
              I accept the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                terms and conditions
              </a>
            </>
          }
        />
        <FormCheckbox
          name="accepted_privacy_policy"
          label={
            <>
              I agree to the{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                privacy policy
              </a>
            </>
          }
        />
      </div>
    </>
  );
}
