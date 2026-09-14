import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { useAction } from '../hooks/useData';
import { ErrorNotice } from '../components/ui/DataState';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';
export default function Register() {
  const auth = useAuth(), navigate = useNavigate();
  const [role, setRole] = useState('client');
  const action = useAction(async data => {
    await auth.register(data);
    const destination = role === 'freelancer' ? '/dashboard/onboarding' : '/dashboard';
    navigate(destination, { replace: true });
  });
  function submit(event) {
    event.preventDefault();
    action.mutate(Object.fromEntries(new FormData(event.currentTarget)));
  }
  return <main className="min-h-screen grid place-items-center p-6">
    <section className="neu-flat rounded-3xl p-8 w-full max-w-md space-y-5">
      <Link to="/" className="font-black text-xl">FastLance</Link>
      <h1 className="text-2xl font-bold">Create account</h1>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name" name="name" autoComplete="name" minLength={2} maxLength={100} required />
        <Field label="I want to" value={role} onChange={event => setRole(event.target.value)} options={[{ value: 'client', label: 'Hire freelancers' }, { value: 'freelancer', label: 'Offer freelance services' }]} />
        <p className="text-sm text-slate-600">One account supports both workspaces. Freelancer access requires professional onboarding. Platform commission is 10%.</p>
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Password" name="password" type="password" autoComplete="new-password" required minLength={10} maxLength={72} placeholder="At least 10 characters" />
        <ErrorNotice error={action.error} />
        <Button type="submit" variant="primary" isLoading={action.isPending}>Create account</Button>
      </form>
      <Link className="text-indigo-600 underline" to="/login">Already registered? Sign in</Link>
    </section>
  </main>;
}
