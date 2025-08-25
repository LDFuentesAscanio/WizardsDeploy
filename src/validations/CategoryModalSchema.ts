import * as Yup from 'yup';

export const categoryModalSchema = Yup.object().shape({
  lookingForExpert: Yup.boolean(),

  selectedCategories: Yup.array()
    .of(Yup.string())
    .when('lookingForExpert', {
      is: true,
      then: (schema) => schema.min(1, 'Select at least one category'),
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
