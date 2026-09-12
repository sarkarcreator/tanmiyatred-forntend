import type { Metadata } from 'next';
import { Playfair_Display, Manrope } from 'next/font/google';
import './globals.css';
import './properties-manager.css';
import { I18nProvider } from '@/lib/i18n/context';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tanmiyat Real Estate Development | Ultra-Luxury Dubai Developer',
  description:
    'Ultra-luxury real estate development in Dubai, UAE. Established in 1999, crafting iconic architectural landmarks, living communities, and enduring legacies.',
  keywords: [
    'Tanmiyat',
    'Tanmiyat Real Estate Development',
    'Dubai Real Estate Developer',
    'Living Legends Dubai',
    'The Court Tower',
    'The Exchange Tower',
    'Luxury Villas Dubai',
    'Dubai Land Developments',
    'Business Bay Real Estate',
  ],
  authors: [{ name: 'Tanmiyat Real Estate Development LLC' }],
  metadataBase: new URL('https://tanmiyatrealestate.com'),
  icons: {
    icon: '/tanmiyat-logo.svg',
    apple: '/tanmiyat-logo.svg',
  },
  openGraph: {
    title: 'Tanmiyat Real Estate Development | Ultra-Luxury Dubai Developer',
    description:
      'Ultra-luxury real estate development in Dubai, UAE. Established in 1999, crafting iconic architectural landmarks, living communities, and enduring legacies.',
    url: 'https://tanmiyatrealestate.com',
    siteName: 'Tanmiyat Real Estate Development',
    locale: 'en_AE',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Tanmiyat Real Estate Development Dubai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tanmiyat Real Estate Development | Ultra-Luxury Dubai Developer',
    description:
      'Ultra-luxury real estate development in Dubai, UAE. Established in 1999, crafting iconic architectural landmarks, living communities, and enduring legacies.',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Tanmiyat Real Estate Development LLC',
    alternateName: 'TANMIYAT',
    url: 'https://tanmiyatrealestate.com',
    logo: 'https://tanmiyatrealestate.com/tanmiyat-logo.svg',
    foundingDate: '1999',
    description:
      'Ultra-luxury real estate developer established in 1999 in Dubai, United Arab Emirates.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    },
    telephone: '+971 4 369 9000',
    email: 'info@tanmiyatrealestate.com',
  };

  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="bg-[#0A0A09] text-[#F5F2EB] font-sans antialiased min-h-screen selection:bg-[#B79A62] selection:text-[#0A0A09]"
        suppressHydrationWarning
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
