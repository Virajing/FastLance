import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './auth';
import { SocketContext } from './socket';
import { refreshSession, acceptSession, SOCKET_BASE } from '../lib/api';
export function SocketProvider({ children }) {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [connection, setConnection] = useState({ status: 'offline', socket: null, userId: null, error: null });
  const userId = user?.id;
  useEffect(() => {
    if (!token || !userId) return;
    let active = true;
    const socket = io(SOCKET_BASE, { auth: { token }, withCredentials: true, reconnection: true });
    const refresh = async () => {
      try { await refreshSession(); }
      catch (error) { if (active) setConnection({ status: 'error', socket: null, userId, error: error.message }); }
    };
    socket.on('connect', () => {
      setConnection({ status: 'online', socket, userId, error: null });
      queryClient.invalidateQueries({ queryKey: ['api'] });
    });
    socket.on('disconnect', () => { if (active) setConnection({ status: 'offline', socket: null, userId, error: null }); });
    socket.on('connect_error', error => {
      if (error.data?.code === 'AUTH_EXPIRED') refresh();
      else if (active) setConnection({ status: 'error', socket: null, userId, error: 'Messaging connection failed. Reconnecting…' });
    });
    socket.on('auth:expired', refresh);
    socket.on('auth:revoked', () => { queryClient.clear(); acceptSession(null); });
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['api'] });
    for (const event of ['conversation:updated', 'notification:new', 'notification:updated', 'dashboard:updated', 'presence:updated']) socket.on(event, invalidate);
    socket.on('socket:error', error => { if (active) setConnection(previous => ({ ...previous, error: error.message })); });
    return () => { active = false; socket.disconnect(); };
  }, [token, userId, queryClient]);
  const value = connection.userId === userId ? connection : { socket: null, status: 'offline', error: null };
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
