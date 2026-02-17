@echo off
echo Fixing detached HEAD and main branch...
git branch -f main a53a782
git checkout main
git push -f origin main
echo Done.
pause
