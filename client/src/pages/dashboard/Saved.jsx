import { Link } from 'react-router-dom';
import { useData, useAction, useFilters } from '../../hooks/useData';
import { favorites } from '../../services';
import Records from '../../components/ui/Records';
import { ErrorNotice } from '../../components/ui/DataState';
import Button from '../../components/ui/Button';
export default function Saved() {
 const { params, update } = useFilters(), query = useData(favorites.list(params)), action = useAction(favorites.remove);
 return <section className="space-y-5"><h1 className="text-2xl font-bold">Saved items</h1><ErrorNotice error={action.error} /><Records query={query} page={params.page || 1} onPage={page => update('page', page)}>{item => <article key={item.id} className="neu-flat p-5 rounded-xl flex gap-4">{item.item ? <Link to={'/' + (item.kind === 'service' ? 'services' : 'freelancers') + '/' + item.target}>{item.item.title || item.item.name}</Link> : <p>This item is no longer available.</p>}<Button disabled={action.isPending} onClick={() => action.mutate(item.id)}>Remove</Button></article>}</Records></section>;
}
