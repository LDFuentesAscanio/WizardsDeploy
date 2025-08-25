'use client';

import { Dialog } from '@headlessui/react';
import { Formik, Form, FieldArray } from 'formik';
import { AnimatePresence, motion } from 'framer-motion'; // 🧠 agregado
import FormInput from '@/components/atoms/FormInput';
import FormCheckbox from '@/components/atoms/FormCheckbox';
import { showError, showSuccess } from '@/utils/toastService';
import { supabase } from '@/utils/supabase/browserClient';
import { categoryModalSchema } from '@/validations/CategoryModalSchema';
import { saveCustomerCategories } from '@/utils/saveCategories';

type Category = {
  id: string;
  name: string;
};

type FormValues = {
  lookingForExpert: boolean;
  selectedCategories: string[];
  description: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialValues: Partial<FormValues>;
  onSubmit?: (values: FormValues) => void | Promise<void>;
};

export default function CustomerCategoryModal({
  isOpen,
  onClose,
  categories,
  initialValues,
  onSubmit,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60"
            aria-hidden="true"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="bg-[#2c3d5a] text-white p-6 rounded-xl w-full max-w-lg"
            >
              <Formik
                initialValues={{
                  lookingForExpert: initialValues.lookingForExpert ?? false,
                  selectedCategories: initialValues.selectedCategories ?? [],
                  description: initialValues.description ?? '',
                }}
                validationSchema={categoryModalSchema}
                onSubmit={async (values) => {
                  try {
                    const { data: authUser } = await supabase.auth.getUser();
                    const user_id = authUser.user?.id;
                    if (!user_id) throw new Error('No user authenticated');

                    await saveCustomerCategories({
                      user_id,
                      selectedCategories: values.selectedCategories,
                      description: values.description,
                    });

                    if (onSubmit) {
                      await onSubmit(values);
                    }

                    showSuccess('Solutions updated successfully!');
                    onClose();
                  } catch (error) {
                    showError('Error saving solutions');
                    console.error('Modal save error:', error);
                  }
                }}
                enableReinitialize
              >
                {({ values, setFieldValue, isValid, isSubmitting }) => (
                  <Form className="space-y-6">
                    <h2 id="modal-title" className="text-xl font-bold">
                      Are you looking for an expert?
                    </h2>

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
                          <p className="text-sm font-semibold mb-2">
                            Solutions
                          </p>
                          <div className="space-y-2">
                            <FieldArray name="selectedSolutions">
                              {() => (
                                <>
                                  {categories.map((category) => (
                                    <FormCheckbox
                                      key={category.id}
                                      name="selectedCategories"
                                      label={category.name}
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        setFieldValue(
                                          'selectedCategories',
                                          checked ? [category.id] : []
                                        );
                                      }}
                                      checked={values.selectedCategories.includes(
                                        category.id
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
                        disabled={!isValid || isSubmitting}
                        className="flex-1 py-2 bg-white text-[#2c3d5a] font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Solutions'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
