import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../hooks/useData';
import DataState from '../components/ui/DataState';
import Records from '../components/ui/Records';
import Button from '../components/ui/Button';
import AttachmentLinks from '../components/ui/AttachmentLinks';
import HireModal from '../components/marketplace/HireModal';
import ContactActions from '../components/marketplace/ContactActions';
import ServiceCard from '../components/marketplace/ServiceCard';
import { money, label } from '../lib/format';
export default function FreelancerProfile() {
 const { id } = useParams(), query = useData('/freelancers/' + id), services = useData('/services?freelancerId=' + id), reviews = useData('/reviews?freelancerId=' + id);
 const [offer, setOffer] = useState(false);
 return <main className="max-w-5xl mx-auto p-6 space-y-6"><DataState query={query}>{({ freelancer }) => <>
  <h1 className="text-3xl font-bold">{freelancer.name}</h1><h2>{freelancer.title}</h2><p>{freelancer.bio}</p>
  <p>{money(freelancer.hourlyRateMinor)} / hour ? {label(freelancer.availability)}</p>
  <p>{freelancer.completedProjects} completed contracts ? {freelancer.rating ?? 0}/5 ({freelancer.reviewsCount} reviews)</p>
  <p>{freelancer.skills.join(', ')}</p><p>{freelancer.serviceCategories.join(', ')}</p>
  <ContactActions kind="freelancer" target={id} participantId={id} /><Button onClick={() => setOffer(true)}>Offer a contract</Button>
  <h2 className="text-xl font-bold">Portfolio</h2>{freelancer.portfolio.length ? freelancer.portfolio.map(item => <article key={item.id || item._id} className="neu-flat rounded-xl p-4">
   <h3>{item.title}</h3><p>{item.description}</p>{item.image && <img src={item.image} alt={item.title} className="max-h-64" />}
   {item.url && <a href={item.url} target="_blank" rel="noreferrer">View project</a>}<AttachmentLinks ids={item.attachments} />
  </article>) : <p>No portfolio items yet.</p>}
  {offer && <HireModal key={id} isOpen onClose={() => setOffer(false)} freelancerId={id} />}
 </>}</DataState><h2 className="text-xl font-bold">Services</h2><Records query={services}>{item => <ServiceCard key={item.id || item._id} service={item} />}</Records>
 <h2 className="text-xl font-bold">Verified reviews</h2><Records query={reviews}>{item => <blockquote key={item.id || item._id}>{item.comment} &middot; {item.rating}/5 ? {item.clientName || 'Former client'}</blockquote>}</Records></main>;
}
