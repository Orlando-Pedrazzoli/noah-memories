'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Travel } from '@/types';

interface TravelMapProps {
  travels: Travel[];
  onMarkerClick: (travel: Travel) => void;
  selectedTravel?: Travel | null;
  className?: string;
}

export default function TravelMap({
  travels,
  onMarkerClick,
  selectedTravel,
  className = '',
}: TravelMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Função para carregar o Leaflet dinamicamente
  const loadLeaflet = async () => {
    try {
      // Carregar CSS do Leaflet
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Aguardar o CSS carregar
        await new Promise(resolve => {
          link.onload = resolve;
          setTimeout(resolve, 1000); // Fallback timeout
        });
      }

      // Carregar JavaScript do Leaflet
      const L = await import('leaflet');

      // Fix para os ícones padrão do Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      return L.default || L;
    } catch (error) {
      console.error('Erro ao carregar Leaflet:', error);
      throw error;
    }
  };

  // Função para inicializar o mapa
  const initializeMap = async () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      console.log('Inicializando mapa...');
      const L = await loadLeaflet();

      // Criar o mapa
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
      });

      // Adicionar tiles do OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      console.log('Mapa criado com sucesso');
      setMapLoaded(true);
      setLoadError(false);
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
      setLoadError(true);
      setMapLoaded(false);
    }
  };

  // Função para adicionar marcadores
  const addMarkers = async () => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    try {
      const L = await loadLeaflet();

      // Limpar marcadores existentes
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];

      // Adicionar novos marcadores
      const validTravels = travels.filter(
        travel =>
          travel.location.latitude &&
          travel.location.longitude &&
          !isNaN(travel.location.latitude) &&
          !isNaN(travel.location.longitude)
      );

      console.log(`Adicionando ${validTravels.length} marcadores`);

      validTravels.forEach(travel => {
        const { latitude, longitude } = travel.location;

        const marker = L.marker([latitude, longitude])
          .addTo(mapInstanceRef.current)
          .bindPopup(
            `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${
                travel.title
              }</h3>
              <p style="margin: 0 0 4px 0; color: #6b7280; display: flex; align-items: center;">
                📍 ${travel.location.name}
              </p>
              <p style="margin: 0; color: #6b7280; display: flex; align-items: center;">
                📅 ${new Date(travel.dateVisited).toLocaleDateString('pt-BR')}
              </p>
              ${
                travel.images.length > 0
                  ? `
                <div style="margin-top: 8px;">
                  <img src="${travel.images[0]}" alt="${travel.title}" 
                       style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px;" />
                </div>
              `
                  : ''
              }
            </div>
          `,
            {
              maxWidth: 250,
              className: 'custom-popup',
            }
          );

        // Evento de clique no marcador
        marker.on('click', () => {
          console.log('Marcador clicado:', travel.title);
          onMarkerClick(travel);
        });

        // Destacar marcador selecionado
        if (selectedTravel && selectedTravel._id === travel._id) {
          marker.openPopup();
        }

        markersRef.current.push(marker);
      });

      // Ajustar zoom para mostrar todos os marcadores
      if (markersRef.current.length > 0) {
        const group = L.featureGroup(markersRef.current);
        const bounds = group.getBounds();

        if (bounds.isValid()) {
          mapInstanceRef.current.fitBounds(bounds, {
            padding: [20, 20],
            maxZoom: 10,
          });
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar marcadores:', error);
    }
  };

  // Effect para inicializar o mapa
  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current) {
      initializeMap();
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        console.log('Limpando mapa...');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
        setMapLoaded(false);
      }
    };
  }, []); // Executar apenas uma vez

  // Effect para atualizar marcadores quando travels mudarem
  useEffect(() => {
    if (mapLoaded && travels.length >= 0) {
      addMarkers();
    }
  }, [travels, mapLoaded, selectedTravel]);

  // Effect para redimensionar o mapa quando necessário
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  }, [mapLoaded]);

  if (loadError) {
    return (
      <div
        className={`w-full h-96 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className='text-center'>
          <MapPin className='h-12 w-12 text-red-400 mx-auto mb-2' />
          <p className='text-red-600 font-medium'>Erro ao carregar mapa</p>
          <p className='text-sm text-red-500 mt-1'>
            Verifique sua conexão com a internet
          </p>
          <button
            onClick={() => {
              setLoadError(false);
              setMapLoaded(false);
              initializeMap();
            }}
            className='mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors'
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div
        className={`w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700 mx-auto mb-4'></div>
          <MapPin className='h-12 w-12 text-gray-400 mx-auto mb-2' />
          <p className='text-gray-600'>Carregando mapa...</p>
          <p className='text-sm text-gray-500 mt-2'>
            {travels.length} destino{travels.length !== 1 ? 's' : ''} disponível
            {travels.length !== 1 ? 'is' : ''}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className='w-full h-96 rounded-lg shadow-sm border border-gray-200'
        style={{ minHeight: '384px' }}
      />

      {/* Controles personalizados */}
      <div className='absolute top-4 left-4 bg-white rounded-lg shadow-md p-2 z-[1000]'>
        <div className='text-xs text-gray-600'>
          📍 {travels.length} destino{travels.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
