# Ziyad Portfolio

A full-stack portfolio website built with Next.js 14, featuring three integrated applications: a developer portfolio, a cafe ordering platform (Cafe NOMAD), and an e-commerce admin dashboard with multi-vendor marketplace.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.6 |
| **Styling** | Tailwind CSS 3.4 |
| **Animations** | Framer Motion 11 |
| **State** | Zustand 5 |
| **Database** | PostgreSQL (Neon) via Prisma 5 |
| **Charts** | Recharts 2.15 |
| **Auth** | bcrypt + session tokens |
| **Validation** | Zod |
| **Deployment** | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (or any PostgreSQL)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/safoineziyad/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your actual values.

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database:
   ```bash
   npm run db:seed
   ```

6. Generate a bcrypt hash for your cafe admin password:
   ```bash
   node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password', 12).then(h => console.log(h))"
   ```
   Add the output to `CAFE_ADMIN_PASS_HASH` in `.env.local`.

7. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset and reseed database |

## Project Structure

```
portfolio/
├── app/
│   ├── page.tsx              # Portfolio landing page
│   ├── cafe/                 # Cafe NOMAD sub-app
│   └── ecommerce/            # E-commerce dashboard sub-app
├── components/               # React components
├── data/                     # Static data files
├── ecommerce/                # E-commerce shared code
├── lib/                      # Utilities (auth, rate-limit, validation)
├── prisma/                   # Database schema
├── scripts/                  # Seed scripts
└── public/                   # Static assets
```

## Features

### Portfolio
- Particle canvas hero with typewriter effect
- Framer Motion scroll-reveal animations
- Skills grid, project showcase with category filtering
- Client testimonials carousel
- Contact form with honeypot spam protection
- Resume/CV download

### Cafe NOMAD
- Full menu with category filtering (38+ items)
- Cart system with Zustand + localStorage
- Checkout with payment modal
- Table reservation system
- Admin dashboard for menu/order/reservation CRUD

### E-Commerce Dashboard
- Product CRUD with image management
- Order lifecycle tracking
- Customer management
- Analytics with Recharts visualizations
- Vendor portal with product/order management
- Multi-vendor marketplace with moderation

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy

Vercel will automatically run `prisma generate` and build the project.

## Environment Variables

See `.env.example` for all required variables. Never commit `.env.local`.

## Security

- Passwords hashed with bcrypt (12 rounds)
- Rate limiting on API routes
- CSRF protection via SameSite cookies
- Input validation with Zod
- Security headers (HSTS, CSP, X-Frame-Options)
- Environment variables validated at startup

## License

MIT
