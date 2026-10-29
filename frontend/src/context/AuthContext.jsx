import React, { useState, useMemo, useCallback } from 'react';
import { AuthContext } from './AuthContextInstance';
import { USER_PROFILES } from './userProfiles';

const ROLE_STORAGE_KEY = 'siprokan_sulut_active_role';
const AUTH_STORAGE_KEY = 'siprokan_sulut_is_authenticated';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      // Default ke true jika pertama kali dibuka, atau ikuti preferensi tersimpan
      return savedAuth !== null ? savedAuth === 'true' : true;
    } catch {
      return true;
    }
  });

  const [role, setRoleState] = useState(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      if (savedRole === 'admin' || savedRole === 'user') return savedRole;
    } catch {
      // Fallback
    }
    return 'admin'; // Default role
  });

  const login = useCallback((roleType) => {
    const selectedRole = roleType === 'user' ? 'user' : 'admin';
    setRoleState(selectedRole);
    setIsAuthenticated(true);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, selectedRole);
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } catch (err) {
      console.warn('Gagal menyimpan sesi login:', err);
    }
    return selectedRole;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, 'false');
    } catch (err) {
      console.warn('Gagal menghapus sesi login:', err);
    }
  }, []);

  const setRole = useCallback((newRole) => {
    if (newRole !== 'admin' && newRole !== 'user') return;
    setRoleState(newRole);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
    } catch (err) {
      console.warn('Gagal menyimpan role:', err);
    }
  }, []);

  const toggleRole = useCallback(() => {
    setRoleState((prev) => {
      const next = prev === 'admin' ? 'user' : 'admin';
      try {
        localStorage.setItem(ROLE_STORAGE_KEY, next);
      } catch (err) {
        console.warn('Gagal menyimpan role:', err);
      }
      return next;
    });
  }, []);

  const value = useMemo(() => {
    const profile = USER_PROFILES[role] || USER_PROFILES.admin;
    return {
      isAuthenticated,
      role,
      isAdmin: isAuthenticated && role === 'admin',
      isUser: isAuthenticated && role === 'user',
      user: profile,
      permissions: profile.permissions,
      login,
      logout,
      setRole,
      toggleRole,
    };
  }, [isAuthenticated, role, login, logout, setRole, toggleRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
