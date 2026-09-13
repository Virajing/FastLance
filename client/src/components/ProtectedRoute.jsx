import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { ErrorNotice } from './ui/DataState';
export default function ProtectedRoute({ role, admin = false }) {
  const { user, loading, error, retry } = useAuth(), location = useLocation();
  if (loading) return <div role="status" className="p-12 text-center">Restoring your session…</div>;
  if (error) return <div className="p-8"><ErrorNotice error={error} retry={retry} /></div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search + location.hash }} />;
  if (role && (user.activeRole !== role || !user.roles.includes(role)) || admin && !user.isAdmin)
    return <div role="alert" className="neu-flat rounded-2xl p-8 space-y-4"><p>This page is unavailable in your current workspace.</p><Link className="text-indigo-600 underline" to="/dashboard">Return to your dashboard</Link></div>;
  return <Outlet />;
}
