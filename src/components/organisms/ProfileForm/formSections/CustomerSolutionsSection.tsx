'use client';

import FormCheckbox from '@/components/atoms/FormCheckbox';
import FormInput from '@/components/atoms/FormInput';

import { useFormikContext } from 'formik';
import { useState } from 'react';

type Solution = {
  id: string;
  name: string;
};

type Props = {
  solutions: Solution[];
};

type FormValues = {
  looking_for_expert: boolean;
  selected_solutions: string[];
  solution_description: string;
  accepted_privacy_policy: boolean;
  accepted_terms_conditions: boolean;
};

export default function CustomerSolutionsSection({ solutions }: Props) {
  const { values, setFieldValue } = useFormikContext<FormValues>();
  const [showSolutions, setShowSolutions] = useState<boolean>(false);
  //(values.looking_for_expert ?? false);

  const handleCheckboxChange = () => {
    const newValue = !showSolutions;
    setShowSolutions(newValue);
    setFieldValue('looking_for_expert', newValue);

    if (!newValue) setFieldValue('selected_solutions', []);
  };

  const handleSolutionToggle = (id: string) => {
    const current = values.selected_solutions || [];
    if (current.includes(id)) {
      setFieldValue(
        'selected_solutions',
        current.filter((item: string) => item !== id)
      );
    } else {
      setFieldValue('selected_solutions', [...current, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mostrar formulario si busca experto */}
      <FormCheckbox
        name="looking_for_expert"
        label="Are you looking for an expert?"
        className="text-white"
        onChange={handleCheckboxChange}
      />

      {values.looking_for_expert && (
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-white mb-2">Solutions</p>
            <div className="space-y-2">
              {solutions.map((solution) => (
                <label
                  key={solution.id}
                  className="flex items-center space-x-2 text-white text-sm"
                >
                  <input
                    type="checkbox"
                    checked={
                      values.selected_solutions?.includes(solution.id) || false
                    }
                    onChange={() => handleSolutionToggle(solution.id)}
                    className="accent-white"
                  />
                  <span>{solution.name}</span>
                </label>
              ))}
            </div>
          </div>

          <FormInput
            name="solution_description"
            label="Briefly tell us about the challenges you are facing or any other need you are currently having:"
            placeholder="I need to redesign our Help Center in Zendesk... I need to create a new flow in Jira..."
            as="textarea"
          />

          <div className="space-y-2">
            <FormCheckbox
              name="accepted_privacy_policy"
              label={
                <>
                  I understand that the information provided by me is subject to
                  the{' '}
                  <a href="/privacy-policy" className="underline">
                    Privacy Policy
                  </a>
                </>
              }
            />
            <FormCheckbox
              name="accepted_terms_conditions"
              label={
                <>
                  By submitting this form, you agree to the{' '}
                  <a href="/terms-and-conditions" className="underline">
                    terms & conditions
                  </a>{' '}
                  and the{' '}
                  <a href="/privacy-policy" className="underline">
                    privacy policy
                  </a>
                </>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
