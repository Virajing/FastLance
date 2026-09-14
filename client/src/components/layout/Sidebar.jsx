import { NavLink, Link, useNavigate } from 'react-router-dom';
import { X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/auth';
import { useAction } from '../../hooks/useData';
import ModeSwitch from './ModeSwitch';
import Button from '../ui/Button';
import { ErrorNotice } from '../ui/DataState';
export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth(), navigate = useNavigate();
  const action = useAction(logout), freelancer = user.activeRole === 'freelancer';
  const links = [
    ['Overview', '/dashboard'], [freelancer ? 'Received contracts' : 'Contracts & orders', '/dashboard/projects'],
    [freelancer ? 'Find jobs' : 'My job posts', '/dashboard/jobs'], [freelancer ? 'My proposals' : 'Received proposals', '/dashboard/proposals'],
    ['Messages', '/dashboard/messages'], ['Notifications', '/dashboard/notifications'],
    ...(freelancer ? [['My services', '/dashboard/services'], ['Portfolio', '/dashboard/portfolio'], ['Earnings & payouts', '/dashboard/earnings'], ['My reviews', '/dashboard/reviews']]
      : [['Saved items', '/dashboard/saved'], ['Browse services', '/services'], ['Find freelancers', '/freelancers']]),
    ['Profile & security', '/dashboard/profile'],
  ];
  return <>
    {isMobileOpen && <button className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden" aria-label="Close navigation" onClick={onCloseMobile} />}
    <aside className={'fixed inset-y-0 left-0 z-40 w-64 bg-[#f0f3f8] border-r border-white p-5 flex flex-col gap-5 overflow-y-auto lg:translate-x-0 ' + (isMobileOpen ? '' : '-translate-x-full')}>
      <div className="flex items-center justify-between"><Link to="/" className="text-xl font-black">Fast<span className="text-indigo-600">Lance</span></Link><button aria-label="Close navigation" className="lg:hidden" onClick={onCloseMobile}><X size={20} /></button></div>
      <div className="neu-inset p-4 rounded-2xl space-y-3"><p className="text-xs uppercase tracking-wider text-indigo-600 font-bold">{freelancer ? 'Freelancer studio' : 'Client workspace'}</p><p className="font-semibold truncate">{user.name}</p><ModeSwitch /></div>
      <nav aria-label="Workspace" className="space-y-1 flex-1">{links.map(([name, path]) => <NavLink key={path} to={path} end={path === '/dashboard'} onClick={onCloseMobile}
        className={({ isActive }) => 'block px-3 py-2.5 rounded-xl text-sm font-medium ' + (isActive ? 'neu-sm text-indigo-600' : 'text-slate-600 hover:bg-slate-200/40')}>{name}</NavLink>)}</nav>
      <ErrorNotice error={action.error} /><Button isLoading={action.isPending} onClick={() => action.mutate(undefined, { onSuccess: () => navigate('/') })} leftIcon={<LogOut size={16} />}>Sign out</Button>
    </aside>
  </>;
}
