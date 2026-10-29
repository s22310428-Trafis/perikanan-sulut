import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import ProductionForm from '../components/production/ProductionForm';
import { productionService } from '../services/api';
import { useToast } from '../context/useToast';
import { useAuth } from '../context/useAuth';
import { StatCardSkeleton } from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';

export default function EditProductionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isAdmin, setRole } = useAuth();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productionService.getById(id);
        setInitialData(data);
      } catch (err) {
        console.error('Gagal mengambil data produksi:', err);
        setError('Data produksi tidak ditemukan atau gagal dimuat.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await productionService.update(id, formData);
      addToast('Data produksi berhasil diperbarui di Cloud Firestore.', 'success');
      navigate('/produksi');
    } catch (err) {
      console.error('Gagal memperbarui data produksi:', err);
      addToast('Gagal memperbarui data produksi. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guard: Jika sedang dalam Mode User (Read-Only)
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200/80 shadow-md text-center space-y-5 animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Akses Terbatas: Mode Pengguna (Read-Only)</h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Hanya Administrator Dinas Kelautan & Perikanan yang memiliki wewenang untuk mengubah data pendaratan ikan yang tersimpan.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setRole('admin')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Beralih ke Mode Admin (Akses CRUD)</span>
          </button>
          <Link
            to="/produksi"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Data Produksi</span>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-10 bg-slate-200 rounded w-64 animate-pulse" />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorState
          title={error || 'Data tidak ditemukan'}
          description="Data produksi yang ingin Anda ubah tidak tersedia atau telah dihapus."
          onRetry={() => navigate('/produksi')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Edit Data Hasil Produksi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Perbarui rincian pendaratan ikan untuk ID:{' '}
          <span className="font-mono text-blue-700 font-semibold">{id}</span>
        </p>
      </div>

      <ProductionForm
        key={initialData.id}
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        formTitle="Formulir Pembaruan Data Produksi"
      />
    </div>
  );
}
