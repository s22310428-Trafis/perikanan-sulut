import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  User,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  RefreshCw,
  Compass,
  Shield,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const { isAdmin, toggleRole, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs and title
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/') {
      return { title: 'Dashboard Utama', trail: ['Dashboard'] };
    }
    if (path === '/produksi') {
      return {
        title: isAdmin ? 'Pengelolaan Data Produksi (CRUD)' : 'Katalog Data Hasil Produksi',
        trail: ['Data Produksi'],
      };
    }
    if (path === '/produksi/tambah') {
      return {
        title: 'Tambah Data Produksi Baru',
        trail: ['Data Produksi', 'Tambah Produksi'],
      };
    }
    if (path.startsWith('/produksi/edit')) {
      return {
        title: 'Edit Data Produksi',
        trail: ['Data Produksi', 'Edit'],
      };
    }
    if (path.startsWith('/produksi/')) {
      return {
        title: 'Detail Hasil Tangkapan',
        trail: ['Data Produksi', 'Detail'],
      };
    }
    if (path === '/statistik') {
      return { title: 'Statistik Perikanan Sulut', trail: ['Statistik'] };
    }
    if (path === '/laporan') {
      return { title: 'Laporan & Analisis Produksi', trail: ['Laporan'] };
    }
    return { title: 'Sistem Informasi Perikanan', trail: ['Beranda'] };
  };

  const { title, trail } = getPageInfo();

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
      {/* Left side: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Toggle Mobile Sidebar */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Buka navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {/* Breadcrumb Trail */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-slate-400 font-medium"
          >
            <span className="hover:text-slate-600 transition-colors">SIPROKAN SULUT</span>
            {trail.map((item, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span
                  className={
                    index === trail.length - 1
                      ? 'text-blue-700 font-semibold'
                      : 'hover:text-slate-600'
                  }
                >
                  {item}
                </span>
              </React.Fragment>
            ))}
          </nav>
          {/* Active Page Title */}
          <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: Ocean Region Pill, Role Switcher, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Maritime Region Pill (hidden on very small screens) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50/80 border border-sky-200/80 text-xs font-semibold text-sky-800">
          <Compass className="w-3.5 h-3.5 text-sky-600" />
          <span>Sulut • WPPNRI 715 & 716</span>
        </div>

        {/* Role Switcher Pill */}
        <button
          type="button"
          onClick={toggleRole}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
            isAdmin
              ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
          }`}
          title="Klik untuk beralih mode antara Admin (CRUD) dan Pengguna (Read-Only)"
        >
          {isAdmin ? (
            <Shield className="w-3.5 h-3.5 text-amber-600" />
          ) : (
            <Eye className="w-3.5 h-3.5 text-teal-600" />
          )}
          <span>{isAdmin ? 'Mode: Admin' : 'Mode: User'}</span>
          <RefreshCw className="w-3 h-3 text-slate-400 ml-0.5" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Notifikasi sistem"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-slate-800">Notifikasi Sistem</h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                    2 Baru
                  </span>
                </div>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  onClick={() => setShowNotifications(false)}
                >
                  Tandai dibaca
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      Pendaratan Baru di PPS Bitung
                    </p>
                    <p className="text-slate-500 mt-0.5">
                      KM. Mina Bahari mencatat 850 Kg Ikan Tuna Sirip Kuning.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block">
                      Tersimpan di Cloud Firestore
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Koneksi REST API Aktif</p>
                    <p className="text-slate-500 mt-0.5">
                      Spring Boot port 8080 terhubung aman ke Cloud Firestore.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block">
                      Sistem Normal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Menu profil pengguna"
          >
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs ${
              isAdmin ? 'bg-gradient-to-tr from-blue-700 to-indigo-600' : 'bg-gradient-to-tr from-teal-700 to-emerald-600'
            }`}>
              {user.avatarInitials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{user.title}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="p-3 border-b border-slate-100 mb-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {isAdmin ? 'ADMINISTRATOR' : 'PENGGUNA PUBLIK'}
                  </span>
                </div>
                <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{user.department}</p>
              </div>

              <div className="space-y-0.5">
                {/* Switch Role Option */}
                <button
                  type="button"
                  onClick={() => {
                    toggleRole();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors text-left font-semibold cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span>
                    Beralih ke Mode {isAdmin ? 'Pengguna (Read-Only)' : 'Admin (CRUD)'}
                  </span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  type="button"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Informasi Hak Akses</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Panduan SIPROKAN</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
