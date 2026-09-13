export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export const SOCKET_BASE = new URL(API_BASE, window.location.origin).origin;
let accessToken = null, refreshPromise;
const listeners = new Set();
export class ApiError extends Error {
  constructor(message, status, code) { super(message); this.status = status; this.code = code; }
}
export const getAccessToken = () => accessToken;
export const subscribeSession = listener => { listeners.add(listener); return () => listeners.delete(listener); };
export function acceptSession(data) {
  accessToken = data?.accessToken ?? null;
  listeners.forEach(listener => listener(data ?? null));
}
async function decode(response) {
  let json;
  try { json = await response.json(); }
  catch { throw new ApiError('The API returned an unreadable response. Check the server URL and retry.', response.status); }
  if (!response.ok) throw new ApiError(json.message || 'Request failed. Retry.', response.status, json.code);
  return json;
}
async function refreshRequest() {
  const response = await fetch(API_BASE + '/auth/refresh', { method: 'POST', credentials: 'include' });
  try {
    const result = await decode(response);
    acceptSession(result.data);
    return result.data;
  } catch (error) {
    if (error.status === 401 || error.status === 403) acceptSession(null);
    throw error;
  }
}
export function refreshSession() {
  if (!refreshPromise) {
    // Serialize cookie rotation across tabs, as well as requests within a tab.
    const operation = navigator.locks ? navigator.locks.request('fastlance-refresh', refreshRequest) : refreshRequest();
    refreshPromise = operation.finally(() => { refreshPromise = undefined; });
  }
  return refreshPromise;
}
async function request(path, options = {}, retried = false) {
  const headers = { ...options.headers };
  if (options.body && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = 'Bearer ' + accessToken;
  let response;
  try { response = await fetch(API_BASE + path, { ...options, headers, credentials: 'include' }); }
  catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Cannot reach FastLance. Check your connection and the API server, then retry.', 0);
  }
  if (response.status === 401 && !retried && !path.startsWith('/auth/')) {
    await refreshSession();
    return request(path, options, true);
  }
  if (options.binary) {
    if (!response.ok) return decode(response);
    return response.blob();
  }
  return decode(response);
}
export const api = {
  get: (path, signal) => request(path, { signal }),
  post: (path, data) => request(path, { method: 'POST', body: data instanceof FormData ? data : data === undefined ? undefined : JSON.stringify(data) }),
  patch: (path, data) => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: path => request(path, { method: 'DELETE' }),
  download: path => request(path, { binary: true }),
};
