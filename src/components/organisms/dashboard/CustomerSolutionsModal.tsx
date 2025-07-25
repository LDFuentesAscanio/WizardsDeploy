'use client';

import { Dialog } from '@headlessui/react';
import { Formik, Form, FieldArray } from 'formik';
import FormInput from '@/components/atoms/FormInput';
import FormCheckbox from '@/components/atoms/FormCheckbox';
import { solutionModalSchema } from '@/validations/solutionModalSchema';

type Solution = {
  id: string;
  name: string;
};

type FormValues = {
  lookingForExpert: boolean;
  selectedSolutions: string[];
  description: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  solutions: Solution[];
  initialValues: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
};

export default function CustomerSolutionModal({
  isOpen,
  onClose,
  solutions,
  initialValues,
  onSubmit,
}: Props) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-[#2c3d5a] text-white p-6 rounded-xl w-full max-w-lg">
          <Formik
            initialValues={{
              lookingForExpert: initialValues.lookingForExpert ?? false,
              selectedSolutions: initialValues.selectedSolutions ?? [],
              description: initialValues.description ?? '',
              acceptedTerms: initialValues.acceptedTerms ?? false,
              acceptedPrivacy: initialValues.acceptedPrivacy ?? false,
            }}
            validationSchema={solutionModalSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, isValid, isSubmitting }) => (
              <Form className="space-y-6">
                <Dialog.Title className="text-xl font-bold">
                  Are you looking for an expert?
                </Dialog.Title>

                <FormCheckbox
                  name="lookingForExpert"
                  label="Yes, I'm looking for an expert"
                  onChange={(e) => {
                    if (!e.target.checked) {
                      setFieldValue('selectedSolutions', []);
                      setFieldValue('description', '');
                    }
                  }}
                />

                {values.lookingForExpert && (
                  <>
                    <div>
                      <p className="text-sm font-semibold mb-2">Solutions</p>
                      <div className="space-y-2">
                        <FieldArray name="selectedSolutions">
                          {() => (
                            <>
                              {solutions.map((solution) => (
                                <FormCheckbox
                                  key={solution.id}
                                  name={`solution-${solution.id}`}
                                  label={solution.name}
                                  onChange={(e) => {
                                    const newSelection = e.target.checked
                                      ? [
                                          ...values.selectedSolutions,
                                          solution.id,
                                        ]
                                      : values.selectedSolutions.filter(
                                          (id) => id !== solution.id
                                        );
                                    setFieldValue(
                                      'selectedSolutions',
                                      newSelection
                                    );
                                  }}
                                  checked={values.selectedSolutions.includes(
                                    solution.id
                                  )}
                                />
                              ))}
                            </>
                          )}
                        </FieldArray>
                      </div>
                    </div>

                    <FormInput
                      name="description"
                      label="Describe your challenge"
                      placeholder="e.g. I need help setting up Jira workflows..."
                      as="textarea"
                      rows={4}
                    />

                    {/* Terms and Privacy */}
                    <div className="pt-4 space-y-3 border-t border-white/20">
                      <FormCheckbox
                        name="acceptedTerms"
                        label={
                          <>
                            I accept the{' '}
                            <a
                              href="/terms"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-[#67ff94]"
                            >
                              terms and conditions
                            </a>
                          </>
                        }
                      />

                      <FormCheckbox
                        name="acceptedPrivacy"
                        label={
                          <>
                            I agree to the{' '}
                            <a
                              href="/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-[#67ff94]"
                            >
                              privacy policy
                            </a>
                          </>
                        }
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      !isValid ||
                      isSubmitting ||
                      (values.lookingForExpert &&
                        (!values.acceptedTerms || !values.acceptedPrivacy))
                    }
                    className="flex-1 py-2 bg-white text-[#2c3d5a] font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Solutions'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Dialog>
  );
}
