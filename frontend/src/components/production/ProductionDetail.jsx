import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Fish,
  Calendar,
  MapPin,
  ShieldCheck,
  Ship,
  FileText,
} from 'lucide-react';
import { formatRupiah } from '../../utils/currency';
import { formatKg, formatWeightSmart } from '../../utils/calculation';
import { formatDateIndo } from '../../utils/date';

export default function ProductionDetailComponent({
  item,
  onDeleteRequest,
  isReadOnly = false,
  backUrl = '/admin/produksi',
  editUrl = null,
}) {
  const navigate = useNavigate();

  if (!item) return null;

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(backUrl)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Data Produksi</span>
        </button>

        {!isReadOnly && (
          <div className="flex items-center gap-2.5">
            <Link
              to={editUrl || `/admin/produksi/edit/${item.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-blue-600 hover:border-blue-200 text-xs font-semibold shadow-xs transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Data</span>
            </Link>

            <button
              type="button"
              onClick={() => onDeleteRequest(item)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus</span>
            </button>
          </div>
        )}
      </div>

      {/* Hero Emphasis Card: Total Nilai Produksi */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 relative overflow-hidden">
        {/* Subtle decorative background water wave / grid */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Fish className="w-64 h-64 -mr-10 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-sky-300 text-xs font-semibold border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Terverifikasi Dinas Kelautan & Perikanan Sulut</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {item.fishType}
            </h1>
            <p className="text-sm text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{item.location}</span>
              <span>•</span>
              <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{formatDateIndo(item.productionDate)}</span>
            </p>
          </div>

          {/* Visual Emphasis: Total Nilai Produksi */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/20 text-left md:text-right shrink-0">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-300">
              Total Nilai Produksi
            </p>
            <div className="text-2xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight mt-1">
              {formatRupiah(item.totalValue)}
            </div>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              {formatKg(item.quantity)} × {formatRupiah(item.pricePerKg)}/Kg
            </p>
          </div>
        </div>
      </div>

      {/* Detail Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Volume & Finansial */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Fish className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Volume & Harga</h3>
              <p className="text-xs text-slate-400">Rincian kuantitas tangkapan</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Jumlah Produksi:</span>
              <span className="text-base font-bold text-slate-800">
                {formatWeightSmart(item.quantity)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Satuan Berat:</span>
              <span className="font-semibold text-slate-700">{item.unit || 'Kilogram (Kg)'}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Harga per Kilogram:</span>
              <span className="font-semibold text-slate-800">
                {formatRupiah(item.pricePerKg)} / Kg
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Asal & Pendaratan */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Lokasi & Waktu</h3>
              <p className="text-xs text-slate-400">Pelabuhan dan tanggal pendaratan</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Pelabuhan / TPI:</span>
              <span className="font-semibold text-slate-800 text-sm">{item.location}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Wilayah Administrasi:</span>
              <span className="font-semibold text-slate-700">Provinsi Sulawesi Utara</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Tanggal Pendaratan:</span>
              <span className="font-semibold text-slate-800">
                {formatDateIndo(item.productionDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Nelayan & Alat Tangkap */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Nelayan & Sarana</h3>
              <p className="text-xs text-slate-400">Armada penangkap ikan</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Nama Nelayan / Kapal:</span>
              <span className="font-semibold text-slate-800 text-sm">{item.fishermanName}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Alat / Metode Tangkap:</span>
              <span className="font-semibold text-slate-700">
                {item.fishingGear || 'Pancing Ulur / Tradisional'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">ID Catatan:</span>
              <span className="font-mono text-slate-500 uppercase">{item.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes / Information Section */}
      {item.notes && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-sm">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Keterangan & Catatan Tambahan</span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {item.notes}
          </p>
        </div>
      )}
    </div>
  );
}
