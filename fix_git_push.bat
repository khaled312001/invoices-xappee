@echo off
echo Fixing GitHub Push Protection...
git reset --soft HEAD~1
git reset HEAD public_html/.env
git add .gitignore
git commit -m "Fix: Add .gitignore and remove secrets"
git push -u origin main
echo Done.
pause
