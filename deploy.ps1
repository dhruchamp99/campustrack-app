# 🚀 Automated Deployment Script

## This script will guide you through deploying CampusTrack

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CampusTrack Deployment Assistant    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Frontend is already deployed to Firebase!" -ForegroundColor Green
Write-Host "   URL: https://campustrack-app-4b232.web.app" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  To complete deployment, you need:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. MongoDB Atlas Account (Database)" -ForegroundColor White
Write-Host "   - Go to: https://www.mongodb.com/cloud/atlas" -ForegroundColor Gray
Write-Host "   - Sign up (free)" -ForegroundColor Gray
Write-Host "   - Create free cluster" -ForegroundColor Gray
Write-Host "   - Get connection string" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Render Account (Backend)" -ForegroundColor White
Write-Host "   - Go to: https://render.com" -ForegroundColor Gray
Write-Host "   - Sign up with GitHub or email" -ForegroundColor Gray
Write-Host "   - Create Web Service" -ForegroundColor Gray
Write-Host "   - Deploy backend" -ForegroundColor Gray
Write-Host ""

Write-Host "📝 Estimated time: 20-30 minutes" -ForegroundColor Cyan
Write-Host ""

$continue = Read-Host "Would you like to continue? (Y/N)"

if ($continue -eq "Y" -or $continue -eq "y") {
    Write-Host ""
    Write-Host "Great! Let's start..." -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Step 1: MongoDB Atlas Setup" -ForegroundColor Cyan
    Write-Host "Opening MongoDB Atlas in your browser..." -ForegroundColor Gray
    Start-Process "https://www.mongodb.com/cloud/atlas/register"
    
    Write-Host ""
    $mongoUri = Read-Host "After creating cluster, paste your MongoDB connection string here"
    
    if ($mongoUri) {
        Write-Host "✅ MongoDB URI saved!" -ForegroundColor Green
        
        # Save to .env file
        $envContent = @"
PORT=5000
MONGO_URI=$mongoUri
JWT_SECRET=supersecretkey_campustrack_2024
NODE_ENV=production
"@
        Set-Content -Path "server\.env.production" -Value $envContent
        Write-Host "✅ Environment file created!" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Step 2: Render Setup" -ForegroundColor Cyan
    Write-Host "Opening Render in your browser..." -ForegroundColor Gray
    Start-Process "https://render.com/register"
    
    Write-Host ""
    Write-Host "After creating Render account:" -ForegroundColor Yellow
    Write-Host "1. Create new Web Service" -ForegroundColor White
    Write-Host "2. Use these settings:" -ForegroundColor White
    Write-Host "   - Build Command: cd server && npm install" -ForegroundColor Gray
    Write-Host "   - Start Command: cd server && npm start" -ForegroundColor Gray
    Write-Host "3. Add environment variables from server\.env.production" -ForegroundColor White
    Write-Host ""
    
    $backendUrl = Read-Host "After deployment, paste your Render backend URL here"
    
    if ($backendUrl) {
        Write-Host "✅ Backend URL saved!" -ForegroundColor Green
        
        # Update frontend env
        Set-Content -Path "client\.env.production" -Value "VITE_API_URL=$backendUrl"
        
        Write-Host ""
        Write-Host "Rebuilding frontend with new backend URL..." -ForegroundColor Cyan
        Set-Location client
        npm run build
        Set-Location ..
        
        Write-Host ""
        Write-Host "Redeploying to Firebase..." -ForegroundColor Cyan
        firebase deploy --only hosting
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "   🎉 DEPLOYMENT COMPLETE! 🎉          " -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your app is now live at:" -ForegroundColor Cyan
        Write-Host "https://campustrack-app-4b232.web.app" -ForegroundColor Green
        Write-Host ""
        Write-Host "Login credentials:" -ForegroundColor Cyan
        Write-Host "Admin: dhru@campus.com / admin123" -ForegroundColor White
        Write-Host ""
    }
} else {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
}
