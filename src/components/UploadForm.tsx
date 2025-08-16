// src/components/UploadForm.tsx
// =============================================================================

'use client';
import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X, Check } from 'lucide-react';

interface UploadFormProps {
  onUploadComplete?: (imageUrl: string) => void;
  folder?: string;
  maxFiles?: number;
}

export default function UploadForm({
  onUploadComplete,
  folder = 'general',
  maxFiles = 5,
}: UploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Máximo ${maxFiles} arquivos permitidos`);
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);
    setError('');
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError('');
    const urls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          urls.push(data.imageUrl);
          if (onUploadComplete) {
            onUploadComplete(data.imageUrl);
          }
        } else {
          throw new Error(data.error || 'Erro no upload');
        }
      }

      setUploadedUrls(urls);
      setFiles([]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='card'>
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          Upload de Imagens
        </h3>
        <p className='text-sm text-gray-600'>
          Selecione até {maxFiles} imagens (JPG, PNG, WebP - máx. 10MB cada)
        </p>
      </div>

      {/* Área de Upload */}
      <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors'>
        <Upload className='h-12 w-12 text-gray-400 mx-auto mb-4' />
        <input
          type='file'
          multiple
          accept='image/*'
          onChange={handleFileSelect}
          className='hidden'
          id='file-upload'
          disabled={uploading}
        />
        <label
          htmlFor='file-upload'
          className='cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
        >
          <ImageIcon className='h-5 w-5 mr-2' />
          Selecionar Imagens
        </label>
      </div>

      {/* Preview dos Arquivos */}
      {files.length > 0 && (
        <div className='mt-6'>
          <h4 className='text-sm font-medium text-gray-900 mb-3'>
            Arquivos Selecionados:
          </h4>
          <div className='space-y-2'>
            {files.map((file, index) => (
              <div
                key={index}
                className='flex items-center justify-between bg-gray-50 rounded-lg p-3'
              >
                <div className='flex items-center space-x-3'>
                  <ImageIcon className='h-5 w-5 text-gray-400' />
                  <span className='text-sm text-gray-700 truncate'>
                    {file.name}
                  </span>
                  <span className='text-xs text-gray-500'>
                    ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className='text-red-500 hover:text-red-700'
                  disabled={uploading}
                >
                  <X className='h-4 w-4' />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={uploadFiles}
            disabled={uploading}
            className='mt-4 w-full btn-primary disabled:bg-gray-400 flex items-center justify-center space-x-2'
          >
            {uploading ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Upload className='h-5 w-5' />
                <span>
                  Enviar {files.length} arquivo{files.length > 1 ? 's' : ''}
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Sucesso */}
      {uploadedUrls.length > 0 && (
        <div className='mt-6 bg-green-50 border border-green-200 rounded-lg p-4'>
          <div className='flex items-center space-x-2 text-green-700 mb-2'>
            <Check className='h-5 w-5' />
            <span className='font-medium'>Upload concluído!</span>
          </div>
          <p className='text-sm text-green-600'>
            {uploadedUrls.length} imagem{uploadedUrls.length > 1 ? 'ns' : ''}{' '}
            enviada{uploadedUrls.length > 1 ? 's' : ''} com sucesso.
          </p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className='mt-6 bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-600 text-sm'>{error}</p>
        </div>
      )}
    </div>
  );
}
