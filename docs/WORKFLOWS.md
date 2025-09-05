# WORKFLOWS.md

## Autenticación

- **Vista**: `src/components/views/AuthView.tsx`
- **Métodos**:
  - Google OAuth (`supabase.auth.signInWithOAuth({ provider: 'google' })`)
  - Magic Link (`supabase.auth.signInWithOtp({ email })`)
- **Pantallas**:
  - `/auth` (login/signup)
  - `/auth/verify` (estado de verificación)
  - `/auth/callback` (resuelve sesión y decide redirección)

**Redirecciones:**
- Si el perfil está incompleto → `/onboarding`
- Si el perfil está completo → `/dashboard`

## Onboarding / Forzar perfil

- **Hook**: `useForceProfileCompletion`, `useRedirectIfProfileComplete`
- **Guard**: `components/guards/DashboardGuard.tsx`
- **Vistas**: `src/components/views/OnboardingView.tsx`, ruta `/onboarding`

## Dashboard

- **Ruta base**: `/(dashboard)/dashboard`
- **Navbar**: `components/organisms/dashboard/DashboardNavbar.tsx`
- **Secciones**: perfil, skills/tools, experiencia, portafolio.

## Proyectos

- **Servicios**: `utils/projectsService.ts`
  - `fetchProjectsByRole(userId, role)` – filtra según rol (customer/admin)
  - `fetchProjectsForExpert(userId)` – proyectos asociados al experto
- **UI**: `components/organisms/projects/*`
  - `ProjectList`, `ProjectForm`, `ProjectEditModal`
  - `OfferEditModal` (ofertas/contracted_solutions)
- **Explorar ofertas**: `/(dashboard)/projects/explore` con `utils/exploreProjectsService.ts`

## Perfiles

- **Servicios**: `utils/profilesService.ts`
  - Obtiene cards de expertos y sus `expert_media` (avatar) y skills/tools.
- **UI**: `components/organisms/profiles/*`
  - `ProfilesList`, `ProfilesSearch`, `ProfileCard`, modales.

## Toasts / UX

- `utils/toastService.ts` encapsula **sonner** para notificaciones coherentes.
