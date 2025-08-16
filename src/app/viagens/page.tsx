'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TravelMap from '@/components/TravelMap';
import {
  MapPin,
  Calendar,
  Image as ImageIcon,
  Plus,
  Plane,
} from 'lucide-react';
import { Travel } from '@/types';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function ViagensPage() {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [selectedTravel, setSelectedTravel] = useState<Travel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/travels');
      if (response.ok) {
        const data = await response.json();
        setTravels(data);
      } else {
        setError('Erro ao carregar viagens');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (travel: Travel) => {
    setSelectedTravel(travel);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-2'>
              <Plane className='h-8 w-8 text-slate-700' />
              <span>Álbum de Viagens</span>
            </h1>
            <p className='text-gray-600'>
              Aventuras pelo mundo do Noah Taffo Pedrazzoli
            </p>
          </div>
          <Link
            href='/upload'
            className='btn-primary flex items-center space-x-2'
          >
            <Plus className='h-5 w-5' />
            <span>Nova Viagem</span>
          </Link>
        </div>

        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700'></div>
          </div>
        ) : error ? (
          <div className='text-center py-20'>
            <p className='text-red-600'>{error}</p>
          </div>
        ) : (
          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Mapa */}
            <div className='lg:col-span-2'>
              <div className='card'>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  Mapa Mundial
                </h2>
                <TravelMap
                  travels={travels}
                  onMarkerClick={handleMarkerClick}
                  selectedTravel={selectedTravel}
                />
              </div>
            </div>

            {/* Lista de Viagens */}
            <div className='space-y-6'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Destinos Visitados ({travels.length})
              </h2>

              {travels.length === 0 ? (
                <div className='card text-center py-8'>
                  <MapPin className='h-12 w-12 text-gray-300 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    Nenhuma viagem ainda
                  </h3>
                  <p className='text-gray-500 mb-6'>
                    Seja o primeiro a adicionar uma aventura!
                  </p>
                  <Link href='/upload' className='btn-primary'>
                    Adicionar Viagem
                  </Link>
                </div>
              ) : (
                <div className='space-y-4 max-h-96 overflow-y-auto'>
                  {travels.map(travel => (
                    <div
                      key={travel._id}
                      className={`card cursor-pointer transition-all duration-200 ${
                        selectedTravel?._id === travel._id
                          ? 'ring-2 ring-slate-500 shadow-lg bg-slate-50'
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => setSelectedTravel(travel)}
                    >
                      {/* Imagem Principal */}
                      {travel.images.length > 0 && (
                        <div className='relative h-32 mb-3 rounded-lg overflow-hidden'>
                          <img
                            src={travel.images[0]}
                            alt={travel.title}
                            className='w-full h-full object-cover'
                          />
                          {travel.images.length > 1 && (
                            <div className='absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded'>
                              +{travel.images.length - 1}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Conteúdo */}
                      <div>
                        <h3 className='font-semibold text-gray-900 mb-1'>
                          {travel.title}
                        </h3>

                        <div className='flex items-center space-x-1 text-sm text-gray-600 mb-2'>
                          <MapPin className='h-3 w-3' />
                          <span>{travel.location.name}</span>
                        </div>

                        <div className='flex items-center justify-between text-xs text-gray-500'>
                          <div className='flex items-center space-x-1'>
                            <Calendar className='h-3 w-3' />
                            <span>
                              {formatDate(new Date(travel.dateVisited))}
                            </span>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <ImageIcon className='h-3 w-3' />
                            <span>{travel.images.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de Detalhes da Viagem */}
        {selectedTravel && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto'>
              {/* Header */}
              <div className='p-6 border-b border-gray-200'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h2 className='text-2xl font-bold text-gray-900'>
                      {selectedTravel.title}
                    </h2>
                    <div className='flex items-center space-x-2 text-gray-600 mt-1'>
                      <MapPin className='h-4 w-4' />
                      <span>{selectedTravel.location.name}</span>
                      <span>•</span>
                      <Calendar className='h-4 w-4' />
                      <span>
                        {formatDate(new Date(selectedTravel.dateVisited))}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTravel(null)}
                    className='text-gray-400 hover:text-gray-600'
                  >
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Conteúdo */}
              <div className='p-6'>
                {/* Descrição */}
                {selectedTravel.description && (
                  <div className='mb-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      Sobre a Viagem
                    </h3>
                    <p className='text-gray-600 leading-relaxed'>
                      {selectedTravel.description}
                    </p>
                  </div>
                )}

                {/* Galeria de Fotos */}
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    Galeria ({selectedTravel.images.length} fotos)
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {selectedTravel.images.map((image, index) => (
                      <div
                        key={index}
                        className='relative aspect-square rounded-lg overflow-hidden'
                      >
                        <img
                          src={image}
                          alt={`${selectedTravel.title} - Foto ${index + 1}`}
                          className='w-full h-full object-cover hover:scale-105 transition-transform duration-200'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
