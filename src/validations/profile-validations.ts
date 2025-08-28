import * as Yup from 'yup';

export const getProfileSchema = (role: string | null) => {
  const baseSchema = {
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    country_id: Yup.string().required('Country is required'),
  };

  const customerSchema = {
    company_name: Yup.string().required('Company name is required'),
    job_title: Yup.string().required('Job title is required'),
    description: Yup.string().min(
      20,
      'Company description must be at least 20 characters'
    ),
  };

  const expertSchema = {
    bio: Yup.string()
      .min(20, 'Bio must be at least 20 characters')
      .required('Bio is required'),
    profession_id: Yup.string().required('Profession is required'),
    expertise: Yup.array()
      .min(1, 'At least one expertise is required')
      .required('Expertise is required'),
    skills: Yup.array()
      .min(1, 'At least one skill is required')
      .required('Skills are required'),
    tools: Yup.array()
      .min(1, 'At least one tool is required')
      .required('Tools are required'),
  };

  if (role?.toLowerCase() === 'customer') {
    return Yup.object().shape({
      ...baseSchema,
      ...customerSchema,
    });
  }

  return Yup.object().shape({
    ...baseSchema,
    ...expertSchema,
  });
};
