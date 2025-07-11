import * as Yup from 'yup';

export const profileSchema = Yup.object({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  country_id: Yup.string().required('Country is required'),
  role_id: Yup.string().required('Role is required'),
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
});
