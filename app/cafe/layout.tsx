import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './cafe.css';
import Navbar from '@/components/cafe/Navbar';
import Footer from '@/components/cafe/Footer';
import Toast from '@/components/cafe/Toast';
import ScrollToTop from '@/components/cafe/ScrollToTop';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Café NOMAD - Marrakech',
  description:
    'Experience the finest coffee in Marrakech. Crafted with passion, served with art. Book a table, browse our menu, or order online.',
  keywords: [
    'cafe',
    'marrakech',
    'coffee',
    'restaurant',
    'morocco',
    'book a table',
    'menu',
  ],
  openGraph: {
    title: 'Café NOMAD - Marrakech',
    description:
      'Experience the finest coffee in Marrakech. Crafted with passion, served with art.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Café NOMAD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Café NOMAD - Marrakech',
    description:
      'Experience the finest coffee in Marrakech. Crafted with passion, served with art.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Café NOMAD',
  description:
    'Experience the finest coffee in Marrakech. Crafted with passion, served with art.',
  image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=1920',
  url: 'https://cafenomad.com',
  telephone: '+212524000000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rue Sidi Bouamar, Medina',
    addressLocality: 'Marrakech',
    postalCode: '40000',
    addressCountry: 'MA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 31.6295,
    longitude: -7.9811,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '22:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '23:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '08:00',
      closes: '21:00',
    },
  ],
  priceRange: '$$',
  servesCuisine: ['Coffee', 'Pastries', 'Waffles', 'Crepe', 'Brunch'],
  menu: 'https://cafenomad.com/cafe/menu',
  acceptsReservations: 'True',
};

export default function CafeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${playfair.variable} ${poppins.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <div className="cafe-page-enter">{children}</div>
      <Footer />
      <Toast />
      <ScrollToTop />
    </div>
  );
}
