//External libraries
import * as Yup from 'yup';

export const onboardingSchema = Yup.object({
  first_name: Yup.string()
    .required('First name is required')
    .min(2, 'Must be at least 2 characters'),

  last_name: Yup.string()
    .required('Last name is required')
    .min(2, 'Must be at least 2 characters'),

  role: Yup.string()
    .required('Role is required')
    .oneOf(['expert', 'customer'], 'Invalid role'),
});
