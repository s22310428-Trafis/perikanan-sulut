import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Fish, MapPin, Calendar, User, Eye } from 'lucide-react';
import { formatRupiah } from '../../utils/currency';
import { formatKg } from '../../utils/calculation';
import { formatDateIndo } from '../../utils/date';

export default function RecentProduction({ productions = [], viewAllLink }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const targetLink = viewAllLink || (isAdmin ? '/admin/produksi' : '/user/produksi');

  // Ambil maksimal 5 data terbaru
  const latestItems = productions.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/50 to-white">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
              Produksi Pendaratan Terbaru
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Realtime
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pencatatan hasil tangkapan nelayan terkini di pelabuhan dan sentra TPI Sulawesi Utara
          </p>
        </div>

        <Link
          to={targetLink}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all cursor-pointer self-start sm:self-auto"
        >
          <span>Lihat Semua Data</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Content */}
      {latestItems.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-400">
          Belum ada catatan produksi terbaru di sistem.
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-xs">
              <tr>
                <th className="py-3.5 px-5">Jenis Komoditas</th>
                <th className="py-3.5 px-4 text-right">Volume</th>
                <th className="py-3.5 px-5 text-right">Total Nilai</th>
                <th className="py-3.5 px-5">Lokasi Pendaratan</th>
                <th className="py-3.5 px-4">Tanggal Tangkap</th>
                <th className="py-3.5 px-5">Nama Nelayan / Kapal</th>
                <th className="py-3.5 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {latestItems.map((item) => {
                const detailUrl = isAdmin
                  ? `/admin/produksi/${item.id}`
                  : `/user/produksi/${item.id}`;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
                          <Fish className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900 text-sm">{item.fishType}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-slate-800 text-sm">
                      {formatKg(item.quantity)}
                    </td>
                    <td className="py-4 px-5 text-right font-black text-emerald-700 text-sm">
                      {formatRupiah(item.totalValue)}
                    </td>
                    <td className="py-4 px-5 text-slate-700 text-sm">
                      <div className="flex items-center gap-1.5 max-w-[220px] truncate">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{formatDateIndo(item.productionDate, true)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-800 font-medium max-w-[220px] truncate text-sm">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{item.fishermanName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <Link
                        to={detailUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
