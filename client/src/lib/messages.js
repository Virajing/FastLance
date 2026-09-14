// Database sequence is authoritative. Pending messages follow saved messages.
export function mergeMessages(...groups) {
 const rows = new Map();
 for (const group of groups) for (const row of group) {
  const key = row.clientId || row.id;
  const previous = rows.get(key);
  if (!previous || Number.isSafeInteger(row.sequence) || !Number.isSafeInteger(previous.sequence)) rows.set(key, row);
 }
 return [...rows.values()].sort((a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity));
}
