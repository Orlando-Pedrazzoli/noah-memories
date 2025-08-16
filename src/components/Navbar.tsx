'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Camera,
  MapPin,
  Upload,
  LogOut,
  Heart,
  Baby,
  Plane,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = '' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Limpar qualquer cache
        window.location.href = '/login';
      } else {
        console.error('Erro no logout');
        alert('Erro ao fazer logout. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      alert('Erro de conexão. Tente novamente.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav
      className={`bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 ${className}`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Nome Noah - Esquerda */}
          <div className='flex items-center space-x-2'>
            <Baby className='h-7 w-7 text-gray-600' />
            <Link
              href='/'
              className='text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors duration-200'
            >
              Noah <span className='text-gray-600'>Taffo Pedrazzoli</span>
            </Link>
          </div>

          {/* Links Centro - Apenas Desktop */}
          <div className='hidden md:flex items-center space-x-6'>
            <Link
              href='/memorias'
              className='text-gray-700 hover:text-slate-900 transition-colors duration-200 flex items-center space-x-2 font-medium'
            >
              <Heart className='h-5 w-5' />
              <span>Álbum de Memórias</span>
            </Link>
            <Link
              href='/viagens'
              className='text-gray-700 hover:text-slate-900 transition-colors duration-200 flex items-center space-x-2 font-medium'
            >
              <Plane className='h-5 w-5' />
              <span>Álbum de Viagens</span>
            </Link>
            <Link
              href='/upload'
              className='text-gray-700 hover:text-slate-900 transition-colors duration-200 flex items-center space-x-2 font-medium'
            >
              <Upload className='h-5 w-5' />
              <span>Upload</span>
            </Link>
          </div>

          {/* Desktop - Botão Logout */}
          <div className='hidden md:block'>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className='bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200'
            >
              {loggingOut ? (
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
              ) : (
                <LogOut className='h-5 w-5' />
              )}
              <span>{loggingOut ? 'Saindo...' : 'Logout'}</span>
            </button>
          </div>

          {/* Mobile - Menu Icon */}
          <div className='md:hidden'>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='text-gray-700 hover:text-gray-900 p-2'
            >
              {mobileMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className='md:hidden border-t border-gray-200 py-4'>
            <div className='flex flex-col space-y-4'>
              <Link
                href='/memorias'
                className='text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center space-x-3 font-medium py-2'
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className='h-5 w-5' />
                <span>Álbum de Memórias</span>
              </Link>
              <Link
                href='/viagens'
                className='text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center space-x-3 font-medium py-2'
                onClick={() => setMobileMenuOpen(false)}
              >
                <Plane className='h-5 w-5' />
                <span>Álbum de Viagens</span>
              </Link>
              <Link
                href='/upload'
                className='text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center space-x-3 font-medium py-2'
                onClick={() => setMobileMenuOpen(false)}
              >
                <Upload className='h-5 w-5' />
                <span>Upload</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                disabled={loggingOut}
                className='bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white px-4 py-3 rounded-lg flex items-center space-x-3 font-medium transition-colors duration-200 w-full text-left'
              >
                {loggingOut ? (
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                ) : (
                  <LogOut className='h-5 w-5' />
                )}
                <span>{loggingOut ? 'Saindo...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
