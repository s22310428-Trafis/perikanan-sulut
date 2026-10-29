import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { formatRupiah, formatCompactRupiah } from '../../utils/currency';
import { formatKg } from '../../utils/calculation';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-xl shadow-xl border border-slate-700 text-sm space-y-2 z-50">
        <p className="font-bold text-sky-300 border-b border-slate-700 pb-1.5">
          Periode: {label}
        </p>
        <div className="flex items-center justify-between gap-6">
          <span className="text-slate-300 font-medium">Volume Tangkapan:</span>
          <span className="font-bold text-white">{formatKg(data.produksiKg)}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-slate-300 font-medium">Estimasi Valuasi:</span>
          <span className="font-bold text-emerald-400">{formatRupiah(data.nilaiRupiah)}</span>
        </div>
        {data.kapalAktif && (
          <div className="flex items-center justify-between gap-6">
            <span className="text-slate-400">Armada Nelayan:</span>
            <span className="font-medium text-slate-200">{data.kapalAktif} Kapal</span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function ProductionChart({
  chartData,
  activePeriod,
  onPeriodChange,
}) {
  const [metricType, setMetricType] = useState('kg'); // 'kg' or 'rupiah'

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden">
      {/* Chart Header & Controls (AdminLTE Card Header Style) */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/50 to-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200 mt-0.5">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                Grafik Tren Hasil Produksi Perikanan
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Sulut
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Visualisasi kuantitas tangkapan laut dan estimasi nilai ekonomi lelang perikanan
            </p>
          </div>
        </div>

        {/* Controls: Metric Toggle & Period Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Metric Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs sm:text-sm font-semibold border border-slate-200/60">
            <button
              type="button"
              onClick={() => setMetricType('kg')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                metricType === 'kg'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Volume (Kg)
            </button>
            <button
              type="button"
              onClick={() => setMetricType('rupiah')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                metricType === 'rupiah'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Valuasi (Rp)
            </button>
          </div>

          {/* Period Filter Buttons */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs sm:text-sm font-semibold border border-slate-200/60">
            {[
              { id: 'harian', label: 'Harian' },
              { id: 'mingguan', label: 'Mingguan' },
              { id: 'bulanan', label: 'Bulanan' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPeriodChange(p.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activePeriod === p.id
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="p-5 sm:p-6 w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorRp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey={activePeriod === 'bulanan' ? 'month' : 'label'}
              stroke="#475569"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              stroke="#475569"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) =>
                metricType === 'kg' ? `${val / 1000} Ton` : formatCompactRupiah(val)
              }
            />
            <Tooltip content={<CustomTooltip />} />
            {metricType === 'kg' ? (
              <Area
                type="monotone"
                dataKey="produksiKg"
                name="Volume Produksi"
                stroke="#0284c7"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorKg)"
              />
            ) : (
              <Area
                type="monotone"
                dataKey="nilaiRupiah"
                name="Nilai Produksi"
                stroke="#059669"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRp)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Insight Bar */}
      <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>
            {metricType === 'kg'
              ? 'Tren volume tangkapan menunjukkan tren positif di WPPNRI 715 & 716'
              : 'Estimasi nilai perputaran uang di Tempat Pelelangan Ikan (TPI) Sulut'}
          </span>
        </div>
        <span className="font-semibold text-slate-800">Sinkronisasi Otomatis Firestore</span>
      </div>
    </div>
  );
}
