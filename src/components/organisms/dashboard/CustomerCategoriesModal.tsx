// src/components/organisms/dashboard/CustomerCategoriesModal.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Formik, Form, FieldArray } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import FormInput from '@/components/atoms/FormInput';
import FormCheckbox from '@/components/atoms/FormCheckbox';
import FormSelect from '@/components/atoms/FormSelect';
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

type SelectOption = { value: string; label: string };

type SkillItem = { skill_name: string; skill_level: number };
type ToolItem = { tool_name: string };

type FormValues = {
  lookingForExpert: boolean;
  categoryId: string;
  selectedCategories: string[]; // tomamos el primero
  projectId: string;
  description: string;
  contracted_profession_id: string;
  contracted_expertise_id: string;
  skills: SkillItem[];
  tools: ToolItem[];
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
  const [loadingLists, setLoadingLists] = useState<boolean>(false);

  const [professionOpts, setProfessionOpts] = useState<SelectOption[]>([
    { value: '', label: 'Select an option' },
  ]);
  const [expertiseOpts, setExpertiseOpts] = useState<SelectOption[]>([
    { value: '', label: 'Select an option' },
  ]);

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

        const { data: profs, error: profErr } = await supabase
          .from('contracted_professions')
          .select('id, profession_name')
          .order('profession_name', { ascending: true });
        if (profErr) throw profErr;
        setProfessionOpts(
          (profs ?? []).length
            ? [
                { value: '', label: 'Select an option' },
                ...(profs ?? []).map((p) => ({
                  value: p.id,
                  label: p.profession_name,
                })),
              ]
            : [{ value: '', label: 'Select an option' }]
        );

        const { data: exps, error: expErr } = await supabase
          .from('contracted_expertise')
          .select('id, expertise_name')
          .order('expertise_name', { ascending: true });
        if (expErr) throw expErr;
        setExpertiseOpts(
          (exps ?? []).length
            ? [
                { value: '', label: 'Select an option' },
                ...(exps ?? []).map((e) => ({
                  value: e.id,
                  label: e.expertise_name,
                })),
              ]
            : [{ value: '', label: 'Select an option' }]
        );
      } catch (e) {
        console.error('❌ Error loading lists:', e);
        showError('Error loading lists');
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

  const resolvedInitialValues: FormValues = useMemo(
    () => ({
      lookingForExpert: initialValues.lookingForExpert ?? false,
      categoryId: initialValues.categoryId ?? '',
      selectedCategories: initialValues.selectedCategories ?? [],
      projectId: initialValues.projectId ?? '',
      description: initialValues.description ?? '',
      contracted_profession_id: initialValues.contracted_profession_id ?? '',
      contracted_expertise_id: initialValues.contracted_expertise_id ?? '',
      skills: (initialValues.skills as SkillItem[] | undefined) ?? [],
      tools: (initialValues.tools as ToolItem[] | undefined) ?? [],
    }),
    [initialValues]
  );

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
                  initialValues={resolvedInitialValues}
                  validationSchema={categoryModalSchema}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                      const {
                        data: { user },
                        error: authErr,
                      } = await supabase.auth.getUser();
                      if (authErr) throw authErr;
                      const userId = user?.id;
                      if (!userId) throw new Error('No user authenticated');

                      const subcategoryId =
                        values.selectedCategories?.[0] ?? '';
                      if (!subcategoryId)
                        throw new Error('Please select one subcategory');
                      if (!values.projectId)
                        throw new Error('Please select a project');

                      await saveCustomerCategories({
                        supabase,
                        userId,
                        projectId: values.projectId,
                        subcategoryId,
                        description: values.description,
                        contracted_profession_id:
                          values.contracted_profession_id,
                        contracted_expertise_id: values.contracted_expertise_id,
                        skills: values.skills,
                        tools: values.tools,
                      });

                      if (onSubmit) await onSubmit(values);

                      showSuccess('Offer created successfully!');
                      resetForm();
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
                      {/* Header */}
                      <div className="p-6 border-b border-white/10 flex-shrink-0">
                        <h2 id="modal-title" className="text-xl font-bold">
                          Looking for experts?
                        </h2>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
                        <FormCheckbox
                          name="lookingForExpert"
                          label="Yes, I'm looking for experts"
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFieldValue('lookingForExpert', checked);
                            if (!checked) {
                              setFieldValue('categoryId', '');
                              setFieldValue('selectedCategories', []);
                              setFieldValue('projectId', '');
                              setFieldValue('description', '');
                              setFieldValue('contracted_profession_id', '');
                              setFieldValue('contracted_expertise_id', '');
                              setFieldValue('skills', []);
                              setFieldValue('tools', []);
                              setSubcategories([]);
                            }
                          }}
                          checked={values.lookingForExpert}
                        />

                        {values.lookingForExpert && (
                          <>
                            {/* Project */}
                            <FormSelect
                              name="projectId"
                              label="Project"
                              disabled={loadingLists}
                              options={[
                                { value: '', label: 'Select an option' },
                                ...projects.map((p) => ({
                                  value: p.id,
                                  label: p.project_name,
                                })),
                              ]}
                            />

                            {/* Category */}
                            <FormSelect
                              name="categoryId"
                              label="Category"
                              disabled={loadingLists}
                              onChangeValue={async (val) => {
                                setFieldValue('categoryId', val);
                                setFieldValue('selectedCategories', []);
                                await fetchSubcategories(val);
                              }}
                              options={[
                                { value: '', label: 'Select an option' },
                                ...categories.map((c) => ({
                                  value: c.id,
                                  label: c.name,
                                })),
                              ]}
                            />

                            {/* Subcategories (single-select) */}
                            {values.categoryId && (
                              <div>
                                <p className="text-sm font-semibold mb-2">
                                  Subcategories
                                </p>
                                <div className="space-y-2">
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
                                        checked={isChecked}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          setFieldValue(
                                            'selectedCategories',
                                            checked ? [sub.id] : []
                                          );
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Required Profession */}
                            <FormSelect
                              name="contracted_profession_id"
                              label="Required Profession"
                              disabled={loadingLists}
                              options={professionOpts}
                            />

                            {/* Required Expertise */}
                            <FormSelect
                              name="contracted_expertise_id"
                              label="Required Expertise"
                              disabled={loadingLists}
                              options={expertiseOpts}
                            />

                            {/* Description */}
                            <FormInput
                              name="description"
                              label="Describe your need"
                              placeholder="e.g. We need a Salesforce expert to set up flows..."
                              as="textarea"
                              rows={4}
                            />

                            {/* Skills */}
                            <FieldArray
                              name="skills"
                              render={({ push, remove }) => (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold">
                                      Required Skills
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        push({
                                          skill_name: '',
                                          skill_level: 5,
                                        } as SkillItem)
                                      }
                                      className="px-3 py-1 rounded-lg bg-white text-[#2c3d5a] text-sm font-semibold hover:bg-gray-100"
                                    >
                                      Add Skill
                                    </button>
                                  </div>

                                  {values.skills.map((_, idx) => (
                                    <div
                                      key={`skill-${idx}`}
                                      className="grid grid-cols-3 gap-2"
                                    >
                                      <FormInput
                                        name={`skills[${idx}].skill_name`}
                                        placeholder="Skill name"
                                      />
                                      <FormInput
                                        name={`skills[${idx}].skill_level`}
                                        type="number"
                                        placeholder="1-10"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => remove(idx)}
                                        className="px-3 py-2 rounded-lg border border-white/40 hover:bg-white/10"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            />

                            {/* Tools */}
                            <FieldArray
                              name="tools"
                              render={({ push, remove }) => (
                                <div className="space-y-2 mt-4">
                                  <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold">
                                      Required Tools
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        push({ tool_name: '' } as ToolItem)
                                      }
                                      className="px-3 py-1 rounded-lg bg-white text-[#2c3d5a] text-sm font-semibold hover:bg-gray-100"
                                    >
                                      Add Tool
                                    </button>
                                  </div>

                                  {values.tools.map((_, idx) => (
                                    <div
                                      key={`tool-${idx}`}
                                      className="grid grid-cols-3 gap-2"
                                    >
                                      <FormInput
                                        name={`tools[${idx}].tool_name`}
                                        placeholder="Tool name"
                                      />
                                      <div />
                                      <button
                                        type="button"
                                        onClick={() => remove(idx)}
                                        className="px-3 py-2 rounded-lg border border-white/40 hover:bg-white/10"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            />
                          </>
                        )}
                      </div>

                      {/* Footer */}
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
