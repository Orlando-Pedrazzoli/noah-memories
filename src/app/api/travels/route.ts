// src/app/api/travels/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { Travel } from '@/types';

function authenticateRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token || !verifyToken(token)) {
    return false;
  }
  return true;
}

// GET - Buscar viagens
export async function GET(request: NextRequest) {
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const db = await getDatabase();
    const travels = await db
      .collection('travels')
      .find({})
      .sort({ dateVisited: -1 })
      .toArray();

    return NextResponse.json(travels);
  } catch (error) {
    console.error('Erro ao buscar viagens:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// POST - Criar nova viagem
export async function POST(request: NextRequest) {
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, location, images, dateVisited } = body;

    if (
      !title ||
      !location ||
      !location.name ||
      !location.latitude ||
      !location.longitude
    ) {
      return NextResponse.json(
        {
          error:
            'Campos obrigatórios: title, location com name/latitude/longitude',
        },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const travel: Omit<Travel, '_id'> = {
      title,
      description: description || '',
      location,
      images: images || [],
      dateVisited: new Date(dateVisited || Date.now()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('travels').insertOne(travel);

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...travel,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar viagem:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
