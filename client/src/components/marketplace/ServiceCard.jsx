import { Link } from 'react-router-dom';
import { money } from '../../lib/format';
export default function ServiceCard({ service }) {
 return <article className="neu-flat rounded-2xl p-5 space-y-2">
  {service.coverImage && <img className="h-40 w-full object-cover rounded-xl" src={service.coverImage} alt="" loading="lazy" />}
  <Link className="text-lg font-bold text-indigo-700" to={'/services/' + service.id}>{service.title}</Link>
  <p>{service.shortDesc}</p><p>By {service.freelancerName}</p>
  <p>From {money(service.startingPriceMinor)} &middot; {service.rating ?? 0}/5 ({service.reviewsCount ?? 0} reviews)</p>
 </article>;
}
