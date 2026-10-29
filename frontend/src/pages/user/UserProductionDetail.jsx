import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductionDetailComponent from '../../components/production/ProductionDetail';
import { productionService } from '../../services/api';
import { StatCardSkeleton } from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';

export default function UserProductionDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productionService.getById(id);
        if (isMounted) setItem(data);
      } catch (err) {
        if (isMounted) {
          console.error('Gagal mengambil rincian produksi:', err);
          setError('Data pendaratan tidak ditemukan atau gagal dimuat.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

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
        description="Data pendaratan ikan yang Anda cari tidak tersedia."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <ProductionDetailComponent
      item={item}
      isReadOnly={true}
      backUrl="/user/produksi"
    />
  );
}
