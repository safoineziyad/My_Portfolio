<div align="center">

# Ziyad | Full-Stack Developer Portfolio

A full-stack portfolio platform built with **Next.js 14 App Router**, featuring three integrated applications: a developer portfolio, a cafe ordering platform, and a complete e-commerce admin dashboard with multi-vendor marketplace.

[![CI](https://github.com/safoineziyad/My_Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/safoineziyad/My_Portfolio/actions)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D2D2D?logo=prisma)](https://prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

[Live Demo](https://ziyad.dev) &bull; [Blog](https://ziyad.dev/blog) &bull; [Cafe NOMAD](https://ziyad.dev/cafe) &bull; [Dashboard](https://ziyad.dev/ecommerce)

</div>

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org) (App Router) |
| **Language** | [TypeScript 5.6](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com) |
| **Animations** | [Framer Motion 11](https://www.framer.com/motion/) |
| **State** | [Zustand 5](https://zustand-demo.pmnd.rs) |
| **Database** | [PostgreSQL](https://www.postgresql.org) (Neon) via [Prisma 5](https://prisma.io) |
| **Charts** | [Recharts 2.15](https://recharts.org) |
| **Auth** | [bcryptjs](https://www.npmjs.com/package/bcryptjs) + HttpOnly session cookies |
| **Validation** | [Zod](https://zod.dev) |
| **Payments** | [Stripe](https://stripe.com) Checkout |
| **Email** | [Resend](https://resend.com) |
| **Images** | [Cloudinary](https://cloudinary.com) |
| **Testing** | [Jest](https://jestjs.io) + ts-jest |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) |
| **Deployment** | [Vercel](https://vercel.com) |

---

## Features

### Portfolio Landing Page
- Particle canvas hero with animated connections
- Typewriter effect cycling through taglines
- Framer Motion scroll-reveal animations throughout
- About section with animated count-up statistics
- Skills grid with 9 technologies (HTML5, CSS3, JS, TS, React, Next.js, Node.js, Python, Docker)
- Project showcase with category filtering (All / Full-Stack / Frontend / React)
- Client testimonials carousel with star ratings
- Contact form with honeypot spam protection + Web3Forms integration
- Resume/CV download button
- Blog section with full CRUD admin
- Responsive mobile navigation with animated drawer
- Custom 404 page ("Missing Texture")
- Social links: GitHub, Twitter, LinkedIn, Discord, Instagram

### Cafe NOMAD — Restaurant Platform
- Full restaurant website with dedicated CSS design system (1460 lines)
- Home page with hero, about, popular specials, photo gallery
- Full menu page with category filtering (7 categories, 38+ items)
- Shopping cart with Zustand + localStorage persistence
- Checkout with Stripe Checkout (card) — order recorded idempotently via webhook + return-URL verification
- Table reservation system with capacity management
- Order status tracking page
- Contact form with email notifications (Resend)
- Admin panel with login, dashboard, menu CRUD, order management, reservation management
- JSON-LD structured data for SEO
- Scroll-to-top button, toast notifications, scroll-reveal animations
- Rate limiting and input sanitization on API routes

### E-Commerce Admin Dashboard
- Full admin dashboard with Recharts visualizations (area, pie, bar charts)
- Product management with image upload (Cloudinary)
- Order lifecycle tracking with status timeline
- Customer management
- Analytics page with revenue trends, top products, order distribution
- Team member management (admin, manager, member roles)
- Inventory alerts with low stock thresholds
- Settings page
- Blog admin with full CRUD (create, edit, publish, delete posts with tags and cover images)
- Morocco-specific tax engine (VAT, PIT, CIT, CNSS)

### Multi-Vendor Marketplace
- Vendor onboarding and approval workflow
- Vendor dashboard with stats, product CRUD, order management, payouts
- Public storefront with product listings, detail pages, cart, checkout
- User authentication (register/login) with session-based auth
- Product moderation and dispute resolution
- Platform settings for commission rates
- Stripe payment integration

### API Backend (50+ routes)
- **Portfolio**: Health check, file upload
- **Blog**: CRUD operations with search and pagination (admin-protected)
- **Cafe**: Menu, orders, reservations, admin CRUD, contact
- **E-Commerce**: Products, orders, customers, analytics, categories, notifications, team, settings
- **Marketplace**: Auth, products, cart, orders, reviews, categories, vendor management
- **Payments**: Stripe checkout sessions, return-URL verification, webhook handling

---

## Project Structure

```
portfolio/
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (Inter + JetBrains Mono fonts, Sonner toaster)
│   ├── page.tsx                      # Portfolio landing page
│   ├── error.tsx                     # Global error boundary
│   ├── loading.tsx                   # Global loading spinner
│   ├── not-found.tsx                 # Custom 404 page
│   ├── globals.css                   # Tailwind base + custom styles
│   │
│   ├── api/                          # Backend API routes
│   │   ├── blog/                     # Blog CRUD (GET list, POST create)
│   │   │   └── [slug]/               # Blog by slug (GET, PUT, DELETE)
│   │   ├── health/                   # Health check endpoint
│   │   ├── stripe/                   # Stripe integration
│   │   │   ├── checkout/             # Create checkout sessions
│   │   │   └── webhook/              # Payment webhook handler
│   │   ├── upload/                   # Cloudinary image upload
│   │   ├── admin/messages/           # Admin message management
│   │   └── cafe-api/                 # Cafe NOMAD backend
│   │       ├── admin/                # Admin auth, menu CRUD, orders, reservations, stats
│   │       ├── menu/                 # Public menu endpoints
│   │       ├── orders/               # Order creation and status
│   │       ├── reservations/         # Reservation creation and status
│   │       └── contact/              # Cafe contact form
│   │
│   ├── blog/                         # Public blog pages
│   │   ├── page.tsx                  # Blog listing
│   │   └── [slug]/page.tsx           # Blog post detail
│   │
│   ├── cafe/                         # Cafe NOMAD sub-app
│   │   ├── layout.tsx                # Cafe layout (Playfair + Poppins fonts, JSON-LD)
│   │   ├── cafe.css                  # Dedicated CSS design system (1460 lines)
│   │   ├── page.tsx                  # Home: hero, about, specials, gallery
│   │   ├── error.tsx                 # Cafe error boundary
│   │   ├── not-found.tsx             # Cafe 404
│   │   ├── menu/page.tsx             # Full menu with filtering
│   │   ├── cart/page.tsx             # Shopping cart
│   │   ├── checkout/page.tsx         # Checkout with payment modal
│   │   ├── reservation/page.tsx      # Table reservation form
│   │   ├── status/page.tsx           # Order/reservation status tracker
│   │   ├── contact/page.tsx          # Contact form
│   │   └── admin/                    # Admin panel
│   │       ├── login/page.tsx        # Admin login
│   │       └── dashboard/page.tsx    # Menu/order/reservation CRUD
│   │
│   └── ecommerce/                    # E-Commerce platform
│       ├── layout.tsx                # Ecommerce layout wrapper
│       ├── page.tsx                  # Redirects to dashboard
│       ├── error.tsx                 # Ecommerce error boundary
│       │
│       ├── api/                      # 34 API route files
│       │   ├── auth/                 # Login, logout, session check
│       │   ├── products/             # Product CRUD + [id]
│       │   ├── orders/               # Order CRUD + [id]
│       │   ├── customers/            # Customer list
│       │   ├── analytics/            # Dashboard analytics
│       │   ├── categories/           # Product categories
│       │   ├── notifications/        # Notification system + [id]
│       │   ├── team/                 # Team management + [id]
│       │   ├── settings/             # Store settings (GET/PUT)
│       │   ├── vendor/               # Vendor products, orders, payouts, stats
│       │   ├── marketplace/          # Auth, products, cart, orders, reviews, categories
│       │   └── admin/marketplace/    # Vendor approval, moderation, settings, disputes
│       │
│       ├── login/page.tsx            # Admin login page
│       ├── dashboard/                # Admin dashboard pages
│       │   ├── page.tsx              # Main dashboard with Recharts
│       │   ├── products/page.tsx     # Product CRUD
│       │   ├── orders/page.tsx       # Order management
│       │   ├── customers/page.tsx    # Customer list
│       │   ├── analytics/page.tsx    # Analytics charts
│       │   ├── team/page.tsx         # Team management
│       │   ├── blog/                 # Blog admin (list, new, edit)
│       │   ├── vendors/page.tsx      # Vendor management
│       │   ├── moderation/page.tsx   # Product moderation
│       │   ├── disputes/page.tsx     # Dispute management
│       │   ├── marketplace-settings/ # Platform settings
│       │   └── settings/page.tsx     # Store settings
│       │
│       ├── vendor/                   # Vendor portal
│       │   ├── layout.tsx            # Vendor layout
│       │   ├── page.tsx              # Vendor dashboard
│       │   ├── products/page.tsx     # Vendor product CRUD
│       │   ├── orders/page.tsx       # Vendor order management
│       │   └── payouts/page.tsx      # Payout requests
│       │
│       └── store/                    # Public storefront
│           ├── layout.tsx            # Store layout
│           ├── page.tsx              # Store home
│           ├── products/             # Product listing + [slug] detail
│           ├── cart/page.tsx         # Store cart
│           ├── checkout/page.tsx     # Stripe checkout
│           └── auth/                 # Login + register
│
├── components/                       # React components
│   ├── Hero.tsx                      # Particle canvas + typewriter + CTA
│   ├── Navbar.tsx                    # Fixed nav with mobile drawer + blog link
│   ├── About.tsx                     # Bio + count-up stats + CV download
│   ├── Skills.tsx                    # Skill grid with icons
│   ├── WebProjects.tsx               # Project cards with category filters
│   ├── Contact.tsx                   # Contact form (Web3Forms)
│   ├── Footer.tsx                    # Social links (GitHub, Twitter, LinkedIn, Discord, Instagram)
│   ├── ScrollReveal.tsx              # Framer Motion scroll animation
│   ├── ImageUpload.tsx               # Cloudinary image upload with preview
│   └── cafe/                         # Cafe NOMAD components
│       ├── Navbar.tsx                # Cafe nav with cart badge
│       ├── Footer.tsx                # Cafe footer
│       ├── MenuCard.tsx              # Menu item card with add-to-cart
│       ├── FilterBar.tsx             # Category filter buttons
│       ├── PaymentModal.tsx          # Stripe Checkout payment modal
│       ├── Toast.tsx                 # Cart toast notification
│       ├── ScrollToTop.tsx           # Scroll-to-top button
│       ├── RevealOnScroll.tsx        # IntersectionObserver scroll reveal
│       ├── MenuSkeleton.tsx          # Loading skeleton for menu
│       ├── FormSkeleton.tsx          # Loading skeleton for forms
│       └── FormMessage.tsx           # Success/error message component
│
├── lib/                              # Utility libraries
│   ├── cloudinary.ts                 # Cloudinary upload/delete helpers
│   ├── email.ts                      # Resend email (contact, orders, reservations, alerts)
│   ├── env.ts                        # Zod-validated environment variables
│   ├── logger.ts                     # Structured logging utility
│   ├── rate-limit.ts                 # Per-route rate limiting with IP detection
│   ├── sanitize.ts                   # HTML stripping, input validation
│   ├── validations.ts                # Zod schemas for all API inputs
│   ├── cafe-db.ts                    # Cafe database helpers (Prisma-backed)
│   ├── static-file-server.ts         # Static file serving utility
│   └── cafe/                         # Cafe-specific utilities
│       ├── types.ts                  # Cafe TypeScript types
│       ├── cart-store.ts             # Zustand cart store (localStorage)
│       └── payment-utils.ts          # Luhn check, card detection, formatting
│
├── ecommerce/                        # E-commerce shared code
│   ├── lib/
│   │   ├── auth.ts                   # bcryptjs password hashing + session management
│   │   ├── api-auth.ts               # requireAdmin / requireVendor helpers (cookies)
│   │   ├── marketplace-auth.ts       # Marketplace buyer auth (HttpOnly cookie)
│   │   ├── db.ts                     # Prisma client singleton
│   │   ├── orders.ts                 # createOrdersFromCart shared checkout logic
│   │   ├── tax.ts                    # Morocco 2026 tax engine
│   │   └── utils.ts                  # Currency, date, status helpers
│   ├── components/
│   │   ├── Sidebar.tsx               # Admin sidebar + TopBar with search + notifications
│   │   └── DashboardPage.tsx         # Main dashboard with Recharts (typed)
│   ├── store/ui.ts                   # Zustand UI store (sidebar, notifications)
│   └── types/index.ts                # TypeScript interfaces
│
├── prisma/                           # Database
│   ├── schema.prisma                 # 30+ models (products, orders, vendors, blog, cafe)
│   └── migrations/                   # Database migrations
│       └── 20260727203407_init/      # Initial migration
│
├── data/                             # Static data
│   ├── projects.ts                   # 8 project definitions (fullstack, frontend, react)
│   └── cafe-database.json            # Cafe menu (45 items), orders, reservations
│
├── public/                           # Static assets
│   ├── favicon.svg                   # Purple "Z" icon
│   └── images/projects/              # 5 SVG project thumbnails
│
├── scripts/                          # Utility scripts
│   ├── seed-ecommerce.js             # Seeds store, products, customers, orders, reviews
│   ├── seed-marketplace.js           # Seeds vendors, marketplace products, categories
│   ├── setup.bat                     # Windows setup script
│   └── clean-git-history.bat         # Git history cleanup instructions
│
├── tests/                            # Test files
│   ├── rate-limit.test.ts            # Rate limiter + IP detection tests
│   └── validations.test.ts           # Zod schema validation tests
│
├── .github/workflows/ci.yml          # GitHub Actions CI (lint, typecheck, build)
│
├── next.config.js                    # Next.js config (security headers, CSP, image domains)
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── jest.config.ts                    # Jest test configuration
├── postcss.config.js                 # PostCSS configuration
├── package.json                      # Dependencies and scripts
├── .env.example                      # Environment variable template
├── .gitignore                        # Git exclusions
├── README.md                         # This file
└── SETUP.md                          # Detailed setup instructions
```

---

## Getting Started

### Prerequisites

- **Node.js 18+**
- **npm** or **yarn**
- A [Neon](https://neon.tech) PostgreSQL database (or any PostgreSQL)

### Quick Setup

```bash
# 1. Clone
git clone https://github.com/safoineziyad/My_Portfolio.git
cd My_Portfolio

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Edit .env.local with your values

# 4. Migrate & Seed
npx prisma migrate dev
npm run db:seed

# 5. Generate cafe admin password hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 12).then(h => console.log(h))"
# Add output to CAFE_ADMIN_PASS_HASH in .env.local

# 6. Start
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
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset and reseed database |
| `npm run db:push` | Push schema to database without migration |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `ADMIN_API_KEY` | Yes | Admin API authentication key (min 16 chars) |
| `CAFE_ADMIN_USER` | Yes | Cafe admin username |
| `CAFE_ADMIN_PASS_HASH` | Yes | Bcrypt-hashed cafe admin password |
| `CAFE_API_KEY` | Yes | Cafe API authentication key |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | No | Web3Forms contact form key |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | No | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret |
| `NEXT_PUBLIC_ECOMMERCE_URL` | No | E-commerce dashboard URL (default: http://localhost:3000/ecommerce) |
| `NEXT_PUBLIC_PORTFOLIO_URL` | No | Canonical site URL (default: http://localhost:3000) |
| `RESEND_API_KEY` | No | Resend email API key |

> **Never commit `.env.local` to version control.**

---

## API Endpoints

### Portfolio
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/upload` | Upload image to Cloudinary |

### Blog
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/blog` | List posts (supports `?search`, `?published`, `?page`) |
| POST | `/api/blog` | Create new post |
| GET | `/api/blog/[slug]` | Get post by slug |
| PUT | `/api/blog/[slug]` | Update post |
| DELETE | `/api/blog/[slug]` | Delete post |

### Cafe NOMAD
| Method | Endpoint | Description |
|---|---|---|
| GET | `/cafe-api/menu` | Get menu items |
| POST | `/cafe-api/orders` | Create order |
| POST | `/cafe-api/reservations` | Create reservation |
| GET | `/cafe-api/reservations/status` | Check reservation status |
| POST | `/cafe-api/contact` | Send contact message |
| POST | `/cafe-api/admin/login` | Admin login |
| GET | `/cafe-api/admin/menu` | Get all menu items (admin) |
| PUT | `/cafe-api/admin/menu/[id]` | Update menu item |
| DELETE | `/cafe-api/admin/menu/[id]` | Delete menu item |
| GET | `/cafe-api/admin/orders` | Get all orders |
| PATCH | `/cafe-api/admin/orders/[id]` | Update order status |
| GET | `/cafe-api/admin/reservations` | Get all reservations |
| PATCH | `/cafe-api/admin/reservations/[id]` | Update reservation |
| GET | `/cafe-api/admin/stats` | Dashboard statistics |

### E-Commerce
| Method | Endpoint | Description |
|---|---|---|
| POST | `/ecommerce/api/auth/login` | Admin login |
| POST | `/ecommerce/api/auth/logout` | Admin logout |
| GET/POST | `/ecommerce/api/products` | List/create products |
| GET/PUT/DELETE | `/ecommerce/api/products/[id]` | Product CRUD |
| GET/POST | `/ecommerce/api/orders` | List/create orders |
| GET/PATCH | `/ecommerce/api/orders/[id]` | Order detail/update |
| GET | `/ecommerce/api/customers` | Customer list |
| GET | `/ecommerce/api/analytics` | Dashboard analytics |
| GET/POST | `/ecommerce/api/categories` | Category management |
| GET/POST | `/ecommerce/api/notifications` | Notifications |
| GET/POST/PUT/DELETE | `/ecommerce/api/team/[id]` | Team management |

### Marketplace
| Method | Endpoint | Description |
|---|---|---|
| POST | `/ecommerce/api/marketplace/auth/register` | Buyer registration |
| POST | `/ecommerce/api/marketplace/auth/login` | Buyer login |
| POST | `/ecommerce/api/marketplace/auth/register-seller` | Seller registration |
| GET/POST | `/ecommerce/api/marketplace/products` | Marketplace products |
| GET | `/ecommerce/api/marketplace/products/[slug]` | Product detail |
| GET/POST/DELETE | `/ecommerce/api/marketplace/cart` | Cart management |
| GET/POST | `/ecommerce/api/marketplace/orders` | Marketplace orders |
| GET/POST | `/ecommerce/api/marketplace/reviews` | Product reviews |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/stripe/checkout` | Create Stripe checkout session |
| POST | `/api/stripe/cafe-checkout` | Create Stripe checkout session for cafe orders |
| GET | `/api/stripe/verify` | Verify paid session and create order (`?session_id=`) |
| POST | `/api/stripe/webhook` | Stripe webhook handler (idempotent order creation) |

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy

Vercel automatically runs `prisma generate` on build.

### Manual Deployment

```bash
npm run build
npm run start
```

---

## Security

- Passwords hashed with **bcryptjs** (12 rounds)
- **HttpOnly session cookies** for admin, vendor, and buyer auth
- **Rate limiting** on API routes (configurable per-route)
- **Input validation** with Zod schemas on every endpoint
- **Middleware guards** on dashboard/vendor pages + per-route auth on admin/vendor/blog APIs
- **Security headers**: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- **Environment variables validated** at startup with Zod
- **Honeypot spam protection** on contact forms
- **Image upload** with type and size validation
- **Structured logging** replacing raw console.error

---

## Database Schema

The Prisma schema contains **30+ models** across:

- **Store**: Store, Product, ProductVariant, ProductImage, Category, Order, OrderItem, Cart, CartItem, Customer, Review, Setting, InventoryLog
- **Auth**: TeamMember, Session, AuditLog, Notification
- **Marketplace**: Vendor, User, MarketplaceProduct, MarketplaceCategory, MarketplaceOrder, MarketplaceReview, MarketplaceCart, Dispute, Payout, PlatformSetting
- **Blog**: BlogPost, BlogTag
- **Cafe**: CafeMenuItem, CafeOrder, CafeOrderItem, CafeReservation, CafeContactMessage

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Author

**Ziyad** — 14-year-old developer from Morocco

- GitHub: [@safoineziyad](https://github.com/safoineziyad)
- Twitter: [@ziyad_dev](https://x.com/ziyad_dev)
- LinkedIn: [safoineziyad](https://linkedin.com/in/safoineziyad)

---

## License

MIT
