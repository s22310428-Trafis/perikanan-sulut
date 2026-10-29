import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const CURRENT_YEAR = new Date().getFullYear();

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Sidebar: Desktop natural flex item, mobile drawer overlay */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area: Fills remaining width cleanly */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Page Body with proper padding & breathing room */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="py-5 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 mt-auto">
          <p>
            © {CURRENT_YEAR} Dinas Kelautan dan Perikanan Provinsi Sulawesi Utara.
            Sistem Informasi Hasil Produksi Perikanan Berbasis Web.
          </p>
        </footer>
      </div>
    </div>
  );
}
