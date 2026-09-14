import { Link } from 'react-router-dom';
import { money, label } from '../../lib/format';
export default function FreelancerCard({ freelancer }) {
 return <article className="neu-flat rounded-2xl p-5 space-y-2">
  <Link className="text-lg font-bold text-indigo-700" to={'/freelancers/' + freelancer.id}>{freelancer.name}</Link>
  <p>{freelancer.title}</p><p>{money(freelancer.hourlyRateMinor)} / hour ? {label(freelancer.availability)}</p>
  <p>{freelancer.rating ?? 0}/5 ({freelancer.reviewsCount ?? 0} reviews)</p>
  <p>{freelancer.skills?.join(', ')}</p>
 </article>;
}
