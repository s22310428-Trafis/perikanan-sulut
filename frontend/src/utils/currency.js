/**
 * Format number to Indonesian Rupiah (IDR)
 * Example: 4500000 -> "Rp 4.500.000"
 * @param {number|string} amount
 * @param {boolean} showPrefix
 * @returns {string}
 */
export function formatRupiah(amount, showPrefix = true) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return showPrefix ? 'Rp 0' : '0';
  }

  const num = Math.round(Number(amount));
  const formatted = new Intl.NumberFormat('id-ID').format(num);
  return showPrefix ? `Rp ${formatted}` : formatted;
}

/**
 * Format large IDR into compact readable string (Juta / Miliar)
 * Example: 4500000000 -> "Rp 4,5 M"
 * @param {number} amount
 * @returns {string}
 */
export function formatCompactRupiah(amount) {
  if (!amount || isNaN(amount)) return 'Rp 0';
  const num = Number(amount);
  if (num >= 1_000_000_000) {
    return `Rp ${(num / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
  }
  if (num >= 1_000_000) {
    return `Rp ${(num / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;
  }
  return formatRupiah(num);
}

/**
 * Parse Rupiah string or formatted string back to raw number
 * @param {string} value
 * @returns {number}
 */
export function parseRupiah(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}
