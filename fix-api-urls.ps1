# PowerShell script to fix all localhost URLs

$files = @(
    "client\src\pages\admin\ManageStudents.jsx",
    "client\src\pages\admin\AdminDashboard.jsx",
    "client\src\pages\admin\ManageTeachers.jsx",
    "client\src\pages\admin\ManageSubjects.jsx",
    "client\src\pages\student\StudentDashboard.jsx",
    "client\src\pages\teacher\TeacherDashboard.jsx",
    "client\src\pages\teacher\AttendanceMarking.jsx"
)

foreach ($file in $files) {
    Write-Host "Fixing $file..."
    
    $content = Get-Content $file -Raw
    
    # Add import at the top if not already there
    if ($content -notmatch "import API_BASE_URL") {
        $content = $content -replace "(import.*?;\r?\n)", "`$1import API_BASE_URL from '../../config/apiConfig'`r`n"
    }
    
    # Replace all localhost URLs
    $content = $content -replace "'http://localhost:5000", "'`${API_BASE_URL}"
    $content = $content -replace '"http://localhost:5000', '"`${API_BASE_URL}'
    $content = $content -replace '`http://localhost:5000', '`${API_BASE_URL}'
    
    Set-Content -Path $file -Value $content
    Write-Host "✅ Fixed $file"
}

Write-Host "`n🎉 All files fixed!"
