# Start CampusTrack Application

Write-Host "🚀 Starting CampusTrack Application..." -ForegroundColor Cyan
Write-Host ""

# Start Backend Server
Write-Host "📦 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\attendence management\server'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Green; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\attendence management\client'; Write-Host '🎨 Frontend Server Starting...' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Instructions:" -ForegroundColor Cyan
Write-Host "1. Wait for both servers to fully start (10-15 seconds)"
Write-Host "2. Backend will run on: http://localhost:5000"
Write-Host "3. Frontend will run on: http://localhost:5173"
Write-Host "4. Open browser and go to: http://localhost:5173"
Write-Host "5. Login as admin:"
Write-Host "   - Email: admin@campustrack.com"
Write-Host "   - Password: admin123"
Write-Host ""
Write-Host "🎉 Ready to use CampusTrack!" -ForegroundColor Green
