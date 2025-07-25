// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({
    req: request,
    res: response,
  });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname, searchParams } = request.nextUrl;

  // ⛔ No interceptar la ruta de callback de OAuth
  if (pathname.startsWith('/auth/callback')) {
    // Verificar si es un callback de Google
    const provider = searchParams.get('provider');
    if (provider === 'google') {
      return response;
    }
    return response;
  }

  // Manejar el caso de redirección después del login
  if (pathname === '/auth') {
    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) {
      // Si hay una sesión y una URL de redirección, redirigir
      if (session) {
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }
  }

  const isProtectedPath = [
    '/dashboard',
    '/profile',
    '/search',
    '/projects',
  ].some((path) => pathname === path || pathname.startsWith(`${path}/`));

  // 🔒 Bloquear acceso a rutas protegidas si no hay sesión
  if (!session && isProtectedPath) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', pathname); // Redirige después del login
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 Evitar que usuarios logueados entren a /auth
  if (session && (pathname === '/auth' || pathname.startsWith('/auth/login'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
  runtime: 'nodejs', // 👈 evita el runtime Edge (causante del warning)
};
