import { Link } from 'react-router-dom';
import { Menu, Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/auth';
import { useData } from '../../hooks/useData';
import { dashboards } from '../../services';
export default function DashboardHeader({ onOpenMobileMenu }) {
  const { user } = useAuth(), query = useData(dashboards.overview());
  const values = query.data?.data;
  return <header className="sticky top-0 z-20 bg-[#f0f3f8]/95 backdrop-blur border-b border-white h-20 px-4 sm:px-8 flex items-center justify-between gap-4">
    <div className="flex items-center gap-3"><button onClick={onOpenMobileMenu} aria-label="Open navigation" className="lg:hidden neu-btn rounded-xl p-2"><Menu size={20} /></button>
      <div><p className="font-bold">{user.activeRole === 'freelancer' ? 'Freelancer studio' : 'Client workspace'}</p><p className="text-xs text-slate-500">{user.name}</p></div></div>
    <nav aria-label="Workspace shortcuts" className="flex gap-4">
      <Link to="/dashboard/messages" aria-label={'Messages' + (values ? ', ' + values.unreadMessages + ' unread' : '')} className="neu-btn rounded-xl px-3 py-2 flex items-center gap-2"><MessageSquare size={18} />{values?.unreadMessages > 0 && <span>{values.unreadMessages}</span>}</Link>
      <Link to="/dashboard/notifications" aria-label="Notifications" className="neu-btn rounded-xl px-3 py-2 flex items-center gap-2"><Bell size={18} />{values?.unreadNotifications > 0 && <span>{values.unreadNotifications}</span>}</Link>
    </nav>
  </header>;
}
