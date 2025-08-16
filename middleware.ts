import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Páginas públicas que não precisam de autenticação
  const publicPaths = ['/login'];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Verificar se tem token de autenticação
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // Redirecionar para login se não estiver autenticado
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)',
  ],
};
