// src/components/LoginForm.tsx
// =============================================================================

'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Baby, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4'>
      <div className='max-w-md w-full'>
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
          {/* Header */}
          <div className='bg-gradient-to-r from-slate-700 to-slate-800 p-8 text-center'>
            <Baby className='h-16 w-16 text-white mx-auto mb-4' />
            <h1 className='text-2xl font-bold text-white mb-2'>
              Memórias do Noah
            </h1>
            <p className='text-slate-200'>Acesso exclusivo da família</p>
          </div>

          {/* Form */}
          <div className='p-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label
                  htmlFor='username'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Usuário
                </label>
                <input
                  id='username'
                  type='text'
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className='input-field'
                  placeholder='Digite o usuário'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Senha
                </label>
                <div className='relative'>
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className='input-field pr-12'
                    placeholder='Digite a senha'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                  <p className='text-red-600 text-sm'>{error}</p>
                </div>
              )}

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2'
              >
                {loading ? (
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                ) : (
                  <>
                    <LogIn className='h-5 w-5' />
                    <span>Entrar</span>
                  </>
                )}
              </button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-500'>
                Acesso restrito aos membros da família
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
