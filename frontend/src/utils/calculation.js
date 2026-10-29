/**
 * Kalkulasi total nilai produksi: jumlah × harga per kilogram
 * @param {number|string} quantity
 * @param {number|string} pricePerKg
 * @returns {number}
 */
export function calculateTotalValue(quantity, pricePerKg) {
  const qty = parseFloat(quantity) || 0;
  const price = parseFloat(pricePerKg) || 0;
  return Math.round(qty * price);
}

/**
 * Format berat dalam kilogram dengan pemisah ribuan
 * Contoh: 1500 -> "1.500 Kg"
 * @param {number|string} weightInKg
 * @param {boolean} showUnit
 * @returns {string}
 */
export function formatKg(weightInKg, showUnit = true) {
  if (weightInKg === null || weightInKg === undefined || isNaN(Number(weightInKg))) {
    return showUnit ? '0 Kg' : '0';
  }
  const num = Number(weightInKg);
  const formatted = num.toLocaleString('id-ID', {
    maximumFractionDigits: 1,
  });
  return showUnit ? `${formatted} Kg` : formatted;
}

/**
 * Format berat ke Ton jika melebihi 1.000 Kg
 * @param {number} weightInKg
 * @returns {string}
 */
export function formatWeightSmart(weightInKg) {
  const num = Number(weightInKg) || 0;
  if (num >= 1000) {
    const tons = (num / 1000).toLocaleString('id-ID', { maximumFractionDigits: 2 });
    return `${tons} Ton (${formatKg(num)})`;
  }
  return formatKg(num);
}
