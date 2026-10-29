import React from 'react';

export function TableSkeleton({ rows = 5, cols = 8 }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200/80 flex items-center px-6 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded flex-1" />
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 px-6 flex items-center gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 bg-slate-100 rounded flex-1"
                style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-slate-200 rounded w-28" />
        <div className="w-10 h-10 bg-slate-100 rounded-xl" />
      </div>
      <div className="h-8 bg-slate-200 rounded w-40 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-24" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-pulse h-80 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-slate-200 rounded w-48" />
        <div className="h-8 bg-slate-100 rounded w-32" />
      </div>
      <div className="flex items-end justify-between gap-4 h-48 pt-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-slate-100 rounded-t"
            style={{ height: `${(i % 4 + 2) * 20}%` }}
          />
        ))}
      </div>
      <div className="h-3 bg-slate-100 rounded w-full" />
    </div>
  );
}
