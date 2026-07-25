import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './cafe.css';
import Navbar from '@/components/cafe/Navbar';
import Footer from '@/components/cafe/Footer';
import Toast from '@/components/cafe/Toast';

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
    'Experience the finest coffee in Marrakech. Crafted with passion, served with art.',
  openGraph: {
    title: 'Café NOMAD - Marrakech',
    description:
      'Experience the finest coffee in Marrakech. Crafted with passion, served with art.',
    type: 'website',
  },
};

export default function CafeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${playfair.variable} ${poppins.variable}`}>
      <Navbar />
      {children}
      <Footer />
      <Toast />
    </div>
  );
}
