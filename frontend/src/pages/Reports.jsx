import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Download,
  Filter,
  X,
} from 'lucide-react';
import { productionService } from '../services/api';
import { formatRupiah } from '../utils/currency';
import { formatKg } from '../utils/calculation';
import { FISH_TYPES, LOCATIONS } from '../data/mockProduction';
import { useToast } from '../context/useToast';
import { StatCardSkeleton, ChartSkeleton } from '../components/common/LoadingSkeleton';

export default function ReportsPage() {
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [productions, setProductions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedFish, setSelectedFish] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await productionService.getAll();
        setProductions(data);
      } catch (err) {
        console.error('Gagal mengambil data laporan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Data
  const filteredData = useMemo(() => {
    return productions.filter((item) => {
      if (selectedFish && item.fishType !== selectedFish) return false;
      if (selectedLocation && item.location !== selectedLocation) return false;
      return true;
    });
  }, [productions, selectedFish, selectedLocation]);

  // Agregasi Berdasarkan Jenis Ikan
  const fishTypeAggregation = useMemo(() => {
    const map = {};
    filteredData.forEach((item) => {
      const key = item.fishType || 'Lainnya';
      if (!map[key]) {
        map[key] = { name: key, totalKg: 0, totalNilai: 0, count: 0 };
      }
      map[key].totalKg += Number(item.quantity) || 0;
      map[key].totalNilai += Number(item.totalValue) || 0;
      map[key].count += 1;
    });
    return Object.values(map).sort((a, b) => b.totalKg - a.totalKg);
  }, [filteredData]);

  // Agregasi Berdasarkan Lokasi
  const locationAggregation = useMemo(() => {
    const map = {};
    filteredData.forEach((item) => {
      // Ambil nama singkat pelabuhan
      const rawLoc = item.location || 'Sulut';
      const shortName = rawLoc.split('(')[0].trim();
      if (!map[shortName]) {
        map[shortName] = { name: shortName, fullName: rawLoc, totalKg: 0, totalNilai: 0 };
      }
      map[shortName].totalKg += Number(item.quantity) || 0;
      map[shortName].totalNilai += Number(item.totalValue) || 0;
    });
    return Object.values(map).sort((a, b) => b.totalKg - a.totalKg);
  }, [filteredData]);

  // Metrik Ringkasan
  const totalKg = filteredData.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalRp = filteredData.reduce((sum, item) => sum + (Number(item.totalValue) || 0), 0);
  const avgPrice = totalKg > 0 ? Math.round(totalRp / totalKg) : 0;
  const topFish = fishTypeAggregation[0]?.name || '-';

  // Handle Export Mock
  const handleExport = (e) => {
    e.preventDefault();
    setShowExportModal(false);
    addToast(
      `Laporan berhasil diekspor dalam format ${exportFormat.toUpperCase()}!`,
      'success'
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Laporan & Analisis Produksi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analitik komprehensif hasil tangkapan ikan dan valuasi ekonomi perikanan Sulawesi Utara.
          </p>
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={() => setShowExportModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Laporan</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Filter Parameter Analisis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Filter Periode */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Periode Waktu
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="all">Semua Periode</option>
              <option value="month">Bulan Berjalan</option>
              <option value="quarter">Triwulan Berjalan</option>
              <option value="year">Tahun 2026</option>
            </select>
          </div>

          {/* Filter Jenis Ikan */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Komoditas Jenis Ikan
            </label>
            <select
              value={selectedFish}
              onChange={(e) => setSelectedFish(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="">Semua Jenis Ikan</option>
              {FISH_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Lokasi */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Lokasi Pelabuhan / TPI
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="">Semua Lokasi</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              Total Volume
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{formatKg(totalKg)}</div>
            <p className="text-xs text-slate-400 mt-1">Hasil pendaratan terfilter</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              Total Nilai Produksi
            </span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{formatRupiah(totalRp)}</div>
            <p className="text-xs text-slate-400 mt-1">Perputaran nilai ekonomi</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              Rata-rata Harga Pasar
            </span>
            <div className="text-2xl font-bold text-blue-700 mt-1">
              {formatRupiah(avgPrice)} / Kg
            </div>
            <p className="text-xs text-slate-400 mt-1">Harga riil di tingkat TPI</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              Komoditas Utama
            </span>
            <div className="text-xl font-bold text-slate-900 mt-1 truncate">{topFish}</div>
            <p className="text-xs text-slate-400 mt-1">Pangsa volume terbesar</p>
          </div>
        </div>
      )}

      {/* Visualizations Grid: 2 Targeted High-Impact Charts */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Produksi Berdasarkan Jenis Ikan */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">
                Produksi Berdasarkan Jenis Ikan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Perbandingan volume tangkapan (Kg) per spesies komoditas
              </p>
            </div>

            <div className="w-full h-72 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={fishTypeAggregation.slice(0, 6)}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => `${v} Kg`}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#64748b"
                    fontSize={11}
                    width={110}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [formatKg(value), 'Volume']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="totalKg" fill="#0284c7" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-400 text-right mt-2">
              Menampilkan 6 komoditas tangkapan tertinggi
            </div>
          </div>

          {/* Chart 2: Produksi Berdasarkan Lokasi */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">
                Produksi Berdasarkan Lokasi Pendaratan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribusi kuantitas hasil tangkapan di pelabuhan & TPI Sulut
              </p>
            </div>

            <div className="w-full h-72 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationAggregation.slice(0, 5)}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val / 1000} Ton`}
                  />
                  <Tooltip
                    formatter={(val) => [formatKg(val), 'Volume Tangkapan']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="totalKg" fill="#0d9488" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-400 text-right mt-2">
              PPS Bitung mendominasi pendaratan armada tangkap besar
            </div>
          </div>
        </div>
      )}

      {/* Tabel Ringkasan Laporan */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-base">Tabel Ringkasan Komoditas</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rekapitulasi volume, nilai produksi, dan kontribusi pangsa pasar
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Komoditas Ikan</th>
                <th className="py-3.5 px-4 text-center">Frekuensi Pendaratan</th>
                <th className="py-3.5 px-4 text-right">Total Volume</th>
                <th className="py-3.5 px-5 text-right">Total Nilai</th>
                <th className="py-3.5 px-4 text-right">Rata-rata Harga / Kg</th>
                <th className="py-3.5 px-6 text-right">Pangsa Pasar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fishTypeAggregation.map((row) => {
                const sharePercent = totalKg > 0 ? ((row.totalKg / totalKg) * 100).toFixed(1) : 0;
                const rowAvgPrice =
                  row.totalKg > 0 ? Math.round(row.totalNilai / row.totalKg) : 0;

                return (
                  <tr key={row.name} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-800 flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>{row.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{row.count} kali</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                      {formatKg(row.totalKg)}
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold text-emerald-700">
                      {formatRupiah(row.totalNilai)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600 font-medium">
                      {formatRupiah(rowAvgPrice)}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${Math.min(Number(sharePercent), 100)}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700 text-xs w-10 text-right">
                          {sharePercent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Export Laporan Perikanan</h3>
                  <p className="text-xs text-slate-500">Provinsi Sulawesi Utara</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExport} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Pilih Format File</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pdf', label: 'PDF Document (.pdf)' },
                    { id: 'excel', label: 'Excel (.xlsx)' },
                    { id: 'csv', label: 'Data CSV (.csv)' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setExportFormat(fmt.id)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        exportFormat === fmt.id
                          ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-slate-500 text-[11px] leading-relaxed">
                Laporan mencakup seluruh metrik terfilter: {formatKg(totalKg)} produksi dan nilai{' '}
                {formatRupiah(totalRp)} dengan verifikasi DKP Provinsi Sulawesi Utara.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-sm shadow-blue-500/20"
                >
                  Unduh Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
