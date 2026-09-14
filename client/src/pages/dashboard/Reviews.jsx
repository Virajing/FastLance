import { useAuth } from '../../context/auth';
import { useData, useFilters } from '../../hooks/useData';
import { marketplace } from '../../services';
import Records from '../../components/ui/Records';
export default function Reviews() {
 const { user } = useAuth(), { params, update } = useFilters(), query = useData(marketplace.reviews({ ...params, freelancerId: user.id }));
 return <section className="space-y-5"><h1 className="text-2xl font-bold">Verified reviews</h1><Records query={query} page={params.page || 1} onPage={page => update('page', page)}>{item => <blockquote key={item.id} className="neu-flat rounded-xl p-5">{item.comment} &middot; {item.rating}/5 ? {item.clientName || 'Former client'}</blockquote>}</Records></section>;
}
