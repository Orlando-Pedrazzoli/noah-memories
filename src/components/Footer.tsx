// src/components/Footer.tsx
// =============================================================================

import React from 'react';
import Link from 'next/link';
import { Baby, Heart, Plane, Upload } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-slate-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid md:grid-cols-3 gap-8'>
          {/* Coluna 1 - Sobre */}
          <div>
            <div className='flex items-center space-x-2 mb-4'>
              <Baby className='h-8 w-8 text-gray-400' />
              <h3 className='text-xl font-bold'>Memórias do Noah</h3>
            </div>
            <p className='text-gray-400 leading-relaxed'>
              Um arquivo digital especial para preservar cada momento mágico do
              crescimento e das aventuras do nosso pequeno explorador.
            </p>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h4 className='text-lg font-semibold mb-4 text-gray-300'>
              Links Rápidos
            </h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/memorias'
                  className='text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2'
                >
                  <Heart className='h-4 w-4' />
                  <span>Álbum de Memórias</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/viagens'
                  className='text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2'
                >
                  <Plane className='h-4 w-4' />
                  <span>Álbum de Viagens</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/upload'
                  className='text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2'
                >
                  <Upload className='h-4 w-4' />
                  <span>Upload de Fotos</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Informações */}
          <div>
            <h4 className='text-lg font-semibold mb-4 text-gray-300'>
              Família
            </h4>
            <div className='text-gray-400 space-y-2'>
              <p>💝 Feito com amor para o Noah</p>
              <p>📸 Preservando memórias preciosas</p>
              <p>🗺️ Documentando aventuras</p>
              <p>⭐ Crescendo junto com você</p>
            </div>
          </div>
        </div>

        {/* Linha de Copyright */}
        <div className='border-t border-slate-800 mt-8 pt-8 text-center'>
          <p className='text-gray-400'>
            © {currentYear} Memórias do Noah Taffo Pedrazzoli.
            <span className='text-gray-300 ml-2'>
              Feito com 💜 pela família
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
