// src/components/MemoryCard.tsx
// =============================================================================

import React from 'react';
import {
  Heart,
  GraduationCap,
  Calendar,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';
import { Memory } from '@/types';
import { formatDate } from '@/lib/utils';

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
  className?: string;
  showFullDescription?: boolean;
}

export default function MemoryCard({
  memory,
  onClick,
  className = '',
  showFullDescription = false,
}: MemoryCardProps) {
  const isSchoolwork = memory.type === 'schoolwork';

  return (
    <div
      className={`card hover:shadow-xl transition-all duration-300 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Imagem Principal */}
      {memory.images.length > 0 && (
        <div className='relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100'>
          <img
            src={memory.images[0]}
            alt={memory.title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            loading='lazy'
          />

          {/* Badge de múltiplas imagens */}
          {memory.images.length > 1 && (
            <div className='absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1'>
              <ImageIcon className='h-3 w-3' />
              <span>+{memory.images.length - 1}</span>
            </div>
          )}

          {/* Overlay de hover */}
          <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center'>
            <Eye className='h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className='space-y-3'>
        {/* Header com tipo e categoria */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            {isSchoolwork ? (
              <GraduationCap className='h-4 w-4 text-blue-500' />
            ) : (
              <Heart className='h-4 w-4 text-red-500' />
            )}
            <span className='text-xs text-gray-500 uppercase tracking-wide font-medium'>
              {isSchoolwork ? 'Trabalho Escolar' : 'Memória'}
            </span>
          </div>

          {/* Badge da idade */}
          <span className='bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full font-medium'>
            {memory.ageCategory
              .replace('anos', ' anos')
              .replace('ano', ' ano')
              .replace('meses', ' meses')}
          </span>
        </div>

        {/* Título */}
        <h3 className='text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-slate-700 transition-colors'>
          {memory.title}
        </h3>

        {/* Descrição */}
        {memory.description && (
          <p
            className={`text-gray-600 text-sm leading-relaxed ${
              showFullDescription ? '' : 'line-clamp-3'
            }`}
          >
            {memory.description}
          </p>
        )}

        {/* Footer com metadados */}
        <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
          <div className='flex items-center space-x-1 text-xs text-gray-500'>
            <Calendar className='h-3 w-3' />
            <span>{formatDate(new Date(memory.createdAt))}</span>
          </div>

          <div className='flex items-center space-x-3 text-xs text-gray-500'>
            <div className='flex items-center space-x-1'>
              <ImageIcon className='h-3 w-3' />
              <span>{memory.images.length}</span>
            </div>

            {memory.updatedAt !== memory.createdAt && (
              <span className='text-blue-500 font-medium'>Editado</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
