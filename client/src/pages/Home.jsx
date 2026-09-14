import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import DataState from '../components/ui/DataState';
import Records from '../components/ui/Records';
import ServiceCard from '../components/marketplace/ServiceCard';
import FreelancerCard from '../components/marketplace/FreelancerCard';
export default function Home() {
 const categories = useData('/categories'), services = useData('/services?sort=rating&limit=6');
 const freelancers = useData('/freelancers?sort=rating&limit=6'), reviews = useData('/reviews?limit=6');
 return <main className="max-w-7xl mx-auto p-6 space-y-10">
  <section className="py-12 space-y-5"><h1 className="text-4xl font-black">Find the right talent for your next project.</h1>
   <p>Discover creative and technical services, agree on milestones, and collaborate through FastLance.</p>
   <Link className="text-indigo-700 underline" to="/services">Explore services</Link></section>
  <section className="space-y-4"><h2 className="text-2xl font-bold">Categories</h2><DataState query={categories}>{data => <div className="flex flex-wrap gap-4">
   {data.categories.length ? data.categories.map(item => <Link className="neu-flat rounded-xl p-4" key={item.id} to={'/services?category=' + encodeURIComponent(item.slug)}>{item.name}</Link>) : <p>No categories yet.</p>}
  </div>}</DataState></section>
  <section className="space-y-4"><h2 className="text-2xl font-bold">Discover services</h2><Records query={services}>{item => <ServiceCard key={item.id} service={item} />}</Records></section>
  <section className="space-y-4"><h2 className="text-2xl font-bold">Meet freelancers</h2><Records query={freelancers}>{item => <FreelancerCard key={item.id} freelancer={item} />}</Records></section>
  <section className="space-y-4"><h2 className="text-2xl font-bold">Verified client reviews</h2><Records query={reviews}>{item => <blockquote key={item.id} className="neu-flat rounded-xl p-4"><p>{item.comment}</p><footer>{item.clientName || 'Former client'} &middot; {item.rating}/5</footer></blockquote>}</Records></section>
 </main>;
}
