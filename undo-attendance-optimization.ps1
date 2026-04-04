# ==============================================================
# UNDO SCRIPT: Revert Array-Based Attendance Back to Original
# ==============================================================
# This script will:
#   1. Restore the original Attendance.js model from backup
#   2. Restore the original attendanceController.js from backup
#   3. Restore the original teacherController.js from backup
#   4. Restore old data from the backup collection (if migration was run)
#
# Usage: Run this PowerShell script from the project root:
#   .\undo-attendance-optimization.ps1
# ==============================================================

Write-Host ""
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host "  UNDO: Reverting Attendance Optimization    " -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host ""

$projectRoot = "d:\attendence management"

# --- Step 1: Restore Model ---
$modelBackup = "$projectRoot\server\src\models\Attendance.js.backup"
$modelTarget = "$projectRoot\server\src\models\Attendance.js"

if (Test-Path $modelBackup) {
    Copy-Item $modelBackup $modelTarget -Force
    Write-Host "[OK] Restored Attendance.js model from backup" -ForegroundColor Green
} else {
    Write-Host "[WARN] No backup found for Attendance.js" -ForegroundColor Red
    Write-Host "       The original file content is shown below. Copy it manually if needed." -ForegroundColor Red
    Write-Host ""
    Write-Host @"
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        required: true
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

attendanceSchema.index({ studentId: 1, subjectId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
"@ -ForegroundColor DarkGray
}

# --- Step 2: Restore Controller ---
$controllerBackup = "$projectRoot\server\src\controllers\attendanceController.js.backup"
$controllerTarget = "$projectRoot\server\src\controllers\attendanceController.js"

if (Test-Path $controllerBackup) {
    Copy-Item $controllerBackup $controllerTarget -Force
    Write-Host "[OK] Restored attendanceController.js from backup" -ForegroundColor Green
} else {
    Write-Host "[WARN] No backup found for attendanceController.js" -ForegroundColor Red
}

# --- Step 3: Restore Teacher Controller ---
$teacherBackup = "$projectRoot\server\src\controllers\teacherController.js.backup"
$teacherTarget = "$projectRoot\server\src\controllers\teacherController.js"

if (Test-Path $teacherBackup) {
    Copy-Item $teacherBackup $teacherTarget -Force
    Write-Host "[OK] Restored teacherController.js from backup" -ForegroundColor Green
} else {
    Write-Host "[WARN] No backup found for teacherController.js" -ForegroundColor Red
    Write-Host "       Run: git checkout server/src/controllers/teacherController.js" -ForegroundColor Red
}

# --- Step 4: Restore Admin Controller (cascade delete) ---
Write-Host ""
Write-Host "[INFO] adminController.js cascade delete was also modified." -ForegroundColor Cyan
Write-Host "       Change line ~184 from:" -ForegroundColor Cyan
Write-Host '         await Attendance.updateMany({}, { $pull: { presentStudents: ... } })' -ForegroundColor DarkGray
Write-Host "       Back to:" -ForegroundColor Cyan
Write-Host '         await Attendance.deleteMany({ studentId: req.params.id })' -ForegroundColor DarkGray
Write-Host "       Or run: git checkout server/src/controllers/adminController.js" -ForegroundColor Cyan

# --- Step 4: Database Restore Instructions ---
Write-Host ""
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host "  DATABASE RESTORE (If migration was run)    " -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "If you ran the migration script (migrate-attendance.js)," -ForegroundColor White
Write-Host "your old data was saved in a backup collection." -ForegroundColor White
Write-Host ""
Write-Host "To restore it, connect to MongoDB and run:" -ForegroundColor Cyan
Write-Host ""
Write-Host '  1. db.attendances.drop()                               // Remove new session data' -ForegroundColor DarkGray
Write-Host '  2. db.attendances_backup_XXXXXXXXX.renameCollection("attendances")  // Restore old data' -ForegroundColor DarkGray
Write-Host ""
Write-Host "(Replace XXXXXXXXX with the actual timestamp from migration output)" -ForegroundColor DarkGray

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  UNDO COMPLETE (Code files restored)        " -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Restart your server: npm run dev" -ForegroundColor White
Write-Host "  2. If you migrated data, follow the database restore steps above" -ForegroundColor White
Write-Host ""
