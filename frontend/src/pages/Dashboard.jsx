import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Fish,
  DollarSign,
  MapPin,
  Scale,
  Plus,
  FileText,
  TrendingUp,
  Waves,
  Compass,
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ProductionChart from '../components/dashboard/ProductionChart';
import RecentProduction from '../components/dashboard/RecentProduction';
import { productionService } from '../services/api';
import { formatRupiah } from '../utils/currency';
import { formatKg } from '../utils/calculation';
import { StatCardSkeleton, ChartSkeleton } from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import { useAuth } from '../context/useAuth';

export default function DashboardPage() {
  const { isAdmin, user } = useAuth();
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

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const items = await productionService.getAll();
      setProductions(items);

      const computedStats = await productionService.getDashboardSummary(items);
      setStats(computedStats);

      const trend = productionService.getChartData(chartPeriod);
      setChartData(trend);
    } catch (err) {
      console.error('Error saat memuat data dashboard:', err);
      setError('Data produksi gagal dimuat. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

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
        console.error('Error saat memuat data dashboard:', err);
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
    return <ErrorState title={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Ocean Maritime Welcome Banner */}
      <div className="ocean-hero-gradient rounded-3xl p-6 sm:p-7 text-white relative overflow-hidden shadow-xl border border-sky-600/30">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Waves className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-200 text-xs font-semibold border border-white/15">
                <Compass className="w-3.5 h-3.5 text-cyan-300" />
                <span>Laut Sulawesi & Teluk Tomini</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Kondisi Laut: Kondusif
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              {isAdmin ? `Selamat Datang, ${user.name}` : 'Portal Publik Hasil Perikanan Sulawesi Utara'}
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/90 max-w-2xl leading-relaxed">
              {isAdmin
                ? 'Panel kendali resmi Dinas Kelautan & Perikanan. Kelola data pendaratan, analisis hasil tangkapan laut, dan pantau statistik ekonomi maritim.'
                : 'Pusat informasi publik hasil tangkapan nelayan Sulawesi Utara secara transparan, akurat, dan terverifikasi.'}
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/statistik"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-xs"
            >
              <TrendingUp className="w-4 h-4 text-cyan-300" />
              <span>Statistik Laut</span>
            </Link>

            <Link
              to="/laporan"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 text-sky-300" />
              <span>Laporan</span>
            </Link>

            {isAdmin ? (
              <Link
                to="/produksi/tambah"
                className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md shadow-amber-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Catat Tangkapan</span>
              </Link>
            ) : (
              <Link
                to="/produksi"
                className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs shadow-md transition-all cursor-pointer hover:bg-sky-50"
              >
                <Fish className="w-4 h-4 text-blue-700" />
                <span>Lihat Katalog</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 4 Main Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Total Produksi */}
          <StatCard
            title="Total Produksi"
            value={formatKg(stats.totalProduksiKg)}
            subtext="Volume tangkapan tercatat"
            icon={Scale}
            trend="+12.4%"
            trendPositive={true}
            variant="blue"
          />

          {/* 2. Total Nilai Produksi */}
          <StatCard
            title="Total Nilai Produksi"
            value={formatRupiah(stats.totalNilaiRupiah)}
            subtext="Estimasi nilai transaksi"
            icon={DollarSign}
            trend="+8.6%"
            trendPositive={true}
            variant="emerald"
          />

          {/* 3. Jumlah Jenis Ikan */}
          <StatCard
            title="Jumlah Jenis Ikan"
            value={`${stats.totalJenisIkan} Spesies`}
            subtext="Cakalang, Tuna & Tongkol"
            icon={Fish}
            trend="Komoditas Utama"
            trendPositive={true}
            variant="sky"
          />

          {/* 4. Jumlah Lokasi Produksi */}
          <StatCard
            title="Jumlah Lokasi Produksi"
            value={`${stats.totalLokasi} TPI / Pelabuhan`}
            subtext="Bitung, Manado, Sangihe"
            icon={MapPin}
            trend="Aktif Beroperasi"
            trendPositive={true}
            variant="amber"
          />
        </div>
      )}

      {/* Chart Section */}
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
      <RecentProduction productions={productions} />
    </div>
  );
}
