import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/auth';

export function useData(path, options = {}) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['api', user?.id ?? 'public', user?.activeRole ?? 'public', path],
    queryFn: ({ signal }) => api.get(path, signal),
    enabled: Boolean(path), staleTime: 30000, retry: false, ...options,
  });
}
export function useAction(action) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: action,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api'] }),
  });
}
export function useFilters() {
  const [params, setParams] = useSearchParams();
  const update = (key, value) => {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      if (value === '' || value === undefined) next.delete(key); else next.set(key, String(value));
      if (key !== 'page') next.delete('page');
      return next;
    });
  };
  return { params: Object.fromEntries(params), update, reset: () => setParams({}) };
}
export function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
