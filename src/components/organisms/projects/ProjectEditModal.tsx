'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import { showError, showSuccess } from '@/utils/toastService';
import FormInput from '@/components/atoms/FormInput';
import Button from '@/components/atoms/Button';

import {
  Project,
  fetchProjectOffers,
  deactivateOffer,
  updateProject,
  deleteProject,
  ContractedRow,
} from '@/utils/projectsService';

import { projectUpdateSchema } from '@/validations/projectSchemas';
import CustomerCategoryModal from '@/components/organisms/dashboard/CustomerCategoriesModal';
import { ConfirmDialog } from '@/components/organisms/dashboard/ConfirmDialog';
import { supabase } from '@/utils/supabase/browserClient';

type Category = { id: string; name: string };

type Props = {
  open: boolean;
  onClose: () => void;
  project: Project;
  onSaved: () => void; // refresh de la lista
};

export default function ProjectEditModal({
  open,
  onClose,
  project,
  onSaved,
}: Props) {
  const [offers, setOffers] = useState<ContractedRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        setLoading(true);
        const [offersRes, catRes] = await Promise.all([
          fetchProjectOffers(project.id),
          supabase.from('categories').select('id, name'),
        ]);
        setOffers(offersRes);
        setCategories((catRes.data as Category[]) || []);
      } catch (e) {
        console.error(e);
        showError('Error loading project data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, project.id]);

  const handleRemoveOffer = async (offerId: string) => {
    try {
      await deactivateOffer(offerId);
      setOffers((prev) => prev.filter((o) => o.id !== offerId));
      showSuccess('Offer removed');
    } catch (e) {
      console.error(e);
      showError('Failed to remove offer');
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(project.id);
      showSuccess('Project deleted');
      setConfirmDeleteOpen(false);
      onClose();
      onSaved();
    } catch (e) {
      console.error(e);
      showError('Failed to delete project');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
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
          className="bg-[#2c3d5a] text-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <Formik
            enableReinitialize
            validationSchema={projectUpdateSchema}
            initialValues={{
              project_name: project.project_name ?? '',
              description: project.description ?? '',
              start_date: project.start_date ?? '',
              end_date: project.end_date ?? '',
              status: project.status ?? 'Planning',
              budget: project.budget ?? '',
              responsible: project.responsible ?? '',
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await updateProject(project.id, {
                  project_name: values.project_name,
                  description: values.description,
                  start_date: values.start_date || null,
                  end_date: values.end_date || null,
                  status: values.status as Project['status'],
                  budget: values.budget ? Number(values.budget) : null,
                  responsible: values.responsible || null,
                });
                showSuccess('Project updated');
                onSaved();
              } catch (e) {
                console.error(e);
                showError('Failed to update project');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col h-full">
                {/* body scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <h2 className="text-xl font-bold">Edit Project</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput name="project_name" label="Project Name" />
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
                    <FormInput
                      name="start_date"
                      type="date"
                      label="Start Date"
                    />
                    <FormInput name="end_date" type="date" label="End Date" />
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

                  <FormInput
                    name="description"
                    label="Description"
                    as="textarea"
                    rows={4}
                  />

                  {/* offers */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">
                        Offers associated
                      </h3>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => setShowOfferModal(true)}
                      >
                        Create Offer
                      </Button>
                    </div>

                    {loading ? (
                      <p className="text-white/70 text-sm">Loading offers...</p>
                    ) : offers.length ? (
                      <div className="space-y-3">
                        {offers.map((o) => (
                          <div
                            key={o.id}
                            className="bg-white/10 p-4 rounded-lg flex items-start justify-between"
                          >
                            <div className="space-y-1">
                              <p className="font-semibold">
                                {o.subcategories?.categories?.name ||
                                  'Category'}{' '}
                                · {o.subcategories?.name || 'Subcategory'}
                              </p>
                              {o.description_solution && (
                                <p className="text-sm text-white/80">
                                  {o.description_solution}
                                </p>
                              )}
                              {o.contract_date && (
                                <p className="text-xs text-white/60">
                                  Contracted: {o.contract_date}
                                </p>
                              )}
                            </div>
                            <button
                              className="text-sm text-red-300 hover:text-red-400"
                              type="button"
                              onClick={() => handleRemoveOffer(o.id)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-white/70">No offers yet.</p>
                    )}
                  </div>
                </div>

                {/* footer */}
                <div className="p-6 border-t border-white/10 flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                  >
                    {isSubmitting ? 'Saving...' : 'Save changes'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Close
                  </Button>
                  <div className="ml-auto" />
                  <Button
                    type="button"
                    className="!border-2 !border-red-400 !text-red-300 hover:!bg-red-400/10"
                    variant="secondary"
                    onClick={() => setConfirmDeleteOpen(true)}
                  >
                    Delete Project
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Crear oferta sobre este proyecto (pre-seleccionado) */}
          <CustomerCategoryModal
            isOpen={showOfferModal}
            onClose={() => setShowOfferModal(false)}
            categories={categories}
            initialValues={{
              lookingForExpert: true,
              categoryId: '',
              selectedCategories: [],
              projectId: project.id,
              description: '',
            }}
            onSubmit={async () => {
              // al cerrar, refrescamos ofertas
              try {
                const fresh = await fetchProjectOffers(project.id);
                setOffers(fresh);
              } catch {
                /* noop */
              } finally {
                setShowOfferModal(false);
              }
            }}
          />

          <ConfirmDialog
            isOpen={confirmDeleteOpen}
            title="Delete Project"
            description="This will permanently delete the project and its offers. Are you sure?"
            onConfirm={handleDeleteProject}
            onCancel={() => setConfirmDeleteOpen(false)}
          />
        </motion.div>
      </div>
    </Dialog>
  );
}
