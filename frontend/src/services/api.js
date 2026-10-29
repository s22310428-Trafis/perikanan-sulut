import axios from 'axios';
import { INITIAL_PRODUCTIONS, FISH_TYPES, LOCATIONS, MONTHLY_TREND_DATA, WEEKLY_TREND_DATA, DAILY_TREND_DATA } from '../data/mockProduction';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const STORAGE_KEY = 'simprokan_sulut_productions_v1';

// Inisialisasi Axios Client untuk integrasi dengan Spring Boot REST API
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

/**
 * Normalizer data dari Spring Boot REST API ke format yang kompatibel dengan UI frontend
 */
function normalizeItem(item) {
  if (!item) return item;
  return {
    id: String(item.id),
    fishType: item.jenisIkan || item.fishType || '',
    jenisIkan: item.jenisIkan || item.fishType || '',
    quantity: item.jumlahProduksi !== undefined ? Number(item.jumlahProduksi) : Number(item.quantity) || 0,
    jumlahProduksi: item.jumlahProduksi !== undefined ? Number(item.jumlahProduksi) : Number(item.quantity) || 0,
    unit: item.satuan || item.unit || 'Kg',
    satuan: item.satuan || item.unit || 'Kg',
    pricePerKg: item.hargaPerKg !== undefined ? Number(item.hargaPerKg) : Number(item.pricePerKg) || 0,
    hargaPerKg: item.hargaPerKg !== undefined ? Number(item.hargaPerKg) : Number(item.pricePerKg) || 0,
    totalValue: item.totalNilai !== undefined ? Number(item.totalNilai) : Number(item.totalValue) || 0,
    totalNilai: item.totalNilai !== undefined ? Number(item.totalNilai) : Number(item.totalValue) || 0,
    productionDate: item.tanggalProduksi || item.productionDate || '',
    tanggalProduksi: item.tanggalProduksi || item.productionDate || '',
    location: item.lokasiProduksi || item.location || '',
    lokasiProduksi: item.lokasiProduksi || item.location || '',
    fishermanName: item.namaNelayan || item.fishermanName || '',
    namaNelayan: item.namaNelayan || item.fishermanName || '',
    fishingGear: item.alatTangkap || item.fishingGear || 'Tradisional',
    alatTangkap: item.alatTangkap || item.fishingGear || 'Tradisional',
    notes: item.catatan || item.notes || '',
    catatan: item.catatan || item.notes || '',
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  };
}

/**
 * Helper penyimpanan lokal (Fallback jika Spring Boot REST API offline)
 */
function getStoredProductions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTIONS));
      return [...INITIAL_PRODUCTIONS].map(normalizeItem);
    }
    return JSON.parse(raw).map(normalizeItem);
  } catch (err) {
    console.warn('Gagal membaca localStorage, menggunakan data in-memory:', err);
    return [...INITIAL_PRODUCTIONS].map(normalizeItem);
  }
}

function saveStoredProductions(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Gagal menyimpan ke localStorage:', err);
  }
}

/**
 * Service API Hasil Produksi Perikanan
 */
export const productionService = {
  /**
   * Mengambil semua data produksi dari Spring Boot REST API
   */
  async getAll() {
    try {
      const response = await apiClient.get('/produksi');
      // Periksa format ApiResponse { success: true, data: [...] }
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data.map(normalizeItem);
      } else if (response.data && Array.isArray(response.data)) {
        return response.data.map(normalizeItem);
      }
    } catch {
      // Fallback ke penyimpanan lokal saat backend belum aktif atau network offline
    }
    return getStoredProductions();
  },

  /**
   * Mengambil data produksi berdasarkan ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/produksi/${id}`);
      if (response.data && response.data.success && response.data.data) {
        return normalizeItem(response.data.data);
      } else if (response.data) {
        return normalizeItem(response.data);
      }
    } catch {
      // Fallback ke local
    }
    const list = getStoredProductions();
    const item = list.find((p) => String(p.id) === String(id));
    if (!item) {
      throw new Error(`Data produksi dengan ID ${id} tidak ditemukan.`);
    }
    return item;
  },

  /**
   * Menambahkan data produksi baru ke Spring Boot REST API (Cloud Firestore)
   */
  async create(data) {
    const backendPayload = {
      jenisIkan: data.jenisIkan || data.fishType,
      jumlahProduksi: Number(data.jumlahProduksi ?? data.quantity) || 0,
      satuan: data.satuan || data.unit || 'Kg',
      hargaPerKg: Number(data.hargaPerKg ?? data.pricePerKg) || 0,
      tanggalProduksi: data.tanggalProduksi || data.productionDate,
      lokasiProduksi: data.lokasiProduksi || data.location,
      namaNelayan: data.namaNelayan || data.fishermanName,
      alatTangkap: data.alatTangkap || data.fishingGear || '',
      catatan: data.catatan || data.notes || '',
    };

    try {
      const response = await apiClient.post('/produksi', backendPayload);
      if (response.data && response.data.success && response.data.data) {
        const savedItem = normalizeItem(response.data.data);
        const current = getStoredProductions();
        saveStoredProductions([savedItem, ...current.filter((p) => String(p.id) !== String(savedItem.id))]);
        return savedItem;
      }
    } catch (err) {
      console.warn('Gagal menyimpan via REST API, menyimpan ke lokal storage:', err.message);
    }

    // Fallback lokal
    const localRecord = normalizeItem({
      ...backendPayload,
      id: `prd-${Date.now().toString(36)}`,
      totalNilai: backendPayload.jumlahProduksi * backendPayload.hargaPerKg,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const current = getStoredProductions();
    const updated = [localRecord, ...current];
    saveStoredProductions(updated);
    return localRecord;
  },

  /**
   * Memperbarui data produksi yang sudah ada di Spring Boot REST API (Cloud Firestore)
   */
  async update(id, data) {
    const backendPayload = {
      jenisIkan: data.jenisIkan || data.fishType,
      jumlahProduksi: Number(data.jumlahProduksi ?? data.quantity) || 0,
      satuan: data.satuan || data.unit || 'Kg',
      hargaPerKg: Number(data.hargaPerKg ?? data.pricePerKg) || 0,
      tanggalProduksi: data.tanggalProduksi || data.productionDate,
      lokasiProduksi: data.lokasiProduksi || data.location,
      namaNelayan: data.namaNelayan || data.fishermanName,
      alatTangkap: data.alatTangkap || data.fishingGear || '',
      catatan: data.catatan || data.notes || '',
    };

    try {
      const response = await apiClient.put(`/produksi/${id}`, backendPayload);
      if (response.data && response.data.success && response.data.data) {
        const updatedItem = normalizeItem(response.data.data);
        const current = getStoredProductions();
        saveStoredProductions(current.map((p) => String(p.id) === String(id) ? updatedItem : p));
        return updatedItem;
      }
    } catch (err) {
      console.warn('Gagal memperbarui via REST API, memperbarui lokal storage:', err.message);
    }

    // Fallback lokal
    const current = getStoredProductions();
    const index = current.findIndex((p) => String(p.id) === String(id));
    if (index === -1) {
      throw new Error(`Data produksi dengan ID ${id} tidak ditemukan.`);
    }

    const updatedRecord = normalizeItem({
      ...current[index],
      ...backendPayload,
      id: String(id),
      totalNilai: backendPayload.jumlahProduksi * backendPayload.hargaPerKg,
      updatedAt: new Date().toISOString(),
    });

    current[index] = updatedRecord;
    saveStoredProductions(current);
    return updatedRecord;
  },

  /**
   * Menghapus data produksi di Spring Boot REST API (Cloud Firestore)
   */
  async delete(id) {
    try {
      await apiClient.delete(`/produksi/${id}`);
    } catch (err) {
      console.warn('Gagal menghapus via REST API, menghapus dari lokal storage:', err.message);
    }

    const current = getStoredProductions();
    const filtered = current.filter((p) => String(p.id) !== String(id));
    saveStoredProductions(filtered);
    return { success: true, id };
  },

  /**
   * Mengambil ringkasan dashboard
   */
  async getDashboardSummary(items) {
    try {
      const response = await apiClient.get('/dashboard/summary');
      if (response.data && response.data.success && response.data.data) {
        const d = response.data.data;
        return {
          totalProduksiKg: d.totalProduksi ?? 0,
          totalNilaiRupiah: d.totalNilaiProduksi ?? 0,
          totalJenisIkan: d.jumlahJenisIkan ?? 0,
          totalLokasi: d.jumlahLokasiProduksi ?? 0,
          totalTransaksi: d.totalTransaksi ?? 0,
        };
      }
    } catch {
      // Fallback
    }
    return this.calculateStats(items);
  },

  /**
   * Reset data ke contoh default Sulut
   */
  resetToDefault() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTIONS));
    return [...INITIAL_PRODUCTIONS].map(normalizeItem);
  },

  /**
   * Menghitung statistik dashboard dari data terkini
   */
  calculateStats(productions) {
    const list = productions || getStoredProductions();
    const totalProduksiKg = list.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const totalNilaiRupiah = list.reduce((sum, item) => sum + (Number(item.totalValue) || 0), 0);
    
    // Unique fish types & locations
    const fishTypesSet = new Set(list.map((item) => item.fishType || item.jenisIkan).filter(Boolean));
    const locationsSet = new Set(list.map((item) => item.location || item.lokasiProduksi).filter(Boolean));

    return {
      totalProduksiKg,
      totalNilaiRupiah,
      totalJenisIkan: fishTypesSet.size,
      totalLokasi: locationsSet.size,
      totalTransaksi: list.length,
    };
  },

  getChartData(period = 'bulanan') {
    if (period === 'harian') return DAILY_TREND_DATA;
    if (period === 'mingguan') return WEEKLY_TREND_DATA;
    return MONTHLY_TREND_DATA;
  },

  getMasterData() {
    return {
      fishTypes: FISH_TYPES,
      locations: LOCATIONS,
    };
  },
};
