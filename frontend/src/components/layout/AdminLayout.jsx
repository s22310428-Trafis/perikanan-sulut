import React, { useState, useRef, useEffect, useMemo } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Fish,
  BarChart3,
  TrendingUp,
  Waves,
  X,
  Menu,
  Shield,
  Bell,
  CheckCircle2,
  ChevronDown,
  LogOut,
  ChevronRight,
  Compass,
  ArrowRight,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';

const ADMIN_MENUS = [
  {
    name: 'Dashboard Admin',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Ringkasan & Operasional',
  },
  {
    name: 'CRUD Produksi',
    path: '/admin/produksi',
    icon: Fish,
    description: 'Kelola Data Pendaratan (CRUD)',
    badge: 'CRUD',
  },
  {
    name: 'Statistik Kelautan',
    path: '/admin/statistik',
    icon: TrendingUp,
    description: 'Analisis Kuantitatif & Kuota',
  },
  {
    name: 'Laporan & Audit',
    path: '/admin/laporan',
    icon: BarChart3,
    description: 'Rekapitulasi & Ekspor Dokumen',
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');

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

  const handleLogout = () => {
    logout();
    addToast('Anda telah keluar dari Portal Administrator.', 'info');
    navigate('/login', { replace: true });
  };

  // Get Page Title for Navbar
  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('/dashboard')) return { title: 'Dashboard Administrator', trail: ['Admin', 'Dashboard'] };
    if (p.includes('/produksi/tambah')) return { title: 'Tambah Data Produksi (CRUD)', trail: ['Admin', 'Produksi', 'Tambah'] };
    if (p.includes('/produksi/edit')) return { title: 'Edit Data Produksi (CRUD)', trail: ['Admin', 'Produksi', 'Edit'] };
    if (p.includes('/produksi/') && !p.includes('/produksi/tambah')) return { title: 'Detail Data Produksi', trail: ['Admin', 'Produksi', 'Detail'] };
    if (p.includes('/produksi')) return { title: 'Pengelolaan Data Produksi (CRUD)', trail: ['Admin', 'Produksi'] };
    if (p.includes('/statistik')) return { title: 'Statistik Kelautan Sulut', trail: ['Admin', 'Statistik'] };
    if (p.includes('/laporan')) return { title: 'Laporan & Audit Produksi', trail: ['Admin', 'Laporan'] };
    return { title: 'Panel Administrator DKP', trail: ['Admin'] };
  };

  const { title, trail } = getPageTitle();

  const filteredMenus = useMemo(() => {
    if (!menuSearch.trim()) return ADMIN_MENUS;
    const q = menuSearch.toLowerCase();
    return ADMIN_MENUS.filter(
      (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    );
  }, [menuSearch]);

  const sidebarContent = (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 sm:h-20 px-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
            <Waves className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg tracking-tight text-white">
                SIPROKAN
              </span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold truncate max-w-[150px]">
              Dinas Kelautan Prov. Sulut
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* AdminLTE-Style User Profile Panel at Top of Sidebar */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/50 flex items-center gap-3.5 shrink-0">
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white/20">
            AD
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white truncate">{user.name}</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Online • Admin DKP</span>
          </div>
        </div>
      </div>

      {/* AdminLTE-Style Sidebar Search Bar */}
      <div className="p-3 border-b border-slate-850 shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari menu..."
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Section Header: NAVIGASI UTAMA */}
      <div className="px-5 pt-3 pb-1 shrink-0">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          NAVIGASI UTAMA
        </p>
      </div>

      {/* Navigation Links with AdminLTE-Style Visual Hierarchy */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        {filteredMenus.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent
                    className={`w-5 h-5 transition-colors shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="leading-tight font-semibold text-sm">{item.name}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-xs mt-0.5 truncate ${
                        isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-6 rounded-full bg-white absolute right-1.5" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Link to view User Portal */}
      <div className="p-3 mx-3 mb-2 shrink-0">
        <button
          type="button"
          onClick={() => navigate('/user/dashboard')}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Lihat Portal User</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Sidebar Footer with Logout */}
      <div className="p-3 px-4 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold text-slate-400 text-xs">Admin DKP Sulut</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Keluar dari akun Administrator"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-72 shrink-0 sticky top-0 h-screen z-30">
          {sidebarContent}
        </aside>

        {/* Mobile Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 w-72 shadow-2xl animate-in slide-in-from-left duration-200">
              {sidebarContent}
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Admin Navbar (AdminLTE Style) */}
          <header className="sticky top-0 z-20 h-16 sm:h-18 bg-white border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                aria-label="Buka navigasi sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 font-medium">
                  <span>SIPROKAN SULUT</span>
                  {trail.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      <span className={idx === trail.length - 1 ? 'text-blue-700 font-bold' : ''}>
                        {item}
                      </span>
                    </React.Fragment>
                  ))}
                </nav>
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  {title}
                </h1>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Panel Administrator</span>
              </div>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                  aria-label="Lihat notifikasi"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 text-xs sm:text-sm">
                    <h4 className="font-bold text-slate-900 pb-2 border-b border-slate-100">
                      Notifikasi Admin DKP
                    </h4>
                    <div className="space-y-2 mt-2">
                      <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900">Database Firestore Terkoneksi</p>
                          <p className="text-xs text-slate-600 mt-0.5">Kredensial aman & port 8080 aktif.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown with Logout */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-white">
                    AD
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{user.name}</p>
                    <p className="text-xs text-slate-500 leading-tight">Admin DKP Sulut</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-sm">
                    <div className="p-3 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/user/dashboard');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 text-left cursor-pointer"
                      >
                        <Compass className="w-4 h-4 text-cyan-600" />
                        <span>Pratinjau Portal User</span>
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-left font-bold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar (Logout)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
