import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Waves,
  Fish,
  Compass,
  Ship,
  TrendingUp,
  MapPin,
  Layers,
  Award,
  DollarSign,
  Filter,
  Shield,
  Eye,
} from 'lucide-react';
import { productionService } from '../services/api';
import { formatRupiah } from '../utils/currency';
import { formatKg } from '../utils/calculation';
import { useAuth } from '../context/useAuth';
import { StatCardSkeleton, ChartSkeleton } from '../components/common/LoadingSkeleton';

const OCEAN_COLORS = [
  '#0284c7', // Sky blue
  '#0d9488', // Teal
  '#2563eb', // Royal blue
  '#0891b2', // Cyan
  '#059669', // Emerald
  '#6366f1', // Indigo
  '#f59e0b', // Amber
  '#ec4899', // Pink coral
  '#8b5cf6', // Violet
  '#14b8a6', // Light teal
];

function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700/80 text-xs space-y-1">
        <p className="font-semibold text-slate-300 border-b border-slate-700/80 pb-1">
          {label || item.name}
        </p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sky-300">{item.name || 'Nilai'}:</span>
          <span className="font-bold text-white">
            {typeof item.value === 'number'
              ? item.dataKey === 'totalKg' || item.dataKey === 'produksiKg'
                ? formatKg(item.value)
                : item.dataKey === 'totalNilai' || item.dataKey === 'avgPrice'
                ? formatRupiah(item.value)
                : item.value
              : item.value}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function StatisticsPage() {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [productions, setProductions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [activeMetric, setActiveMetric] = useState('volume'); // 'volume' or 'nilai'
  const [currentTime] = useState(() => Date.now());

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await productionService.getAll();
        if (isMounted) {
          setProductions(data);
        }
      } catch (err) {
        console.error('Gagal mengambil data statistik:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter Data berdasarkan periode jika dipilih
  const filteredData = useMemo(() => {
    if (selectedPeriod === 'all') return productions;
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    return productions.filter((item) => {
      if (!item.productionDate) return true;
      const itemTimestamp = Date.parse(item.productionDate);
      if (Number.isNaN(itemTimestamp)) return true;
      if (selectedPeriod === '30days') {
        return (currentTime - itemTimestamp) <= thirtyDaysMs;
      }
      return true;
    });
  }, [productions, selectedPeriod, currentTime]);

  // 1. Agregasi Statistik per Jenis Ikan
  const fishStats = useMemo(() => {
    const map = {};
    filteredData.forEach((item) => {
      const fishName = item.fishType || item.jenisIkan || 'Ikan Lainnya';
      if (!map[fishName]) {
        map[fishName] = {
          name: fishName,
          totalKg: 0,
          totalNilai: 0,
          count: 0,
          gear: item.fishingGear || item.alatTangkap || 'Tradisional',
        };
      }
      map[fishName].totalKg += Number(item.quantity) || 0;
      map[fishName].totalNilai += Number(item.totalValue) || 0;
      map[fishName].count += 1;
    });

    const totalAllKg = Object.values(map).reduce((sum, f) => sum + f.totalKg, 0);

    return Object.values(map)
      .map((f) => ({
        ...f,
        avgPrice: f.totalKg > 0 ? Math.round(f.totalNilai / f.totalKg) : 0,
        percentage: totalAllKg > 0 ? Number(((f.totalKg / totalAllKg) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.totalKg - a.totalKg);
  }, [filteredData]);

  // 2. Agregasi Statistik per Lokasi Pelabuhan
  const locationStats = useMemo(() => {
    const map = {};
    filteredData.forEach((item) => {
      const rawLoc = item.location || item.lokasiProduksi || 'Sulut';
      const shortName = rawLoc.split('(')[0].trim();
      if (!map[shortName]) {
        map[shortName] = {
          name: shortName,
          fullName: rawLoc,
          totalKg: 0,
          totalNilai: 0,
          count: 0,
        };
      }
      map[shortName].totalKg += Number(item.quantity) || 0;
      map[shortName].totalNilai += Number(item.totalValue) || 0;
      map[shortName].count += 1;
    });
    return Object.values(map).sort((a, b) => b.totalKg - a.totalKg);
  }, [filteredData]);

  // 3. Agregasi Sebaran Alat Tangkap
  const gearStats = useMemo(() => {
    const map = {};
    filteredData.forEach((item) => {
      const rawGear = item.fishingGear || item.alatTangkap || 'Lainnya';
      const gear = rawGear.split('(')[0].trim() || 'Lainnya';
      if (!map[gear]) {
        map[gear] = { name: gear, value: 0 };
      }
      map[gear].value += Number(item.quantity) || 0;
    });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [filteredData]);

  // KPI Metrics
  const totalKg = filteredData.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalNilai = filteredData.reduce((sum, item) => sum + (Number(item.totalValue) || 0), 0);
  const avgPriceOverall = totalKg > 0 ? Math.round(totalNilai / totalKg) : 0;
  const topCommodity = fishStats[0]?.name || '-';
  const topLocation = locationStats[0]?.name || '-';

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Ocean Themed Hero Header */}
      <div className="ocean-hero-gradient rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-sky-600/30">
        {/* Subtle decorative wave overlay */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Waves className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-200 text-xs font-semibold border border-white/15">
              <Compass className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
              <span>Wilayah Pengelolaan Perikanan Negara RI (WPPNRI 715 & 716)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Statistik Hasil Perikanan Sulawesi Utara
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/90 max-w-2xl leading-relaxed">
              Pusat analitik kuantitatif, tren tangkapan laut komersial, sebaran pelabuhan pendaratan,
              serta evaluasi potensi ekonomi maritim Provinsi Sulawesi Utara.
            </p>
          </div>

          {/* Role Status Pill */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-xs space-y-1">
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <Shield className="w-4 h-4 text-amber-300" />
              ) : (
                <Eye className="w-4 h-4 text-cyan-300" />
              )}
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                {isAdmin ? 'Mode Administrator' : 'Mode Publik / Pengguna'}
              </span>
            </div>
            <p className="text-sky-200 text-[11px]">
              {isAdmin
                ? 'Akses penuh visualisasi & pengelolaan data'
                : 'Akses transparansi statistik resmi (Read-Only)'}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Volume */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-sky-300 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Volume Tangkapan
              </span>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Fish className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatKg(totalKg)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-sky-700 font-medium">
              <Waves className="w-3.5 h-3.5 text-sky-500" />
              <span>{fishStats.length} Komoditas Terdaftar</span>
            </div>
          </div>

          {/* Card 2: Total Valuasi Ekonomi */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Valuasi Ekonomi
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
              {formatRupiah(totalNilai)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nilai perputaran lelang & TPI</span>
            </div>
          </div>

          {/* Card 3: Rata-Rata Harga Pasar */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Rata-Rata Harga / Kg
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatRupiah(avgPriceOverall)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Ikan Dominan: <strong className="text-slate-700">{topCommodity}</strong></span>
            </div>
          </div>

          {/* Card 4: Sentra Pelabuhan Terbesar */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Sentra Pelabuhan Aktif
              </span>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Ship className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {locationStats.length} <span className="text-sm font-semibold text-slate-500">Titik TPI</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-teal-700 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">Sentra: {topLocation}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Metric Toggle Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Parameter Visualisasi Data
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Metric Selector */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveMetric('volume')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMetric === 'volume'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Berdasarkan Volume (Kg)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('nilai')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMetric === 'nilai'
                  ? 'bg-white text-emerald-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Berdasarkan Valuasi (Rp)
            </button>
          </div>

          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="py-1.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer font-medium"
          >
            <option value="all">Semua Riwayat Data</option>
            <option value="30days">30 Hari Terakhir</option>
          </select>
        </div>
      </div>

      {/* Main Charts Row */}
      {loading ? (
        <ChartSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Komposisi Volume Tangkapan per Jenis Ikan */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">
                  Volume Produksi per Jenis Komoditas
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700">
                  Kg
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Peringkat komoditas tangkapan laut unggulan di Sulawesi Utara
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={fishStats}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                    width={110}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar
                    dataKey={activeMetric === 'volume' ? 'totalKg' : 'totalNilai'}
                    name={activeMetric === 'volume' ? 'Total Volume' : 'Total Nilai'}
                    fill="#0284c7"
                    radius={[0, 8, 8, 0]}
                  >
                    {fishStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={OCEAN_COLORS[index % OCEAN_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Sebaran Produksi per Pelabuhan / TPI */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">
                  Distribusi Pendaratan per Pelabuhan / TPI
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700">
                  Pelabuhan Sulut
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Sentra pendaratan hasil laut di Bitung, Manado, Sangihe, Likupang & Minut
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationStats}
                  margin={{ top: 10, right: 20, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#475569', fontSize: 10 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar
                    dataKey={activeMetric === 'volume' ? 'totalKg' : 'totalNilai'}
                    name={activeMetric === 'volume' ? 'Volume (Kg)' : 'Nilai (Rp)'}
                    fill="#0d9488"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Row: Sebaran Alat Tangkap & Rata-rata Harga Pasar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart: Komposisi Alat Tangkap */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-800 text-base">Metode / Alat Tangkap</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rasio tangkapan berdasarkan teknologi penangkapan nelayan
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gearStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {gearStats.map((entry, index) => (
                    <Cell
                      key={`gear-cell-${index}`}
                      fill={OCEAN_COLORS[index % OCEAN_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatKg(value), 'Volume']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-[11px] text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabel Komparasi Harga Rata-Rata */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Perbandingan Harga Pasar & Kontribusi Nilai
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Estimasi harga jual rata-rata per kilogram di pelabuhan pendaratan
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              Sulut Market
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Komoditas Ikan</th>
                  <th className="py-2.5 px-3 text-right">Volume Tangkapan</th>
                  <th className="py-2.5 px-3 text-right">Pangsa (%)</th>
                  <th className="py-2.5 px-3 text-right">Harga Rata-Rata/Kg</th>
                  <th className="py-2.5 px-4 text-right">Valuasi Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fishStats.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: OCEAN_COLORS[idx % OCEAN_COLORS.length] }}
                      />
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-700">
                      {formatKg(item.totalKg)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
                        {item.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-800">
                      {formatRupiah(item.avgPrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">
                      {formatRupiah(item.totalNilai)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
