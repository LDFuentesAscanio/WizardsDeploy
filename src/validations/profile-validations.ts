import * as Yup from 'yup';

export const getProfileSchema = (role: string | null) => {
  const baseSchema = {
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    country_id: Yup.string().required('Country is required'),
    role_id: Yup.string().required('Role is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
  };

  const customerSchema = {
    company_name: Yup.string().required('Company name is required'),
    actual_role: Yup.string().required('Actual role is required'),
    accepted_privacy_policy: Yup.boolean()
      .oneOf([true], 'You must accept privacy policy')
      .required('Privacy policy acceptance is required'),
    accepted_terms_conditions: Yup.boolean()
      .oneOf([true], 'You must accept terms')
      .required('Terms acceptance is required'),
    looking_for_expert: Yup.boolean(),

    // ✅ Asegura tipado explícito del array
    selected_solutions: Yup.array()
      .of(Yup.string())
      .when('looking_for_expert', {
        is: true,
        then: (schema) =>
          schema
            .min(1, 'Select at least one solution')
            .required('At least one solution is required'),
        otherwise: (schema) => schema.notRequired(),
      }),

    solution_description: Yup.string().when('looking_for_expert', {
      is: true,
      then: (schema) =>
        schema
          .min(20, 'Description must be at least 20 characters')
          .required('Description is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  };

  const expertSchema = {
    bio: Yup.string().required('Bio is required'),
    profession: Yup.string().required('Profession is required'),
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
