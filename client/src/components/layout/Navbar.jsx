import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../../context/auth';
export default function Navbar() {
  const { user, loading } = useAuth();
  return <header className="sticky top-0 z-30 bg-[#f0f3f8]/95 backdrop-blur border-b border-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-20 flex items-center justify-between flex-wrap gap-4 py-3">
      <Link to="/" className="flex items-center gap-3 font-black text-xl"><span className="neu-flat p-3 rounded-2xl text-indigo-600"><Zap size={22} /></span>FastLance</Link>
      <nav aria-label="Main navigation" className="flex items-center flex-wrap gap-3 sm:gap-6 text-sm font-semibold">
        <Link to="/services">Services</Link><Link to="/freelancers">Freelancers</Link>
        {user ? <Link className="neu-btn-primary rounded-xl px-4 py-2" to="/dashboard">My workspace</Link>
          : loading ? <span role="status" className="text-slate-500">Restoring session…</span> : <><Link to="/login">Log in</Link><Link className="neu-btn-primary rounded-xl px-4 py-2" to="/register">Get started</Link></>}
      </nav>
    </div>
  </header>;
}
