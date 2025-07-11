# 🚀 Migración de Proyecto Stardust a Next.js

Este documento describe el proceso de migración de una aplicación web simple en HTML/CSS puro a un entorno moderno utilizando Next.js, TypeScript, Tailwind CSS v4.1 (sin archivo tailwind.config.js) y Supabase.

## 📌 Resumen del Proyecto Original

El proyecto consistía en una landing page y una pantalla de login con autenticación mediante Supabase.

### Tecnologías del Proyecto Original

- HTML5 y CSS3
- Supabase JS v2
- Javascript Vanilla

## 🎯 Objetivo de la Migración

- Modernizar el stack tecnológico.
- Mejorar la mantenibilidad del código.
- Facilitar escalabilidad futura.
- Separar componentes reutilizables.
- Adoptar tecnologías actuales como Next.js, TypeScript y Tailwind CSS v4.1 (sin archivo tailwind.config.js).

## 🧱 Nuevas Tecnologías Utilizadas

- [Next.js](https://nextjs.org/) (v15.3.3)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4.1 (sin archivo tailwind.config.js)](https://tailwindcss.com/)
- [Supabase JS v2](https://supabase.com/)
- Atomic Design: Atoms, Molecules, Organisms
- Arquitectura modular bajo `/src`

## 🔨 Cambios Realizados

### 1. Estructura del Proyecto

- **Antes:** Archivos HTML y CSS planos (`index.html`, `login.html`, `styles.css`)
- **Después:** Estructura modular basada en App Router de Next.js

### 2. Migración Visual

- Se mantuvo la apariencia original utilizando Tailwind CSS v4.1 (sin archivo tailwind.config.js).
- Estilos visuales conservados usando clases utilitarias directamente en los componentes.
- `globals.css` contiene únicamente temas globales, fuentes y variables.

### 3. Componentización

- `Button`: Componente genérico con variantes (`primary`, `secondary`, `email`, `google`)
- `Logo`: Componente separado
- `EmailLogin`, `GoogleLoginButton`: Lógica de login modularizada
- `LoginCard`: Reúne las opciones de login

### 4. Rutas

- `/`: Landing page con botones de Sign In y Sign Up.
- `/login`: Página de autenticación.

### 5. Autenticación

- Se creó una instancia de Supabase en `utils/supabase/client.ts`.
- Uso de OAuth (Google) y OTP (email).
- Redirección al dashboard tras autenticación.

### 6. Layout y Tipografía

- Se usó Google Fonts (Mulish) globalmente.
- `layout.tsx` gestiona el diseño base.

## 🧪 Detalles Técnicos

- `use client` se agregó en componentes con hooks.
- Estilos CSS como `fadeIn` se mantuvieron en `globals.css`.
- Variables de entorno utilizadas para conectar con Supabase:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📌 Pendientes / Futuras Mejoras

- Implementar dashboard privado
- Validación y feedback de email
- Mejor manejo de errores visuales
- Sistema global de sesión

## 🛠️ Instrucciones de Instalación

Estas instrucciones están pensadas para personas no técnicas que deseen ejecutar el proyecto de manera local.

### 1. Requisitos previos

Asegúrese de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [Git](https://git-scm.com/)
- Un editor de texto como [Visual Studio Code](https://code.visualstudio.com/)

### 2. Clonar el proyecto

Abra una terminal y ejecute:

```bash
git clone https://github.com/ninja-Wiz/website
cd website
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar Supabase

Cree un archivo `.env.local` en la raíz del proyecto con las siguientes variables (los valores deben provenir del proyecto en Supabase):

```env
NEXT_PUBLIC_SUPABASE_URL=TU_URL_DE_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_CLAVE_ANONIMA_DE_SUPABASE
```

### 5. Iniciar el proyecto

```bash
npm run dev
```

El proyecto se ejecutará en [http://localhost:3000](http://localhost:3000).

---

Migrado y documentado por **Luis Fuentes**, desarrollador fullstack con enfoque frontend, como parte de una pasantía técnica.

Este es un proyecto de Next.js inicializado con create-next-app.

🚀 Primeros pasos

Primero, iniciá el servidor de desarrollo:

bash:
npm run dev

# o

yarn dev

# o

pnpm dev

# o

bun dev

Abrir http://localhost:3000 en el navegador para ver el resultado.

se puede comenzar a editar la página modificando el archivo app/page.tsx. La página se actualizará automáticamente a medida que guardes los cambios.

Este proyecto utiliza next/font para optimizar y cargar automáticamente Geist, una nueva familia tipográfica creada por Vercel.

📚 Más información
Para aprender más sobre Next.js, consultá los siguientes recursos:

Documentación de Next.js: información sobre las características y la API de Next.js.

Aprende Next.js: un tutorial interactivo de Next.js.

También podés visitar el repositorio oficial en GitHub: tus sugerencias y contribuciones son bienvenidas.

☁️ Despliegue en Vercel
La forma más sencilla de desplegar tu app de Next.js es usando la plataforma Vercel(https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), creada por los desarrolladores de Next.js.

Consultá nuestra documentación de despliegue(https://nextjs.org/docs/app/building-your-application/deploying) para obtener más detalles.
