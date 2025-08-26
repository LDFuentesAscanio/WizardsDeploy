'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Formik, Form } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import FormInput from '@/components/atoms/FormInput';

// Si ya tienes estos tipos/servicios, usa esos imports.
// Aquí están tipados mínimos para no romper:
type Project = {
  id: string;
  project_name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  budget: number | null;
  responsible: string | null;
  customer_id: string;
  created_at?: string;
  updated_at?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSave?: (p: Partial<Project>) => Promise<void> | void; // tu handler de actualización
  onDelete?: () => Promise<void> | void; // tu handler de borrado
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
  onSave,
  onDelete,
}: Props) {
  // si necesitas side-effects (p.ej. cargar ofertas) puedes hacerlo aquí
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // ejemplo: fetch de ofertas del proyecto si quieres mostrarlas
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

          {/* Wrapper que permite scroll general cuando el contenido es muy alto */}
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
                    project_name: project?.project_name ?? '',
                    description: project?.description ?? '',
                    start_date: project?.start_date ?? '',
                    end_date: project?.end_date ?? '',
                    status: project?.status ?? 'Planning',
                    budget:
                      typeof project?.budget === 'number' ? project.budget : '',
                    responsible: project?.responsible ?? '',
                  }}
                  validationSchema={editSchema}
                  onSubmit={async (values) => {
                    try {
                      setSubmitting(true);
                      // Convierte budget '' -> null (si mantienes number | null)
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
                      if (onSave) await onSave(payload);
                      onClose();
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
                      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
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

                        {/* 
                          Si quieres listar ofertas asociadas aquí, 
                          colócalas dentro de este área scrollable 
                          (no en header/footer) para que no se “corten”.
                        */}
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
        </Dialog>
      )}
    </AnimatePresence>
  );
}
