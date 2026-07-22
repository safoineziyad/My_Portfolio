export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  category: 'fullstack' | 'frontend' | 'react';
  image: string;
  liveUrl?: string;
  githubUrl?: string;

}

export const webProjects: Project[] = [
  {
    id: 'ecommerce-dashboard',
    title: 'E-Commerce Admin Dashboard',
    description:
      'Full-stack admin dashboard with real-time analytics, product CRUD with image management, order lifecycle tracking with status timeline, customer management with LTV calculations, and inventory alerts. Built with Next.js 14 App Router, Prisma + SQLite, Recharts for data visualization, Zustand for state, and full REST API with pagination and search.',
    tech: ['Next.js', 'Prisma', 'SQLite', 'Recharts', 'Zustand', 'Tailwind CSS'],
    category: 'fullstack',
    image: '/images/projects/cafe-nomad.svg',
    liveUrl: '/ecommerce/dashboard',
  },
  {
    id: 'cafe-nomad',
    title: 'Cafe NOMAD — Full-Stack Ordering Platform',
    description:
      'Production cafe platform for Cafe NOMAD in Marrakech serving 40+ menu items across 6 categories. Features real-time order status tracking, table reservations with capacity management, a payment modal with card validation, and a protected admin dashboard for menu/order/reservation CRUD. Built with Node.js/Express backend and a JSON-file database layer with rate limiting and input sanitization.',
    tech: ['Node.js', 'Express', 'JavaScript', 'HTML/CSS', 'Full-Stack'],
    category: 'fullstack',
    image: '/images/projects/cafe-nomad.svg',
    liveUrl: '/cafe/',
    githubUrl: 'https://github.com/safoineziyad/Cafe_NOMAD',
  },
  {
    id: 'portfolio-site',
    title: 'Portfolio — This Site',
    description:
      'Next.js 14 App Router portfolio with server-side rendering, Tailwind CSS design system, and Framer Motion animations. Includes a particle canvas hero, typewriter effect, scroll-reveal transitions, contact form with rate limiting and honeypot spam protection, and an embedded e-commerce admin dashboard.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    category: 'fullstack',
    image: '/images/projects/weather.svg',
    liveUrl: '/',
    githubUrl: 'https://github.com/safoineziyad/portfolio',
  },
];
