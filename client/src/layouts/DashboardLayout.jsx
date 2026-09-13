import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/layout/DashboardHeader';
export default function DashboardLayout() {
  const [open, setOpen] = useState(false), { user } = useAuth();
  return <div className="min-h-screen">
    <Sidebar isMobileOpen={open} onCloseMobile={() => setOpen(false)} />
    <div className="lg:pl-64"><DashboardHeader onOpenMobileMenu={() => setOpen(true)} />
      <main key={user.id + user.activeRole} className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"><Outlet /></main>
    </div>
  </div>;
}
