'use client';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormInput from '@/components/atoms/FormInput';
import Button from '@/components/atoms/Button';
import { supabase } from '@/utils/supabase/browserClient';
import { showError, showSuccess } from '@/utils/toastService';
import { Database } from '@/types/supabase';

type ProjectInsert = Database['public']['Tables']['it_projects']['Insert'];

const projectSchema = Yup.object().shape({
  project_name: Yup.string().required('Project name is required'),
  description: Yup.string().required('Description is required'),
  start_date: Yup.date().required('Start date is required'),
  end_date: Yup.date().nullable(),
  status: Yup.string()
    .oneOf(['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'])
    .required('Status is required'),
  budget: Yup.number().nullable(),
  responsible: Yup.string().nullable(),
});

type Props = {
  onClose: () => void;
};

export default function ProjectForm({ onClose }: Props) {
  return (
    <Formik
      initialValues={{
        project_name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'Planning',
        budget: '',
        responsible: '',
      }}
      validationSchema={projectSchema}
      onSubmit={async (values) => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          // obtener customer_id desde tabla customers
          const { data: customer, error: customerError } = await supabase
            .from('customers')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (customerError || !customer) throw customerError;

          const insertData: ProjectInsert = {
            project_name: values.project_name,
            description: values.description,
            start_date: values.start_date || null,
            end_date: values.end_date || null,
            status: values.status,
            budget: values.budget ? Number(values.budget) : null,
            responsible: values.responsible || null,
            customer_id: customer.id,
          };

          const { error } = await supabase
            .from('it_projects')
            .insert(insertData);

          if (error) throw error;
          showSuccess('Project created!');
          onClose();
        } catch (err) {
          console.error('❌ Error creating project:', err);
          showError('Error creating project');
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4 bg-[#2c3d5a] p-6 rounded-xl shadow-md text-[#e7e7e7]">
          <FormInput name="project_name" label="Project Name" />
          <FormInput
            name="description"
            label="Description"
            as="textarea"
            rows={4}
          />
          <FormInput name="start_date" type="date" label="Start Date" />
          <FormInput name="end_date" type="date" label="End Date" />
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
          <FormInput name="budget" type="number" label="Budget (optional)" />
          <FormInput name="responsible" label="Responsible (optional)" />

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
