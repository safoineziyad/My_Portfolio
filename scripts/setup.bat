@ECHO OFF
REM =============================================================================
REM Portfolio Database Setup Script
REM Run this after copying .env.example to .env.local and filling in values
REM =============================================================================

echo.
echo ====================================
echo  Portfolio Database Setup
echo ====================================
echo.

REM Check if .env.local exists
IF NOT EXIST .env.local (
    echo ERROR: .env.local not found!
    echo Please copy .env.example to .env.local and fill in your values.
    echo.
    echo   copy .env.example .env.local
    echo.
    pause
    exit /b 1
)

echo [1/4] Generating Prisma client...
call npx prisma generate
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Prisma generate failed
    pause
    exit /b 1
)

echo.
echo [2/4] Running database migrations...
call npx prisma migrate dev --name init
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Migration failed. Check your DATABASE_URL in .env.local
    pause
    exit /b 1
)

echo.
echo [3/4] Seeding database...
call node scripts/seed-ecommerce.js
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Seeding failed
    pause
    exit /b 1
)

echo.
echo [4/4] Generating bcrypt hash for cafe admin password...
echo.
echo Run this command with your desired password:
echo   node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YOUR_PASSWORD', 12).then(h => console.log(h))"
echo.
echo Then add the output to CAFE_ADMIN_PASS_HASH in .env.local

echo.
echo ====================================
echo  Setup Complete!
echo ====================================
echo.
echo Run 'npm run dev' to start the development server.
echo.
pause
