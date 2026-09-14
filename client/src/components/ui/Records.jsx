import DataState from './DataState';
import Button from './Button';
export default function Records({ query, page = 1, onPage, children }) {
  return <DataState query={query}>{(rows, pagination) => <div className="space-y-4">
    {rows.length ? rows.map(children) : <p className="neu-inset rounded-xl p-6">No records yet.</p>}
    {onPage && <nav aria-label="Pagination" className="flex items-center gap-4">
      <Button disabled={Number(page) <= 1} onClick={() => onPage(Number(page) - 1)}>Previous</Button>
      <span>Page {page} · {pagination.total} records</span>
      <Button disabled={Number(page) >= pagination.pages} onClick={() => onPage(Number(page) + 1)}>Next</Button>
    </nav>}
  </div>}</DataState>;
}
