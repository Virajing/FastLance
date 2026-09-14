import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/auth';
import { useData, useAction, useFilters } from '../../hooks/useData';
import { orders } from '../../services';
import { payForOrder } from '../../services/payments';
import DataState, { ErrorNotice } from '../../components/ui/DataState';
import Records from '../../components/ui/Records';
import Field from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload';
import AttachmentLinks from '../../components/ui/AttachmentLinks';
import { money, label, dateTime } from '../../lib/format';
function Contract({ data }) {
 const { order, deliveries, review } = data, { user } = useAuth();
 const capabilities = useData('/capabilities'), [attachments, setAttachments] = useState([]), [paymentMessage, setPaymentMessage] = useState('');
 const action = useAction(body => orders.transition(order.id, body));
 const reviewAction = useAction(form => orders.review(order.id, { rating: Number(form.get('rating')), comment: form.get('comment') }));
 const payment = useAction(async () => {
  setPaymentMessage(''); const result = await payForOrder(order.id, user);
  setPaymentMessage(result.data.order?.paymentStatus === 'paid' || result.data.payment?.status === 'paid' ? 'Payment verified by the server.' : 'Checkout received. Awaiting confirmed payment status.');
 });
 const client = user.activeRole === 'client' && order.client.id === user.id, freelancer = user.activeRole === 'freelancer' && order.freelancer.id === user.id;
 return <div className="space-y-5">
  <h2 className="text-xl font-bold">{order.title}</h2><p>{order.client.name} &middot; {order.freelancer.name}</p><p>{label(order.status)} &middot; Payment: {label(order.paymentStatus)} &middot; {money(order.totalAmountMinor)}</p>
  <p>Platform commission: {money(order.platformFeeMinor)} ? Freelancer payable: {money(order.freelancerAmountMinor)}</p><p className="whitespace-pre-wrap">{order.requirements}</p>
  {freelancer && order.status === 'pending' && <div className="flex gap-3"><Button disabled={action.isPending} onClick={() => action.mutate({ action: 'accepted' })}>Accept contract</Button><Button disabled={action.isPending} onClick={() => action.mutate({ action: 'rejected' })}>Reject contract</Button></div>}
  {client && order.status === 'awaiting_payment' && <DataState query={capabilities}>{config => <div className="space-y-3"><Button disabled={!config.payments} isLoading={payment.isPending} onClick={() => payment.mutate()}>Pay with Razorpay</Button>{!config.payments && <p>{config.paymentMessage}</p>}</div>}</DataState>}
  <ErrorNotice error={payment.error} />{paymentMessage && <p role="status">{paymentMessage}</p>}
  <h3 className="font-bold">Milestones</h3>{order.milestones.map(milestone => <article key={(milestone.id || milestone._id)} className="neu-flat rounded-xl p-4 space-y-3">
   <p>{milestone.title} &middot; {money(milestone.amountMinor)} &middot; {label(milestone.status)}</p>
   {freelancer && order.paymentStatus === 'paid' && ['active','revision_requested','milestone_submitted','resolved'].includes(order.status) && ['pending','revision_requested'].includes(milestone.status) && <form className="space-y-3" onSubmit={event => { event.preventDefault(); action.mutate({ action: 'deliver', milestoneId: (milestone.id || milestone._id), notes: new FormData(event.currentTarget).get('notes'), attachments: attachments.map(item => item.id) }, { onSuccess: () => setAttachments([]) }); }}>
    <Field label="Delivery notes" name="notes" multiline required maxLength={5000} /><FileUpload scope="order" contextId={order.id} value={attachments} onChange={setAttachments} />
    <Button type="submit" isLoading={action.isPending}>{milestone.status === 'revision_requested' ? 'Resubmit work' : 'Submit milestone'}</Button>
   </form>}
   {client && milestone.status === 'submitted' && ['delivered','milestone_submitted','resolved'].includes(order.status) && <form className="space-y-3" onSubmit={event => { event.preventDefault(); action.mutate({ action: 'revision', milestoneId: (milestone.id || milestone._id), notes: new FormData(event.currentTarget).get('notes') }); }}>
    <Field label="Revision request" name="notes" multiline required maxLength={5000} /><Button type="submit" isLoading={action.isPending}>Request revision</Button>
    <Button disabled={action.isPending} onClick={() => action.mutate({ action: 'approve_milestone', milestoneId: (milestone.id || milestone._id) })}>Approve milestone</Button>
   </form>}
  </article>)}
  {client && ['delivered','resolved'].includes(order.status) && order.milestones.every(item => item.status === 'approved') && <Button disabled={action.isPending} onClick={() => action.mutate({ action: 'complete' })}>Complete contract</Button>}
  {(client || freelancer) && order.paymentStatus === 'paid' && ['active','milestone_submitted','delivered','revision_requested','resolved'].includes(order.status) && <details><summary>Open dispute</summary><form onSubmit={event => { event.preventDefault(); action.mutate({ action: 'dispute', notes: new FormData(event.currentTarget).get('notes') }); }}><Field label="Dispute details" name="notes" multiline required /><Button type="submit" isLoading={action.isPending}>Submit dispute</Button></form></details>}
  <ErrorNotice error={action.error} />
  <h3 className="font-bold">Delivery history</h3>{deliveries.length ? deliveries.map(item => <article key={item.id} className="neu-inset rounded-xl p-4"><p>{item.notes}</p><p>{dateTime(item.createdAt)}</p><AttachmentLinks ids={item.attachments} /></article>) : <p>No deliveries yet.</p>}
  {client && order.status === 'completed' && !review && <form className="space-y-3" onSubmit={event => { event.preventDefault(); reviewAction.mutate(new FormData(event.currentTarget)); }}><Field label="Rating" name="rating" options={[5,4,3,2,1].map(value => ({ value, label: value + ' stars' }))} /><Field label="Review" name="comment" multiline maxLength={2000} /><Button type="submit" isLoading={reviewAction.isPending}>Submit verified review</Button><ErrorNotice error={reviewAction.error} /></form>}
  {review && <p>Verified review: {review.rating}/5 ? {review.comment}</p>}
 </div>;
}
export default function Projects() {
 const { id } = useParams(), { params, update } = useFilters(), query = useData(id ? orders.detail(id) : orders.list(params));
 return <section className="space-y-5"><h1 className="text-2xl font-bold">{id ? 'Contract details' : 'Contracts'}</h1>
  {id ? <DataState query={query}>{data => <Contract key={id} data={data} />}</DataState> : <Records query={query} page={params.page || 1} onPage={page => update('page', page)}>{item => <Link key={item.id} className="block neu-flat rounded-xl p-5" to={'/dashboard/projects/' + item.id}>{item.title} &middot; {money(item.totalAmountMinor)} &middot; {label(item.status)}</Link>}</Records>}
 </section>;
}
