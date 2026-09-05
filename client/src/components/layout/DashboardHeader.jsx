import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NOTIFICATIONS } from '../../data/mockData';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import { Badge } from '../ui/Badge';
import {
  Menu,
  Bell,
  Search,
  Plus,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

export const DashboardHeader = ({ onOpenMobileMenu, title = 'Dashboard Overview' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const notificationDropdownItems = [
    {
      label: (
        <div className="flex items-center justify-between w-full pb-1 border-b border-slate-200/60">
          <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
              className="text-[11px] text-indigo-600 hover:underline font-medium"
            >
              Mark all read
            </button>
          )}
        </div>
      )
    },
    ...notifications.map((n) => ({
      label: (
        <div
          onClick={() => {
            if (n.link) navigate(n.link);
          }}
          className={`py-2 px-1 flex flex-col gap-1 w-full text-left ${!n.read ? 'bg-indigo-50/40 rounded-lg' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 line-clamp-1">{n.title}</span>
            <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">{n.message}</p>
        </div>
      )
    })),
    { divider: true },
    {
      label: 'View all updates →',
      onClick: () => navigate('/dashboard/projects')
    }
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#f0f3f8]/90 backdrop-blur-md border-b border-white/80 px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
      {/* Left section: Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2.5 rounded-xl neu-btn text-slate-600 hover:text-slate-900 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none">{title}</h1>
          <p className="text-xs text-slate-500 mt-1 hidden sm:block">
            Welcome back, <strong className="text-slate-700">{user?.name}</strong>. Here is your operational pulse.
          </p>
        </div>
      </div>

      {/* Right section: Search + Actions + Notifications */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search */}
        <div className="hidden md:flex items-center relative w-52 lg:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects, files..."
            className="w-full neu-inset rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {/* New Order / Hire CTA */}
        <Link to="/services" className="hidden sm:block">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-xs font-bold"
          >
            New Project
          </Button>
        </Link>

        {/* Notifications Dropdown */}
        <Dropdown
          align="right"
          items={notificationDropdownItems}
          trigger={
            <button
              className="p-2.5 rounded-xl neu-btn text-slate-600 hover:text-slate-900 relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-[#f0f3f8]">
                  {unreadCount}
                </span>
              )}
            </button>
          }
        />

        {/* Messages shortcut */}
        <Link to="/dashboard/messages">
          <button
            className="p-2.5 rounded-xl neu-btn text-slate-600 hover:text-slate-900 relative cursor-pointer"
            aria-label="Messages"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#f0f3f8]"></span>
          </button>
        </Link>

        {/* Avatar Profile Link */}
        <Link to="/dashboard/profile" className="pl-1">
          <Avatar src={user?.avatar} name={user?.name} size="sm" status="online" />
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
