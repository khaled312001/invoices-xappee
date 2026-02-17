@echo off
echo Optimizing Git for large push...
git config http.postBuffer 524288000
echo Retrying Push to GitHub...
git push -f origin main
echo Done.
pause
