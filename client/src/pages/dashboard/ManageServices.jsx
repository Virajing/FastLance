import { useState } from 'react';
import { useData, useAction, useFilters } from '../../hooks/useData';
import { marketplace } from '../../services';
import DataState, { ErrorNotice } from '../../components/ui/DataState';
import Records from '../../components/ui/Records';
import Field from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import { toMinor, rupees, label } from '../../lib/format';
function ServiceEditor({ item, onSaved }) {
 const categories = useData('/categories'), pack = item?.packages?.basic;
 const action = useAction(async form => {
  const values = Object.fromEntries(form);
  await marketplace.saveService(item?.id, { title: values.title, description: values.description, category: values.category, status: values.status,
   packages: { ...item?.packages, basic: { name: values.packageName, priceMinor: toMinor(values.price), deliveryDays: Number(values.days), revisions: Number(values.revisions), description: values.packageDescription, features: [] } } });
  onSaved();
 });
 return <DataState query={categories}>{data => <form className="space-y-3" onSubmit={event => { event.preventDefault(); action.mutate(new FormData(event.currentTarget)); }}>
  <Field label="Service title" name="title" defaultValue={item?.title} required minLength={3} maxLength={150} />
  <Field label="Description" name="description" multiline defaultValue={item?.description} minLength={20} maxLength={10000} required />
  <Field label="Category" name="category" defaultValue={item?.category} options={data.categories.map(x => ({ value: x.slug, label: x.name }))} required />
  <Field label="Basic package name" name="packageName" defaultValue={pack?.name} minLength={2} required />
  <Field label="Package description" name="packageDescription" defaultValue={pack?.description} multiline maxLength={2000} />
  <Field label="Price (INR)" name="price" type="number" min="1" step="0.01" defaultValue={rupees(pack?.priceMinor)} required />
  <Field label="Delivery days" name="days" type="number" min="1" max="365" defaultValue={pack?.deliveryDays} required />
  <Field label="Revisions" name="revisions" type="number" min="0" max="100" defaultValue={pack?.revisions ?? 1} required />
  <Field label="Publication status" name="status" defaultValue={item?.status || 'draft'} options={['draft','published','unpublished'].map(value => ({ value, label: label(value) }))} />
  <ErrorNotice error={action.error} /><Button type="submit" isLoading={action.isPending}>Save service</Button><Button onClick={onSaved}>Close editor</Button>
 </form>}</DataState>;
}
export default function ManageServices() {
 const { params, update } = useFilters(), query = useData(marketplace.ownServices(params)), [editing, setEditing] = useState(null);
 const action = useAction(marketplace.deleteService);
 return <section className="space-y-5"><h1 className="text-2xl font-bold">My services</h1><Button onClick={() => setEditing({})}>Create service</Button>
  {editing && <ServiceEditor key={editing.id || 'new'} item={editing} onSaved={() => setEditing(null)} />}<ErrorNotice error={action.error} />
  <Records query={query} page={params.page || 1} onPage={page => update('page', page)}>{item => <article key={item.id} className="neu-flat rounded-xl p-5 space-x-3"><span>{item.title} &middot; {label(item.status)}</span><Button onClick={() => setEditing(item)}>Edit service</Button><Button disabled={action.isPending} onClick={() => action.mutate(item.id)}>Delete service</Button></article>}</Records>
 </section>;
}
