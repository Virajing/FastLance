import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, acceptSession, subscribeSession, refreshSession } from '../lib/api';
import { AuthContext } from './auth';
let restorePromise;
export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, token: null, loading: true, error: null });
  const queryClient = useQueryClient();
  const restore = useCallback(() => {
    if (!restorePromise) restorePromise = refreshSession().finally(() => { restorePromise = undefined; });
    return restorePromise;
  }, []);
  useEffect(() => {
    let mounted = true;
    const unsubscribe = subscribeSession(session => {
      if (mounted) setState({ user: session?.user ?? null, token: session?.accessToken ?? null, loading: false, error: null });
    });
    restore().catch(error => {
      if (mounted) setState({ user: null, token: null, loading: false, error: [401, 403].includes(error.status) ? null : error });
    });
    return () => { mounted = false; unsubscribe(); };
  }, [restore]);
  const authenticate = async (path, data) => {
    const result = await api.post(path, data);
    await queryClient.cancelQueries();
    queryClient.clear(); acceptSession(result.data);
    return result.data.user;
  };
  const updateProfile = async data => {
    const result = await api.patch('/auth/me', data);
    setState(previous => ({ ...previous, user: result.data.user }));
    await queryClient.invalidateQueries();
    return result.data.user;
  };
  const switchRole = async activeRole => {
    const result = await api.patch('/auth/role', { activeRole });
    await queryClient.cancelQueries(); queryClient.clear();
    setState(previous => ({ ...previous, user: result.data.user }));
    return result.data.user;
  };
  const onboard = async data => {
    const result = await api.post('/auth/onboard', data);
    await queryClient.cancelQueries(); queryClient.clear();
    setState(previous => ({ ...previous, user: result.data.user }));
    return result.data.user;
  };
  const logout = async () => {
    await api.post('/auth/logout');
    await queryClient.cancelQueries(); queryClient.clear(); acceptSession(null);
  };
  const changePassword = async data => {
    await api.patch('/auth/password', data);
    await queryClient.cancelQueries(); queryClient.clear(); acceptSession(null);
  };
  const retry = () => {
    setState(previous => ({ ...previous, loading: true, error: null }));
    restore().catch(error => setState({ user: null, token: null, loading: false, error: [401, 403].includes(error.status) ? null : error }));
  };
  return <AuthContext.Provider value={{ ...state, isAuthenticated: Boolean(state.user),
    login: (email, password) => authenticate('/auth/login', { email, password }),
    register: data => authenticate('/auth/register', data), logout, switchRole, updateProfile, onboard, changePassword, retry }}>
    {children}
  </AuthContext.Provider>;
}
