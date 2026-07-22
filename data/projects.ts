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
    id: 'weather-app',
    title: 'Weather Forecast App — Real-Time Geolocation',
    description:
      'Self-contained weather application pulling live data from the Open-Meteo API with zero API keys required. Delivers geolocation with city-search fallback, 24-hour scrollable hourly forecasts, 7-day daily forecasts, and 6 detailed metrics (UV, humidity, wind, visibility, pressure, dew point). Dynamic glassmorphism backgrounds shift based on weather conditions.',
    tech: ['Vanilla JS', 'Open-Meteo API', 'CSS Glassmorphism'],
    category: 'frontend',
    image: '/images/projects/weather.svg',
    liveUrl: '/weather/',
  },
  {
    id: 'color-palette',
    title: 'ChromaCraft — Colour Palette Generator',
    description:
      'Colour palette generator with 5 generation modes (Random, Complementary, Analogous, Triadic, Monochromatic). Exports palettes to CSS Variables, SCSS, Tailwind Config, and JSON. Features WCAG AA/AAA contrast checking, lock-and-regenerate workflow, JWT authentication for saving palettes, spacebar shortcut, history carousel, and dark/light glassmorphism UI.',
    tech: ['React', 'Tailwind CSS', 'Framer Motion'],
    category: 'react',
    image: '/images/projects/color-palette.svg',
    liveUrl: '/colour-palette/',
  },
  {
    id: 'task-dashboard',
    title: 'TaskFlow — Real-Time Kanban Board',
    description:
      'Collaborative Kanban board with WebSocket-powered real-time sync across multiple users. Features JWT authentication with bcrypt password hashing, drag-and-drop card reordering with optimistic UI updates, board/column/card CRUD, and an Express + Socket.io backend with in-memory/MongoDB dual-mode storage. Designed for team task management with role-based board ownership.',
    tech: ['React', 'Express', 'Socket.io', 'MongoDB', 'JWT'],
    category: 'fullstack',
    image: '/images/projects/cafe-nomad.svg',
    liveUrl: '/task-dashboard/',
  },
  {
    id: 'portfolio-site',
    title: 'Portfolio — This Site',
    description:
      'Next.js 14 App Router portfolio with server-side rendering, Tailwind CSS design system, and Framer Motion animations. Includes a particle canvas hero, typewriter effect, scroll-reveal transitions, contact form with rate limiting and honeypot spam protection, and 4 embedded sub-applications served via custom static file routing.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    category: 'fullstack',
    image: '/images/projects/weather.svg',
    liveUrl: '/',
    githubUrl: 'https://github.com/safoineziyad/portfolio',
  },
];
