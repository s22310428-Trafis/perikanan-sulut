import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, Fish, MapPin, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatRupiah } from '../../utils/currency';
import { formatKg } from '../../utils/calculation';
import { formatDateIndo } from '../../utils/date';
import { useAuth } from '../../context/useAuth';

export default function ProductionTable({
  productions = [],
  onDeleteRequest,
}) {
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Pagination calculation
  const totalPages = Math.ceil(productions.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = productions.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
      {/* Table Horizontal Scroll Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50/90 text-slate-600 font-semibold border-b border-slate-200/80 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4 text-center w-12">No</th>
              <th className="py-3.5 px-6">Jenis Ikan</th>
              <th className="py-3.5 px-4 text-right">Jumlah Produksi</th>
              <th className="py-3.5 px-4 text-right">Harga / Kg</th>
              <th className="py-3.5 px-5 text-right">Total Nilai</th>
              <th className="py-3.5 px-4">Tanggal Produksi</th>
              <th className="py-3.5 px-4">Lokasi Pendaratan</th>
              <th className="py-3.5 px-5">Nelayan / Kapal</th>
              <th className="py-3.5 px-6 text-center">
                {isAdmin ? 'Aksi (CRUD)' : 'Detail'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems.map((item, index) => {
              const rowNumber = startIndex + index + 1;
              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* No */}
                  <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                    {rowNumber}
                  </td>

                  {/* Jenis Ikan */}
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                        <Fish className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">
                          {item.fishType}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.fishingGear || 'Tangkapan Laut'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Jumlah Produksi */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-semibold text-slate-800 text-sm">
                      {formatKg(item.quantity)}
                    </span>
                  </td>

                  {/* Harga / Kg */}
                  <td className="py-3.5 px-4 text-right text-slate-600 font-medium">
                    {formatRupiah(item.pricePerKg)}
                  </td>

                  {/* Total Nilai */}
                  <td className="py-3.5 px-5 text-right">
                    <span className="font-bold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-100 text-xs inline-block">
                      {formatRupiah(item.totalValue)}
                    </span>
                  </td>

                  {/* Tanggal Produksi */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDateIndo(item.productionDate, true)}</span>
                    </div>
                  </td>

                  {/* Lokasi */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5 max-w-[220px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate" title={item.location}>
                        {item.location}
                      </span>
                    </div>
                  </td>

                  {/* Nelayan */}
                  <td className="py-3.5 px-5 text-slate-700 font-medium max-w-[220px]">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate" title={item.fishermanName}>
                        {item.fishermanName}
                      </span>
                    </div>
                  </td>

                  {/* Aksi */}
                  <td className="py-3.5 px-6 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Detail: Tersedia untuk Admin dan User */}
                      <Link
                        to={`/produksi/${item.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium text-xs"
                        title="Lihat Detail Data"
                        aria-label={`Detail data ${item.fishType}`}
                      >
                        <Eye className="w-4 h-4 text-slate-500" />
                        <span className="hidden sm:inline">Detail</span>
                      </Link>

                      {/* Edit & Hapus: HANYA untuk Administrator */}
                      {isAdmin && (
                        <>
                          {/* Edit */}
                          <Link
                            to={`/produksi/edit/${item.id}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Edit Data (Admin)"
                            aria-label={`Edit data ${item.fishType}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          {/* Hapus */}
                          <button
                            type="button"
                            onClick={() => onDeleteRequest(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus Data (Admin)"
                            aria-label={`Hapus data ${item.fishType}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-slate-500 font-medium">
          Menampilkan <span className="font-semibold text-slate-700">{startIndex + 1}</span> -{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(startIndex + itemsPerPage, productions.length)}
          </span>{' '}
          dari <span className="font-semibold text-slate-700">{productions.length}</span> data
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
