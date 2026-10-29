import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Fish,
  BarChart3,
  Waves,
  X,
  Anchor,
  TrendingUp,
  Shield,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export default function Sidebar({ isOpen, onClose }) {
  const { isAdmin, toggleRole } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      description: 'Ringkasan & Metrik Produksi',
      badge: null,
    },
    {
      name: 'Data Produksi',
      path: '/produksi',
      icon: Fish,
      description: isAdmin ? 'Pengelolaan Hasil Tangkapan' : 'Katalog Tangkapan Laut',
      badge: isAdmin ? 'CRUD' : 'Read-Only',
      badgeColor: isAdmin ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    },
    {
      name: 'Statistik',
      path: '/statistik',
      icon: TrendingUp,
      description: 'Tren & Sebaran Wilayah',
      badge: 'Baru',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    },
    {
      name: 'Laporan',
      path: '/laporan',
      icon: BarChart3,
      description: 'Analitik & Ekspor Dokumen',
      badge: null,
    },
  ];

  // Reusable Sidebar Inner Content
  const sidebarContent = (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 border-r border-slate-800 select-none">
      {/* Brand / Logo Header with Maritime Wave Accent */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/80 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-sky-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <Waves className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                SIPROKAN
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                SULUT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[160px] font-medium">
              Hasil Produksi Perikanan
            </p>
          </div>
        </div>

        {/* Close button for Mobile Drawer */}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Tutup menu sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Indicator Card */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className={`p-3 rounded-2xl border transition-all ${
          isAdmin
            ? 'bg-blue-950/40 border-blue-800/50 text-blue-200'
            : 'bg-teal-950/40 border-teal-800/50 text-teal-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <UserCheck className="w-4 h-4 text-teal-400 shrink-0" />
              )}
              <span className="text-xs font-bold tracking-tight text-white">
                {isAdmin ? 'Mode Administrator' : 'Mode Pengguna'}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleRole}
              title={`Beralih ke mode ${isAdmin ? 'Pengguna (Read-Only)' : 'Administrator'}`}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/15"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Ganti</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {isAdmin
              ? 'Akses CRUD penuh: Tambah, edit, & hapus data'
              : 'Akses publik: Hanya baca data tangkapan laut'}
          </p>
        </div>
      </div>

      {/* Section Label */}
      <div className="px-6 pt-3 pb-1 shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Navigasi Utama
        </p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-700 to-sky-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent
                    className={`w-4 h-4 transition-colors shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="leading-tight font-semibold text-xs">{item.name}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 truncate ${
                        isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <span className="w-1 h-5 rounded-full bg-white/90 absolute right-1.5" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Maritime Info Card */}
      <div className="p-3 mx-3 mb-3 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950/60 border border-slate-800/80 text-xs shrink-0">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
          <Anchor className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px]">Provinsi Sulawesi Utara</span>
        </div>
        <p className="text-slate-400 text-[10px] leading-relaxed">
          Sentra perikanan: Bitung, Manado, Sangihe, Talaud, Minsel & Minut.
        </p>
      </div>

      {/* Footer Sidebar */}
      <div className="p-3 px-5 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300 font-medium text-[11px]">Firestore Online</span>
        </div>
        <span className="text-[10px] text-slate-500">v2.0 Sulut</span>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Static Sidebar: Always in natural Flexbox flow */}
      <aside className="hidden lg:flex w-72 shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* 2. Mobile / Tablet Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside className="fixed inset-y-0 left-0 w-72 shadow-2xl transition-transform animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
