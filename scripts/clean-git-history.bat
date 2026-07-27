@ECHO OFF
REM =============================================================================
REM Git History Cleanup Script
REM This removes .env files from git history
REM 
REM OPTION 1: Install BFG (recommended, faster)
REM   Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
REM   java -jar bfg.jar --delete-files .env
REM   java -jar bfg.jar --delete-files .env.local
REM   git reflog expire --expire=now --all && git gc --prune=now --aggressive
REM
REM OPTION 2: Use git-filter-repo (requires Python)
REM   pip install git-filter-repo
REM   git filter-repo --path .env --path .env.local --invert-paths --force
REM
REM OPTION 3: Nuclear option - start fresh (simplest)
REM =============================================================================

echo.
echo ====================================
echo  Git History Cleanup Options
echo ====================================
echo.
echo The secrets (.env files) were committed to git history.
echo Even though .gitignore now excludes them, they remain in history.
echo.
echo Choose an option:
echo.
echo   1. Install BFG Repo-Cleaner (RECOMMENDED)
echo      - Download from: https://rtyley.github.io/bfg-repo-cleaner/
echo      - java -jar bfg.jar --delete-files .env
echo      - java -jar bfg.jar --delete-files .env.local  
echo      - git reflog expire --expire=now --all
echo      - git gc --prune=now --aggressive
echo      - git push --force
echo.
echo   2. Install git-filter-repo (requires Python)
echo      - pip install git-filter-repo
echo      - git filter-repo --path .env --path .env.local --path prisma/dev.db --invert-paths --force
echo      - git push --force
echo.
echo   3. Nuclear: Delete repo and re-push (simplest but loses stars/forks)
echo      - Delete the GitHub repo
echo      - Create a new repo
echo      - Push all current files (secrets are not in current files)
echo.
echo IMPORTANT: After cleaning history, you MUST rotate ALL secrets:
echo   - Neon DB connection string
echo   - Admin API keys
echo   - Cafe credentials
echo   - Vercel tokens
echo   - Stripe keys
echo   - Resend API key
echo   - Cloudinary credentials
echo.
pause
