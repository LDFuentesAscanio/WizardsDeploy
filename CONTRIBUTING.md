````md
# 🤝 Cómo contribuir

¡Gracias por tu interés en mejorar el proyecto!

## 🧾 Reglas generales

- Usá nombres claros para tus ramas:
  - `feature/login-form`
  - `bugfix/redirect-verify`
- Usá `develop` como base para nuevas features.
- Hacé PRs a `develop`, no a `main` directamente.
- Usá commits descriptivos.

## 🚀 Cómo empezar

```bash
git checkout -b feature/nombre-de-tu-feature develop

Al terminar:

git add .
git commit -m "feat: agrega formulario de contacto"
git push origin feature/nombre-de-tu-feature

Abre un Pull Request y describe qué cambios hiciste.

# 🏛️ Arquitectura del Proyecto

Este proyecto sigue **Screaming Architecture** + **Atomic Design**.

## 🎤 Screaming Architecture

- Las carpetas gritan su propósito:
  - `/auth`, `/dashboard`, `/onboarding` → indican qué hace cada una.
  - Las rutas de Next.js están organizadas por contexto.

## ⚛️ Atomic Design

Componentes se agrupan así:

- **Atoms**: Botones, inputs, íconos.
- **Molecules**: Agrupaciones simples (e.g., email + botón).
- **Organisms**: Componentes completos (e.g., LoginCard).

## 🧠 Hooks

Hooks personalizados abstraen la lógica compleja:
- `useOnboarding`: guarda perfil del usuario en Supabase.
- `useGoogleAutofill`: extrae datos del proveedor Google.
- `useRedirectAfterAuth`: redirige según perfil al recibir Magic Link.

## 📦 Archivos clave

/app
└── auth/
└── dashboard/
└── onboarding/
/components
└── atoms/
└── molecules/
└── organisms/
/hooks
/utils/supabase/client.ts
/validations

```
````
