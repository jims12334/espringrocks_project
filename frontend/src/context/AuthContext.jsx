import React, { createContext, useContext, useState, useCallback } from 'react';
import { API_BASE } from '../utils/api';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('access_token') || null);
  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  /**
   * apiFetch — drop-in replacement for fetch() that:
   *  1. Automatically attaches the Authorization header.
   *  2. On 401, attempts a silent token refresh.
   *  3. Retries the original request with the new token.
   *  4. Logs out the user if the refresh also fails.
   */
  const apiFetch = useCallback(async (url, options = {}) => {
    const accessToken = localStorage.getItem('access_token');

    const buildHeaders = (tkn) => ({
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(tkn ? { Authorization: `Bearer ${tkn}` } : {}),
    });

    // First attempt
    let response = await fetch(url, { ...options, headers: buildHeaders(accessToken) });

    // If 401, try refreshing the token once
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        logout();
        return response;
      }

      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!refreshRes.ok) {
          // Refresh failed — session is truly expired
          logout();
          return response;
        }

        const refreshData = await refreshRes.json();
        const newAccess = refreshData.access;

        // Persist the new token
        localStorage.setItem('access_token', newAccess);
        if (refreshData.refresh) {
          localStorage.setItem('refresh_token', refreshData.refresh);
        }
        setToken(newAccess);

        // Retry original request with fresh token
        response = await fetch(url, { ...options, headers: buildHeaders(newAccess) });

        // If still 401 after refresh, force logout
        if (response.status === 401) {
          logout();
        }
      } catch {
        logout();
      }
    }

    return response;
  }, [logout]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Invalid username or password.');
      }

      const data = await response.json();
      const userData = {
        id: data.user?.id,
        username: data.user?.username,
        full_name: data.user?.full_name,
        role: data.user?.role || 'Employee',
        email: data.user?.email,
      };

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(data.access);
      setUser(userData);

      return userData;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};