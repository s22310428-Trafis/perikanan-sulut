import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductionDetailComponent from '../components/production/ProductionDetail';
import DeleteModal from '../components/common/DeleteModal';
import { productionService } from '../services/api';
import { useToast } from '../context/useToast';
import { StatCardSkeleton } from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';

export default function ProductionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productionService.getById(id);
      setItem(data);
    } catch (err) {
      console.error('Gagal mengambil detail produksi:', err);
      setError('Data produksi tidak ditemukan atau gagal dimuat.');
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
        const data = await productionService.getById(id);
        if (isMounted) {
          setItem(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Gagal mengambil detail produksi:', err);
          setError('Data produksi tidak ditemukan atau gagal dimuat.');
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
  }, [id]);

  const handleDeleteRequest = (target) => {
    setDeleteTarget(target);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await productionService.delete(deleteTarget.id);
      addToast('Data produksi berhasil dihapus.', 'success');
      navigate('/produksi');
    } catch (err) {
      console.error('Gagal menghapus data:', err);
      addToast('Gagal menghapus data produksi. Silakan coba lagi.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded w-48 animate-pulse" />
        <div className="h-44 bg-slate-200 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <ErrorState
        title={error || 'Data Tidak Ditemukan'}
        description="Data produksi yang Anda cari mungkin telah dihapus atau ID tidak valid."
        onRetry={fetchDetail}
      />
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <ProductionDetailComponent
        item={item}
        onDeleteRequest={handleDeleteRequest}
      />

      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        item={deleteTarget}
        isDeleting={isDeleting}
      />
    </div>
  );
}
