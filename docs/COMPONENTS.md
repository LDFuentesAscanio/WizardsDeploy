# COMPONENTS.md

Documentación por componente (orden alfabético por ruta).

## `components/atoms/Button.tsx`

- **Componente:** `Button`  
- **Líneas:** 30  
- **Usa:** —

**Firma (parámetros):**

```ts
{
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps
```

---

## `components/atoms/FormCheckbox.tsx`

- **Componente:** `FormCheckbox`  
- **Líneas:** 54  
- **Usa:** client, formik

**Firma (parámetros):**

```ts
{
  name,
  label,
  className,
  onChange,
  checked,
}: FormCheckboxProps
```

**Props detectadas:**

```ts
interface FormCheckboxProps {
name: string;
  label?: string | React.ReactNode;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
}
```

---

## `components/atoms/FormInput.tsx`

- **Componente:** `FormInput`  
- **Líneas:** 123  
- **Usa:** client, formik

**Firma (parámetros):**

```ts
{
  name,
  label,
  placeholder,
  type = 'text',
  as = 'input',
  rows = 4,
  className,
  options = [],
}: FormInputProps
```

**Props detectadas:**

```ts
interface FormInputProps {
name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  as?: 'input' | 'textarea' | 'select';
  rows?: number;
  className?: string;
  options?: Option[];
}
```

---

## `components/atoms/FormSelect.tsx`

- **Componente:** `FormSelect`  
- **Líneas:** 67  
- **Usa:** formik

**Firma (parámetros):**

```ts
{
  name,
  label,
  options,
  disabled,
  onChangeValue,
}: FormSelectProps
```

**Props detectadas:**

```ts
interface FormSelectProps {
name: string;
  label?: string;
  options: { value: string; label: string
}
```

---

## `components/atoms/Loader.tsx`

- **Componente:** `Loader`  
- **Líneas:** 30  
- **Usa:** —

**Firma (parámetros):**

```ts
{
  src = '/icons/carga.svg',
  size = 160,
  className = '',
}: Props
```

---

## `components/atoms/SocialIcon.tsx`

- **Componente:** `SocialIcon`  
- **Líneas:** 42  
- **Usa:** —

**Props detectadas:**

```ts
interface SocialIconProps {
url: string;
  className?: string;
  iconSize?: number | string;
  iconClass?: string;
  color?: string;
  hoverColor?: string;
}
```

---

## `components/atoms/StarRatingInput.tsx`

- **Componente:** `StarRatingInput`  
- **Líneas:** 56  
- **Usa:** client, formik

**Firma (parámetros):**

```ts
{
  name,
  label = 'Rating',
  max = 5,
}: StarRatingInputProps
```

**Props detectadas:**

```ts
interface StarRatingInputProps {
name: string;
  label?: string;
  max?: number; // por defecto 5 estrellas
}
```

---

## `components/auth/AuthCheckClient.tsx`

- **Componente:** `AuthCheckClient`  
- **Líneas:** 31  
- **Usa:** client, supabase, next/router

**Firma (parámetros):**

```ts
{ children }: { children: React.ReactNode }
```

---

## `components/auth/AuthCheckServer.tsx`

- **Componente:** `AuthCheckServer`  
- **Líneas:** 24  
- **Usa:** supabase, next/router

**Firma (parámetros):**

```ts
{
  children,
}: {
  children: React.ReactNode;
}
```

---

## `components/guards/DashboardGuard.tsx`

- **Componente:** `DashboardGuard`  
- **Líneas:** 128  
- **Usa:** client, supabase, next/router

**Firma (parámetros):**

```ts
{
  children,
}: {
  children: React.ReactNode;
}
```

---

## `components/molecules/EmailInputWithSubmit.tsx`

- **Componente:** `EmailInputWithSubmit`  
- **Líneas:** 69  
- **Usa:** client

**Firma (parámetros):**

```ts
{
  onSubmit,
  loading,
  mode,
}: EmailInputWithSubmitProps
```

**Props detectadas:**

```ts
interface EmailInputWithSubmitProps {
onSubmit: (email: string) => void;
  loading: boolean;
  mode: 'login' | 'signup';
}
```

---

## `components/molecules/ImageUpload.tsx`

- **Componente:** `ImageUploader`  
- **Líneas:** 224  
- **Usa:** client, supabase

**Firma (parámetros):**

```ts
{
  label,
  type,
  initialUrl,
  onUpload,
  roleName,
}: Props
```

---

## `components/molecules/LoadingAuthScreen.tsx`

- **Componente:** `LoadingAuthScreen`  
- **Líneas:** 40  
- **Usa:** client

**Firma (parámetros):**

```ts
{
  onAuthComplete,
}: LoadingAuthScreenProps
```

**Props detectadas:**

```ts
interface LoadingAuthScreenProps {
onAuthComplete: () => void;
}
```

---

## `components/molecules/OAuthGoogleButton.tsx`

- **Componente:** `OAuthGoogleButton`  
- **Líneas:** 20  
- **Usa:** client

**Firma (parámetros):**

```ts
{ onClick }: OAuthGoogleButtonProps
```

**Props detectadas:**

```ts
interface OAuthGoogleButtonProps {
onClick: () => void;
}
```

---

## `components/molecules/ProjectCard.tsx`

- **Componente:** `ProjectCard`  
- **Líneas:** 47  
- **Usa:** —

**Firma (parámetros):**

```ts
{
  project,
  onClick,
}: {
  project: Project;
  onClick?: (
```

---

## `components/molecules/StatCard.tsx`

- **Componente:** `StatCard`  
- **Líneas:** 16  
- **Usa:** client

**Firma (parámetros):**

```ts
{ label, value }: StatCardProps
```

**Props detectadas:**

```ts
interface StatCardProps {
label: string;
  value: string | number;
}
```

---

## `components/molecules/TaskItem.tsx`

- **Componente:** `TaskItem`  
- **Líneas:** 23  
- **Usa:** client

**Firma (parámetros):**

```ts
{ label, done }: TaskItemProps
```

**Props detectadas:**

```ts
interface TaskItemProps {
label: string;
  done: boolean;
}
```

---

## `components/molecules/UploadDocumentField.tsx`

- **Componente:** `UploadDocumentField`  
- **Líneas:** 160  
- **Usa:** client, formik, supabase

---

## `components/organisms/LandingContent.tsx`

- **Componente:** `LandingContent`  
- **Líneas:** 18  
- **Usa:** —

---

## `components/organisms/LoginCard.tsx`

- **Componente:** `LoginCard`  
- **Líneas:** 45  
- **Usa:** client

**Firma (parámetros):**

```ts
{
  mode,
  onGoogleLogin,
  onEmailSubmit,
  loading,
}: LoginCardProps
```

**Props detectadas:**

```ts
interface LoginCardProps {
mode: 'login' | 'signup';
  onGoogleLogin: () => void;
  onEmailSubmit: (email: string) => void;
  loading: boolean;
}
```

---

## `components/organisms/ProfileForm/ProfileForm.tsx`

- **Componente:** `ProfileForm`  
- **Líneas:** 71  
- **Usa:** client, formik

---

## `components/organisms/ProfileForm/formComponents/ExpertiseItem.tsx`

- **Componente:** `ExpertiseItem`  
- **Líneas:** 80  
- **Usa:** client, formik

**Firma (parámetros):**

```ts
{
  index,
  platforms,
  experienceOptions,
  onRemove,
  canRemove,
}: Props
```

**Props detectadas:**

```ts
interface Props {
index: number;
  platforms: Platform[];
  experienceOptions: { value: string; label: string
}
```

---

## `components/organisms/ProfileForm/formComponents/ExpertiseSection.tsx`

- **Componente:** `ExpertiseSection`  
- **Líneas:** 174  
- **Usa:** client, formik

**Firma (parámetros):**

```ts
{ name, platforms }: Props
```

---

## `components/organisms/ProfileForm/formComponents/SkillsSection.tsx`

- **Componente:** `SkillSection`  
- **Líneas:** 137  
- **Usa:** client, formik

**Firma (parámetros):**

```ts
{
  name = 'skills',
  label = 'Skills',
  placeholder = 'Add a skill and press Enter',
  options = [],
  maxItems,
}: SkillSectionProps
```

**Props detectadas:**

```ts
interface SkillSectionProps {
name?: string; // default: "skills"
  label?: string; // default: "Skills"
  placeholder?: string; // default: "Add a skill and press Enter"
  options?: Option[]; // sugerencias opcionales
  maxItems?: number; // opcional
}
```

---

## `components/organisms/ProfileForm/formComponents/ToolsSection.tsx`

- **Componente:** `ToolSection`  
- **Líneas:** 134  
- **Usa:** client, formik

**Firma (parámetros):**

```ts
{
  name = 'tools',
  label = 'Tools',
  placeholder = 'Add a tool and press Enter',
  options = [],
  maxItems,
}: ToolSectionProps
```

**Props detectadas:**

```ts
interface ToolSectionProps {
name?: string; // default: "tools"
  label?: string; // default: "Tools"
  placeholder?: string; // default: "Add a tool and press Enter"
  options?: Option[];
  maxItems?: number;
}
```

---

## `components/organisms/ProfileForm/formSections/CommonSection.tsx`

- **Componente:** `CommonSection`  
- **Líneas:** 71  
- **Usa:** client, formik

**Firma (parámetros):**

```ts
{ countries, roles, roleName }: Props
```

---

## `components/organisms/ProfileForm/formSections/CustomerBasicInfo.tsx`

- **Componente:** `CustomerBasicInfo`  
- **Líneas:** 53  
- **Usa:** client, formik

**Firma (parámetros):**

```ts
{ roleName }: Props
```

---

## `components/organisms/ProfileForm/formSections/CustomerSections.tsx`

- **Componente:** `CustomerSections`  
- **Líneas:** 52  
- **Usa:** client

**Firma (parámetros):**

```ts
{ roleName }: Props
```

---

## `components/organisms/ProfileForm/formSections/ExpertInfoSection.tsx`

- **Componente:** `ExpertInfoSection`  
- **Líneas:** 92  
- **Usa:** client, formik

**Firma (parámetros):**

```ts
{ professions, platforms }: Props
```

---

## `components/organisms/dashboard/BioSection.tsx`

- **Componente:** `BioSection`  
- **Líneas:** 17  
- **Usa:** client

**Firma (parámetros):**

```ts
{ bio }: BioSectionProps
```

**Props detectadas:**

```ts
interface BioSectionProps {
bio: string;
}
```

---

## `components/organisms/dashboard/ConfirmDialog.tsx`

- **Componente:** `ConfirmDialog`  
- **Líneas:** 70  
- **Usa:** client, headlessui

**Firma (parámetros):**

```ts
{
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps
```

**Props detectadas:**

```ts
interface ConfirmDialogProps {
isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}
```

---

## `components/organisms/dashboard/CustomerCategoriesModal.tsx`

- **Componente:** `CustomerCategoryModal`  
- **Líneas:** 495  
- **Usa:** formik, supabase, headlessui, framer-motion

**Firma (parámetros):**

```ts
{
  isOpen,
  onClose,
  categories,
  initialValues,
  onSubmit,
}: Props
```

---

## `components/organisms/dashboard/DashboardNavbar.tsx`

- **Componente:** `DashboardNavbar`  
- **Líneas:** 241  
- **Usa:** client, supabase, next/router, framer-motion

---

## `components/organisms/dashboard/ExperienceSection.tsx`

- **Componente:** `ExperienceSection`  
- **Líneas:** 36  
- **Usa:** client

**Firma (parámetros):**

```ts
{
  experiences,
}: ExperienceSectionProps
```

**Props detectadas:**

```ts
interface ExperienceSectionProps {
experiences: Experience[];
}
```

---

## `components/organisms/dashboard/PortfolioSection.tsx`

- **Componente:** `PortfolioSection`  
- **Líneas:** 58  
- **Usa:** client, framer-motion

**Firma (parámetros):**

```ts
{ projects }: PortfolioSectionProps
```

**Props detectadas:**

```ts
interface PortfolioSectionProps {
projects: Project[];
}
```

---

## `components/organisms/dashboard/ProfileCompletionCard.tsx`

- **Componente:** `ProfileCompletionCard`  
- **Líneas:** 39  
- **Usa:** client

**Firma (parámetros):**

```ts
{
  completed,
  missingFields,
}: ProfileCompletionCardProps
```

**Props detectadas:**

```ts
interface ProfileCompletionCardProps {
completed: number; // porcentaje completado (0-100)
  missingFields: string[];
}
```

---

## `components/organisms/dashboard/SkillsSection.tsx`

- **Componente:** `SkillsSection`  
- **Líneas:** 53  
- **Usa:** client

**Firma (parámetros):**

```ts
{ skills, tools }: SkillsSectionProps
```

**Props detectadas:**

```ts
interface SkillsSectionProps {
skills: string[];
  tools: string[];
}
```

---

## `components/organisms/dashboard/StatsSection.tsx`

- **Componente:** `StatsSection`  
- **Líneas:** 32  
- **Usa:** client, framer-motion

**Firma (parámetros):**

```ts
{ stats }: StatsSectionProps
```

**Props detectadas:**

```ts
interface StatsSectionProps {
stats: StatItem[];
}
```

---

## `components/organisms/dashboard/TasksOverview.tsx`

- **Componente:** `TasksOverview`  
- **Líneas:** 60  
- **Usa:** client

**Firma (parámetros):**

```ts
{
  completed,
  total,
  tasks,
}: TasksOverviewProps
```

**Props detectadas:**

```ts
interface TasksOverviewProps {
completed: number;
  total: number;
  tasks: Task[];
}
```

---

## `components/organisms/dashboard/UserCard.tsx`

- **Componente:** `UserCard`  
- **Líneas:** 51  
- **Usa:** client, framer-motion

**Firma (parámetros):**

```ts
{
  firstName,
  lastName,
  profession,
  avatarUrl,
  linkedin,
  otherLink,
}: UserCardProps
```

**Props detectadas:**

```ts
interface UserCardProps {
firstName: string;
  lastName: string;
  profession?: string;
  avatarUrl: string;
  linkedin?: string | null;
  otherLink?: string | null;
}
```

---

## `components/organisms/profiles/ProfileCard.tsx`

- **Componente:** `ProfileCard`  
- **Líneas:** 65  
- **Usa:** client, framer-motion

**Firma (parámetros):**

```ts
{ profile, onClick }: Props
```

---

## `components/organisms/profiles/ProfileDetailModal.tsx`

- **Componente:** `ProfileDetailModal`  
- **Líneas:** 174  
- **Usa:** client, headlessui, framer-motion

**Firma (parámetros):**

```ts
{
  isOpen,
  onClose,
  profile,
  onMessage,
}: Props
```

---

## `components/organisms/profiles/ProfilesList.tsx`

- **Componente:** `ProfilesList`  
- **Líneas:** 22  
- **Usa:** client

**Firma (parámetros):**

```ts
{ profiles, onSelect }: Props
```

---

## `components/organisms/profiles/ProfilesSearch.tsx`

- **Componente:** `ProfilesSearch`  
- **Líneas:** 21  
- **Usa:** client

**Firma (parámetros):**

```ts
{ value, onChange }: Props
```

---

## `components/organisms/projects/ExpertEmptyState.tsx`

- **Componente:** `ExpertEmptyState`  
- **Líneas:** 25  
- **Usa:** client

---

## `components/organisms/projects/ExpertProjectsList.tsx`

- **Componente:** `ExpertProjectsList`  
- **Líneas:** 51  
- **Usa:** client, framer-motion

**Firma (parámetros):**

```ts
{
  items,
}: {
  items: ExpertProjectItem[];
}
```

---

## `components/organisms/projects/OfferEditModal.tsx`

- **Componente:** `OfferEditModal`  
- **Líneas:** 290  
- **Usa:** client, formik, supabase, headlessui, framer-motion, yup

**Firma (parámetros):**

```ts
{
  isOpen,
  onClose,
  offer,
  onSaved,
}: Props
```

---

## `components/organisms/projects/ProjectEditModal.tsx`

- **Componente:** `ProjectEditModal`  
- **Líneas:** 418  
- **Usa:** client, formik, supabase, headlessui, framer-motion, yup

**Firma (parámetros):**

```ts
{
  isOpen,
  onClose,
  project,
  onSaved,
  onDelete,
}: Props
```

---

## `components/organisms/projects/ProjectForm.tsx`

- **Componente:** `ProjectForm`  
- **Líneas:** 108  
- **Usa:** client, formik, supabase

**Firma (parámetros):**

```ts
{ onClose }: Props
```

---

## `components/organisms/projects/ProjectList.tsx`

- **Componente:** `ProjectList`  
- **Líneas:** 27  
- **Usa:** client

**Firma (parámetros):**

```ts
{
  projects,
  onSelect,
}: {
  projects: Project[];
  onSelect?: (p: Project
```

---

## `components/organisms/projects/explore/ExploreOfferCard.tsx`

- **Componente:** `ExploreOfferCard`  
- **Líneas:** 57  
- **Usa:** client, framer-motion

**Firma (parámetros):**

```ts
{ offer, onClick }: Props
```

---

## `components/organisms/projects/explore/ExploreOfferDetailModal.tsx`

- **Componente:** `ExploreOfferDetailModal`  
- **Líneas:** 128  
- **Usa:** client, headlessui, framer-motion

**Firma (parámetros):**

```ts
{
  isOpen,
  onClose,
  offer,
  onApply,
}: Props
```

---

## `components/organisms/projects/explore/ExploreOfferList.tsx`

- **Componente:** `ExploreOfferList`  
- **Líneas:** 21  
- **Usa:** client

**Firma (parámetros):**

```ts
{ offers, onSelect }: Props
```

---

## `components/organisms/projects/explore/ExploreSearch.tsx`

- **Componente:** `ExploreSearch`  
- **Líneas:** 21  
- **Usa:** client

**Firma (parámetros):**

```ts
{ value, onChange }: Props
```

---

## `components/views/AuthCallbackView.tsx`

- **Componente:** `AuthCallbackView`  
- **Líneas:** 43  
- **Usa:** client, supabase, next/router

---

## `components/views/AuthView.tsx`

- **Componente:** `AuthView`  
- **Líneas:** 62  
- **Usa:** client, supabase, next/router

---

## `components/views/CustomerDashboardView.tsx`

- **Componente:** `CustomerDashboardView`  
- **Líneas:** 375  
- **Usa:** client, supabase, framer-motion

---

## `components/views/DashboardView.tsx`

- **Componente:** `DashboardView`  
- **Líneas:** 90  
- **Usa:** client, supabase

---

## `components/views/OnboardingPageView.tsx`

- **Componente:** `OnboardingPageView`  
- **Líneas:** 13  
- **Usa:** —

---

## `components/views/OnboardingView.tsx`

- **Componente:** `OnboardingView`  
- **Líneas:** 117  
- **Usa:** client, formik, supabase

---

## `components/views/VerifyView.tsx`

- **Componente:** `VerifyView`  
- **Líneas:** 20  
- **Usa:** client

---
