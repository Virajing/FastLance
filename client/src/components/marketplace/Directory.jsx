import { useData, useFilters, useDebounced } from '../../hooks/useData';
import { marketplace } from '../../services';
import Field from '../ui/Field';
import { rupees, toMinor } from '../../lib/format';
import Button from '../ui/Button';
import DataState from '../ui/DataState';
import Records from '../ui/Records';
import ServiceCard from './ServiceCard';
import FreelancerCard from './FreelancerCard';
export default function Directory({ freelancers = false }) {
  const { params, update, reset } = useFilters(), search = useDebounced(params.q || '');
  const categories = useData('/categories');
  const query = useData((freelancers ? marketplace.freelancers : marketplace.services)({ ...params, q: search }));
  return <main className="max-w-7xl mx-auto p-6 space-y-6">
    <h1 className="text-3xl font-bold">{freelancers ? 'Find freelancers' : 'Explore services'}</h1>
    <div className="grid sm:grid-cols-3 gap-4">
      <Field label="Search" value={params.q || ''} onChange={event => update('q', event.target.value)} />
      <DataState query={categories}>{data => <Field label="Category" value={params.category || ''} onChange={event => update('category', event.target.value)}
        options={[{ value: '', label: 'All categories' }, ...data.categories.map(item => ({ value: item.slug, label: item.name }))]} />}</DataState>
      <Field label="Sort" value={params.sort || 'newest'} onChange={event => update('sort', event.target.value)} options={[
        { value: 'newest', label: 'Newest' }, { value: 'rating', label: 'Rating' }, { value: 'price', label: 'Price: low to high' }, { value: 'price_desc', label: 'Price: high to low' },
      ]} />
      <Field label="Minimum rating" type="number" min="0" max="5" step="0.5" value={params.minRating || ''} onChange={event => update('minRating', event.target.value)} />
      {freelancers && <Field label="Availability" value={params.availability || ''} onChange={event => update('availability', event.target.value)} options={[
        { value: '', label: 'Any availability' }, { value: 'available', label: 'Available' }, { value: 'part_time', label: 'Part time' }, { value: 'unavailable', label: 'Unavailable' },
      ]} />}
      <Field key={params.maxPrice || 'any-price'} label={freelancers ? 'Maximum hourly rate (INR)' : 'Maximum price (INR)'} type="number" min="0" step="0.01" defaultValue={rupees(params.maxPrice === undefined ? undefined : Number(params.maxPrice))} onBlur={event => { if (event.target.validity.valid) update('maxPrice', event.target.value ? toMinor(event.target.value) : ''); }} />
      <Button onClick={reset}>Clear filters</Button>
    </div>
    <Records query={query} page={params.page || 1} onPage={page => update('page', page)}>{item => freelancers
      ? <FreelancerCard key={item.id} freelancer={item} /> : <ServiceCard key={item.id} service={item} />}</Records>
  </main>;
}
