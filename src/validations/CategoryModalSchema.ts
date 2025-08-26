import * as Yup from 'yup';

export const categoryModalSchema = Yup.object().shape({
  lookingForExpert: Yup.boolean(),

  projectId: Yup.string().when('lookingForExpert', {
    is: true,
    then: (s) => s.required('Project is required'),
    otherwise: (s) => s.notRequired(),
  }),

  categoryId: Yup.string().when('lookingForExpert', {
    is: true,
    then: (s) => s.required('Category is required'),
    otherwise: (s) => s.notRequired(),
  }),

  selectedCategories: Yup.array()
    .of(Yup.string())
    .when('lookingForExpert', {
      is: true,
      then: (s) => s.min(1, 'Select a subcategory'),
      otherwise: (s) => s.notRequired(),
    }),

  description: Yup.string().when('lookingForExpert', {
    is: true,
    then: (s) =>
      s
        .min(20, 'Description must be at least 20 characters')
        .required('Description is required'),
    otherwise: (s) => s.notRequired(),
  }),
});
