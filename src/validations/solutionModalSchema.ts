import * as Yup from 'yup';

export const solutionModalSchema = Yup.object().shape({
  lookingForExpert: Yup.boolean(),

  selectedSolutions: Yup.array()
    .of(Yup.string())
    .when('lookingForExpert', {
      is: true,
      then: (schema) => schema.min(1, 'Select at least one solution'),
      otherwise: (schema) => schema.notRequired(),
    }),

  description: Yup.string().when('lookingForExpert', {
    is: true,
    then: (schema) =>
      schema
        .min(20, 'Description must be at least 20 characters')
        .required('Description is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
});
