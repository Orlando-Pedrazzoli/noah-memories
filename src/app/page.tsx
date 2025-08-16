import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Heart,
  MapPin,
  Star,
  Calendar,
  Image,
  Camera,
  Plane,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='min-h-screen'>
      <Navbar />

      {/* Hero Section */}
      <section className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header da Hero */}
          <div className='text-center mb-16'>
            <h1 className='text-5xl md:text-6xl font-bold text-gray-900 mb-6'>
              Bem-vindos ao mundo do
              <span className='text-gray-700 block mt-2'>Noah</span>
            </h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              Um espaço especial para guardar cada momento mágico, cada sorriso,
              cada descoberta e cada aventura da nossa maior alegria.
            </p>
            <div className='flex justify-center items-center mt-6 space-x-2'>
              <Star className='h-6 w-6 text-gray-400 fill-current' />
              <Star className='h-6 w-6 text-gray-400 fill-current' />
              <Star className='h-6 w-6 text-gray-400 fill-current' />
            </div>
          </div>

          {/* Cards Principais - Formato Quadrado Lado a Lado */}
          <div className='flex flex-col lg:flex-row gap-8 max-w-4xl mx-auto justify-center'>
            {/* Card Álbum de Memórias */}
            <div className='group flex-1 max-w-sm mx-auto lg:mx-0'>
              <div className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 aspect-square flex flex-col'>
                <div className='bg-gradient-to-br from-slate-700 to-slate-800 p-6 text-white relative overflow-hidden flex-1 flex flex-col justify-center'>
                  <div className='absolute top-0 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -mr-12 -mt-12'></div>
                  <div className='absolute bottom-0 left-0 w-20 h-20 bg-white bg-opacity-5 rounded-full -ml-10 -mb-10'></div>
                  <div className='text-center relative z-10'>
                    <Heart className='h-12 w-12 mb-3 mx-auto text-gray-300' />
                    <h2 className='text-2xl font-bold mb-2'>
                      Álbum de Memórias
                    </h2>
                    <p className='text-gray-300 text-sm'>
                      Momentos especiais organizados por idade
                    </p>
                  </div>
                </div>
                <div className='p-6 flex-1 flex flex-col justify-between'>
                  <div className='space-y-3 mb-4'>
                    <div className='flex items-center space-x-2 text-sm'>
                      <Calendar className='h-4 w-4 text-slate-600' />
                      <span className='text-gray-700'>Por ano de vida</span>
                    </div>
                    <div className='flex items-center space-x-2 text-sm'>
                      <Image className='h-4 w-4 text-slate-600' />
                      <span className='text-gray-700'>Fotos e trabalhos</span>
                    </div>
                  </div>
                  <Link
                    href='/memorias'
                    className='w-full bg-slate-700 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md text-sm text-center block'
                  >
                    Explorar Memórias
                  </Link>
                </div>
              </div>
            </div>

            {/* Card Álbum de Viagens */}
            <div className='group flex-1 max-w-sm mx-auto lg:mx-0'>
              <div className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 aspect-square flex flex-col'>
                <div className='bg-gradient-to-br from-slate-600 to-slate-700 p-6 text-white relative overflow-hidden flex-1 flex flex-col justify-center'>
                  <div className='absolute top-0 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -mr-12 -mt-12'></div>
                  <div className='absolute bottom-0 left-0 w-20 h-20 bg-white bg-opacity-5 rounded-full -ml-10 -mb-10'></div>
                  <div className='text-center relative z-10'>
                    <MapPin className='h-12 w-12 mb-3 mx-auto text-gray-300' />
                    <h2 className='text-2xl font-bold mb-2'>
                      Álbum de Viagens
                    </h2>
                    <p className='text-gray-300 text-sm'>
                      Aventuras pelo mundo em mapa interativo
                    </p>
                  </div>
                </div>
                <div className='p-6 flex-1 flex flex-col justify-between'>
                  <div className='space-y-3 mb-4'>
                    <div className='flex items-center space-x-2 text-sm'>
                      <MapPin className='h-4 w-4 text-slate-600' />
                      <span className='text-gray-700'>Mapa interativo</span>
                    </div>
                    <div className='flex items-center space-x-2 text-sm'>
                      <Camera className='h-4 w-4 text-slate-600' />
                      <span className='text-gray-700'>Álbuns por destino</span>
                    </div>
                  </div>
                  <Link
                    href='/viagens'
                    className='w-full bg-slate-700 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md text-sm text-center block'
                  >
                    Explorar Viagens
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className='mt-20 text-center'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto'>
              <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <div className='text-3xl font-bold text-slate-800'>0+</div>
                <div className='text-gray-600 font-medium'>Fotos</div>
              </div>
              <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <div className='text-3xl font-bold text-slate-800'>0+</div>
                <div className='text-gray-600 font-medium'>Memórias</div>
              </div>
              <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <div className='text-3xl font-bold text-slate-800'>0+</div>
                <div className='text-gray-600 font-medium'>Viagens</div>
              </div>
              <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <div className='text-3xl font-bold text-slate-800'>∞</div>
                <div className='text-gray-600 font-medium'>Amor</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
