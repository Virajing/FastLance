import { api, API_BASE } from '../lib/api';
const query = (path, params = {}) => {
  const values = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''));
  return values.size ? path + '?' + values : path;
};
export const marketplace = {
  categories: () => '/categories', capabilities: () => '/capabilities',
  services: params => query('/services', params), freelancers: params => query('/freelancers', params),
  service: id => '/services/' + id, freelancer: id => '/freelancers/' + id, reviews: params => query('/reviews', params),
  ownServices: params => query('/workspace/services', params),
  saveService: (id, data) => id ? api.patch('/services/' + id, data) : api.post('/services', data),
  deleteService: id => api.delete('/services/' + id),
};
export const jobs = {
  list: params => query('/jobs', params), detail: id => '/jobs/' + id,
  save: (id, data) => id ? api.patch('/jobs/' + id, data) : api.post('/jobs', data),
};
export const proposals = {
  list: params => query('/proposals', params), forJob: (id, params) => query('/jobs/' + id + '/proposals', params),
  create: (id, data) => api.post('/jobs/' + id + '/proposals', data),
  update: (id, data) => api.patch('/proposals/' + id, data),
  decide: (id, action) => api.post('/proposals/' + id + '/decision', { action }),
};
export const orders = {
  list: params => query('/orders', params), detail: id => '/orders/' + id,
  create: data => api.post('/orders', data), transition: (id, data) => api.patch('/orders/' + id + '/transition', data),
  review: (id, data) => api.post('/orders/' + id + '/review', data),
};
export const messaging = {
  list: params => query('/conversations', params), conversation: id => '/conversations/' + id,
  history: (id, params) => query('/conversations/' + id + '/messages', params),
  create: participantId => api.post('/conversations', { participantId }),
  send: (id, data) => api.post('/conversations/' + id + '/messages', data),
  read: (id, sequence) => api.post('/conversations/' + id + '/read', { sequence }),
  delivered: (id, sequence) => api.post('/conversations/' + id + '/delivered', { sequence }),
};
export const notifications = {
  list: params => query('/notifications', params), read: id => api.patch('/notifications/' + id + '/read', {}),
  readAll: () => api.patch('/notifications/read-all', {}),
};
export const dashboards = {
  overview: () => '/dashboard', earnings: params => query('/earnings', params), payouts: params => query('/payouts', params),
};
export const profile = {
  portfolio: data => api.post('/freelancers/me/portfolio', data),
  updatePortfolio: (id, data) => api.patch('/freelancers/me/portfolio/' + id, data),
  deletePortfolio: id => api.delete('/freelancers/me/portfolio/' + id),
};
export const favorites = {
  list: params => query('/favorites', params), save: (kind, target) => api.post('/favorites', { kind, target }),
  remove: id => api.delete('/favorites/' + id),
};
export const files = {
  async upload(file, scope, contextId) {
    const data = new FormData(); data.append('file', file); data.append('scope', scope);
    if (contextId) data.append('contextId', contextId);
    return api.post('/attachments', data);
  },
  url: id => API_BASE + '/attachments/' + id + '/download',
  async download(id, name) {
    const blob = await api.download('/attachments/' + id + '/download');
    const url = URL.createObjectURL(blob), anchor = document.createElement('a');
    anchor.href = url; anchor.download = name || 'attachment'; anchor.click();
    URL.revokeObjectURL(url);
  },
};
export const admin = {
  disputes: params => query('/admin/disputes', params), users: params => query('/admin/users', params),
  setStatus: (id, status) => api.patch('/admin/users/' + id + '/status', { status }),
  category: data => api.post('/admin/categories', data),
  refund: id => api.post('/orders/' + id + '/refund'),
};
