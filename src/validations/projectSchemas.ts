import * as Yup from 'yup';

export const projectCreateSchema = Yup.object().shape({
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

export const projectUpdateSchema = Yup.object().shape({
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
