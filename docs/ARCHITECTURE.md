# ARCHITECTURE.md

El proyecto combina **Screaming Architecture** (carpetas por dominio/feature) con **Atomic Design** para la UI.

## Capas y carpetas

- `src/app` – rutas (App Router). Agrupación por contexto: `auth`, `(dashboard)`, `onboarding`, etc.
- `src/components` – **atoms**, **molecules**, **organisms**, **views**.
- `src/hooks` – lógica de UI reutilizable por feature (onboarding, perfil, redirecciones).
- `src/utils` – servicios (Supabase) y helpers.
- `src/validations` – esquemas Yup para formularios.
- `src/types` – tipos TS generados a partir de la BD de Supabase.

## Convenciones

- Client Components llevan `'use client'` arriba del archivo.
- Servicios que pegan a Supabase están en `utils/*Service.ts`.
- Formularios con **Formik** + **Yup**.
- `sonner` para toasts, centralizado en `utils/toastService.ts`.
- `next/image` habilitado para dominios de buckets en `next.config.ts`.
- Fuentes Google (Mulish / Rubik) y colores en `tailwind.config.ts`.

## Datos y estado

- Sesión Supabase provista por `SessionContextProvider` en `src/app/providers.tsx`.
- Lectura/SSR: `utils/supabase/serverClient.ts`.
- Cliente: `utils/supabase/browserClient.ts`.
