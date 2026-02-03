# Get Teacher Credentials from Production Database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Fetch Production Teacher Credentials" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will connect to your PRODUCTION MongoDB Atlas database." -ForegroundColor Yellow
Write-Host ""

Write-Host "Enter your MongoDB Atlas connection string:" -ForegroundColor Cyan
Write-Host "(Example: mongodb+srv://username:password@cluster.mongodb.net/campustrack)" -ForegroundColor Gray
$mongoUri = Read-Host "MongoDB URI"

if ($mongoUri) {
    Write-Host ""
    Write-Host "Connecting to production database..." -ForegroundColor Cyan
    
    $env:MONGO_URI = $mongoUri
    cd server
    node get-production-teachers.js
    cd ..
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   Done!                               " -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
}
else {
    Write-Host ""
    Write-Host "No MongoDB URI provided. Exiting..." -ForegroundColor Red
}
