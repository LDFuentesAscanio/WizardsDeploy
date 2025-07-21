'use client';
import FormCheckbox from '@/components/atoms/FormCheckbox';
import FormInput from '@/components/atoms/FormInput';
import { useFormikContext } from 'formik';
import { ProfileFormValues } from '../types';

type Solution = {
  id: string;
  name: string;
};

type Props = {
  solutions: Solution[];
};

export default function CustomerSolutionsSection({ solutions }: Props) {
  const { values, setFieldValue } = useFormikContext<ProfileFormValues>();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setFieldValue('looking_for_expert', newValue);
    if (!newValue) {
      setFieldValue('selected_solutions', []);
      setFieldValue('solution_description', '');
    }
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
      {/* Checkbox: looking_for_expert */}
      <FormCheckbox
        name="looking_for_expert"
        label="Are you looking for an expert?"
        className="text-white"
        onChange={handleCheckboxChange}
      />

      {/* Si selecciona looking_for_expert, se muestran las soluciones y el input */}
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
        </div>
      )}

      {/* ✅ Checkboxes para términos y privacidad (con nombres correctos) */}
      <div className="space-y-2 pt-4">
        <FormCheckbox
          name="accepted_terms_conditions"
          label={
            <>
              I accept the{' '}
              <a href="/terms" target="_blank" className="underline">
                terms and conditions
              </a>
              .
            </>
          }
          className="text-white"
        />

        <FormCheckbox
          name="accepted_privacy_policy"
          label={
            <>
              I agree to the{' '}
              <a href="/privacy" target="_blank" className="underline">
                privacy policy
              </a>
              .
            </>
          }
          className="text-white"
        />
      </div>
    </div>
  );
}
