'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Formik, Form, FieldArray } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import FormInput from '@/components/atoms/FormInput';
import FormCheckbox from '@/components/atoms/FormCheckbox';
import { showError, showSuccess } from '@/utils/toastService';
import { supabase } from '@/utils/supabase/browserClient';
import { categoryModalSchema } from '@/validations/CategoryModalSchema';
import { saveCustomerCategories } from '@/utils/saveCategories';

type Category = { id: string; name: string };

type Subcategory = {
  id: string;
  name: string;
  category_id: string | null;
};

type ProjectLite = { id: string; project_name: string };

type FormValues = {
  lookingForExpert: boolean;
  categoryId: string;
  selectedCategories: string[];
  projectId: string;
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
  const [projects, setProjects] = useState<ProjectLite[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        setLoadingLists(true);
        const {
          data: { user },
          error: authErr,
        } = await supabase.auth.getUser();
        if (authErr) throw authErr;
        if (!user) return;

        const { data: customerRow, error: custErr } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        if (custErr) throw custErr;
        if (!customerRow?.id) return;

        const { data: projectRows, error: projErr } = await supabase
          .from('it_projects')
          .select('id, project_name')
          .eq('customer_id', customerRow.id);
        if (projErr) throw projErr;

        setProjects(
          (projectRows ?? []).map((p) => ({
            id: p.id,
            project_name: p.project_name,
          }))
        );
      } catch (e) {
        console.error('❌ Error loading projects:', e);
        showError('Error loading projects list');
      } finally {
        setLoadingLists(false);
      }
    })();
  }, [isOpen]);

  const fetchSubcategories = async (categoryId: string) => {
    try {
      if (!categoryId) {
        setSubcategories([]);
        return;
      }
      setLoadingLists(true);
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name, category_id')
        .eq('category_id', categoryId);

      if (error) throw error;
      setSubcategories((data as Subcategory[]) ?? []);
    } catch (e) {
      console.error('❌ Error loading subcategories:', e);
      showError('Error loading subcategories');
    } finally {
      setLoadingLists(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-[120]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60"
            aria-hidden="true"
          />

          {/* Modal center */}
          <div className="fixed inset-0 z-[120] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
                className="bg-[#2c3d5a] text-white rounded-xl w-full max-w-lg h-[85vh] overflow-hidden flex flex-col"
              >
                <Formik<FormValues>
                  initialValues={{
                    lookingForExpert: initialValues.lookingForExpert ?? false,
                    categoryId: initialValues.categoryId ?? '',
                    selectedCategories: initialValues.selectedCategories ?? [],
                    projectId: initialValues.projectId ?? '',
                    description: initialValues.description ?? '',
                  }}
                  validationSchema={categoryModalSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      const { data: authUser } = await supabase.auth.getUser();
                      const user_id = authUser.user?.id;
                      if (!user_id) throw new Error('No user authenticated');

                      await saveCustomerCategories({
                        user_id,
                        projectId: values.projectId,
                        selectedCategories: values.selectedCategories,
                        description: values.description,
                      });

                      if (onSubmit) await onSubmit(values);

                      showSuccess('Offer created successfully!');
                      onClose();
                    } catch (error) {
                      console.error('Modal save error:', error);
                      showError('Error saving offer');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  enableReinitialize
                >
                  {({ values, setFieldValue, isValid, isSubmitting }) => (
                    <Form className="flex flex-col h-full min-h-0">
                      {' '}
                      {/* Cambiado a h-full */}
                      {/* Header fijo */}
                      <div className="p-6 border-b border-white/10 flex-shrink-0">
                        <h2 id="modal-title" className="text-xl font-bold">
                          Looking for experts?
                        </h2>
                      </div>
                      {/* Scrollable content */}
                      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
                        <FormCheckbox
                          name="lookingForExpert"
                          label="Yes, I'm looking for experts"
                          onChange={(e) => {
                            if (!e.target.checked) {
                              setFieldValue('categoryId', '');
                              setFieldValue('selectedCategories', []);
                              setFieldValue('projectId', '');
                              setFieldValue('description', '');
                              setSubcategories([]);
                            }
                          }}
                          checked={values.lookingForExpert}
                        />

                        {values.lookingForExpert && (
                          <>
                            {/* Project */}
                            <div className="grid gap-2">
                              <label className="text-sm">Project</label>
                              <select
                                name="projectId"
                                value={values.projectId}
                                onChange={(e) =>
                                  setFieldValue('projectId', e.target.value)
                                }
                                disabled={loadingLists}
                                className="w-full px-4 py-3 rounded-xl bg-[#e7e7e7] text-[#2c3d5a]"
                              >
                                <option value="">Select a project</option>
                                {projects.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.project_name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Category */}
                            <div className="grid gap-2">
                              <label className="text-sm">Category</label>
                              <select
                                name="categoryId"
                                value={values.categoryId}
                                onChange={async (e) => {
                                  const newCat = e.target.value;
                                  setFieldValue('categoryId', newCat);
                                  setFieldValue('selectedCategories', []);
                                  await fetchSubcategories(newCat);
                                }}
                                disabled={loadingLists}
                                className="w-full px-4 py-3 rounded-xl bg-[#e7e7e7] text-[#2c3d5a]"
                              >
                                <option value="">Select a category</option>
                                {categories.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Subcategories */}
                            {values.categoryId && (
                              <div>
                                <p className="text-sm font-semibold mb-2">
                                  Subcategories
                                </p>
                                <div className="space-y-2">
                                  <FieldArray name="selectedCategories">
                                    {() => (
                                      <>
                                        {subcategories.map((sub) => {
                                          const isChecked =
                                            values.selectedCategories.includes(
                                              sub.id
                                            );
                                          return (
                                            <FormCheckbox
                                              key={sub.id}
                                              name="selectedCategories"
                                              label={sub.name}
                                              onChange={(e) => {
                                                const checked =
                                                  e.target.checked;
                                                setFieldValue(
                                                  'selectedCategories',
                                                  checked ? [sub.id] : []
                                                );
                                              }}
                                              checked={isChecked}
                                            />
                                          );
                                        })}
                                      </>
                                    )}
                                  </FieldArray>
                                </div>
                              </div>
                            )}

                            <FormInput
                              name="description"
                              label="Describe your need"
                              placeholder="e.g. We need a Salesforce expert to set up flows..."
                              as="textarea"
                              rows={4}
                            />
                          </>
                        )}
                      </div>
                      {/* Footer fijo */}
                      <div className="p-6 border-t border-white/10 flex-shrink-0">
                        <div className="flex gap-3">
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
                            {isSubmitting ? 'Saving...' : 'Create Offer'}
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </motion.div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
