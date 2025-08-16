'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Heart,
  GraduationCap,
  Calendar,
  Image as ImageIcon,
  Plus,
} from 'lucide-react';
import { Memory } from '@/types';
import { getAgeCategories, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function MemoriasPage() {
  const [selectedAge, setSelectedAge] = useState('1ano');
  const [selectedType, setSelectedType] = useState<'memory' | 'schoolwork'>(
    'memory'
  );
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const ageCategories = getAgeCategories();

  useEffect(() => {
    fetchMemories();
  }, [selectedAge, selectedType]);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/memories?ageCategory=${selectedAge}&type=${selectedType}`
      );
      if (response.ok) {
        const data = await response.json();
        setMemories(data);
      } else {
        setError('Erro ao carregar memórias');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='flex'>
        {/* Sidebar Fixa */}
        <aside className='w-64 bg-white shadow-lg h-screen sticky top-16 overflow-y-auto'>
          <div className='p-6'>
            <div className='flex items-center space-x-2 mb-6'>
              <Heart className='h-6 w-6 text-slate-700' />
              <h2 className='text-xl font-bold text-gray-900'>Memórias</h2>
            </div>

            {/* Filtro por Tipo */}
            <div className='mb-6'>
              <h3 className='text-sm font-medium text-gray-700 mb-3'>Tipo</h3>
              <div className='space-y-2'>
                <button
                  onClick={() => setSelectedType('memory')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedType === 'memory'
                      ? 'bg-slate-100 text-slate-900 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className='flex items-center space-x-2'>
                    <Heart className='h-4 w-4' />
                    <span>Memórias</span>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedType('schoolwork')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedType === 'schoolwork'
                      ? 'bg-slate-100 text-slate-900 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className='flex items-center space-x-2'>
                    <GraduationCap className='h-4 w-4' />
                    <span>Trabalhos Escolares</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Filtro por Idade */}
            <div>
              <h3 className='text-sm font-medium text-gray-700 mb-3'>Idade</h3>
              <div className='space-y-1'>
                {ageCategories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedAge(category.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedAge === category.value
                        ? 'bg-slate-100 text-slate-900 font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className='flex-1 p-8'>
          <div className='max-w-6xl mx-auto'>
            {/* Header */}
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                  {selectedType === 'memory'
                    ? 'Memórias'
                    : 'Trabalhos Escolares'}
                </h1>
                <p className='text-gray-600'>
                  {ageCategories.find(cat => cat.value === selectedAge)?.label}{' '}
                  - Noah Taffo Pedrazzoli
                </p>
              </div>
              <Link
                href='/upload'
                className='btn-primary flex items-center space-x-2'
              >
                <Plus className='h-5 w-5' />
                <span>Adicionar</span>
              </Link>
            </div>

            {/* Grid de Memórias */}
            {loading ? (
              <div className='flex items-center justify-center py-20'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700'></div>
              </div>
            ) : error ? (
              <div className='text-center py-20'>
                <p className='text-red-600'>{error}</p>
              </div>
            ) : memories.length === 0 ? (
              <div className='text-center py-20'>
                <ImageIcon className='h-16 w-16 text-gray-300 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Nenhuma {selectedType === 'memory' ? 'memória' : 'trabalho'}{' '}
                  encontrada
                </h3>
                <p className='text-gray-500 mb-6'>
                  Seja o primeiro a adicionar uma{' '}
                  {selectedType === 'memory' ? 'memória' : 'trabalho'} para esta
                  idade!
                </p>
                <Link href='/upload' className='btn-primary'>
                  Adicionar Agora
                </Link>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {memories.map(memory => (
                  <div
                    key={memory._id}
                    className='card hover:shadow-xl transition-all duration-300'
                  >
                    {/* Imagem Principal */}
                    {memory.images.length > 0 && (
                      <div className='relative h-48 mb-4 rounded-lg overflow-hidden'>
                        <img
                          src={memory.images[0]}
                          alt={memory.title}
                          className='w-full h-full object-cover'
                        />
                        {memory.images.length > 1 && (
                          <div className='absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded'>
                            +{memory.images.length - 1}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Conteúdo */}
                    <div>
                      <div className='flex items-center space-x-2 mb-2'>
                        {memory.type === 'memory' ? (
                          <Heart className='h-4 w-4 text-red-500' />
                        ) : (
                          <GraduationCap className='h-4 w-4 text-blue-500' />
                        )}
                        <span className='text-xs text-gray-500 uppercase tracking-wide'>
                          {memory.type === 'memory'
                            ? 'Memória'
                            : 'Trabalho Escolar'}
                        </span>
                      </div>

                      <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                        {memory.title}
                      </h3>

                      {memory.description && (
                        <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
                          {memory.description}
                        </p>
                      )}

                      <div className='flex items-center justify-between text-xs text-gray-500'>
                        <div className='flex items-center space-x-1'>
                          <Calendar className='h-3 w-3' />
                          <span>{formatDate(new Date(memory.createdAt))}</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <ImageIcon className='h-3 w-3' />
                          <span>
                            {memory.images.length} foto
                            {memory.images.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
