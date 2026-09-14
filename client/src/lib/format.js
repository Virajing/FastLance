export const money = value => Number.isSafeInteger(value) ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value / 100) : 'Price unavailable';
export const rupees = value => Number.isSafeInteger(value) ? (value / 100).toFixed(2) : '';
export function toMinor(value) {
  const match = String(value).trim().match(/^(\d{1,9})(?:\.(\d{1,2}))?$/);
  if (!match) throw new Error('Enter a valid rupee amount with at most two decimal places.');
  return Number(match[1]) * 100 + Number((match[2] || '').padEnd(2, '0'));
}
export const date = value => value ? new Date(value).toLocaleDateString('en-IN') : 'Not set';
export const dateTime = value => value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '';
export const label = value => (value || '').replaceAll('_', ' ');
