import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import { Badge } from '../ui/Badge';
import {
  Zap,
  Menu,
  X,
  LayoutDashboard,
  FolderGit2,
  MessageSquare,
  User,
  LogOut,
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Services', path: '/services' },
    { label: 'Freelancers', path: '/freelancers' },
    { label: 'How It Works', path: '/#how-it-works' },
    ...(isAuthenticated
      ? [
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Messages', path: '/dashboard/messages' }
        ]
      : [])
  ];

  const userMenuItems = [
    {
      label: 'Switch to ' + (user?.role === 'client' ? 'Freelancer' : 'Client') + ' Mode',
      icon: <RefreshCw className="w-4 h-4 text-indigo-500" />,
      onClick: switchRole
    },
    { divider: true },
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      onClick: () => navigate('/dashboard')
    },
    {
      label: 'My Projects',
      icon: <FolderGit2 className="w-4 h-4" />,
      onClick: () => navigate('/dashboard/projects')
    },
    {
      label: 'Messages',
      icon: <MessageSquare className="w-4 h-4" />,
      onClick: () => navigate('/dashboard/messages'),
      badge: <Badge size="sm" variant="primary">2</Badge>
    },
    {
      label: 'Profile Settings',
      icon: <User className="w-4 h-4" />,
      onClick: () => navigate('/dashboard/profile')
    },
    { divider: true },
    {
      label: 'Sign Out',
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
      onClick: () => {
        logout();
        navigate('/');
      }
    }
  ];

  const isActive = (path) => {
    if (path.startsWith('/#')) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f0f3f8]/90 backdrop-blur-md border-b border-white/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl neu-flat flex items-center justify-center text-indigo-600 border border-white/90 group-hover:scale-105 transition-transform duration-200">
            <Zap className="w-6 h-6 fill-indigo-500 text-indigo-600" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-slate-900 tracking-tight">FastLance</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60 uppercase tracking-widest">
                PRO
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 -mt-0.5">Top-Tier Freelance Engine</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`
                  px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${
                    active
                      ? 'neu-sm text-indigo-600 bg-white/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions & User State */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={switchRole}
                className="text-xs text-slate-600 hover:text-indigo-600 gap-1.5 hidden xl:flex"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Mode: <strong className="capitalize text-slate-800">{user?.role}</strong></span>
              </Button>

              <Dropdown
                align="right"
                items={userMenuItems}
                trigger={
                  <div className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl neu-sm cursor-pointer hover:neu-flat transition-all">
                    <Avatar
                      src={user?.avatar}
                      name={user?.name}
                      size="sm"
                      status="online"
                    />
                    <div className="text-left leading-tight hidden lg:block">
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[110px]">{user?.name}</p>
                      <p className="text-[10px] font-medium text-indigo-600 uppercase tracking-wide">{user?.role}</p>
                    </div>
                  </div>
                }
              />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" rightIcon={<Sparkles className="w-3.5 h-3.5" />}>
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <Link to="/dashboard">
              <Avatar src={user?.avatar} name={user?.name} size="sm" status="online" />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl neu-btn text-slate-700 hover:text-slate-900 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/70 bg-[#f0f3f8] px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          <div className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
                  ${isActive(link.path) ? 'neu-sm text-indigo-600 bg-white' : 'text-slate-700 hover:bg-slate-200/50'}
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200/60 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    switchRole();
                    setMobileMenuOpen(false);
                  }}
                  leftIcon={<RefreshCw className="w-4 h-4 text-indigo-500" />}
                >
                  Switch to {user?.role === 'client' ? 'Freelancer' : 'Client'} Mode
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="raised" size="sm" fullWidth>Log In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" fullWidth>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
