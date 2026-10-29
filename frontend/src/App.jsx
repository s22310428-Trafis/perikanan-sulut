import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';

// Public & Auth Pages
import LoginPage from './pages/Login';

// Dedicated Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProduction from './pages/admin/AdminProduction';
import AdminAddProduction from './pages/admin/AdminAddProduction';
import AdminEditProduction from './pages/admin/AdminEditProduction';
import AdminProductionDetail from './pages/admin/AdminProductionDetail';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminReports from './pages/admin/AdminReports';

// Dedicated User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserProduction from './pages/user/UserProduction';
import UserProductionDetail from './pages/user/UserProductionDetail';
import UserStatistics from './pages/user/UserStatistics';
import UserReports from './pages/user/UserReports';

function RootRedirect() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
}

function LegacyRedirect({ toAdmin, toUser }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={role === 'admin' ? toAdmin : toUser} replace />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Halaman Login Mandiri */}
            <Route path="/login" element={<LoginPage />} />

            {/* Root Route: Redirect Cerdas berdasarkan Status & Peran */}
            <Route path="/" element={<RootRedirect />} />

            {/* ROUTE GROUP: PORTAL ADMINISTRATOR DKP (/admin/...) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="produksi" element={<AdminProduction />} />
              <Route path="produksi/tambah" element={<AdminAddProduction />} />
              <Route path="produksi/edit/:id" element={<AdminEditProduction />} />
              <Route path="produksi/:id" element={<AdminProductionDetail />} />
              <Route path="statistik" element={<AdminStatistics />} />
              <Route path="laporan" element={<AdminReports />} />
            </Route>

            {/* ROUTE GROUP: PORTAL PENGGUNA PUBLIK & NELAYAN (/user/...) */}
            <Route
              path="/user"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/user/dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="produksi" element={<UserProduction />} />
              <Route path="produksi/:id" element={<UserProductionDetail />} />
              <Route path="statistik" element={<UserStatistics />} />
              <Route path="laporan" element={<UserReports />} />
            </Route>

            {/* Redirect Rute Lama agar Kompatibel */}
            <Route
              path="/produksi"
              element={<LegacyRedirect toAdmin="/admin/produksi" toUser="/user/produksi" />}
            />
            <Route
              path="/statistik"
              element={<LegacyRedirect toAdmin="/admin/statistik" toUser="/user/statistik" />}
            />
            <Route
              path="/laporan"
              element={<LegacyRedirect toAdmin="/admin/laporan" toUser="/user/laporan" />}
            />

            {/* Fallback 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
