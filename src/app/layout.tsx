import type { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { Suspense } from 'react';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFab } from '@/components/ui/WhatsAppFab';
import { siteConfig } from '@/lib/content';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} — Software contable para el comercio colombiano`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: 'ROHU Soluciones' }],
  creator: 'ROHU Soluciones',
  publisher: 'ROHU Soluciones',
  icons: {
    icon: '/rohu_favicon.ico',
    shortcut: '/rohu_favicon.ico',
    apple: '/rohu_logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: SITE_URL,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Software contable para el comercio colombiano`,
    description: siteConfig.description,
    images: [
      {
        url: '/rohu_logo.png',
        width: 1024,
        height: 1024,
        alt: 'ROHU Contable',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/rohu_logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1E3A8A',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ROHU Soluciones',
  url: SITE_URL,
  logo: `${SITE_URL}/rohu_logo.png`,
  description: siteConfig.description,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CO',
  },
};

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: siteConfig.name,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, Windows, Android',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'COP',
    lowPrice: '0',
    availability: 'https://schema.org/InStock',
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
      </head>
      <body className="bg-brand-bg text-brand-text min-h-screen flex flex-col">
        <a href="#main" className="skip-link">
          Saltar al contenido principal
        </a>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
