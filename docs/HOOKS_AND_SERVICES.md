# HOOKS_AND_SERVICES.md

## Hooks (`src/hooks`)

- `hooks/useCountries.ts` → exports: useCountries  _(pistas: supabase, effect)_  – **33 líneas**
- `hooks/useDashboardUser.ts` → exports: useDashboardUser  _(pistas: supabase, auth, effect)_  – **68 líneas**
- `hooks/useForceProfileCompletion.ts` → exports: useForceProfileCompletion  _(pistas: supabase, auth, router, effect)_  – **102 líneas**
- `hooks/useOnboarding.ts` → exports: useOnboarding  _(pistas: supabase, auth, router)_  – **125 líneas**
- `hooks/useProfileSubmit.ts` → exports: useProfileSubmit  _(pistas: supabase, auth, router)_  – **262 líneas**
- `hooks/useRedirectIfProfileComplete.ts` → exports: useRedirectIfProfileComplete  _(pistas: supabase, auth, router, effect)_  – **100 líneas**

## Servicios y utilidades (`src/utils`)

- `utils/detectPlatform.ts` → exports: getPlatformIcon  _(pistas: —)_  – **39 líneas**
- `utils/exploreProjectsService.ts` → exports: exploreProjectsService  _(pistas: supabase)_  – **74 líneas**
- `utils/fetchDashboardData.ts` → exports: fetchDashboardData  _(pistas: supabase)_  – **151 líneas**
- `utils/profilesService.ts` → exports: profilesService  _(pistas: supabase)_  – **119 líneas**
- `utils/projectsService.ts` → exports: projectsService  _(pistas: supabase, auth)_  – **261 líneas**
- `utils/saveCategories.ts` → exports: saveCategories  _(pistas: supabase)_  – **93 líneas**
- `utils/supabase/browserClient.ts` → exports: browserClient  _(pistas: supabase, auth)_  – **7 líneas**
- `utils/supabase/serverClient.ts` → exports: createServerClient  _(pistas: supabase, auth)_  – **9 líneas**
- `utils/toastService.ts` → exports: dismissToast, showError, showInfo, showLoading, showSuccess  _(pistas: —)_  – **57 líneas**

## Validaciones (`src/validations`)

- `validations/CategoryModalSchema.ts` → exports: CategoryModalSchema – **66 líneas**
- `validations/onboarding-validations.ts` → exports: onboarding-validations – **17 líneas**
- `validations/profile-validations.ts` → exports: getProfileSchema – **47 líneas**
- `validations/projectSchemas.ts` → exports: projectSchemas – **26 líneas**