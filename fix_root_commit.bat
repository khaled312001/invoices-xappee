@echo off
echo Fixing Root Commit Issue...
git checkout --orphan clean_main
git reset
git add .gitignore
git add .
git reset HEAD public_html/.env
git commit -m "Initial commit (clean)"
git branch -D main
git branch -m main
git push -f origin main
echo Done.
pause
