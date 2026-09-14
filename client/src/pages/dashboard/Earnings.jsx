import { useData, useFilters } from '../../hooks/useData';
import { dashboards } from '../../services';
import DataState from '../../components/ui/DataState';
import Records from '../../components/ui/Records';
import { money, label } from '../../lib/format';
export default function Earnings() {
 const { params, update } = useFilters(), query = useData(dashboards.earnings(params)), overview = useData('/dashboard'), payouts = useData(dashboards.payouts(params));
 return <section className="space-y-5"><h1 className="text-2xl font-bold">Earnings and payouts</h1><DataState query={overview}>{data => <div><p>Available payable: {money(data.availableMinor)} ? Pending: {money(data.pendingMinor)} ? Held: {money(data.heldMinor)} ? Paid out: {money(data.paidOutMinor)}</p><p>{data.capabilities.payoutMessage}</p></div>}</DataState><h2>Ledger</h2>
  <Records query={query} page={params.page || 1} onPage={page => update('page', page)}>{item => <article key={item.id} className="neu-flat p-5 rounded-xl">{item.order?.title || 'Contract'} &middot; Payable {money(item.payableMinor)} &middot; {label(item.status)}</article>}</Records>
  <h2>Payout records</h2><Records query={payouts}>{item => <p key={item.id}>{money(item.amountMinor)} &middot; {label(item.status)}</p>}</Records>
 </section>;
}
