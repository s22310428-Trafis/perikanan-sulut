import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Fish,
  DollarSign,
  MapPin,
  Scale,
  Plus,
  Shield,
  Database,
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
import { useAuth } from '../../context/useAuth';

export default function AdminDashboard() {
  const { user } = useAuth();
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
        console.error('Error saat memuat data dashboard admin:', err);
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
      {/* AdminLTE-Style Page Header with Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200/90 gap-2">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <span className="text-sm sm:text-base text-slate-500 font-normal">
            Panel Kendali & Audit Perikanan Sulut
          </span>
        </div>
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
          <Home className="w-4 h-4 text-slate-400" />
          <span>Beranda</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-blue-700 font-bold">Dashboard Admin</span>
        </nav>
      </div>

      {/* Admin Welcome Ribbon & Fast Actions */}
      <div className="rounded-xl p-4 sm:p-5 text-white bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Selamat Datang, {user.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Cloud Firestore Port 8080 Terkoneksi</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Wewenang penuh untuk menambah, menyunting, audit, dan menghapus catatan hasil produksi tangkapan nelayan.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/admin/produksi/tambah"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Tangkapan Baru</span>
          </Link>
          <Link
            to="/admin/produksi"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
          >
            <Fish className="w-4 h-4 text-sky-300" />
            <span>Kelola Produksi</span>
          </Link>
        </div>
      </div>

      {/* 4 AdminLTE Small-Boxes (High Contrast, Bold Numbers, Watermark Icons) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Box 1: Aqua/Blue (Total Produksi) */}
          <StatCard
            title="Total Produksi Tercatat"
            value={formatKg(stats.totalProduksiKg)}
            subtext="Tercatat resmi di database"
            icon={Scale}
            trend="+12.4% Akumulasi"
            trendPositive={true}
            variant="blue"
            linkTo="/admin/produksi"
            linkText="Lihat Data Produksi"
          />

          {/* Box 2: Green/Emerald (Total Valuasi) */}
          <StatCard
            title="Total Valuasi Transaksi"
            value={formatRupiah(stats.totalNilaiRupiah)}
            subtext="Perputaran ekonomi lelang TPI"
            icon={DollarSign}
            trend="+8.6% Valuasi"
            trendPositive={true}
            variant="emerald"
            linkTo="/admin/laporan"
            linkText="Lihat Laporan Valuasi"
          />

          {/* Box 3: Yellow/Amber (Varietas Komoditas) */}
          <StatCard
            title="Varietas Komoditas Ikan"
            value={`${stats.totalJenisIkan} Spesies`}
            subtext="Cakalang, Tuna, Tongkol, dll"
            icon={Fish}
            trend="Komoditas Utama"
            trendPositive={true}
            variant="amber"
            linkTo="/admin/statistik"
            linkText="Lihat Statistik Spesies"
          />

          {/* Box 4: Red/Rose (Pelabuhan Aktif) */}
          <StatCard
            title="Sentra Pelabuhan Aktif"
            value={`${stats.totalLokasi} Pelabuhan`}
            subtext="Bitung, Manado, Likupang"
            icon={MapPin}
            trend="Terverifikasi DKP"
            trendPositive={true}
            variant="rose"
            linkTo="/admin/produksi"
            linkText="Lihat Sebaran Lokasi"
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
      <RecentProduction productions={productions} viewAllLink="/admin/produksi" />
    </div>
  );
}
