import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Fish,
  Calendar,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  Info,
  Home,
} from 'lucide-react';
import ProductionFilter from '../../components/production/ProductionFilter';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { productionService } from '../../services/api';
import { formatRupiah } from '../../utils/currency';
import { formatKg } from '../../utils/calculation';
import { formatDateIndo } from '../../utils/date';

export default function UserProductionPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productions, setProductions] = useState([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFish, setSelectedFish] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await productionService.getAll();
      setProductions(items);
    } catch (err) {
      console.error('Gagal mengambil data produksi:', err);
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
        if (isMounted) setProductions(items);
      } catch (err) {
        if (isMounted) {
          console.error('Gagal mengambil data produksi:', err);
          setError('Data produksi gagal dimuat. Silakan coba lagi.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Search Logic
  const filteredProductions = useMemo(() => {
    return productions.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchFish = item.fishType?.toLowerCase().includes(q);
        const matchFisherman = item.fishermanName?.toLowerCase().includes(q);
        const matchLoc = item.location?.toLowerCase().includes(q);
        if (!matchFish && !matchFisherman && !matchLoc) return false;
      }
      if (selectedFish && item.fishType !== selectedFish) return false;
      if (selectedLocation && item.location !== selectedLocation) return false;
      if (selectedDate && item.productionDate !== selectedDate) return false;
      return true;
    });
  }, [productions, searchQuery, selectedFish, selectedLocation, selectedDate]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFish('');
    setSelectedLocation('');
    setSelectedDate('');
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredProductions.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProductions.slice(startIndex, startIndex + itemsPerPage);

  if (error) {
    return <ErrorState title={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* AdminLTE-Style Page Header with Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200/90 gap-2">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Katalog Data Hasil Produksi
          </h1>
          <span className="text-sm sm:text-base text-slate-500 font-normal">
            Transparansi Pendaratan Ikan Resmi Sulut
          </span>
        </div>
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
          <Home className="w-4 h-4 text-slate-400" />
          <span>Beranda</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-teal-700 font-bold">Data Produksi</span>
        </nav>
      </div>

      {/* Public Read-Only Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 flex items-start gap-3.5 shadow-2xs">
        <div className="p-2 rounded-lg bg-teal-100 text-teal-700 shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-teal-950 leading-relaxed">
          <strong className="font-bold text-teal-900 block text-sm sm:text-base mb-0.5">
            Portal Informasi Publik (Hanya Baca / Read-Only):
          </strong>
          Anda dapat mencari, memfilter, dan melihat rincian pendaratan hasil laut di Sulawesi Utara secara terbuka. Penambahan dan pengeditan data hanya dapat dilakukan oleh otoritas Dinas Kelautan dan Perikanan Prov. Sulut.
        </div>
      </div>

      {/* Filter & Search Bar */}
      <ProductionFilter
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        selectedFish={selectedFish}
        onFishChange={(val) => {
          setSelectedFish(val);
          setCurrentPage(1);
        }}
        selectedLocation={selectedLocation}
        onLocationChange={(val) => {
          setSelectedLocation(val);
          setCurrentPage(1);
        }}
        selectedDate={selectedDate}
        onDateChange={(val) => {
          setSelectedDate(val);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
        totalResults={filteredProductions.length}
      />

      {/* Table or Empty State */}
      {loading ? (
        <TableSkeleton rows={6} cols={8} />
      ) : filteredProductions.length === 0 ? (
        <EmptyState
          title="Tidak ada data pendaratan yang ditemukan."
          description="Coba ubah kata kunci pencarian atau reset filter untuk melihat seluruh rekaman data tangkapan."
          showReset={Boolean(searchQuery || selectedFish || selectedLocation || selectedDate)}
          onReset={handleResetFilters}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3.5 px-4 text-center w-12">No</th>
                  <th className="py-3.5 px-5">Jenis Ikan</th>
                  <th className="py-3.5 px-4 text-right">Volume (Kg)</th>
                  <th className="py-3.5 px-4 text-right">Harga / Kg</th>
                  <th className="py-3.5 px-5 text-right">Total Nilai</th>
                  <th className="py-3.5 px-4">Tanggal Pendaratan</th>
                  <th className="py-3.5 px-5">Lokasi TPI / Pelabuhan</th>
                  <th className="py-3.5 px-5">Kapal / Nelayan</th>
                  <th className="py-3.5 px-5 text-center">Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.map((item, index) => {
                  const rowNumber = startIndex + index + 1;
                  return (
                    <tr key={item.id} className="hover:bg-teal-50/40 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400 text-sm">
                        {rowNumber}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
                            <Fish className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm block">
                              {item.fishType}
                            </span>
                            <span className="text-xs text-slate-500">
                              {item.fishingGear || 'Tangkapan Laut'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-sm">
                        {formatKg(item.quantity)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-700 font-semibold text-sm">
                        {formatRupiah(item.pricePerKg)}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 text-sm inline-block">
                          {formatRupiah(item.totalValue)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{formatDateIndo(item.productionDate, true)}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-700 text-sm">
                        <div className="flex items-center gap-1.5 max-w-[220px]">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-800 font-medium max-w-[220px] text-sm">
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{item.fishermanName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <Link
                          to={`/user/produksi/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
            <div>
              Menampilkan <span className="font-bold text-slate-900">{startIndex + 1}</span> -{' '}
              <span className="font-bold text-slate-900">
                {Math.min(startIndex + itemsPerPage, filteredProductions.length)}
              </span>{' '}
              dari <span className="font-bold text-slate-900">{filteredProductions.length}</span> data pendaratan
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <div className="px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-800">
                Halaman {currentPage} dari {totalPages}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
