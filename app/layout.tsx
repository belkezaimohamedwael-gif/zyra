import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZYRA — Chaussures Féminines · Algérie',
  description: 'Découvrez la collection ZYRA de chaussures féminines. Livraison partout en Algérie. Paiement à la livraison.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
