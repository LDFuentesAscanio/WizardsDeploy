import * as Yup from 'yup';

export const categoryModalSchema = Yup.object().shape({
  lookingForExpert: Yup.boolean(),

  // Requeridos solo si lookingForExpert es true
  projectId: Yup.string().when('lookingForExpert', {
    is: true,
    then: (s) => s.required('Select a project'),
    otherwise: (s) => s.notRequired(),
  }),

  categoryId: Yup.string().when('lookingForExpert', {
    is: true,
    then: (s) => s.required('Select a category'),
    otherwise: (s) => s.notRequired(),
  }),

  selectedCategories: Yup.array()
    .of(Yup.string())
    .when('lookingForExpert', {
      is: true,
      then: (s) =>
        s
          .min(1, 'Select one subcategory')
          .max(1, 'Only one subcategory can be selected'),
      otherwise: (s) => s.notRequired(),
    }),

  description: Yup.string().when('lookingForExpert', {
    is: true,
    then: (s) =>
      s
        .trim()
        .min(20, 'Description must be at least 20 characters')
        .required('Description is required'),
    otherwise: (s) => s.notRequired(),
  }),
});
