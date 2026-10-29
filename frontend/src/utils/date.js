/**
 * Format tanggal ISO (YYYY-MM-DD) atau timestamp menjadi format Bahasa Indonesia
 * Contoh: "2026-10-28" -> "28 Oktober 2026"
 * @param {string|Date} dateInput
 * @param {boolean} shortMonth
 * @returns {string}
 */
export function formatDateIndo(dateInput, shortMonth = false) {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: shortMonth ? 'short' : 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Dapatkan tanggal hari ini dalam format YYYY-MM-DD untuk input HTML type="date"
 * @returns {string}
 */
export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
