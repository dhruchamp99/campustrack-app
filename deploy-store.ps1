# Deploy Store Section Updates

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Deploying Store Section Updates     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "What will be deployed:" -ForegroundColor Yellow
Write-Host "  - New Store page" -ForegroundColor Green
Write-Host "  - Backend API endpoint" -ForegroundColor Green
Write-Host "  - Updated navigation" -ForegroundColor Green
Write-Host "  - Download functionality" -ForegroundColor Green
Write-Host ""

# Step 1: Commit to Git
Write-Host "Step 1: Committing changes to Git..." -ForegroundColor Cyan
git add .
git commit -m "Add Store section for teachers"

Write-Host ""
Write-Host "Step 2: Push to GitHub (for Render auto-deploy)..." -ForegroundColor Cyan
git push origin main

Write-Host ""
Write-Host "Backend will auto-deploy on Render in 2-3 minutes..." -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "Continue with frontend deployment? (Y/N)"

if ($continue -eq "Y" -or $continue -eq "y") {
    Write-Host ""
    Write-Host "Step 3: Building frontend..." -ForegroundColor Cyan
    Set-Location client
    npm run build
    Set-Location ..
    
    Write-Host ""
    Write-Host "Step 4: Deploying to Firebase..." -ForegroundColor Cyan
    firebase deploy --only hosting
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   DEPLOYMENT COMPLETE!                " -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your app: https://campustrack-app-4b232.web.app" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Test the Store section:" -ForegroundColor Yellow
    Write-Host "  1. Login as teacher" -ForegroundColor White
    Write-Host "  2. Click Store in sidebar" -ForegroundColor White
    Write-Host "  3. View submitted attendance" -ForegroundColor White
    Write-Host ""
}
