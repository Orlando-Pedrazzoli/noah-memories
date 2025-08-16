// src/app/api/auth/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Verificar credenciais do .env
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
      const token = generateToken('admin');

      const response = NextResponse.json({
        success: true,
        message: 'Login realizado com sucesso!',
      });

      // Definir cookie httpOnly
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 dias
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Credenciais inválidas',
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Logout realizado com sucesso!',
  });

  response.cookies.delete('auth-token');
  return response;
}
