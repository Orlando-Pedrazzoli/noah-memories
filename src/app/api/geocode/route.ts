// src/app/api/geocode/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Endereço é obrigatório' },
        { status: 400 }
      );
    }

    // Usando Nominatim (OpenStreetMap) - Gratuito
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=5`,
      {
        headers: {
          'User-Agent': 'Noah-Memories-App/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Erro na API de geocodificação');
    }

    const data = await response.json();

    const results = data.map((item: any) => ({
      name: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      country: item.address?.country || '',
      state: item.address?.state || '',
      city:
        item.address?.city || item.address?.town || item.address?.village || '',
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Erro no geocoding:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}
