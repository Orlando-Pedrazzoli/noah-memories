import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('=== INÍCIO DO LOGIN ===');

    const body = await request.json();
    console.log('Body recebido:', {
      username: body.username,
      password: body.password ? '[HIDDEN]' : 'undefined',
    });

    const { username, password } = body;

    // Verificar credenciais do .env
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log('Credenciais do .env:', {
      adminUsername: adminUsername || 'UNDEFINED',
      adminPassword: adminPassword ? '[HIDDEN]' : 'UNDEFINED',
    });

    console.log('Comparação:', {
      usernameMatch: username === adminUsername,
      passwordMatch: password === adminPassword,
    });

    if (username === adminUsername && password === adminPassword) {
      console.log('✅ Credenciais válidas! Gerando token...');

      const token = generateToken('admin');
      console.log('Token gerado:', token ? 'SUCCESS' : 'FAILED');

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
        path: '/',
      });

      console.log('✅ Cookie definido com sucesso');
      console.log('=== FIM DO LOGIN (SUCESSO) ===');
      return response;
    }

    console.log('❌ Credenciais inválidas');
    console.log('=== FIM DO LOGIN (FALHA) ===');

    return NextResponse.json(
      {
        success: false,
        message: 'Credenciais inválidas',
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('❌ ERRO NO LOGIN:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    console.log('=== LOGOUT INICIADO ===');

    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso!',
    });

    response.cookies.delete('auth-token');
    console.log('✅ Cookie removido');
    console.log('=== LOGOUT CONCLUÍDO ===');

    return response;
  } catch (error) {
    console.error('❌ ERRO NO LOGOUT:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro no logout',
      },
      { status: 500 }
    );
  }
}
