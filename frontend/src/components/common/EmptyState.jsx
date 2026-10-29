import React from 'react';
import { Fish, Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'Belum ada data produksi.',
  description = 'Data hasil tangkapan nelayan belum tercatat atau tidak ada data yang cocok dengan kriteria filter.',
  actionText = 'Tambah Produksi',
  actionLink = '/produksi/tambah',
  onAction,
  onReset,
  showReset = false,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs my-6">
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-inner border border-sky-100">
          <Fish className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-white">
          <Plus className="w-4 h-4" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {showReset && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Filter
          </button>
        )}

        {actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {actionText}
          </Link>
        ) : onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {actionText}
          </button>
        ) : null}
      </div>
    </div>
  );
}
