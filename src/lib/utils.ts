// src/lib/utils.ts
// =============================================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getAgeCategories() {
  return [
    { value: '0-12meses', label: '0-12 meses' },
    { value: '1ano', label: '1 ano' },
    { value: '2anos', label: '2 anos' },
    { value: '3anos', label: '3 anos' },
    { value: '4anos', label: '4 anos' },
    { value: '5anos', label: '5 anos' },
    { value: '6anos', label: '6 anos' },
    { value: '7anos', label: '7 anos' },
    { value: '8anos', label: '8 anos' },
    { value: '9anos', label: '9 anos' },
    { value: '10anos', label: '10 anos' },
  ];
}
