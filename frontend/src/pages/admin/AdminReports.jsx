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
  ShieldCheck,
  FileCheck,
  Home,
  ChevronRight,
  Scale,
  DollarSign,
  Fish,
  MapPin,
} from 'lucide-react';
import { productionService } from '../../services/api';
import { formatRupiah } from '../../utils/currency';
import { formatKg } from '../../utils/calculation';
import { FISH_TYPES, LOCATIONS } from '../../data/mockProduction';
import { useToast } from '../../context/useToast';
import { StatCardSkeleton, ChartSkeleton } from '../../components/common/LoadingSkeleton';
import StatCard from '../../components/dashboard/StatCard';

export default function AdminReportsPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [productions, setProductions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedFish, setSelectedFish] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await productionService.getAll();
        if (isMounted) setProductions(data);
      } catch (err) {
        console.error('Gagal mengambil data laporan:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredData = useMemo(() => {
    return productions.filter((item) => {
      if (selectedFish && item.fishType !== selectedFish) return false;
      if (selectedLocation && item.location !== selectedLocation) return false;
      return true;
    });
  }, [productions, selectedFish, selectedLocation]);

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

  const locationAggregation = useMemo(() => {
    const map = {};
    filteredData.forEach((item) => {
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

  const totalKg = filteredData.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalRp = filteredData.reduce((sum, item) => sum + (Number(item.totalValue) || 0), 0);
  const avgPrice = totalKg > 0 ? Math.round(totalRp / totalKg) : 0;
  const topFish = fishTypeAggregation[0]?.name || '-';
  const topLocation = locationAggregation[0]?.name || '-';

  const handleExport = (e) => {
    e.preventDefault();
    setShowExportModal(false);
    addToast(
      `Laporan resmi DKP Sulut berhasil diekspor dalam format ${exportFormat.toUpperCase()}!`,
      'success'
    );
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* AdminLTE-Style Page Header with Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200/90 gap-2">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Laporan & Audit Hasil Produksi
          </h1>
          <span className="text-sm sm:text-base text-slate-500 font-normal">
            Rekapitulasi Resmi & Verifikasi Data Tangkapan DKP
          </span>
        </div>
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
          <Home className="w-4 h-4 text-slate-400" />
          <span>Beranda</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-blue-700 font-bold">Laporan Admin</span>
        </nav>
      </div>

      {/* Action Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Dokumen Rekapitulasi Produksi Perikanan
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Dokumen Resmi DKP
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Unduh berkas rekapitulasi untuk keperluan audit, arsip dinas, maupun diseminasi statistik perikanan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowExportModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor Dokumen Laporan</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
            Parameter Audit & Rekapitulasi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Periode Waktu
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="all">Semua Periode Pendaratan</option>
              <option value="month">Bulan Berjalan</option>
              <option value="quarter">Triwulan Berjalan</option>
              <option value="year">Tahun 2026</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jenis Ikan
            </label>
            <select
              value={selectedFish}
              onChange={(e) => setSelectedFish(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="">Semua Komoditas Ikan</option>
              {FISH_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pelabuhan / TPI
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="">Semua Lokasi Pelabuhan</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 AdminLTE Small-Boxes */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Volume Terfilter"
            value={formatKg(totalKg)}
            subtext="Data pendaratan terfilter"
            icon={Scale}
            variant="blue"
          />

          <StatCard
            title="Total Valuasi Transaksi"
            value={formatRupiah(totalRp)}
            subtext="Valuasi ekonomi terdata"
            icon={DollarSign}
            variant="emerald"
          />

          <StatCard
            title="Rata-rata Harga Pasar"
            value={`${formatRupiah(avgPrice)} / Kg`}
            subtext="Harga riil tingkat TPI"
            icon={Fish}
            variant="amber"
          />

          <StatCard
            title="Pusat Pendaratan Utama"
            value={topLocation}
            subtext={`Pangsa volume: ${topFish}`}
            icon={MapPin}
            variant="rose"
          />
        </div>
      )}

      {/* Visualizations */}
      {loading ? (
        <ChartSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1">
              Produksi Berdasarkan Jenis Ikan
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">Volume hasil tangkapan terverifikasi (Kg)</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fishTypeAggregation}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip formatter={(value) => [formatKg(value), 'Volume']} />
                  <Bar dataKey="totalKg" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1">
              Sebaran Pendaratan per Pelabuhan
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">Total pendaratan di sentra pelabuhan Sulut</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationAggregation}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip formatter={(value) => [formatKg(value), 'Volume']} />
                  <Bar dataKey="totalKg" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowExportModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 z-10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-blue-700">
                <FileCheck className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">Ekspor Dokumen Laporan Resmi</h3>
              </div>
              <button type="button" onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExport} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-slate-800">Format Dokumen Ekspor:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['pdf', 'excel', 'csv'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setExportFormat(fmt)}
                      className={`py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-bold uppercase transition-all cursor-pointer ${
                        exportFormat === fmt
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 text-xs sm:text-sm text-slate-600 space-y-1 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Dokumen Resmi Terverifikasi DKP</span>
                </div>
                <p>Mencakup {filteredData.length} baris data pendaratan terfilter.</p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
                >
                  Ekspor Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
