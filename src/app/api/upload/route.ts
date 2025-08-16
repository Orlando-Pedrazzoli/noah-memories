import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { verifyToken } from '@/lib/auth';

function authenticateRequest(request: NextRequest) {
  console.log('=== VERIFICANDO AUTENTICAÇÃO ===');

  const token = request.cookies.get('auth-token')?.value;
  console.log('Token encontrado:', token ? 'SIM' : 'NÃO');

  if (!token) {
    console.log('❌ Token não encontrado');
    return false;
  }

  const verified = verifyToken(token);
  console.log('Token válido:', verified ? 'SIM' : 'NÃO');

  return !!verified;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== INÍCIO DO UPLOAD ===');

    if (!authenticateRequest(request)) {
      console.log('❌ Não autorizado');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    console.log('✅ Usuário autenticado');

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const folder: string = (data.get('folder') as string) || 'general';

    console.log('Dados recebidos:', {
      file: file ? `${file.name} (${file.size} bytes, ${file.type})` : 'NENHUM',
      folder: folder,
    });

    if (!file) {
      console.log('❌ Nenhum arquivo enviado');
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Verificar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    console.log('Verificando tipo de arquivo:', file.type);

    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Tipo de arquivo não permitido:', file.type);
      return NextResponse.json(
        {
          error: 'Tipo de arquivo não permitido. Use: JPG, PNG ou WebP',
        },
        { status: 400 }
      );
    }

    // Verificar tamanho (máximo 10MB)
    console.log('Verificando tamanho do arquivo:', file.size, 'bytes');

    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ Arquivo muito grande:', file.size);
      return NextResponse.json(
        {
          error: 'Arquivo muito grande. Máximo 10MB',
        },
        { status: 400 }
      );
    }

    console.log('✅ Arquivo válido, convertendo para buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('Buffer criado:', buffer.length, 'bytes');

    console.log('🌥️ Enviando para Cloudinary...');
    console.log('Configuração Cloudinary:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'UNDEFINED',
      api_key: process.env.CLOUDINARY_API_KEY || 'UNDEFINED',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '[HIDDEN]' : 'UNDEFINED',
    });

    const imageUrl = await uploadToCloudinary(buffer, folder);
    console.log('✅ Upload concluído! URL:', imageUrl);

    console.log('=== FIM DO UPLOAD (SUCESSO) ===');

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Upload realizado com sucesso!',
    });
  } catch (error) {
    console.error('❌ ERRO NO UPLOAD:', error);

    // Log mais detalhado do erro
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
