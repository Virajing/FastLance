import { Link } from 'react-router-dom';
import { useData, useAction, useFilters } from '../../hooks/useData';
import { notifications } from '../../services';
import Records from '../../components/ui/Records';
import { ErrorNotice } from '../../components/ui/DataState';
import Button from '../../components/ui/Button';
import { dateTime } from '../../lib/format';
export default function Notifications() {
 const { params, update } = useFilters(), query = useData(notifications.list(params), { select: result => ({ ...result, data: result.data.notifications }) });
 const action = useAction(id => id ? notifications.read(id) : notifications.readAll());
 return <section className="space-y-5"><h1 className="text-2xl font-bold">Notifications</h1><Button isLoading={action.isPending} onClick={() => action.mutate()}>Mark all read</Button><ErrorNotice error={action.error} />
  <Records query={query} page={params.page || 1} onPage={page => update('page', page)}>{item => <article key={item.id} className="neu-flat p-5 rounded-xl space-y-2"><h2 className="font-bold">{item.title}</h2><p>{item.message}</p><p>{dateTime(item.createdAt)} &middot; {item.read ? 'Read' : 'Unread'}</p>{item.link && <Link to={item.link}>View</Link>}{!item.read && <Button disabled={action.isPending} onClick={() => action.mutate(item.id)}>Mark read</Button>}</article>}</Records>
 </section>;
}
