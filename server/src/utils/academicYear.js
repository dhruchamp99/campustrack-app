/**
 * Academic Year Utility
 * GTU academic year runs July → June
 * July 2025 to June 2026 = "2025-26"
 */

function getAcademicYear(date) {
    const d = new Date(date);
    const month = d.getMonth(); // 0-indexed: 0=Jan, 6=Jul
    const year = d.getFullYear();

    if (month >= 6) {
        // July onwards → current year is the start
        return `${year}-${String(year + 1).slice(2)}`;
    }
    // Jan–June → previous year is the start
    return `${year - 1}-${String(year).slice(2)}`;
}

function getCurrentAcademicYear() {
    return getAcademicYear(new Date());
}

/**
 * Returns a list of academic years from startYear to current
 * Useful for dropdown menus
 */
function getAcademicYearsList(startYear = 2024) {
    const current = getCurrentAcademicYear();
    const currentStartYear = parseInt(current.split('-')[0]);
    const years = [];
    for (let y = currentStartYear; y >= startYear; y--) {
        years.push(`${y}-${String(y + 1).slice(2)}`);
    }
    return years;
}

module.exports = { getAcademicYear, getCurrentAcademicYear, getAcademicYearsList };
