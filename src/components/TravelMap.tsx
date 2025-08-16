// src/components/TravelMap.tsx
// =============================================================================

'use client';
import React, { useEffect, useRef } from 'react';
import { MapPin, Camera, Calendar } from 'lucide-react';
import { Travel } from '@/types';

interface TravelMapProps {
  travels: Travel[];
  onMarkerClick: (travel: Travel) => void;
  selectedTravel?: Travel | null;
  className?: string;
}

// Componente de Mapa usando Leaflet (será carregado dinamicamente)
const LeafletMap = ({
  travels,
  onMarkerClick,
  selectedTravel,
}: TravelMapProps) => {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Carregamento dinâmico do Leaflet (client-side only)
    const loadMap = async () => {
      if (typeof window !== 'undefined') {
        const L = (await import('leaflet')).default;

        // CSS do Leaflet
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Inicializar mapa se ainda não existe
        if (!mapInstanceRef.current && mapRef.current) {
          mapInstanceRef.current = L.map(mapRef.current, {
            center: [20, 0], // Centro do mundo
            zoom: 2,
            zoomControl: true,
            attributionControl: true,
          });

          // Adicionar camada do mapa
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
          }).addTo(mapInstanceRef.current);

          // Ícone customizado para marcadores
          const customIcon = L.divIcon({
            html: '<div class="custom-marker">📍</div>',
            className: 'custom-marker-wrapper',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          });

          // Adicionar marcadores para cada viagem
          travels.forEach(travel => {
            if (travel.location.latitude && travel.location.longitude) {
              const marker = L.marker(
                [travel.location.latitude, travel.location.longitude],
                { icon: customIcon }
              ).addTo(mapInstanceRef.current);

              // Popup com informações da viagem
              marker.bindPopup(`
                <div class="travel-popup">
                  <h3 class="font-bold text-gray-900 mb-1">${travel.title}</h3>
                  <p class="text-sm text-gray-600 mb-2">${
                    travel.location.name
                  }</p>
                  <p class="text-xs text-gray-500">${new Date(
                    travel.dateVisited
                  ).toLocaleDateString('pt-BR')}</p>
                  <p class="text-xs text-gray-500">${
                    travel.images.length
                  } foto${travel.images.length > 1 ? 's' : ''}</p>
                </div>
              `);

              // Click handler
              marker.on('click', () => {
                onMarkerClick(travel);
              });
            }
          });

          // Ajustar zoom para mostrar todos os marcadores
          if (travels.length > 0) {
            const validTravels = travels.filter(
              t => t.location.latitude && t.location.longitude
            );
            if (validTravels.length > 0) {
              const group = new L.featureGroup(
                validTravels.map(travel =>
                  L.marker([
                    travel.location.latitude,
                    travel.location.longitude,
                  ])
                )
              );
              mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
            }
          }
        }
      }
    };

    loadMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [travels]);

  return (
    <div className='relative'>
      <div ref={mapRef} className='w-full h-96 rounded-lg z-10' />

      {/* CSS customizado para os marcadores */}
      <style jsx global>{`
        .custom-marker-wrapper {
          background: transparent !important;
          border: none !important;
        }

        .custom-marker {
          font-size: 24px;
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
          cursor: pointer;
          transition: transform 0.2s;
        }

        .custom-marker:hover {
          transform: scale(1.2);
        }

        .travel-popup {
          min-width: 150px;
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
        }

        .leaflet-popup-tip {
          background: white !important;
        }
      `}</style>
    </div>
  );
};

// Componente de Fallback quando o mapa não pode carregar
const MapFallback = ({ travels, onMarkerClick }: TravelMapProps) => {
  return (
    <div className='w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-dashed border-blue-300 flex flex-col items-center justify-center p-8'>
      <MapPin className='h-16 w-16 text-blue-400 mb-4' />
      <h3 className='text-xl font-semibold text-blue-700 mb-2'>
        Mapa Interativo
      </h3>
      <p className='text-blue-600 text-center mb-4'>
        {travels.length > 0
          ? `${travels.length} destino${
              travels.length > 1 ? 's' : ''
            } visitado${travels.length > 1 ? 's' : ''}`
          : 'Nenhum destino ainda'}
      </p>

      {travels.length > 0 && (
        <div className='grid grid-cols-1 gap-2 max-h-32 overflow-y-auto w-full'>
          {travels.map(travel => (
            <button
              key={travel._id}
              onClick={() => onMarkerClick(travel)}
              className='text-left p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-200'
            >
              <div className='flex items-center space-x-2'>
                <MapPin className='h-4 w-4 text-blue-500 flex-shrink-0' />
                <div>
                  <p className='font-medium text-gray-900 text-sm'>
                    {travel.title}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {travel.location.name}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <p className='text-xs text-blue-500 mt-4 text-center'>
        Mapa interativo carregará automaticamente
      </p>
    </div>
  );
};

// Componente Principal
export default function TravelMap(props: TravelMapProps) {
  const { className = '' } = props;

  return (
    <div className={`travel-map-container ${className}`}>
      {typeof window !== 'undefined' ? (
        <LeafletMap {...props} />
      ) : (
        <MapFallback {...props} />
      )}
    </div>
  );
}
