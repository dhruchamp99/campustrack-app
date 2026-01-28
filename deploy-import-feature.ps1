# Deploy Excel Import Feature
# This script deploys both backend and frontend with the new import feature

Write-Host "🚀 Deploying Excel Import Feature..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Build the frontend
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
cd "client"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend built successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Deploy to Firebase
Write-Host "🔥 Deploying to Firebase..." -ForegroundColor Yellow
cd ..
firebase deploy --only hosting

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Firebase deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend deployed to Firebase!" -ForegroundColor Green
Write-Host ""

# Step 3: Push to GitHub (triggers Render deployment)
Write-Host "📤 Pushing to GitHub (triggers Render deployment)..." -ForegroundColor Yellow
git add .
git commit -m "Added Excel import feature for bulk student upload"
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Git push failed or no changes to commit" -ForegroundColor Yellow
}
else {
    Write-Host "✅ Pushed to GitHub! Render will auto-deploy backend." -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Wait for Render to finish deploying (check Render dashboard)"
Write-Host "2. Test the import feature on your live site"
Write-Host "3. Prepare your Excel file with student data"
Write-Host "4. Import students and verify they appear for teachers"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "- EXCEL_IMPORT_FEATURE.md - User guide"
Write-Host "- TEST_EXCEL_IMPORT.md - Testing guide"
