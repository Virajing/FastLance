import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { useAction } from '../hooks/useData';
import { ErrorNotice } from '../components/ui/DataState';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';
export default function Login() {
  const auth = useAuth(), navigate = useNavigate(), location = useLocation();
  const action = useAction(async data => {
    await auth.login(data.email, data.password);
    const destination = typeof location.state?.from === 'string' && location.state.from.startsWith('/') && !location.state.from.startsWith('//') ? location.state.from : '/dashboard';
    navigate(destination, { replace: true });
  });
  function submit(event) {
    event.preventDefault();
    action.mutate(Object.fromEntries(new FormData(event.currentTarget)));
  }
  return <main className="min-h-screen grid place-items-center p-6">
    <section className="neu-flat rounded-3xl p-8 w-full max-w-md space-y-5">
      <Link to="/" className="font-black text-xl">FastLance</Link>
      <h1 className="text-2xl font-bold">Sign in</h1>
      <form onSubmit={submit} className="space-y-4">
        
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Password" name="password" type="password" autoComplete="current-password" required  />
        <ErrorNotice error={action.error} />
        <Button type="submit" variant="primary" isLoading={action.isPending}>Sign in</Button>
      </form>
      <Link className="text-indigo-600 underline" to="/register">Create an account</Link>
    </section>
  </main>;
}
