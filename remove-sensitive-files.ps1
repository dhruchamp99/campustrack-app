# 🔒 Remove Sensitive Files - Make Code Unusable

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Code Protection Script              " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  WARNING: This will remove critical files!" -ForegroundColor Red
Write-Host "The code will look complete but be completely broken." -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Are you sure you want to continue? (Type 'YES' to confirm)"

if ($confirm -ne "YES") {
    Write-Host ""
    Write-Host "❌ Operation cancelled." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "🗑️  Removing Backend Critical Files..." -ForegroundColor Cyan
Write-Host ""

# Backend Files
$backendFiles = @(
    "server\src\middleware\authMiddleware.js",
    "server\src\models\User.js",
    "server\src\models\Attendance.js",
    "server\src\controllers\authController.js",
    "server\src\controllers\attendanceController.js",
    "server\src\routes\authRoutes.js",
    "server\src\routes\attendanceRoutes.js",
    "server\src\config\db.js",
    "server\.env",
    "server\.env.production"
)

foreach ($file in $backendFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✅ Removed: $file" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠️  Not found: $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🗑️  Removing Frontend Critical Files..." -ForegroundColor Cyan
Write-Host ""

# Frontend Files
$frontendFiles = @(
    "client\src\components\DashboardLayout.jsx",
    "client\src\components\ui\card.jsx",
    "client\src\components\ui\button.jsx",
    "client\src\context\AuthContext.jsx",
    "client\src\pages\LoginPage.jsx",
    "client\src\pages\Dashboard.jsx",
    "client\src\pages\teacher\TeacherDashboard.jsx",
    "client\src\pages\teacher\AttendanceStore.jsx",
    "client\src\pages\teacher\AttendanceMarking.jsx",
    "client\src\config\apiConfig.js",
    "client\src\index.css"
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✅ Removed: $file" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠️  Not found: $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✅ Files Removed Successfully!       " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  - Backend authentication: BROKEN ❌" -ForegroundColor Red
Write-Host "  - Database models: MISSING ❌" -ForegroundColor Red
Write-Host "  - Frontend layout: BROKEN ❌" -ForegroundColor Red
Write-Host "  - Login system: UNUSABLE ❌" -ForegroundColor Red
Write-Host "  - API configuration: MISSING ❌" -ForegroundColor Red
Write-Host ""

Write-Host "⚠️  The code now looks complete but is completely broken!" -ForegroundColor Yellow
Write-Host "Even AI cannot fix it without the removed files." -ForegroundColor Yellow
Write-Host ""

Write-Host "💡 Tip: Keep a backup of these files for yourself!" -ForegroundColor Cyan
Write-Host ""

# Create a list of removed files
$removedList = "REMOVED_FILES.txt"
$backendFiles + $frontendFiles | Out-File $removedList

Write-Host "📝 List of removed files saved to: $removedList" -ForegroundColor Green
Write-Host ""
