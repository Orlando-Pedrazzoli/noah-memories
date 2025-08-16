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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let mapInstance: any = null;
    let markers: any[] = [];

    const loadMap = async () => {
      try {
        if (typeof window === 'undefined' || !mapRef.current) return;

        // Carregar Leaflet
        const leaflet = await import('leaflet');
        const L = leaflet.default;

        // CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Criar mapa
        mapInstance = L.map(mapRef.current).setView([20, 0], 2);

        // Adicionar tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(mapInstance);

        // Adicionar marcadores
        travels.forEach(travel => {
          if (travel.location.latitude && travel.location.longitude) {
            const marker = L.marker([
              travel.location.latitude,
              travel.location.longitude,
            ]).addTo(mapInstance).bindPopup(`
                <div>
                  <h3>${travel.title}</h3>
                  <p>${travel.location.name}</p>
                  <p>${new Date(travel.dateVisited).toLocaleDateString(
                    'pt-BR'
                  )}</p>
                </div>
              `);

            marker.on('click', () => onMarkerClick(travel));
            markers.push(marker);
          }
        });

        // Ajustar zoom
        if (markers.length > 0) {
          const group = L.featureGroup(markers);
          mapInstance.fitBounds(group.getBounds().pad(0.1));
        }

        setMapLoaded(true);
      } catch (error) {
        console.error('Erro no mapa:', error);
        setLoadError(true);
      }
    };

    loadMap();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [travels, onMarkerClick]);

  if (loadError || !mapLoaded) {
    return (
      <div
        className={`w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className='text-center'>
          <MapPin className='h-12 w-12 text-gray-400 mx-auto mb-2' />
          <p className='text-gray-600'>
            {loadError ? 'Erro ao carregar mapa' : 'Carregando mapa...'}
          </p>
          <p className='text-sm text-gray-500 mt-2'>
            {travels.length} destino{travels.length !== 1 ? 's' : ''} disponível
            {travels.length !== 1 ? 'is' : ''}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={mapRef} className='w-full h-96 rounded-lg' />
    </div>
  );
}
