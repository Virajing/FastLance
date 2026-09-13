import Button from './Button';
export default function Pagination({ pagination, onChange }) {
  if (!pagination || pagination.pages <= 1) return null;
  return <nav aria-label="Pagination" className="flex justify-center items-center gap-4 py-6">
    <Button disabled={pagination.page <= 1} onClick={() => onChange(pagination.page - 1)}>Previous</Button>
    <span className="text-sm">Page {pagination.page} of {pagination.pages} · {pagination.total} results</span>
    <Button disabled={pagination.page >= pagination.pages} onClick={() => onChange(pagination.page + 1)}>Next</Button>
  </nav>;
}
