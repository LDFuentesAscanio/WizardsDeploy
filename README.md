# wizards-app

> Plataforma Next.js + Supabase para conectar *customers* con *experts*, gestionar perfiles y proyectos, y explorar ofertas activas.

## 🧰 Stack principal

- **Next.js** 15.3.3 (App Router)
- **React** ^19.0.0 / **React DOM** ^19.0.0
- **Supabase** (`@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, `@supabase/ssr`)
- **Tailwind CSS** ^4
- **Formik** + **Yup** (formularios/validaciones)
- **Headless UI**, **lucide-react** (UI)
- **framer-motion** (animaciones)
- **sonner** (toasts)

> Arquitectura: **Screaming Architecture** (por dominio/feature) + **Atomic Design** (atoms → molecules → organisms → views).

---

## 🚀 Comenzar

### Requisitos
- Node.js 20+ recomendado (Next 15).
- pnpm / npm / yarn (usa el que prefieras).

### Instalación

```bash
# 1) Dependencias
npm install

# 2) Variables de entorno
cp .env.example .env.local
# Editá los valores (NO commitees secretos)

# 3) Ejecutá en desarrollo
npm run dev
```

### Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## ⚙️ Variables de entorno

> **Nunca** subas credenciales reales al repositorio.

Variables usadas (solo nombres):

```env
NEXT_PUBLIC_DEBUG_PROFILE
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_URL
```

Se incluye un **`.env.example`** con las claves esperadas y sin valores.

---

## 🗂️ Estructura de carpetas (src)

```
./
  app/
  components/
  hooks/
  types/
  utils/
  validations/
  supabase-types.ts
app/
  (dashboard)/
  auth/
  force-profile/
  loading/
  onboarding/
  globals.css
  layout.tsx
  page.tsx
  providers.tsx
  app/(dashboard)/
    dashboard/
    profile/
    profiles/
    projects/
    layout.tsx
    app/(dashboard)/dashboard/
      page.tsx
    app/(dashboard)/profile/
      edit/
      app/(dashboard)/profile/edit/
        page.tsx
    app/(dashboard)/profiles/
      page.tsx
    app/(dashboard)/projects/
      explore/
      page.tsx
      app/(dashboard)/projects/explore/
        page.tsx
  app/auth/
    callback/
    verify/
    page.tsx
    app/auth/callback/
      page.tsx
    app/auth/verify/
      page.tsx
  app/force-profile/
    edit/
    app/force-profile/edit/
      page.tsx
  app/loading/
    page.tsx
  app/onboarding/
    page.tsx
components/
  atoms/
  auth/
  guards/
  molecules/
  organisms/
  views/
  components/atoms/
    Button.tsx
    FormCheckbox.tsx
    FormInput.tsx
    FormSelect.tsx
    Loader.tsx
    SocialIcon.tsx
    StarRatingInput.tsx
  components/auth/
    AuthCheckClient.tsx
    AuthCheckServer.tsx
  components/guards/
    DashboardGuard.tsx
  components/molecules/
    EmailInputWithSubmit.tsx
    ImageUpload.tsx
    LoadingAuthScreen.tsx
    OAuthGoogleButton.tsx
    ProjectCard.tsx
    StatCard.tsx
    TaskItem.tsx
    UploadDocumentField.tsx
  components/organisms/
    ProfileForm/
    dashboard/
    profiles/
    projects/
    LandingContent.tsx
    LoginCard.tsx
    components/organisms/dashboard/
      BioSection.tsx
      ConfirmDialog.tsx
      CustomerCategoriesModal.tsx
      DashboardNavbar.tsx
      ExperienceSection.tsx
      PortfolioSection.tsx
      ProfileCompletionCard.tsx
      SkillsSection.tsx
      StatsSection.tsx
      TasksOverview.tsx
      UserCard.tsx
      types.ts
    components/organisms/ProfileForm/
      formComponents/
      formSections/
      ProfileForm.tsx
      helpers.ts
      types.ts
      useProfileFormData.ts
      components/organisms/ProfileForm/formComponents/
        ExpertiseItem.tsx
        ExpertiseSection.tsx
        SkillsSection.tsx
        ToolsSection.tsx
      components/organisms/ProfileForm/formSections/
        CommonSection.tsx
        CustomerBasicInfo.tsx
        CustomerSections.tsx
        ExpertInfoSection.tsx
    components/organisms/profiles/
      ProfileCard.tsx
      ProfileDetailModal.tsx
      ProfilesList.tsx
      ProfilesSearch.tsx
    components/organisms/projects/
      explore/
      ExpertEmptyState.tsx
      ExpertProjectsList.tsx
      OfferEditModal.tsx
      ProjectEditModal.tsx
      ProjectForm.tsx
      ProjectList.tsx
      components/organisms/projects/explore/
        ExploreOfferCard.tsx
        ExploreOfferDetailModal.tsx
        ExploreOfferList.tsx
        ExploreSearch.tsx
  components/views/
    AuthCallbackView.tsx
    AuthView.tsx
    CustomerDashboardView.tsx
    DashboardView.tsx
    OnboardingPageView.tsx
    OnboardingView.tsx
    VerifyView.tsx
hooks/
  useCountries.ts
  useDashboardUser.ts
  useForceProfileCompletion.ts
  useOnboarding.ts
  useProfileSubmit.ts
  useRedirectIfProfileComplete.ts
types/
  supabase.ts
utils/
  supabase/
  detectPlatform.ts
  exploreProjectsService.ts
  fetchDashboardData.ts
  profilesService.ts
  projectsService.ts
  saveCategories.ts
  toastService.ts
  utils/supabase/
    browserClient.ts
    serverClient.ts
validations/
  CategoryModalSchema.ts
  onboarding-validations.ts
  profile-validations.ts
  projectSchemas.ts
```

### Rutas (App Router)

- `/(dashboard)/dashboard`
- `/(dashboard)/profile/edit`
- `/(dashboard)/profiles`
- `/(dashboard)/projects`
- `/(dashboard)/projects/explore`
- `/.`
- `/auth`
- `/auth/callback`
- `/auth/verify`
- `/force-profile/edit`
- `/loading`
- `/onboarding`

---

## 🧱 Componentes (Atomic Design)

La UI se organiza en **atoms**, **molecules**, **organisms** y **views** dentro de `src/components/`.

Encontrarás la documentación detallada en `docs/COMPONENTS.md`.

---

## 🧩 Hooks, servicios y validaciones

- Hooks: `src/hooks` → ver `docs/HOOKS_AND_SERVICES.md`.
- Servicios (Supabase / fetchers): `src/utils/*Service.ts`.
- Validaciones con **Yup**: `src/validations/*`.

---

## 🧭 Flujo de autenticación y perfiles

Diagrama general (simplificado):

1. `/auth` → login con **Google OAuth** o **Magic Link**.
2. `/auth/verify` muestra estado de verificación por email.
3. `/auth/callback` obtiene sesión y redirige:
   - Si el perfil está incompleto → `/onboarding`.
   - Si está completo → `/dashboard`.
4. Las rutas bajo `(dashboard)` usan **guards** para asegurar perfil completo/rol.

Más detalles en `docs/WORKFLOWS.md`.

---

## 🗄️ Base de datos (Supabase)

Tipos generados en `src/types/supabase.ts`. Tablas principales detectadas:

- `categories`
- `contracted_expertise`
- `contracted_professions`
- `contracted_skills`
- `contracted_solutions`
- `contracted_tools`
- `country`
- `customer_media`
- `customers`
- `expert_documents`
- `expert_expertise`
- `expert_media`
- `experts`
- `it_professions`
- `it_projects`
- `platforms`
- `skills`
- `subcategories`
- `tools`
- `user_role`
- `users`

Relaciones clave (a alto nivel):
- `it_projects` ←→ `contracted_solutions` (ofertas por proyecto / subcategoría).
- `experts` ←→ `expert_media`, `expert_expertise`, `expert_documents`.
- `customers` ←→ `it_projects`.
- `categories` ←→ `subcategories` ←→ `contracted_solutions`.

Detalles en `docs/DB_SCHEMA.md`.

---

## 🧪 Linter y estilos

- ESLint: `eslint.config.mjs` (Next + TS).
- Tailwind: `tailwind.config.ts` (paleta personalizada y fuentes Mulish/Rubik).
- Google Fonts: definidas en `src/app/layout.tsx`.

---

## 🤝 Contribuir

Leé `CONTRIBUTING.md`. A grandes rasgos:
- Flujograma: PRs → `develop` (no a `main` directamente).
- Nombres de ramas: `feature/*`, `bugfix/*`.
- Commits descriptivos.

---

## 📦 Despliegue

- Recomendado: **Vercel** con variables de entorno configuradas.
- `next.config.ts` permite `next/image` desde buckets de Supabase configurados.

---

## 🩹 Troubleshooting (rápido)

- **RLS/Policies** en Supabase: si no podés insertar/leer, revisá políticas por rol/tabla.
- **Auth**: verificá redirect URLs y dominios autorizados en Supabase.
- **Tipos**: regenerá tipos si cambia el esquema (`supabase gen types typescript ...`).

---

© 2025 – Documentación generada automáticamente para wizards-app.
