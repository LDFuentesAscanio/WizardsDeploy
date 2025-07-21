// validations/profile-validations.ts
import * as Yup from 'yup';

// Esquema base común a todos los roles
const baseSchema = {
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  country_id: Yup.string().required('Country is required'),
  role_id: Yup.string().required('Role is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
};

// Esquema específico para Customers
const customerSchema = {
  company_name: Yup.string().required('Company name is required'),
  actual_role: Yup.string().required('Actual role is required'),
  accepted_privacy_policy: Yup.boolean().oneOf(
    [true],
    'You must accept the privacy policy'
  ),
  accepted_terms_conditions: Yup.boolean().oneOf(
    [true],
    'You must accept the terms and conditions'
  ),
};

// Esquema específico para Experts
const expertSchema = {
  bio: Yup.string().required('Bio is required'),
  profession: Yup.string().required('Profession is required'),
  expertise: Yup.array()
    .of(
      Yup.object({
        platform_id: Yup.string().required('Platform is required'),
        rating: Yup.number().min(1).max(5).required('Rating is required'),
        experience_time: Yup.string().required('Experience time is required'),
      })
    )
    .min(1, 'At least one expertise is required'),
  skills: Yup.array()
    .of(Yup.string().min(1))
    .min(1, 'At least one skill is required'),
  tools: Yup.array()
    .of(Yup.string().min(1))
    .min(1, 'At least one tool is required'),
};

// Función que devuelve el esquema adecuado según el rol
export const getProfileSchema = (role: string | null) => {
  if (role?.toLowerCase() === 'customer') {
    return Yup.object().shape({
      ...baseSchema,
      ...customerSchema,
    });
  }

  // Por defecto asumimos que es Expert
  return Yup.object().shape({
    ...baseSchema,
    ...expertSchema,
  });
};
