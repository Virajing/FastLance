import { Link } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import DataState from '../../components/ui/DataState';
import { money } from '../../lib/format';
export default function DashboardOverview() {
 const query = useData('/dashboard');
 return <DataState query={query}>{data => <section className="space-y-6">
  <h1 className="text-3xl font-bold">{data.role === 'freelancer' ? 'Freelancer overview' : 'Client overview'}</h1>
  <dl className="grid sm:grid-cols-3 gap-4">{[
   ['Active contracts', data.activeContracts], ['Pending offers', data.pendingOffers], ['Pending proposals', data.proposals],
   ['Unread messages', data.unreadMessages], ['Unread notifications', data.unreadNotifications],
   ...(data.role === 'client' ? [['Total spent', money(data.totalSpentMinor)], ['Open job posts', data.jobs]] : [
    ['Earnings', money(data.earningsMinor)], ['Pending payable', money(data.pendingMinor)], ['Available payable', money(data.availableMinor)],
    ['Held', money(data.heldMinor)], ['Paid out', money(data.paidOutMinor)], ['Services', data.services], ['Rating', data.rating === null ? 'No reviews yet' : data.rating.toFixed(1)], ['Reviews', data.reviewCount],
   ]),
  ].map(([title, value]) => <div key={title} className="neu-flat rounded-xl p-5"><dt>{title}</dt><dd className="text-2xl font-bold">{value}</dd></div>)}</dl>
  {data.role === 'freelancer' && <p>{data.capabilities.payoutMessage}</p>}
  <h2 className="text-xl font-bold">Recent contracts</h2>{data.recentOrders.length ? data.recentOrders.map(order => <Link className="block neu-flat rounded-xl p-4" key={order.id} to={'/dashboard/projects/' + order.id}>{order.title} &middot; {money(order.totalAmountMinor)}</Link>) : <p>No contracts yet.</p>}
  <h2 className="text-xl font-bold">Monthly {data.role === 'client' ? 'spending' : 'earnings'}</h2>
  {data.monthly.length ? <table className="w-full text-left"><thead><tr><th>Month</th><th>Amount</th></tr></thead><tbody>{data.monthly.map(row => <tr key={row._id}><td>{row._id}</td><td>{money(row.amountMinor)}</td></tr>)}</tbody></table> : <p>No recorded activity yet.</p>}
 </section>}</DataState>;
}
