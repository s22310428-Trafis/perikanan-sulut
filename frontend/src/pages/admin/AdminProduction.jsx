import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Eye,
  Edit3,
  Trash2,
  Fish,
  MapPin,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Home,
} from 'lucide-react';
import ProductionFilter from '../../components/production/ProductionFilter';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import DeleteModal from '../../components/common/DeleteModal';
import { productionService } from '../../services/api';
import { formatRupiah } from '../../utils/currency';
import { formatKg } from '../../utils/calculation';
import { formatDateIndo } from '../../utils/date';
import { useToast } from '../../context/useToast';

export default function AdminProductionPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productions, setProductions] = useState([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFish, setSelectedFish] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteRequest = (item) => {
    setDeleteTarget(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await productionService.delete(deleteTarget.id);
      addToast(`Data hasil tangkapan "${deleteTarget.fishType}" berhasil dihapus dari Cloud Firestore.`, 'success');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error('Gagal menghapus data produksi:', err);
      addToast('Gagal menghapus data. Pastikan backend Spring Boot aktif.', 'error');
    } finally {
      setIsDeleting(false);
    }
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
            Data Hasil Produksi
          </h1>
          <span className="text-sm sm:text-base text-slate-500 font-normal">
            Pengelolaan & Audit Data Pendaratan Nelayan
          </span>
        </div>
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
          <Home className="w-4 h-4 text-slate-400" />
          <span>Beranda</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-blue-700 font-bold">Data Produksi</span>
        </nav>
      </div>

      {/* Action Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Katalog Pendaratan Ikan Resmi
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              CRUD Penuh
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola, tambah, perbarui, dan hapus data tangkapan di pelabuhan dan sentra pendaratan Sulawesi Utara.
          </p>
        </div>

        <Link
          to="/admin/produksi/tambah"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Produksi</span>
        </Link>
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

      {/* Main Table / Empty State */}
      {loading ? (
        <TableSkeleton rows={6} cols={9} />
      ) : filteredProductions.length === 0 ? (
        <EmptyState
          title="Belum ada data produksi."
          description="Tidak ada data pendaratan yang sesuai dengan filter atau kata kunci Anda."
          actionText="+ Tambah Produksi"
          actionLink="/admin/produksi/tambah"
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
                  <th className="py-3.5 px-4 text-right">Jumlah Produksi</th>
                  <th className="py-3.5 px-4 text-right">Harga / Kg</th>
                  <th className="py-3.5 px-5 text-right">Total Nilai</th>
                  <th className="py-3.5 px-4">Tanggal Produksi</th>
                  <th className="py-3.5 px-5">Lokasi Pendaratan</th>
                  <th className="py-3.5 px-5">Nelayan / Kapal</th>
                  <th className="py-3.5 px-5 text-center">Aksi (CRUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.map((item, index) => {
                  const rowNumber = startIndex + index + 1;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400 text-sm">
                        {rowNumber}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
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
                        <div className="flex items-center justify-center gap-2">
                          {/* Detail Button */}
                          <Link
                            to={`/admin/produksi/${item.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                            title="Lihat Detail Tangkapan"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </Link>

                          {/* Edit Button */}
                          <Link
                            to={`/admin/produksi/edit/${item.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                            title="Edit Data Tangkapan"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteRequest(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                            title="Hapus Data Tangkapan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
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

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        itemTitle={deleteTarget?.fishType || 'data produksi ini'}
      />
    </div>
  );
}
