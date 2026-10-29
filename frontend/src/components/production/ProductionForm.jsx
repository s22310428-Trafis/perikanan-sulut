import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Fish,
  Calendar,
  MapPin,
  User,
  Calculator,
  Save,
  AlertCircle,
} from 'lucide-react';
import { FISH_TYPES, LOCATIONS } from '../../data/mockProduction';
import { formatRupiah } from '../../utils/currency';
import { formatKg, calculateTotalValue } from '../../utils/calculation';
import { getTodayDateString } from '../../utils/date';

export default function ProductionForm({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  formTitle = 'Form Data Produksi',
}) {
  const navigate = useNavigate();

  // Initialize form state
  const [formData, setFormData] = useState(() => {
    const isCustomFish = initialData?.fishType && !FISH_TYPES.includes(initialData.fishType);
    const isCustomLoc = initialData?.location && !LOCATIONS.includes(initialData.location);
    return {
      fishType: isCustomFish ? '__OTHER__' : initialData?.fishType || '',
      customFishType: isCustomFish ? initialData.fishType : '',
      quantity: initialData?.quantity ?? '',
      unit: initialData?.unit || 'Kg',
      pricePerKg: initialData?.pricePerKg ?? '',
      productionDate: initialData?.productionDate || getTodayDateString(),
      location: isCustomLoc ? '__OTHER__' : initialData?.location || '',
      customLocation: isCustomLoc ? initialData.location : '',
      fishermanName: initialData?.fishermanName || '',
      fishingGear: initialData?.fishingGear || 'Purse Seine (Pukat Cincin)',
      notes: initialData?.notes || '',
    };
  });

  const [errors, setErrors] = useState({});

  // Real-time calculation of Total Nilai
  const parsedQuantity = parseFloat(formData.quantity) || 0;
  const parsedPrice = parseFloat(formData.pricePerKg) || 0;
  const calculatedTotal = calculateTotalValue(parsedQuantity, parsedPrice);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    const resolvedFishType =
      formData.fishType === '__OTHER__' ? formData.customFishType : formData.fishType;
    if (!resolvedFishType || !resolvedFishType.trim()) {
      newErrors.fishType = 'Jenis ikan wajib dipilih atau diisi';
    }

    if (!formData.quantity || parsedQuantity <= 0) {
      newErrors.quantity = 'Jumlah produksi harus lebih dari 0';
    }

    if (!formData.pricePerKg || parsedPrice <= 0) {
      newErrors.pricePerKg = 'Harga per kilogram harus lebih dari 0';
    }

    if (!formData.productionDate) {
      newErrors.productionDate = 'Tanggal produksi wajib diisi';
    }

    const resolvedLocation =
      formData.location === '__OTHER__' ? formData.customLocation : formData.location;
    if (!resolvedLocation || !resolvedLocation.trim()) {
      newErrors.location = 'Lokasi pendaratan/TPI wajib dipilih atau diisi';
    }

    if (!formData.fishermanName || !formData.fishermanName.trim()) {
      newErrors.fishermanName = 'Nama nelayan atau kapal wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalFishType =
      formData.fishType === '__OTHER__' ? formData.customFishType.trim() : formData.fishType;
    const finalLocation =
      formData.location === '__OTHER__' ? formData.customLocation.trim() : formData.location;

    const payload = {
      ...formData,
      fishType: finalFishType,
      location: finalLocation,
      quantity: parsedQuantity,
      pricePerKg: parsedPrice,
      totalValue: calculatedTotal,
    };

    delete payload.customFishType;
    delete payload.customLocation;

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Real-time Calculation Highlight Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-sky-800 text-white rounded-2xl p-5 sm:p-6 shadow-md shadow-blue-900/10 border border-blue-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
              <Calculator className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-sky-200">
                Kalkulasi Otomatis Total Nilai
              </p>
              <p className="text-xs text-blue-100">
                Total dihitung otomatis: Jumlah Produksi × Harga per Kg
              </p>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-xl p-3 px-5 border border-white/10 text-right">
            <div className="text-xs text-sky-200 font-mono">
              {parsedQuantity > 0 && parsedPrice > 0 ? (
                <span>
                  {formatKg(parsedQuantity)} × {formatRupiah(parsedPrice)}
                </span>
              ) : (
                <span>0 Kg × Rp 0</span>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
              = {formatRupiah(calculatedTotal)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Fields Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-800">{formTitle}</h2>
          <p className="text-xs text-slate-500 mt-1">
            Lengkapi data pendaratan hasil tangkapan nelayan dengan teliti dan akurat.
          </p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* 1. Jenis Ikan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Fish className="w-4 h-4 text-sky-600" />
              Jenis Ikan <span className="text-rose-500">*</span>
            </label>
            <select
              name="fishType"
              value={formData.fishType}
              onChange={handleChange}
              className={`w-full py-2.5 px-3.5 rounded-xl border text-sm text-slate-800 bg-white transition-all ${
                errors.fishType
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            >
              <option value="">-- Pilih Jenis Ikan --</option>
              {FISH_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
              <option value="__OTHER__">+ Jenis Ikan Lainnya (Tulis Manual)</option>
            </select>
            {formData.fishType === '__OTHER__' && (
              <input
                type="text"
                name="customFishType"
                value={formData.customFishType}
                onChange={handleChange}
                placeholder="Tuliskan nama jenis ikan..."
                className="mt-2 w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            )}
            {errors.fishType && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.fishType}
              </p>
            )}
          </div>

          {/* 2. Tanggal Produksi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Tanggal Produksi / Pendaratan <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="productionDate"
              value={formData.productionDate}
              onChange={handleChange}
              className={`w-full py-2.5 px-3.5 rounded-xl border text-sm text-slate-800 bg-white transition-all ${
                errors.productionDate
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
            {errors.productionDate && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.productionDate}
              </p>
            )}
          </div>

          {/* 3. Jumlah Produksi & Satuan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>
                Jumlah Produksi <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Satuan: Kilogram</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Contoh: 150"
                min="0.1"
                step="any"
                className={`flex-1 py-2.5 px-3.5 rounded-xl border text-sm text-slate-800 bg-white transition-all ${
                  errors.quantity
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
                }`}
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-24 py-2.5 px-3 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-700 font-medium"
              >
                <option value="Kg">Kg</option>
                <option value="Ton">Ton</option>
              </select>
            </div>
            {errors.quantity && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.quantity}
              </p>
            )}
          </div>

          {/* 4. Harga per Kg */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>
                Harga per Kg (Rp) <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Rupiah</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                name="pricePerKg"
                value={formData.pricePerKg}
                onChange={handleChange}
                placeholder="Contoh: 30000"
                min="1"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 bg-white transition-all ${
                  errors.pricePerKg
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
                }`}
              />
            </div>
            {errors.pricePerKg && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.pricePerKg}
              </p>
            )}
          </div>

          {/* 5. Lokasi Produksi / TPI */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              Lokasi Produksi / Pendaratan <span className="text-rose-500">*</span>
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full py-2.5 px-3.5 rounded-xl border text-sm text-slate-800 bg-white transition-all ${
                errors.location
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            >
              <option value="">-- Pilih Lokasi / TPI Sulut --</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
              <option value="__OTHER__">+ Lokasi Lainnya (Tulis Manual)</option>
            </select>
            {formData.location === '__OTHER__' && (
              <input
                type="text"
                name="customLocation"
                value={formData.customLocation}
                onChange={handleChange}
                placeholder="Tuliskan nama pelabuhan / TPI..."
                className="mt-2 w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            )}
            {errors.location && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.location}
              </p>
            )}
          </div>

          {/* 6. Nama Nelayan / Kapal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-600" />
              Nama Nelayan / Kapal Penangkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="fishermanName"
              value={formData.fishermanName}
              onChange={handleChange}
              placeholder="Contoh: KM. Berkat Kasih (Capt. Max)"
              className={`w-full py-2.5 px-3.5 rounded-xl border text-sm text-slate-800 bg-white transition-all ${
                errors.fishermanName
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
            {errors.fishermanName && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.fishermanName}
              </p>
            )}
          </div>

          {/* 7. Alat Tangkap (Fishing Gear) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Metode / Alat Tangkap
            </label>
            <input
              type="text"
              name="fishingGear"
              value={formData.fishingGear}
              onChange={handleChange}
              placeholder="Contoh: Purse Seine, Handline, Gillnet..."
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* 8. Catatan Tambahan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Keterangan / Catatan Tambahan
            </label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Contoh: Kualitas grade ekspor, tangkapan Laut Maluku..."
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/produksi')}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-sm shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Produksi</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
