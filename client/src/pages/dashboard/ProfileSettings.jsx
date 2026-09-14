import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import { useAction, useData } from '../../hooks/useData';
import DataState, { ErrorNotice } from '../../components/ui/DataState';
import Field from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import { toMinor, rupees } from '../../lib/format';
import { files } from '../../services';
function ProfileForm({ user }) {
 const { updateProfile, changePassword } = useAuth(), navigate = useNavigate(), categories = useData('/categories'), capabilities = useData('/capabilities');
 const save = useAction(form => { const data = Object.fromEntries(form); if (user.activeRole === 'freelancer') { data.hourlyRateMinor = toMinor(data.rate); data.skills = data.skills.split(',').map(x => x.trim()).filter(Boolean); data.serviceCategories = form.getAll('serviceCategories'); } return updateProfile(data); });
 const password = useAction(async form => { await changePassword(Object.fromEntries(form)); navigate('/login', { replace: true }); });
 const avatar = useAction(async file => { const result = await files.upload(file, 'avatar'); await updateProfile({ avatar: files.url(result.data.attachment.id) }); });
 return <div className="space-y-6"><form className="space-y-3" onSubmit={event => { event.preventDefault(); save.mutate(new FormData(event.currentTarget)); }}>
  <Field label="Name" name="name" defaultValue={user.name} minLength={2} maxLength={100} required />
  <Field label="Bio" name="bio" multiline defaultValue={user.bio} maxLength={5000} />
  <Field label="Location" name="location" defaultValue={user.location} maxLength={150} />
  <Field label="Website" name="website" type="url" defaultValue={user.website} />
  {user.activeRole === 'freelancer' ? <><Field label="Professional title" name="professionalTitle" defaultValue={user.professionalTitle} maxLength={200} />
   <Field label="Skills, separated by commas" name="skills" defaultValue={user.skills.join(', ')} />
   <DataState query={categories}>{data => <fieldset><legend>Service categories</legend>{data.categories.map(item => <label key={item.id} className="flex gap-2"><input type="checkbox" name="serviceCategories" value={item.slug} defaultChecked={user.serviceCategories.includes(item.slug)} />{item.name}</label>)}</fieldset>}</DataState>
   <Field label="Hourly rate (INR)" name="rate" type="number" min="0" step="0.01" defaultValue={rupees(user.hourlyRateMinor)} required />
   <Field label="Availability" name="availability" defaultValue={user.availability} options={[{ value: 'available', label: 'Available' }, { value: 'part_time', label: 'Part time' }, { value: 'unavailable', label: 'Unavailable' }]} />
  </> : <Field label="Company" name="company" defaultValue={user.company} maxLength={150} />}
  <ErrorNotice error={save.error} />{save.isSuccess && <p role="status">Profile saved.</p>}<Button type="submit" isLoading={save.isPending}>Save profile</Button>
 </form><DataState query={capabilities}>{config => <div><label>Upload avatar<input aria-label="Upload avatar" type="file" accept=".png,.jpg,.jpeg,.webp" disabled={!config.storage || avatar.isPending} onChange={event => { if (event.target.files?.[0]) avatar.mutate(event.target.files[0]); event.target.value = ''; }} /></label>{!config.storage && <p>{config.storageMessage}</p>}<ErrorNotice error={avatar.error} /></div>}</DataState>
 <form className="space-y-3" onSubmit={event => { event.preventDefault(); password.mutate(new FormData(event.currentTarget)); }}><h2 className="font-bold">Change password</h2><Field label="Current password" name="currentPassword" type="password" autoComplete="current-password" required /><Field label="New password (at least 10 characters)" name="newPassword" type="password" autoComplete="new-password" minLength={10} maxLength={72} required /><ErrorNotice error={password.error} /><Button type="submit" isLoading={password.isPending}>Change password and sign out</Button></form></div>;
}
export default function ProfileSettings() {
 const { user } = useAuth();
 return <section className="max-w-2xl space-y-5"><h1 className="text-2xl font-bold">Profile and security</h1><ProfileForm key={user.id + user.activeRole + user.updatedAt} user={user} /></section>;
}
