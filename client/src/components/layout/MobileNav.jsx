import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderGit2, MessageSquare, User } from 'lucide-react';

export const MobileNav = () => {
  const items = [
    { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Projects', path: '/dashboard/projects', icon: <FolderGit2 className="w-5 h-5" /> },
    { label: 'Messages', path: '/dashboard/messages', icon: <MessageSquare className="w-5 h-5" />, badge: 2 },
    { label: 'Profile', path: '/dashboard/profile', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#f0f3f8]/95 backdrop-blur-md border-t border-white/90 px-4 py-2 flex items-center justify-around lg:hidden shadow-lg">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/dashboard'}
          className={({ isActive }) => `
            flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 relative
            ${
              isActive
                ? 'neu-inset text-indigo-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }
          `}
        >
          <div className="relative">
            {item.icon}
            {item.badge && (
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
