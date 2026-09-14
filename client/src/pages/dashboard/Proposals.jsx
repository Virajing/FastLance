import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { useData, useAction, useFilters } from '../../hooks/useData';
import { proposals } from '../../services';
import Records from '../../components/ui/Records';
import { ErrorNotice } from '../../components/ui/DataState';
import Field from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import { money, toMinor, rupees, label } from '../../lib/format';
function Proposal({ item }) {
 const { user } = useAuth(), action = useAction(data => data.decision ? proposals.decide(item.id, data.decision) : proposals.update(item.id, data));
 return <article className="neu-flat p-5 rounded-xl space-y-3">
  <h2 className="font-bold">{item.job?.title || 'Deleted job'} &middot; {item.freelancer?.name}</h2><p>{item.coverLetter}</p><p>{money(item.amountMinor)} &middot; {item.deliveryDays} days ? {label(item.status)}</p>
  {item.order && <Link to={'/dashboard/projects/' + item.order}>View contract</Link>}
  {item.status === 'pending' && (user.activeRole === 'client' ? <div className="flex gap-3"><Button isLoading={action.isPending} onClick={() => action.mutate({ decision: 'accept' })}>Accept proposal</Button><Button disabled={action.isPending} onClick={() => action.mutate({ decision: 'reject' })}>Reject proposal</Button></div> : <>
   <details><summary>Edit proposal</summary><form className="space-y-3" onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); action.mutate({ coverLetter: form.get('coverLetter'), amountMinor: toMinor(form.get('amount')), deliveryDays: Number(form.get('deliveryDays')) }); }}>
    <Field label="Cover letter" name="coverLetter" multiline defaultValue={item.coverLetter} minLength={20} maxLength={5000} required />
    <Field label="Amount (INR)" name="amount" type="number" min="1" step="0.01" defaultValue={rupees(item.amountMinor)} required />
    <Field label="Delivery days" name="deliveryDays" type="number" min="1" max="365" defaultValue={item.deliveryDays} required />
    <Button type="submit" isLoading={action.isPending}>Save proposal</Button>
   </form></details><Button disabled={action.isPending} onClick={() => action.mutate({ action: 'withdraw' })}>Withdraw proposal</Button>
  </>)}<ErrorNotice error={action.error} />
 </article>;
}
export default function Proposals() {
 const { params, update } = useFilters(), query = useData(proposals.list(params)), { user } = useAuth();
 return <section className="space-y-5"><h1 className="text-2xl font-bold">{user.activeRole === 'client' ? 'Received proposals' : 'My proposals'}</h1><Records query={query} page={params.page || 1} onPage={page => update('page', page)}>{item => <Proposal key={item.id + item.updatedAt} item={item} />}</Records></section>;
}
