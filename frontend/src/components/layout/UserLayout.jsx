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
  ChevronDown,
  LogOut,
  ChevronRight,
  Compass,
  ArrowRight,
  Eye,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';

const USER_MENUS = [
  {
    name: 'Dashboard Publik',
    path: '/user/dashboard',
    icon: LayoutDashboard,
    description: 'Ringkasan & Cuaca Laut',
  },
  {
    name: 'Data Hasil Produksi',
    path: '/user/produksi',
    icon: Fish,
    description: 'Katalog Tangkapan (Read-Only)',
    badge: 'Read-Only',
  },
  {
    name: 'Statistik Perikanan',
    path: '/user/statistik',
    icon: TrendingUp,
    description: 'Tren & Rata-rata Harga Pasar',
  },
  {
    name: 'Laporan Publik',
    path: '/user/laporan',
    icon: BarChart3,
    description: 'Rekapitulasi Data & Unduh',
  },
];

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');

  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    addToast('Anda telah keluar dari Portal Publik.', 'info');
    navigate('/login', { replace: true });
  };

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('/dashboard')) return { title: 'Dashboard Publik Nelayan', trail: ['Publik', 'Dashboard'] };
    if (p.includes('/produksi/') && !p.includes('/produksi/tambah')) return { title: 'Detail Pendaratan Ikan', trail: ['Publik', 'Produksi', 'Detail'] };
    if (p.includes('/produksi')) return { title: 'Katalog Data Hasil Produksi (Read-Only)', trail: ['Publik', 'Data Produksi'] };
    if (p.includes('/statistik')) return { title: 'Statistik Publik Perikanan Sulut', trail: ['Publik', 'Statistik'] };
    if (p.includes('/laporan')) return { title: 'Laporan Publik Hasil Tangkapan', trail: ['Publik', 'Laporan'] };
    return { title: 'Portal Publik Perikanan Sulut', trail: ['Publik'] };
  };

  const { title, trail } = getPageTitle();

  const filteredMenus = useMemo(() => {
    if (!menuSearch.trim()) return USER_MENUS;
    const q = menuSearch.toLowerCase();
    return USER_MENUS.filter(
      (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    );
  }, [menuSearch]);

  const sidebarContent = (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 sm:h-20 px-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/25 shrink-0">
            <Compass className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg tracking-tight text-white">
                SIPROKAN
              </span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/40">
                PUBLIK
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold truncate max-w-[150px]">
              Portal Nelayan & Warga
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
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white/20">
            NL
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white truncate">{user.name}</p>
          <div className="flex items-center gap-1.5 text-xs text-teal-400 font-semibold mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Online • Pengguna Publik</span>
          </div>
        </div>
      </div>

      {/* AdminLTE-Style Sidebar Search Bar */}
      <div className="p-3 border-b border-slate-850 shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari menu publik..."
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
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
                    ? 'bg-teal-700 text-white shadow-md shadow-teal-700/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent
                    className={`w-5 h-5 transition-colors shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="leading-tight font-semibold text-sm">{item.name}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-400/20 text-teal-300 border border-teal-400/40">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-xs mt-0.5 truncate ${
                        isActive ? 'text-teal-100' : 'text-slate-400 group-hover:text-slate-300'
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

      {/* Link to view Admin Portal */}
      <div className="p-3 mx-3 mb-2 shrink-0">
        <button
          type="button"
          onClick={() => navigate('/admin/dashboard')}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-amber-400" />
            <span>Portal Admin DKP</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Sidebar Footer with Logout */}
      <div className="p-3 px-4 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="font-semibold text-slate-400 text-xs">Akses Publik Terbuka</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Keluar dari akun Publik"
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
          {/* User Navbar */}
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
                      <span className={idx === trail.length - 1 ? 'text-teal-700 font-bold' : ''}>
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
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-900">
                <Eye className="w-3.5 h-3.5 text-teal-600" />
                <span>Portal Publik (Read-Only)</span>
              </div>

              {/* Profile Dropdown with Logout */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-700 to-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-white">
                    NL
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{user.name}</p>
                    <p className="text-xs text-slate-500 leading-tight">Pengguna Publik</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-sm">
                    <div className="p-3 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
                        Akses Publik Terbuka
                      </span>
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/admin/dashboard');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 text-left cursor-pointer"
                      >
                        <Waves className="w-4 h-4 text-blue-600" />
                        <span>Beralih ke Portal Admin</span>
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
