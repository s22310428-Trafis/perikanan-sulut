import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Compass,
  Filter,
  Home,
  ChevronRight,
  Scale,
  DollarSign,
  Fish,
  MapPin,
  Eye,
} from 'lucide-react';
import { productionService } from '../../services/api';
import { formatRupiah } from '../../utils/currency';
import { formatKg } from '../../utils/calculation';
import { StatCardSkeleton, ChartSkeleton } from '../../components/common/LoadingSkeleton';
import StatCard from '../../components/dashboard/StatCard';

const OCEAN_COLORS = [
  '#0d9488', // Teal
  '#0284c7', // Sky blue
  '#06b6d4', // Cyan
  '#059669', // Emerald
  '#2563eb', // Royal blue
  '#f59e0b', // Amber
  '#ec4899', // Pink coral
  '#8b5cf6', // Violet
];

function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-sm space-y-1.5">
        <p className="font-bold text-teal-300 border-b border-slate-700 pb-1">
          {label || item.name}
        </p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-300">{item.name || 'Nilai'}:</span>
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

export default function UserStatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [productions, setProductions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [activeMetric, setActiveMetric] = useState('volume');
  const [currentTime] = useState(() => Date.now());

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await productionService.getAll();
        if (isMounted) setProductions(data);
      } catch (err) {
        console.error('Gagal mengambil data statistik publik:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const locationStats = useMemo(() => {
    const map = {};
    filteredData.forEach((item) => {
      const rawLoc = item.location || item.lokasiProduksi || 'Sulut';
      const shortName = rawLoc.split('(')[0].trim();
      if (!map[shortName]) {
        map[shortName] = { name: shortName, totalKg: 0, totalNilai: 0 };
      }
      map[shortName].totalKg += Number(item.quantity) || 0;
      map[shortName].totalNilai += Number(item.totalValue) || 0;
    });
    return Object.values(map).sort((a, b) => b.totalKg - a.totalKg);
  }, [filteredData]);

  const totalKg = filteredData.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalNilai = filteredData.reduce((sum, item) => sum + (Number(item.totalValue) || 0), 0);
  const avgPriceOverall = totalKg > 0 ? Math.round(totalNilai / totalKg) : 0;
  const topCommodity = fishStats[0]?.name || '-';
  const topLocation = locationStats[0]?.name || '-';

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* AdminLTE-Style Page Header with Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200/90 gap-2">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Statistik & Tren Perikanan Sulut
          </h1>
          <span className="text-sm sm:text-base text-slate-500 font-normal">
            Transparansi Kuantitatif Hasil Tangkapan & Harga Pasar
          </span>
        </div>
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
          <Home className="w-4 h-4 text-slate-400" />
          <span>Beranda</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-teal-700 font-bold">Statistik Publik</span>
        </nav>
      </div>

      {/* Ocean Banner */}
      <div className="rounded-xl p-4 sm:p-5 text-white bg-gradient-to-r from-teal-950 via-teal-900 to-cyan-950 border border-teal-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-semibold border border-white/15">
            <Eye className="w-3.5 h-3.5 text-cyan-300" />
            <span>Transparansi Statistik Perikanan Publik</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Sebaran Pendaratan & Valuasi Ekonomi Pelelangan Ikan
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed">
            Data kuantitatif resmi yang bersumber dari Dinas Kelautan dan Perikanan Provinsi Sulawesi Utara.
          </p>
        </div>

        <div className="shrink-0 bg-white/10 p-3 rounded-xl border border-white/20 text-xs flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-cyan-300" />
          <div>
            <span className="font-bold text-white block">Akses Terbuka</span>
            <span className="text-teal-200 text-xs">Publik & Pelaku Usaha</span>
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
            title="Total Volume Tangkapan"
            value={formatKg(totalKg)}
            subtext={`${fishStats.length} Komoditas Terdaftar`}
            icon={Scale}
            variant="blue"
            linkTo="/user/produksi"
            linkText="Lihat Katalog Ikan"
          />

          <StatCard
            title="Estimasi Perputaran Nilai"
            value={formatRupiah(totalNilai)}
            subtext="Valuasi ekonomi pelelangan"
            icon={DollarSign}
            variant="emerald"
            linkTo="/user/laporan"
            linkText="Lihat Laporan Valuasi"
          />

          <StatCard
            title="Harga Rata-Rata / Kg"
            value={formatRupiah(avgPriceOverall)}
            subtext={`Dominan: ${topCommodity}`}
            icon={Fish}
            variant="amber"
          />

          <StatCard
            title="Pelabuhan Paling Aktif"
            value={topLocation}
            subtext={`${locationStats.length} Titik Pendaratan`}
            icon={MapPin}
            variant="rose"
            linkTo="/user/produksi"
            linkText="Lihat Sebaran Titik"
          />
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-600" />
          <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
            Parameter Visualisasi Publik
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs sm:text-sm font-semibold border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveMetric('volume')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMetric === 'volume'
                  ? 'bg-teal-700 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Volume (Kg)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('nilai')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMetric === 'nilai'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Valuasi (Rp)
            </button>
          </div>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="py-1.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs sm:text-sm font-semibold"
          >
            <option value="all">Semua Riwayat Data</option>
            <option value="30days">30 Hari Terakhir</option>
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      {loading ? (
        <ChartSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1">
              Volume Tangkapan Komoditas Utama
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">
              Perbandingan hasil tangkapan ikan laut di Sulawesi Utara
            </p>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fishStats} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#334155', fontSize: 12 }} width={120} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar dataKey={activeMetric === 'volume' ? 'totalKg' : 'totalNilai'} fill="#0d9488" radius={[0, 8, 8, 0]}>
                    {fishStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={OCEAN_COLORS[index % OCEAN_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1">
              Sebaran Tangkapan per Pelabuhan / TPI
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">
              Pusat pendaratan ikan di Bitung, Manado, Likupang & Sangihe
            </p>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationStats} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar dataKey={activeMetric === 'volume' ? 'totalKg' : 'totalNilai'} fill="#0284c7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tabel Komparasi Harga Pasar */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1">
          Rata-rata Harga Pasar Komoditas Ikan Sulut
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-4">
          Estimasi harga jual rata-rata di tempat pelelangan ikan Sulawesi Utara
        </p>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-xs">
              <tr>
                <th className="py-3 px-4">Nama Komoditas</th>
                <th className="py-3 px-4 text-right">Volume Tangkapan</th>
                <th className="py-3 px-4 text-right">Pangsa (%)</th>
                <th className="py-3 px-4 text-right">Harga Rata-Rata / Kg</th>
                <th className="py-3 px-4 text-right">Valuasi Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fishStats.map((item, idx) => (
                <tr key={idx} className="hover:bg-teal-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: OCEAN_COLORS[idx % OCEAN_COLORS.length] }} />
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800">{formatKg(item.totalKg)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                      {item.percentage}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800">{formatRupiah(item.avgPrice)}</td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-700">{formatRupiah(item.totalNilai)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
