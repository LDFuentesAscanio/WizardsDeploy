'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Formik, Form } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import * as Yup from 'yup';
import type { Tables } from '@/types/supabase';

import Button from '@/components/atoms/Button';
import FormInput from '@/components/atoms/FormInput';
import { fetchProjectOffers, deactivateOffer } from '@/utils/projectsService';
import type { ContractedRow } from '@/utils/projectsService';
import { updateProject } from '@/utils/projectsService';
import { showError, showSuccess } from '@/utils/toastService';
import OfferEditModal from './OfferEditModal';
import CustomerCategoryModal from '@/components/organisms/dashboard/CustomerCategoriesModal';
import { supabase } from '@/utils/supabase/browserClient';

type Project = Tables<'it_projects'>;
type Category = { id: string; name: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSaved?: () => void | Promise<void>;
  onDelete?: () => Promise<void> | void;
};

const editSchema = Yup.object().shape({
  project_name: Yup.string().required('Project name is required'),
  description: Yup.string().required('Description is required'),
  start_date: Yup.date().nullable(),
  end_date: Yup.date().nullable(),
  status: Yup.string()
    .oneOf(['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'])
    .required('Status is required'),
  budget: Yup.number().nullable(),
  responsible: Yup.string().nullable(),
});

export default function ProjectEditModal({
  isOpen,
  onClose,
  project,
  onSaved,
  onDelete,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Ofertas del proyecto
  const [offers, setOffers] = useState<ContractedRow[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [editingOffer, setEditingOffer] = useState<ContractedRow | null>(null);

  // Crear oferta (sub-modal)
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );

  const loadOffers = async () => {
    if (!project?.id) return;
    try {
      setLoadingOffers(true);
      const data = await fetchProjectOffers(project.id);
      setOffers(data);
    } catch (e) {
      console.error('❌ Error loading offers:', e);
      showError('Error loading offers');
    } finally {
      setLoadingOffers(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name');
      if (error) throw error;
      setAvailableCategories((data as Category[]) ?? []);
    } catch (e) {
      console.error('❌ Error loading categories:', e);
      showError('Error loading categories');
    }
  };

  useEffect(() => {
    if (isOpen && project?.id) {
      loadOffers();
      loadCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, project?.id]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-[100]">
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
          <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
                className="bg-[#2c3d5a] text-white rounded-xl w-full max-w-2xl h-[85vh] overflow-hidden flex flex-col"
              >
                <Formik
                  enableReinitialize
                  initialValues={{
                    project_name: project.project_name ?? '',
                    description: project.description ?? '',
                    start_date: project.start_date ?? '',
                    end_date: project.end_date ?? '',
                    status:
                      project.status &&
                      [
                        'Planning',
                        'In Progress',
                        'On Hold',
                        'Completed',
                        'Cancelled',
                      ].includes(project.status as string)
                        ? (project.status as
                            | 'Planning'
                            | 'In Progress'
                            | 'On Hold'
                            | 'Completed'
                            | 'Cancelled')
                        : 'Planning',
                    budget: project.budget ?? '',
                    responsible: project.responsible ?? '',
                  }}
                  validationSchema={editSchema}
                  onSubmit={async (values) => {
                    try {
                      setSubmitting(true);
                      const payload: Partial<Project> = {
                        project_name: values.project_name,
                        description: values.description,
                        start_date: values.start_date || null,
                        end_date: values.end_date || null,
                        status: values.status as Project['status'],
                        budget:
                          values.budget === '' || values.budget === undefined
                            ? null
                            : Number(values.budget),
                        responsible: values.responsible || null,
                      };
                      await updateProject(project.id, payload);
                      showSuccess('Project updated');
                      if (onSaved) await onSaved();
                      onClose();
                    } catch (e) {
                      console.error('❌ Error updating project:', e);
                      showError('Error updating project');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isValid }) => (
                    <Form className="flex flex-col h-full min-h-0">
                      {/* Header fijo */}
                      <div className="p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                        <h2 className="text-xl font-bold">Edit Project</h2>
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
                        {/* Campos del proyecto */}
                        <FormInput name="project_name" label="Project Name" />
                        <FormInput
                          name="description"
                          label="Description"
                          as="textarea"
                          rows={4}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormInput
                            name="start_date"
                            type="date"
                            label="Start Date"
                          />
                          <FormInput
                            name="end_date"
                            type="date"
                            label="End Date"
                          />
                        </div>

                        <FormInput
                          name="status"
                          label="Status"
                          as="select"
                          options={[
                            { value: 'Planning', label: 'Planning' },
                            { value: 'In Progress', label: 'In Progress' },
                            { value: 'On Hold', label: 'On Hold' },
                            { value: 'Completed', label: 'Completed' },
                            { value: 'Cancelled', label: 'Cancelled' },
                          ]}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormInput
                            name="budget"
                            type="number"
                            label="Budget (optional)"
                          />
                          <FormInput
                            name="responsible"
                            label="Responsible (optional)"
                          />
                        </div>

                        {/* Ofertas del proyecto */}
                        <div className="pt-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                              Offers for this project
                            </h3>
                            <Button
                              type="button"
                              variant="primary"
                              onClick={() => setShowCreateOffer(true)}
                              className="px-4 py-2"
                            >
                              Create Offer
                            </Button>
                          </div>

                          {loadingOffers ? (
                            <p className="text-sm text-white/70 mt-2">
                              Loading offers…
                            </p>
                          ) : offers.length ? (
                            <div className="mt-3 space-y-3">
                              {offers.map((o) => (
                                <div
                                  key={o.id}
                                  className="flex items-start justify-between bg-white/5 rounded-lg p-3"
                                >
                                  <div className="pr-3">
                                    <p className="font-semibold">
                                      {(o.subcategories?.categories?.name ??
                                        'Category') +
                                        ' — ' +
                                        (o.subcategories?.name ??
                                          'Subcategory')}
                                    </p>
                                    {o.description_solution && (
                                      <p className="text-sm text-white/70 mt-1">
                                        {o.description_solution}
                                      </p>
                                    )}
                                    <p className="text-xs text-white/50 mt-1">
                                      Active: {o.is_active ? 'Yes' : 'No'}
                                      {o.contract_date
                                        ? ` • ${new Date(
                                            o.contract_date
                                          ).toLocaleDateString()}`
                                        : ''}
                                    </p>
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      onClick={() => setEditingOffer(o)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      className="border-red-400 text-red-300 hover:bg-red-400/10"
                                      onClick={async () => {
                                        try {
                                          await deactivateOffer(o.id);
                                          showSuccess('Offer removed');
                                          await loadOffers();
                                          if (onSaved) await onSaved();
                                        } catch (e) {
                                          console.error(
                                            '❌ Error removing offer:',
                                            e
                                          );
                                          showError('Error removing offer');
                                        }
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-white/70 mt-2">
                              No offers yet.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Footer fijo */}
                      <div className="p-6 border-t border-white/10 flex-shrink-0">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                          >
                            Cancel
                          </Button>

                          {onDelete && (
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={async () => {
                                try {
                                  setDeleting(true);
                                  await onDelete();
                                  onClose();
                                } finally {
                                  setDeleting(false);
                                }
                              }}
                              disabled={deleting}
                              className="flex-1 border-red-400 text-red-300 hover:bg-red-400/10"
                            >
                              {deleting ? 'Deleting...' : 'Delete Project'}
                            </Button>
                          )}

                          <Button
                            type="submit"
                            variant="primary"
                            disabled={!isValid || submitting}
                            className="flex-1"
                          >
                            {submitting ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </motion.div>
            </div>
          </div>

          {/* Submodal: editar oferta existente */}
          {editingOffer && (
            <OfferEditModal
              isOpen={!!editingOffer}
              onClose={() => setEditingOffer(null)}
              offer={editingOffer}
              onSaved={async () => {
                setEditingOffer(null);
                await loadOffers();
                if (onSaved) await onSaved();
              }}
            />
          )}

          {/* Submodal: crear oferta (usa CustomerCategoryModal) */}
          <CustomerCategoryModal
            isOpen={showCreateOffer}
            onClose={() => setShowCreateOffer(false)}
            categories={availableCategories}
            initialValues={{
              lookingForExpert: true,
              categoryId: '',
              selectedCategories: [],
              projectId: project.id, // ← se fija al proyecto actual
              description: '',
            }}
            onSubmit={async () => {
              setShowCreateOffer(false);
              await loadOffers();
              if (onSaved) await onSaved();
            }}
          />
        </Dialog>
      )}
    </AnimatePresence>
  );
}
