import React from 'react';
import { Search, X, Calendar, MapPin, Fish } from 'lucide-react';
import { FISH_TYPES, LOCATIONS } from '../../data/mockProduction';

export default function ProductionFilter({
  searchQuery,
  onSearchChange,
  selectedFish,
  onFishChange,
  selectedLocation,
  onLocationChange,
  selectedDate,
  onDateChange,
  onResetFilters,
  totalResults,
}) {
  const hasActiveFilters = Boolean(
    searchQuery || selectedFish || selectedLocation || selectedDate
  );

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs space-y-4 mb-6">
      {/* Top Bar: Search Input & Quick Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari berdasarkan jenis ikan, nama nelayan, atau lokasi..."
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              aria-label="Hapus pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Counter & Reset Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs sm:text-sm text-slate-600 font-medium">
            Ditemukan: <strong className="text-slate-900 font-bold">{totalResults}</strong> data
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Row: Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3 border-t border-slate-100">
        {/* Filter Jenis Ikan */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Fish className="w-3.5 h-3.5 text-sky-600" />
            <span>Jenis Ikan</span>
          </label>
          <select
            value={selectedFish}
            onChange={(e) => onFishChange(e.target.value)}
            className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer font-medium"
          >
            <option value="">Semua Jenis Ikan</option>
            {FISH_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Lokasi Produksi */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Lokasi Pendaratan</span>
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer font-medium"
          >
            <option value="">Semua Lokasi / TPI</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Tanggal */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tanggal Produksi</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer font-medium"
          />
        </div>
      </div>
    </div>
  );
}
