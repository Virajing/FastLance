import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DASHBOARD_STATS, PROJECTS, FREELANCERS, NOTIFICATIONS } from '../../data/mockData';
import { StatCard } from '../../components/ui/StatCard';
import { ActiveProjectsTable } from '../../components/dashboard/ActiveProjectsTable';
import { SpendingChart } from '../../components/dashboard/SpendingChart';
import { ProjectDetailModal } from '../../components/dashboard/ProjectDetailModal';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
  DollarSign,
  Briefcase,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Plus,
  CheckCircle2,
  Bell,
  ChevronRight,
  Star
} from 'lucide-react';

export const DashboardOverview = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);

  const isClient = user?.role === 'client';

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="neu-flat rounded-3xl p-6 sm:p-8 border border-white/80 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">
              {isClient ? '💼 Client Workspace' : '🚀 Freelancer Workspace'}
            </Badge>
            <span className="text-xs text-slate-400 font-medium">• FastLance Pro Tier</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Julian'}!
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl">
            {isClient
              ? 'You have 3 active engineering contracts running under milestone escrow. All deliverables are on schedule.'
              : 'You have 2 milestones awaiting review and $3,480 ready for withdrawal to your bank account.'}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={switchRole}
            className="text-xs"
          >
            Switch to {isClient ? 'Freelancer' : 'Client'} Mode
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(isClient ? '/freelancers' : '/dashboard/projects')}
            className="gap-1.5 shadow-indigo-500/20 text-xs"
          >
            <Plus className="w-4 h-4" />
            {isClient ? 'Hire New Specialist' : 'View Contracts'}
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title={isClient ? 'Total Spent (Escrow)' : 'Total Earnings'}
          value={isClient ? `$${DASHBOARD_STATS.totalSpent.toLocaleString()}` : '$12,840'}
          change="+18.4%"
          changeType="positive"
          changeLabel="vs last month"
          icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
        />

        <StatCard
          title="Active Projects"
          value={isClient ? DASHBOARD_STATS.activeProjectsCount : '2'}
          change="On track"
          changeType="neutral"
          changeLabel="1 under review"
          icon={<Briefcase className="w-5 h-5 text-emerald-600" />}
        />

        <StatCard
          title={isClient ? 'Hours Billed' : 'Hours Logged'}
          value={`${DASHBOARD_STATS.hoursLogged} hrs`}
          change="+32 hrs"
          changeType="positive"
          changeLabel="this week"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />

        <StatCard
          title={isClient ? 'Escrow Vault Balance' : 'Available for Payout'}
          value={isClient ? `$${(user?.balance || 14250).toLocaleString()}` : '$3,480'}
          change="Protected"
          changeType="positive"
          changeLabel="100% FDIC insured"
          icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* Main Grid: Left (Active Projects + Chart), Right (Talent Recs + Notifications) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Projects Table Widget */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Active Contracts & Milestones</h3>
                <p className="text-xs text-slate-500">Track progress, review code submissions, and release escrow</p>
              </div>
              <Link
                to="/dashboard/projects"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
              >
                View all ({PROJECTS.length})
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <ActiveProjectsTable
              projects={PROJECTS}
              limit={3}
              onSelectProject={(project) => setSelectedProject(project)}
            />
          </div>

          {/* Monthly Spending Chart */}
          <div>
            <SpendingChart data={DASHBOARD_STATS.monthlySpending} />
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Recommended Talent Widget */}
          <Card variant="raised" padding="md" className="border border-white/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Vetted Talent Matches
              </h3>
              <Link to="/freelancers" className="text-xs font-semibold text-indigo-600 hover:underline">
                Explore
              </Link>
            </div>

            <div className="space-y-3">
              {FREELANCERS.slice(0, 3).map((f) => (
                <div
                  key={f.id}
                  onClick={() => navigate(`/freelancers/${f.id}`)}
                  className="neu-sm hover:neu-flat-hover rounded-xl p-3 border border-white/80 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={f.avatar} name={f.name} size="md" status={f.availability === 'Available Now' ? 'online' : 'offline'} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {f.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{f.title}</p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-bold text-slate-700">{f.rating}</span>
                        <span className="text-slate-400 font-normal">(${f.hourlyRate}/hr)</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity / Notification Feed */}
          <Card variant="raised" padding="md" className="border border-white/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-slate-600" />
                Recent Platform Updates
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Live</span>
            </div>

            <div className="space-y-3">
              {NOTIFICATIONS.slice(0, 4).map((notif) => (
                <Link
                  key={notif.id}
                  to={notif.link}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100/70 transition-colors block"
                >
                  <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 leading-tight">
                      {notif.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">
                      {notif.time}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          isOpen={true}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
        />
      )}
    </div>
  );
};

export default DashboardOverview;
