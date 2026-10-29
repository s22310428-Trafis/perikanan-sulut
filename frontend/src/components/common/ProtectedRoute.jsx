import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Arahkan ke dashboard sesuai role yang sedang aktif
    const targetPath = role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    return <Navigate to={targetPath} replace />;
  }

  return children;
}
