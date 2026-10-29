import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { formatKg } from '../../utils/calculation';
import { formatRupiah } from '../../utils/currency';

export default function DeleteModal({ isOpen, onClose, onConfirm, item, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="delete-modal-title" className="font-semibold text-slate-800 text-base">
                Konfirmasi Hapus
              </h3>
              <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Modal */}
        <div className="p-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            Apakah Anda yakin ingin menghapus data produksi ini? Data yang dihapus akan hilang dari catatan sistem hasil produksi perikanan.
          </p>

          {item && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Komoditas:</span>
                <span className="font-semibold text-slate-800">{item.fishType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jumlah:</span>
                <span className="font-semibold text-slate-800">{formatKg(item.quantity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Nilai:</span>
                <span className="font-semibold text-emerald-700">{formatRupiah(item.totalValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lokasi / Nelayan:</span>
                <span className="font-medium text-slate-700 truncate max-w-[200px]">
                  {item.fishermanName}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-5 bg-slate-50/70 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-white hover:border-slate-400 active:bg-slate-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 active:bg-rose-800 transition-colors shadow-sm shadow-rose-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              'Hapus'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
