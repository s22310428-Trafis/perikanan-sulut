import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Fish,
  DollarSign,
  MapPin,
  Scale,
  TrendingUp,
  Compass,
  ArrowRight,
  CheckCircle2,
  Home,
  ChevronRight,
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import ProductionChart from '../../components/dashboard/ProductionChart';
import RecentProduction from '../../components/dashboard/RecentProduction';
import { productionService } from '../../services/api';
import { formatRupiah } from '../../utils/currency';
import { formatKg } from '../../utils/calculation';
import { StatCardSkeleton, ChartSkeleton } from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';

const TODAY_MARKET_PRICES = [
  { name: 'Ikan Tuna Sirip Kuning', price: 'Rp 65.000 - Rp 75.000 / Kg', status: 'Stabil', location: 'PPS Bitung' },
  { name: 'Ikan Cakalang', price: 'Rp 28.000 - Rp 35.000 / Kg', status: 'Tinggi', location: 'PPS Bitung' },
  { name: 'Ikan Tongkol', price: 'Rp 20.000 - Rp 24.000 / Kg', status: 'Stabil', location: 'TPI Tumumpa Manado' },
  { name: 'Ikan Layang', price: 'Rp 16.000 - Rp 19.000 / Kg', status: 'Melimpah', location: 'TPI Likupang' },
  { name: 'Ikan Kakap Merah', price: 'Rp 70.000 - Rp 85.000 / Kg', status: 'Premium', location: 'PP Dagho Sangihe' },
];

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productions, setProductions] = useState([]);
  const [stats, setStats] = useState({
    totalProduksiKg: 0,
    totalNilaiRupiah: 0,
    totalJenisIkan: 0,
    totalLokasi: 0,
  });
  const [chartPeriod, setChartPeriod] = useState('bulanan');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await productionService.getAll();
        if (!isMounted) return;
        setProductions(items);

        const computedStats = await productionService.getDashboardSummary(items);
        if (!isMounted) return;
        setStats(computedStats);

        const trend = productionService.getChartData(chartPeriod);
        setChartData(trend);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error saat memuat data dashboard user:', err);
        setError('Data produksi gagal dimuat. Silakan coba lagi.');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [chartPeriod]);

  const handlePeriodChange = (period) => {
    setChartPeriod(period);
    setChartData(productionService.getChartData(period));
  };

  if (error) {
    return <ErrorState title={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* AdminLTE-Style Page Header with Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200/90 gap-2">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <span className="text-sm sm:text-base text-slate-500 font-normal">
            Pusat Informasi & Transparansi Perikanan Sulut
          </span>
        </div>
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
          <Home className="w-4 h-4 text-slate-400" />
          <span>Beranda</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-teal-700 font-bold">Dashboard Publik</span>
        </nav>
      </div>

      {/* Coastal Information Banner */}
      <div className="rounded-xl p-4 sm:p-5 text-white bg-gradient-to-r from-teal-950 via-teal-900 to-cyan-950 border border-teal-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-teal-500/20 shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Portal Hasil Tangkapan & Pendaratan Nelayan
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-cyan-200 border border-white/20">
                Ombak: 0.5 - 1.2 m (Kondusif)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-100/90 mt-0.5">
              Transparansi kuantitas ikan laut, valuasi ekonomi pelelangan, dan harga pasar komoditas Sulawesi Utara.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/user/produksi"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-teal-900 font-bold text-xs sm:text-sm shadow-md hover:bg-cyan-50 transition-all cursor-pointer"
          >
            <Fish className="w-4 h-4 text-teal-700" />
            <span>Katalog Ikan (Read-Only)</span>
          </Link>
          <Link
            to="/user/statistik"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-cyan-300" />
            <span>Tren Harga Pasar</span>
          </Link>
        </div>
      </div>

      {/* 4 AdminLTE Small-Boxes */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Volume Tangkapan"
            value={formatKg(stats.totalProduksiKg)}
            subtext="Tercatat resmi di pelabuhan"
            icon={Scale}
            trend="Hasil Nelayan"
            trendPositive={true}
            variant="blue"
            linkTo="/user/produksi"
            linkText="Buka Katalog Produksi"
          />

          <StatCard
            title="Estimasi Nilai Valuasi"
            value={formatRupiah(stats.totalNilaiRupiah)}
            subtext="Perputaran ekonomi lelang"
            icon={DollarSign}
            trend="Nilai Pasar"
            trendPositive={true}
            variant="emerald"
            linkTo="/user/laporan"
            linkText="Lihat Laporan Transparansi"
          />

          <StatCard
            title="Keanekaragaman Ikan"
            value={`${stats.totalJenisIkan} Spesies`}
            subtext="Cakalang, Tuna, Layang"
            icon={Fish}
            trend="Komoditas Bahari"
            trendPositive={true}
            variant="amber"
            linkTo="/user/statistik"
            linkText="Lihat Statistik Spesies"
          />

          <StatCard
            title="Pelabuhan & TPI Aktif"
            value={`${stats.totalLokasi} Lokasi`}
            subtext="Bitung, Manado, Sangihe"
            icon={MapPin}
            trend="Pendaratan Terbuka"
            trendPositive={true}
            variant="rose"
            linkTo="/user/produksi"
            linkText="Lihat Sebaran Titik"
          />
        </div>
      )}

      {/* Info Harga Acuan Pelelangan Hari Ini */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/50 to-white">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Info Harga Acuan Pasar Lelang Ikan Sulut Hari Ini
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                Pembaruan Harian
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Estimasi kisaran harga jual ikan segar di TPI Tumumpa Manado & PPS Bitung
            </p>
          </div>

          <Link
            to="/user/statistik"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
          >
            <span>Lihat Grafik Statistik</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {TODAY_MARKET_PRICES.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 hover:bg-teal-50/60 border border-slate-200 hover:border-teal-300 transition-all space-y-2 shadow-2xs"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
                {item.location}
              </span>
              <p className="font-bold text-slate-900 text-sm truncate">{item.name}</p>
              <p className="text-sm font-extrabold text-slate-900">{item.price}</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Kondisi {item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production Trend Chart */}
      {loading ? (
        <ChartSkeleton />
      ) : (
        <ProductionChart
          chartData={chartData}
          activePeriod={chartPeriod}
          onPeriodChange={handlePeriodChange}
        />
      )}

      {/* Recent Production Section */}
      <RecentProduction productions={productions} viewAllLink="/user/produksi" />
    </div>
  );
}
