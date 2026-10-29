import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, RefreshCw } from 'lucide-react';
import ProductionFilter from '../components/production/ProductionFilter';
import ProductionTable from '../components/production/ProductionTable';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import DeleteModal from '../components/common/DeleteModal';
import { productionService } from '../services/api';
import { useToast } from '../context/useToast';
import { useAuth } from '../context/useAuth';

export default function ProductionPage() {
  const { addToast } = useToast();
  const { isAdmin, toggleRole } = useAuth();

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
        if (isMounted) {
          setProductions(items);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Gagal mengambil data produksi:', err);
          setError('Data produksi gagal dimuat. Silakan coba lagi.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Search Logic
  const filteredProductions = useMemo(() => {
    return productions.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchFish = item.fishType?.toLowerCase().includes(query);
        const matchFisherman = item.fishermanName?.toLowerCase().includes(query);
        const matchLoc = item.location?.toLowerCase().includes(query);
        if (!matchFish && !matchFisherman && !matchLoc) {
          return false;
        }
      }

      // 2. Jenis Ikan
      if (selectedFish && item.fishType !== selectedFish) {
        return false;
      }

      // 3. Lokasi
      if (selectedLocation && item.location !== selectedLocation) {
        return false;
      }

      // 4. Tanggal
      if (selectedDate && item.productionDate !== selectedDate) {
        return false;
      }

      return true;
    });
  }, [productions, searchQuery, selectedFish, selectedLocation, selectedDate]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFish('');
    setSelectedLocation('');
    setSelectedDate('');
  };

  // Delete Action Flow (Only for Admin)
  const handleDeleteRequest = (item) => {
    if (!isAdmin) {
      addToast('Akses Dibatasi: Hanya Administrator yang dapat menghapus data.', 'warning');
      return;
    }
    setDeleteTarget(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !isAdmin) return;

    try {
      setIsDeleting(true);
      await productionService.delete(deleteTarget.id);
      setProductions((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      addToast('Data produksi berhasil dihapus dari Cloud Firestore.', 'success');
      setDeleteTarget(null);
    } catch (err) {
      console.error('Gagal menghapus data produksi:', err);
      addToast('Gagal menghapus data produksi. Silakan coba lagi.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return <ErrorState title={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isAdmin ? 'Pengelolaan Data Hasil Produksi' : 'Katalog Data Hasil Produksi'}
            </h1>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              isAdmin ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-teal-50 text-teal-800 border-teal-200'
            }`}>
              {isAdmin ? 'Akses CRUD' : 'Read-Only'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isAdmin
              ? 'Kelola, tambah, perbarui, dan hapus data hasil produksi perikanan Sulawesi Utara.'
              : 'Informasi resmi pencatatan hasil tangkapan nelayan di pelabuhan dan TPI Sulawesi Utara.'}
          </p>
        </div>

        {/* Action Button Utama (Hanya Tampil Jika Admin) */}
        <div className="flex items-center gap-2.5">
          {isAdmin ? (
            <Link
              to="/produksi/tambah"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Produksi</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={toggleRole}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Beralih ke Mode Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* User / Read-Only Notice Banner */}
      {!isAdmin && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-sky-50 border border-teal-200/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-teal-900">
            <Eye className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>Mode Pengguna (Hanya Baca):</strong> Anda dapat meninjau dan mencari seluruh data pendaratan ikan. Fitur Tambah, Edit, dan Hapus hanya dapat diakses dalam mode Administrator.
            </span>
          </div>
          <button
            type="button"
            onClick={toggleRole}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 shrink-0 underline cursor-pointer"
          >
            Aktifkan CRUD Admin
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <ProductionFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFish={selectedFish}
        onFishChange={setSelectedFish}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onResetFilters={handleResetFilters}
        totalResults={filteredProductions.length}
      />

      {/* Main Content / Table / Empty / Loading */}
      {loading ? (
        <TableSkeleton rows={6} cols={9} />
      ) : filteredProductions.length === 0 ? (
        <EmptyState
          title="Belum ada data produksi."
          description={
            searchQuery || selectedFish || selectedLocation || selectedDate
              ? 'Tidak ada data produksi yang sesuai dengan kata kunci atau filter yang Anda pilih.'
              : 'Belum ada catatan hasil produksi perikanan.'
          }
          actionText={isAdmin ? '+ Tambah Produksi' : null}
          actionLink={isAdmin ? '/produksi/tambah' : null}
          showReset={Boolean(searchQuery || selectedFish || selectedLocation || selectedDate)}
          onReset={handleResetFilters}
        />
      ) : (
        <ProductionTable
          productions={filteredProductions}
          onDeleteRequest={handleDeleteRequest}
        />
      )}

      {/* Modal Dialog Konfirmasi Hapus (Hanya Admin) */}
      {isAdmin && (
        <DeleteModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          item={deleteTarget}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
