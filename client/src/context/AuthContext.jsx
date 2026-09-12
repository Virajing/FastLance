import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAccessToken } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.post('/auth/refresh').then((r) => { setAccessToken(r.data.accessToken); return api.get('/auth/me'); }).then((r) => setUser(r.data.user)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const result = await api.post('/auth/login', { email, password });
    setAccessToken(result.data.accessToken);
    setUser(result.data.user);
    return result.data.user;
  };

  const register = async (data) => {
    const result = await api.post('/auth/register', data);
    setAccessToken(result.data.accessToken);
    setUser(result.data.user);
    return result.data.user;
  };

  const logout = async () => {
    await api.post('/auth/logout').catch(() => {});
    setAccessToken(null);
    setUser(null);
  };

  const switchRole = () => {};
  const updateProfile = async (updates) => {
    const result = await api.patch('/auth/me', updates);
    setUser(result.data.user);
    return result.data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchRole,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
