import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { useData, useAction, useFilters } from '../../hooks/useData';
import { jobs, proposals } from '../../services';
import DataState, { ErrorNotice } from '../../components/ui/DataState';
import Records from '../../components/ui/Records';
import Field from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import { money, toMinor, rupees, label } from '../../lib/format';
function JobForm({ job }) {
 const categories = useData('/categories'), navigate = useNavigate();
 const action = useAction(async form => {
  const values = Object.fromEntries(form);
  const result = await jobs.save(job?.id, { ...values, budgetMinor: toMinor(values.budget), skills: values.skills.split(',').map(x => x.trim()).filter(Boolean) });
  navigate('/dashboard/jobs/' + result.data.job.id);
 });
 return <DataState query={categories}>{data => <form className="space-y-3 neu-flat p-5 rounded-xl" onSubmit={event => { event.preventDefault(); action.mutate(new FormData(event.currentTarget)); }}>
  <Field label="Job title" name="title" defaultValue={job?.title} required minLength={3} maxLength={150} />
  <Field label="Description" name="description" multiline defaultValue={job?.description} required minLength={20} maxLength={10000} />
  <Field label="Category" name="category" defaultValue={job?.category} options={data.categories.map(x => ({ value: x.slug, label: x.name }))} required />
  <Field label="Skills, separated by commas" name="skills" defaultValue={job?.skills.join(', ')} />
  <Field label="Budget (INR)" name="budget" type="number" min="1" step="0.01" defaultValue={rupees(job?.budgetMinor)} required />
  <Field label="Budget type" name="budgetType" defaultValue={job?.budgetType} options={[{ value: 'fixed', label: 'Fixed' }, { value: 'hourly', label: 'Hourly' }]} />
  <Field label="Deadline" name="deadline" type="date" defaultValue={job?.deadline?.slice(0, 10)} required />
  <Field label="Status" name="status" defaultValue={job?.status || 'draft'} options={['draft','open','paused','closed'].map(value => ({ value, label: value === 'open' ? 'Published (open)' : label(value) }))} />
  <ErrorNotice error={action.error} /><Button type="submit" isLoading={action.isPending}>Save job</Button>
 </form>}</DataState>;
}
function ProposalForm({ jobId }) {
 const action = useAction(form => proposals.create(jobId, { coverLetter: form.get('coverLetter'), amountMinor: toMinor(form.get('amount')), deliveryDays: Number(form.get('deliveryDays')) }));
 return <form className="space-y-3" onSubmit={event => { event.preventDefault(); action.mutate(new FormData(event.currentTarget)); }}>
  <Field label="Cover letter" name="coverLetter" multiline minLength={20} maxLength={5000} required />
  <Field label="Proposed amount (INR)" name="amount" type="number" min="1" step="0.01" required />
  <Field label="Delivery days" name="deliveryDays" type="number" min="1" max="365" required />
  <ErrorNotice error={action.error} />{action.isSuccess ? <Link to="/dashboard/proposals">Proposal saved. View or edit your proposal.</Link> : <Button type="submit" isLoading={action.isPending}>Submit proposal</Button>}
 </form>;
}
export default function Jobs() {
 const { id } = useParams(), { user } = useAuth(), { params, update } = useFilters();
 const query = useData(id ? jobs.detail(id) : jobs.list(params));
 return <section className="space-y-5"><h1 className="text-2xl font-bold">{id ? 'Job details' : user.activeRole === 'client' ? 'My job posts' : 'Find jobs'}</h1>
  {id ? <DataState query={query}>{({ job }) => <div className="space-y-4"><h2>{job.title}</h2><p>{job.description}</p><p>{money(job.budgetMinor)} &middot; {label(job.status)}</p>
   {user.activeRole === 'client' && job.status !== 'closed' ? <JobForm key={job.id + job.updatedAt} job={job} /> : null}
   {user.activeRole === 'freelancer' && job.client.id !== user.id && job.status === 'open' && <ProposalForm jobId={id} />}
  </div>}</DataState> : <>
   {user.activeRole === 'client' && <details><summary className="cursor-pointer font-semibold">Create job</summary><JobForm /></details>}
   <Records query={query} page={params.page || 1} onPage={page => update('page', page)}>{job => <Link key={job.id} className="block neu-flat rounded-xl p-5" to={'/dashboard/jobs/' + job.id}>{job.title} &middot; {money(job.budgetMinor)} &middot; {label(job.status)}</Link>}</Records>
  </>}
 </section>;
}
