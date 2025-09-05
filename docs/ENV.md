# ENV.md

Este proyecto necesita variables de entorno para conectarse a **Supabase**.

## Requeridas

```env
# .env.example – NO subir valores reales
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
NEXT_PUBLIC_DEBUG_PROFILE=false
```

- `NEXT_PUBLIC_*`: accesibles en el cliente (no pongas claves de servicio aquí).
- `SUPABASE_*`: usadas en server components / SSR.

**Consejos:**
- Usá `.env.local` para desarrollo (git-ignored).
- En producción (ej. Vercel), cargá las variables desde el dashboard.
