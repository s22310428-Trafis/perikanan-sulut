import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import ProductionForm from '../components/production/ProductionForm';
import { productionService } from '../services/api';
import { useToast } from '../context/useToast';
import { useAuth } from '../context/useAuth';

export default function AddProductionPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isAdmin, setRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await productionService.create(formData);
      addToast('Data produksi berhasil ditambahkan dan disimpan ke Cloud Firestore.', 'success');
      navigate('/produksi');
    } catch (err) {
      console.error('Gagal menambahkan produksi:', err);
      addToast('Gagal menambahkan data produksi. Silakan coba lagi.', 'error');
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
            Hanya Administrator Dinas Kelautan & Perikanan yang memiliki wewenang untuk mencatat data pendaratan ikan baru ke database.
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Tambah Data Hasil Produksi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Catat data pendaratan ikan baru dari kapal nelayan di pelabuhan atau TPI Sulawesi Utara.
        </p>
      </div>

      <ProductionForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        formTitle="Formulir Pendaratan Ikan Baru"
      />
    </div>
  );
}
