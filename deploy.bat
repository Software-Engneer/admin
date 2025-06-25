@echo off
echo 🚀 Building Admin Dashboard for deployment...

REM Build the production version
npm run build

echo ✅ Build completed successfully!
echo.
echo 📁 Your build files are ready in the 'build' folder
echo.
echo 🌐 To deploy to your hosting platform:
echo    1. Upload the contents of the 'build' folder to your web server
echo    2. Or use your hosting platform's deployment tools
echo.
echo 📋 Common deployment platforms:
echo    • Netlify: Drag and drop the 'build' folder
echo    • Vercel: Connect your GitHub repo and it will auto-deploy
echo    • GitHub Pages: Use 'npm run deploy' (if configured)
echo    • Firebase: Use 'firebase deploy' (if configured)
echo.
echo 🔗 Your app will now show 'Admin Dashboard' in the browser tab!
pause 