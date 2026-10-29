import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductionForm from '../../components/production/ProductionForm';
import { productionService } from '../../services/api';
import { useToast } from '../../context/useToast';
import { StatCardSkeleton } from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';

export default function AdminEditProductionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productionService.getById(id);
        if (isMounted) setInitialData(data);
      } catch (err) {
        if (isMounted) {
          console.error('Gagal mengambil data produksi:', err);
          setError('Data produksi tidak ditemukan atau gagal dimuat.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await productionService.update(id, formData);
      addToast('Data produksi berhasil diperbarui di Cloud Firestore.', 'success');
      navigate('/admin/produksi');
    } catch (err) {
      console.error('Gagal memperbarui data produksi:', err);
      addToast('Gagal memperbarui data produksi. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          onRetry={() => navigate('/admin/produksi')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Edit Data Hasil Produksi (CRUD)
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
        formTitle="Formulir Pembaruan Data Produksi (Administrator)"
      />
    </div>
  );
}
