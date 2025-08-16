// src/app/api/memories/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { Memory } from '@/types';

// Middleware de autenticação
function authenticateRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token || !verifyToken(token)) {
    return false;
  }
  return true;
}

// GET - Buscar memórias
export async function GET(request: NextRequest) {
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const ageCategory = searchParams.get('ageCategory');
    const type = searchParams.get('type');

    const db = await getDatabase();
    const filter: any = {};

    if (ageCategory) filter.ageCategory = ageCategory;
    if (type) filter.type = type;

    const memories = await db
      .collection('memories')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(memories);
  } catch (error) {
    console.error('Erro ao buscar memórias:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// POST - Criar nova memória
export async function POST(request: NextRequest) {
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, images, ageCategory, type } = body;

    if (!title || !ageCategory || !type) {
      return NextResponse.json(
        {
          error: 'Campos obrigatórios: title, ageCategory, type',
        },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const memory: Omit<Memory, '_id'> = {
      title,
      description: description || '',
      images: images || [],
      ageCategory,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('memories').insertOne(memory);

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...memory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar memória:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
