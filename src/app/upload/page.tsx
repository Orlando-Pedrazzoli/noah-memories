'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UploadForm from '@/components/UploadForm';
import { Plus, Heart, Plane, Image as ImageIcon } from 'lucide-react';
import { getAgeCategories } from '@/lib/utils';

export default function UploadPage() {
  const [selectedDestination, setSelectedDestination] = useState<
    'memories' | 'travels' | null
  >(null);
  const [memoryData, setMemoryData] = useState({
    title: '',
    description: '',
    ageCategory: '1ano',
    type: 'memory' as 'memory' | 'schoolwork',
    images: [] as string[],
  });
  const [travelData, setTravelData] = useState({
    title: '',
    description: '',
    location: {
      name: '',
      latitude: 0,
      longitude: 0,
      country: '',
    },
    dateVisited: new Date().toISOString().split('T')[0],
    images: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageUpload = (imageUrl: string) => {
    if (selectedDestination === 'memories') {
      setMemoryData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
    } else if (selectedDestination === 'travels') {
      setTravelData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
    }
  };

  const geocodeLocation = async (address: string) => {
    try {
      const response = await fetch(
        `/api/geocode?address=${encodeURIComponent(address)}`
      );
      const results = await response.json();

      if (results.length > 0) {
        const location = results[0];
        setTravelData(prev => ({
          ...prev,
          location: {
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
            country: location.country,
          },
        }));
      }
    } catch (error) {
      console.error('Erro no geocoding:', error);
    }
  };

  const saveMemory = async () => {
    if (!memoryData.title || memoryData.images.length === 0) {
      setMessage('Título e pelo menos uma imagem são obrigatórios');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memoryData),
      });

      if (response.ok) {
        setMessage('Memória salva com sucesso!');
        setMemoryData({
          title: '',
          description: '',
          ageCategory: '1ano',
          type: 'memory',
          images: [],
        });
        setSelectedDestination(null);
      } else {
        setMessage('Erro ao salvar memória');
      }
    } catch (error) {
      setMessage('Erro de conexão');
    } finally {
      setSaving(false);
    }
  };

  const saveTravel = async () => {
    if (
      !travelData.title ||
      !travelData.location.name ||
      travelData.images.length === 0
    ) {
      setMessage(
        'Título, localização e pelo menos uma imagem são obrigatórios'
      );
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/travels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(travelData),
      });

      if (response.ok) {
        setMessage('Viagem salva com sucesso!');
        setTravelData({
          title: '',
          description: '',
          location: { name: '', latitude: 0, longitude: 0, country: '' },
          dateVisited: new Date().toISOString().split('T')[0],
          images: [],
        });
        setSelectedDestination(null);
      } else {
        setMessage('Erro ao salvar viagem');
      }
    } catch (error) {
      setMessage('Erro de conexão');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Upload de Memórias
          </h1>
          <p className='text-xl text-gray-600'>
            Adicione novas fotos ao álbum de memórias ou viagens do Noah
          </p>
        </div>

        {!selectedDestination ? (
          /* Seleção de Destino */
          <div className='grid md:grid-cols-2 gap-8 max-w-2xl mx-auto'>
            <button
              onClick={() => setSelectedDestination('memories')}
              className='card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left p-8'
            >
              <Heart className='h-12 w-12 text-slate-700 mb-4' />
              <h3 className='text-xl font-bold text-gray-900 mb-2'>
                Álbum de Memórias
              </h3>
              <p className='text-gray-600'>
                Adicionar fotos organizadas por idade e trabalhos escolares
              </p>
            </button>

            <button
              onClick={() => setSelectedDestination('travels')}
              className='card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left p-8'
            >
              <Plane className='h-12 w-12 text-slate-700 mb-4' />
              <h3 className='text-xl font-bold text-gray-900 mb-2'>
                Álbum de Viagens
              </h3>
              <p className='text-gray-600'>
                Adicionar fotos de viagens com localização no mapa
              </p>
            </button>
          </div>
        ) : (
          <div className='space-y-8'>
            {/* Header */}
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-gray-900 flex items-center space-x-2'>
                {selectedDestination === 'memories' ? (
                  <>
                    <Heart className='h-6 w-6' />
                    <span>Nova Memória</span>
                  </>
                ) : (
                  <>
                    <Plane className='h-6 w-6' />
                    <span>Nova Viagem</span>
                  </>
                )}
              </h2>
              <button
                onClick={() => setSelectedDestination(null)}
                className='btn-secondary'
              >
                Voltar
              </button>
            </div>

            <div className='grid lg:grid-cols-2 gap-8'>
              {/* Formulário */}
              <div className='card'>
                {selectedDestination === 'memories' ? (
                  /* Formulário de Memória */
                  <div className='space-y-6'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Detalhes da Memória
                    </h3>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Título *
                      </label>
                      <input
                        type='text'
                        value={memoryData.title}
                        onChange={e =>
                          setMemoryData(prev => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className='input-field'
                        placeholder='Ex: Primeiro sorriso, Primeira palavra...'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Descrição
                      </label>
                      <textarea
                        value={memoryData.description}
                        onChange={e =>
                          setMemoryData(prev => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className='input-field h-24 resize-none'
                        placeholder='Conte a história deste momento especial...'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Idade *
                      </label>
                      <select
                        value={memoryData.ageCategory}
                        onChange={e =>
                          setMemoryData(prev => ({
                            ...prev,
                            ageCategory: e.target.value as any,
                          }))
                        }
                        className='input-field'
                      >
                        {getAgeCategories().map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Tipo *
                      </label>
                      <div className='flex space-x-4'>
                        <label className='flex items-center'>
                          <input
                            type='radio'
                            value='memory'
                            checked={memoryData.type === 'memory'}
                            onChange={e =>
                              setMemoryData(prev => ({
                                ...prev,
                                type: e.target.value as any,
                              }))
                            }
                            className='mr-2'
                          />
                          Memória
                        </label>
                        <label className='flex items-center'>
                          <input
                            type='radio'
                            value='schoolwork'
                            checked={memoryData.type === 'schoolwork'}
                            onChange={e =>
                              setMemoryData(prev => ({
                                ...prev,
                                type: e.target.value as any,
                              }))
                            }
                            className='mr-2'
                          />
                          Trabalho Escolar
                        </label>
                      </div>
                    </div>

                    {memoryData.images.length > 0 && (
                      <div>
                        <p className='text-sm font-medium text-gray-700 mb-2'>
                          Imagens Adicionadas: {memoryData.images.length}
                        </p>
                        <div className='grid grid-cols-3 gap-2'>
                          {memoryData.images.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className='w-full h-20 object-cover rounded'
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={saveMemory}
                      disabled={
                        saving ||
                        !memoryData.title ||
                        memoryData.images.length === 0
                      }
                      className='w-full btn-primary disabled:bg-gray-400'
                    >
                      {saving ? 'Salvando...' : 'Salvar Memória'}
                    </button>
                  </div>
                ) : (
                  /* Formulário de Viagem */
                  <div className='space-y-6'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Detalhes da Viagem
                    </h3>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Título *
                      </label>
                      <input
                        type='text'
                        value={travelData.title}
                        onChange={e =>
                          setTravelData(prev => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className='input-field'
                        placeholder='Ex: Viagem para Paris, Férias na praia...'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Localização *
                      </label>
                      <div className='flex space-x-2'>
                        <input
                          type='text'
                          value={travelData.location.name}
                          onChange={e =>
                            setTravelData(prev => ({
                              ...prev,
                              location: {
                                ...prev.location,
                                name: e.target.value,
                              },
                            }))
                          }
                          className='input-field flex-1'
                          placeholder='Ex: Paris, França'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            geocodeLocation(travelData.location.name)
                          }
                          className='btn-secondary px-4'
                        >
                          🌍
                        </button>
                      </div>
                      {travelData.location.latitude !== 0 && (
                        <p className='text-xs text-green-600 mt-1'>
                          Coordenadas: {travelData.location.latitude.toFixed(4)}
                          , {travelData.location.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Data da Visita
                      </label>
                      <input
                        type='date'
                        value={travelData.dateVisited}
                        onChange={e =>
                          setTravelData(prev => ({
                            ...prev,
                            dateVisited: e.target.value,
                          }))
                        }
                        className='input-field'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Descrição
                      </label>
                      <textarea
                        value={travelData.description}
                        onChange={e =>
                          setTravelData(prev => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className='input-field h-24 resize-none'
                        placeholder='Conte sobre esta aventura...'
                      />
                    </div>

                    {travelData.images.length > 0 && (
                      <div>
                        <p className='text-sm font-medium text-gray-700 mb-2'>
                          Imagens Adicionadas: {travelData.images.length}
                        </p>
                        <div className='grid grid-cols-3 gap-2'>
                          {travelData.images.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className='w-full h-20 object-cover rounded'
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={saveTravel}
                      disabled={
                        saving ||
                        !travelData.title ||
                        !travelData.location.name ||
                        travelData.images.length === 0
                      }
                      className='w-full btn-primary disabled:bg-gray-400'
                    >
                      {saving ? 'Salvando...' : 'Salvar Viagem'}
                    </button>
                  </div>
                )}
              </div>

              {/* Upload de Imagens */}
              <div>
                <UploadForm
                  onUploadComplete={handleImageUpload}
                  folder={selectedDestination}
                  maxFiles={10}
                />
              </div>
            </div>

            {/* Mensagem */}
            {message && (
              <div
                className={`card ${
                  message.includes('sucesso')
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <p
                  className={
                    message.includes('sucesso')
                      ? 'text-green-700'
                      : 'text-red-700'
                  }
                >
                  {message}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
