'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Formik, Form, FieldArray } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import * as Yup from 'yup';
import { supabase } from '@/utils/supabase/browserClient';
import { showError, showSuccess } from '@/utils/toastService';
import { updateOffer } from '@/utils/projectsService';
import FormInput from '@/components/atoms/FormInput';
import FormCheckbox from '@/components/atoms/FormCheckbox';
import type { ContractedRow } from '@/utils/projectsService';

type Category = { id: string; name: string };
type Subcategory = { id: string; name: string; category_id: string | null };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  offer: ContractedRow; // oferta a editar
  onSaved?: () => void | Promise<void>;
};

type FormValues = {
  projectId: string;
  categoryId: string;
  selectedCategories: string[]; // contiene un único subcategory_id
  description: string;
};

const offerEditSchema = Yup.object().shape({
  projectId: Yup.string().required('Project is required'),
  categoryId: Yup.string().required('Category is required'),
  selectedCategories: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Select one subcategory')
    .max(1, 'Only one subcategory')
    .required('Subcategory is required'),
  description: Yup.string().required('Description is required'),
});

export default function OfferEditModal({
  isOpen,
  onClose,
  offer,
  onSaved,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);

  const projectId = offer.it_projects_id ?? '';

  // Cargar categorías al abrir
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('id, name');
        if (error) throw error;
        setCategories((data as Category[]) ?? []);
      } catch (e) {
        console.error('❌ Error loading categories:', e);
        showError('Error loading categories');
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);

  // Cargar subcategorías para una categoría dada
  const fetchSubcategories = async (categoryId: string) => {
    try {
      if (!categoryId) {
        setSubcategories([]);
        return;
      }
      setLoading(true);
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
      setLoading(false);
    }
  };

  const initialCategoryId = offer.subcategories?.category_id ?? '';
  const initialSubcat = offer.subcategory_id ?? '';

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-[110]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60"
            aria-hidden="true"
          />

          {/* Wrapper con scroll general */}
          <div className="fixed inset-0 z-[110] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
                className="bg-[#2c3d5a] text-white rounded-xl w-full max-w-lg h-[85vh] overflow-hidden flex flex-col"
              >
                <Formik<FormValues>
                  enableReinitialize
                  initialValues={{
                    projectId,
                    categoryId: initialCategoryId,
                    selectedCategories: initialSubcat ? [initialSubcat] : [],
                    description: offer.description_solution ?? '',
                  }}
                  validationSchema={offerEditSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      const subcategory_id = values.selectedCategories[0];
                      await updateOffer(offer.id, {
                        subcategory_id,
                        description_solution: values.description,
                      });
                      showSuccess('Offer updated');
                      if (onSaved) await onSaved();
                      onClose();
                    } catch (e) {
                      console.error('❌ Error updating offer:', e);
                      showError('Error updating offer');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ values, setFieldValue, isValid, isSubmitting }) => (
                    <Form className="flex flex-col h-full min-h-0">
                      {/* Header fijo */}
                      <div className="p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                        <h2 className="text-xl font-bold">Edit Offer</h2>
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-lg px-3 py-1.5 hover:bg-white/10"
                          aria-label="Close"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Contenido scrollable */}
                      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
                        {/* Project (solo lectura) */}
                        <div className="grid gap-2">
                          <label className="text-sm">Project</label>
                          <input
                            value={values.projectId}
                            disabled
                            className="w-full px-4 py-3 rounded-xl bg-[#e7e7e7] text-[#2c3d5a] cursor-not-allowed"
                          />
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
                            onFocus={async () => {
                              // cargar subcategorías si no están cargadas aún
                              if (
                                values.categoryId &&
                                subcategories.length === 0
                              ) {
                                await fetchSubcategories(values.categoryId);
                              }
                            }}
                            disabled={loading}
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

                        {/* Subcategories (single-select) */}
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
                                            const checked = e.target.checked;
                                            // única selección
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

                        {/* Description */}
                        <FormInput
                          name="description"
                          label="Describe your need"
                          placeholder="Short description for this offer…"
                          as="textarea"
                          rows={4}
                        />
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
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
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
