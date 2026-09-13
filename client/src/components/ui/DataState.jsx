import Button from './Button';
export function ErrorNotice({ error, retry }) {
  if (!error) return null;
  return <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
    <p>{error.message || error}</p>
    {retry && <Button className="mt-3" onClick={retry}>Retry</Button>}
  </div>;
}
export default function DataState({ query, children }) {
  if (query.isPending) return <div role="status" className="neu-inset rounded-2xl p-10 text-center text-slate-500">Loading…</div>;
  if (query.isError) return <ErrorNotice error={query.error} retry={() => query.refetch()} />;
  return children(query.data.data, query.data.pagination);
}
