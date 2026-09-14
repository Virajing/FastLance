import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { useAction, useData } from '../../hooks/useData';
import DataState, { ErrorNotice } from '../../components/ui/DataState';
import Field from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import { toMinor } from '../../lib/format';

export default function Onboarding() {
  const { user, onboard } = useAuth(), navigate = useNavigate();
  const categories = useData('/categories');
  const action = useAction(async form => {
    await onboard({ professionalTitle: form.get('professionalTitle'), bio: form.get('bio'),
      skills: form.get('skills').split(',').map(skill => skill.trim()).filter(Boolean),
      serviceCategories: form.getAll('serviceCategories'), hourlyRateMinor: toMinor(form.get('hourlyRate')),
      availability: form.get('availability') });
    navigate('/dashboard', { replace: true });
  });
  if (user.roles.includes('freelancer')) return <Navigate to="/dashboard" replace />;
  return <section className="max-w-2xl space-y-5">
    <h1 className="text-2xl font-bold">Set up your freelancer workspace</h1>
    <p>Your account and identity stay the same when you switch workspaces.</p>
    <DataState query={categories}>{data => <form className="space-y-4" onSubmit={event => {
      event.preventDefault(); action.mutate(new FormData(event.currentTarget));
    }}>
      <Field label="Professional title" name="professionalTitle" minLength={3} maxLength={200} required />
      <Field label="Professional bio" name="bio" multiline minLength={30} maxLength={5000} required />
      <Field label="Skills, separated by commas" name="skills" required />
      <fieldset className="space-y-2"><legend>Service categories</legend>
        {data.categories.map(category => <label key={category.id} className="flex gap-2">
          <input type="checkbox" name="serviceCategories" value={category.slug} />{category.name}
        </label>)}
        {!data.categories.length && <p>No categories are configured. Contact the marketplace administrator.</p>}
      </fieldset>
      <Field label="Hourly rate (INR)" name="hourlyRate" type="number" min="1" step="0.01" required />
      <Field label="Availability" name="availability" options={[
        { value: 'available', label: 'Available' }, { value: 'part_time', label: 'Part time' },
        { value: 'unavailable', label: 'Unavailable' },
      ]} />
      <ErrorNotice error={action.error} />
      <Button type="submit" variant="primary" disabled={!data.categories.length} isLoading={action.isPending}>Complete onboarding</Button>
    </form>}</DataState>
  </section>;
}
