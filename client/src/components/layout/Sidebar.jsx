import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  LayoutDashboard,
  FolderGit2,
  MessageSquare,
  User,
  ShoppingBag,
  Users,
  LogOut,
  Zap,
  RefreshCw,
  Wallet,
  X,
  Plus
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const mainNavItems = [
    { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Projects & Orders', path: '/dashboard/projects', icon: <FolderGit2 className="w-4 h-4" /> },
    {
      label: 'Messages',
      path: '/dashboard/messages',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: '2'
    },
    { label: 'Profile & Settings', path: '/dashboard/profile', icon: <User className="w-4 h-4" /> }
  ];

  const exploreNavItems = [
    { label: 'Browse Services', path: '/services', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Find Freelancers', path: '/freelancers', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#f0f3f8] border-r border-white/80 p-5 flex flex-col justify-between
          transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-lg lg:shadow-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col gap-6">
          {/* Top Logo */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl neu-flat flex items-center justify-center text-indigo-600 border border-white">
                <Zap className="w-5 h-5 fill-indigo-500 text-indigo-600" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 tracking-tight">FastLance</span>
                <span className="block text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                  {user?.role === 'client' ? 'Client Workspace' : 'Freelancer Studio'}
                </span>
              </div>
            </Link>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-xl neu-btn text-slate-400 hover:text-slate-700 lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* User quick badge & role switch */}
          <div className="p-3.5 rounded-2xl neu-inset">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <Avatar src={user?.avatar} name={user?.name} size="sm" status="online" />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                  <span className="text-[10px] text-slate-500 capitalize">{user?.role}</span>
                </div>
              </div>
              <Badge variant={user?.role === 'client' ? 'primary' : 'success'} size="sm">
                {user?.role === 'client' ? 'Client' : 'Pro'}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={switchRole}
              className="text-[11px] py-1.5 h-auto text-indigo-600 hover:bg-white/80"
              leftIcon={<RefreshCw className="w-3 h-3" />}
            >
              Switch to {user?.role === 'client' ? 'Freelancer' : 'Client'}
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                Workspace
              </p>
              <nav className="space-y-1">
                {mainNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/dashboard'}
                    onClick={onCloseMobile}
                    className={({ isActive }) => `
                      flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                      ${
                        isActive
                          ? 'neu-sm text-indigo-600 bg-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="shrink-0">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="primary" size="sm">
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                Discovery
              </p>
              <nav className="space-y-1">
                {exploreNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                      ${
                        isActive
                          ? 'neu-sm text-indigo-600 bg-white font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                      }
                    `}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Escrow Balance Card & Logout */}
        <div className="pt-4 flex flex-col gap-3">
          <div className="p-3.5 rounded-2xl neu-flat bg-white/70 border border-white">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-indigo-500" />
                {user?.role === 'client' ? 'Escrow Balance' : 'Available Payout'}
              </span>
            </div>
            <p className="text-lg font-black text-slate-900 tracking-tight">
              ${(user?.balance || 14250).toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Protected with 256-bit encryption</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50/60"
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
