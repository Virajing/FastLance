import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '../hooks/useData';
import DataState from '../components/ui/DataState';
import Records from '../components/ui/Records';
import Button from '../components/ui/Button';
import HireModal from '../components/marketplace/HireModal';
import ContactActions from '../components/marketplace/ContactActions';
import { money } from '../lib/format';
export default function ServiceDetail() {
 const { id } = useParams(), query = useData('/services/' + id), reviews = useData('/reviews?serviceId=' + id);
 const [tier, setTier] = useState(null);
 return <main className="max-w-5xl mx-auto p-6 space-y-6"><DataState query={query}>{({ service }) => <>
  <h1 className="text-3xl font-bold">{service.title}</h1><Link to={'/freelancers/' + service.freelancerId}>{service.freelancerName}</Link>
  <p className="whitespace-pre-wrap">{service.description}</p><ContactActions kind="service" target={id} participantId={service.freelancerId} />
  <div className="grid md:grid-cols-3 gap-4">{Object.entries(service.packages).filter(([, pack]) => pack).map(([key, pack]) => <article key={key} className="neu-flat rounded-xl p-5 space-y-3">
   <h2 className="font-bold">{pack.name}</h2><p>{money(pack.priceMinor)}</p><p>{pack.deliveryDays} days ? {pack.revisions} revisions</p><p>{pack.description}</p>
   <ul>{pack.features.map(feature => <li key={feature}>{feature}</li>)}</ul><Button onClick={() => setTier(key)}>Choose {key}</Button>
  </article>)}</div>
  {tier && <HireModal key={id + tier} isOpen onClose={() => setTier(null)} service={service} tierKey={tier} packageData={service.packages[tier]} />}
 </>}</DataState><h2 className="text-xl font-bold">Verified reviews</h2><Records query={reviews}>{review => <blockquote key={review.id}>{review.comment} &middot; {review.rating}/5 ? {review.clientName || 'Former client'}</blockquote>}</Records></main>;
}
