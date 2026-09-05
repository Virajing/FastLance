import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/layout/DashboardHeader';
import MobileNav from '../components/layout/MobileNav';

export const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Dynamic header title based on active dashboard path
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.includes('/projects')) return 'Projects & Contracts';
    if (path.includes('/messages')) return 'Real-Time Messaging';
    if (path.includes('/profile')) return 'Profile & Workspace Settings';
    return 'Executive Overview';
  };

  return (
    <div className="min-h-screen bg-[#f0f3f8] text-slate-800 flex flex-col">
      {/* Sidebar for Desktop & Mobile drawer */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Body container offset by sidebar width on lg */}
      <div className="lg:pl-64 flex flex-col flex-1 pb-16 lg:pb-0">
        <DashboardHeader
          title={getHeaderTitle()}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
};

export default DashboardLayout;
