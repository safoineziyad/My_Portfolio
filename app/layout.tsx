import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ziyad | Full-Stack Developer',
  description:
    'Portfolio of Ziyad — a full-stack web developer from Morocco. Building the web with code and creativity.',
  keywords: ['Ziyad', 'portfolio', 'full-stack developer', 'Next.js', 'Morocco'],
  authors: [{ name: 'Ziyad' }],
  openGraph: {
    title: 'Ziyad | Full-Stack Developer',
    description: 'Building the web with code and creativity.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Ziyad Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ziyad | Full-Stack Developer',
    description: 'Building the web with code and creativity.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-bg font-heading text-text-main antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
