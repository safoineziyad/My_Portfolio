# Portfolio Setup Instructions

## Quick Start

### Windows
```cmd
scripts\setup.bat
```

### macOS / Linux
```bash
# 1. Copy and configure environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 2. Generate Prisma client
npx prisma generate

# 3. Run database migrations
npx prisma migrate dev --name init

# 4. Seed the database
npm run db:seed

# 5. Generate bcrypt hash for cafe admin password
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password', 12).then(h => console.log(h))"
# Copy the output to CAFE_ADMIN_PASS_HASH in .env.local

# 6. Start development server
npm run dev
```

## After Setup

1. Visit `http://localhost:3000` for the portfolio
2. Visit `http://localhost:3000/cafe` for Cafe NOMAD
3. Visit `http://localhost:3000/ecommerce` for the admin dashboard
4. Visit `http://localhost:3000/api/health` to verify the API is running

## Admin Login (Cafe)
- Username: (value of CAFE_ADMIN_USER in .env.local)
- Password: (the password you hashed for CAFE_ADMIN_PASS_HASH)

## Admin Login (E-Commerce)
- Email: admin@ziyad.dev
- Password: admin123 (change after first login!)

## Important Security Notes

1. **Rotate all secrets** if this repo was ever public with .env files committed
2. **Never commit .env.local** to version control
3. **Change default passwords** after first login
4. **Generate strong API keys**: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
