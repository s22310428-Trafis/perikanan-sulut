import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductionForm from '../../components/production/ProductionForm';
import { productionService } from '../../services/api';
import { useToast } from '../../context/useToast';

export default function AdminAddProductionPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await productionService.create(formData);
      addToast('Data pendaratan berhasil ditambahkan dan disimpan ke Cloud Firestore.', 'success');
      navigate('/admin/produksi');
    } catch (err) {
      console.error('Gagal menambahkan produksi:', err);
      addToast('Gagal menambahkan data produksi. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Tambah Data Hasil Produksi (CRUD)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Catat pendaratan ikan baru dari kapal nelayan di pelabuhan atau TPI Sulawesi Utara ke Cloud Firestore.
        </p>
      </div>

      <ProductionForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        formTitle="Formulir Pendaratan Ikan Baru (Administrator)"
      />
    </div>
  );
}
