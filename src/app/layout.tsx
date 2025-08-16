import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Memórias do Noah Taffo Pedrazzoli',
  description: 'Um espaço especial para guardar cada momento mágico do Noah',
  keywords: 'memórias, família, fotos, viagens, crescimento',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-BR'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
