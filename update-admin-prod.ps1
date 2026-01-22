# Update Admin Credentials in Production

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Update Admin Credentials            " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "New Admin Credentials:" -ForegroundColor Yellow
Write-Host "  Email: dhru@admin.com" -ForegroundColor Green
Write-Host "  Password: admin@123" -ForegroundColor Green
Write-Host ""

$updateProd = Read-Host "Do you want to update production database? (Y/N)"

if ($updateProd -eq "Y" -or $updateProd -eq "y") {
    Write-Host ""
    Write-Host "Enter your MongoDB Atlas connection string:" -ForegroundColor Cyan
    $mongoUri = Read-Host "MongoDB URI"
    
    if ($mongoUri) {
        Write-Host ""
        Write-Host "Updating production database..." -ForegroundColor Cyan
        
        $env:MONGO_URI = $mongoUri
        cd server
        node update-admin.js
        cd ..
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "   Production Updated!                 " -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now login with:" -ForegroundColor Cyan
        Write-Host "  Email: dhru@admin.com" -ForegroundColor White
        Write-Host "  Password: admin@123" -ForegroundColor White
        Write-Host ""
    }
}
else {
    Write-Host ""
    Write-Host "Skipped production update." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Local database has been updated." -ForegroundColor Green
    Write-Host "Login with: dhru@admin.com / admin@123" -ForegroundColor White
}
