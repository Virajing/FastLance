import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROJECTS } from '../../data/mockData';
import { ProjectDetailModal } from '../../components/dashboard/ProjectDetailModal';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Briefcase,
  Search,
  Plus,
  Clock,
  Calendar,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';

export const Projects = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const statusMap = {
    active: { label: 'In Progress', variant: 'primary' },
    in_progress: { label: 'In Progress', variant: 'primary' },
    review: { label: 'Under Review', variant: 'warning' },
    completed: { label: 'Completed', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'danger' }
  };

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      // Tab filter
      if (activeTab === 'active' && project.status !== 'in_progress' && project.status !== 'active') return false;
      if (activeTab === 'review' && project.status !== 'review') return false;
      if (activeTab === 'completed' && project.status !== 'completed') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = project.title.toLowerCase().includes(q);
        const matchFreelancer = project.freelancerName.toLowerCase().includes(q);
        const matchCat = project.category.toLowerCase().includes(q);
        if (!matchTitle && !matchFreelancer && !matchCat) return false;
      }

      return true;
    });
  }, [activeTab, searchQuery]);

  const counts = {
    all: PROJECTS.length,
    active: PROJECTS.filter((p) => p.status === 'in_progress' || p.status === 'active').length,
    review: PROJECTS.filter((p) => p.status === 'review').length,
    completed: PROJECTS.filter((p) => p.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Contracts & Escrow Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your active agreements, inspect deliverables, and release secure milestone payouts.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/freelancers')}
          className="gap-2 shrink-0 shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Create New Contract
        </Button>
      </div>

      {/* Tabs & Search Controls */}
      <div className="neu-flat rounded-2xl p-4 border border-white/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { key: 'all', label: 'All Contracts', count: counts.all },
            { key: 'active', label: 'In Progress', count: counts.active },
            { key: 'review', label: 'Under Review', count: counts.review },
            { key: 'completed', label: 'Completed', count: counts.completed }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'neu-pressed bg-[#e4e9f2] text-indigo-600 border border-indigo-200/60 shadow-inner'
                  : 'neu-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeTab === tab.key ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Search by project or talent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            clearable={true}
            onClear={() => setSearchQuery('')}
          />
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No contracts found"
          description="There are no projects matching your current tab or search criteria."
          actionLabel="View All Contracts"
          onAction={() => {
            setActiveTab('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const statusConfig = statusMap[project.status] || {
              label: project.status,
              variant: 'default'
            };
            const completedMilestones =
              project.milestones?.filter((m) => m.status === 'completed').length || 0;
            const totalMilestones = project.milestones?.length || 1;
            const progressPct = Math.round((completedMilestones / totalMilestones) * 100);

            return (
              <Card
                key={project.id}
                variant="raised"
                padding="lg"
                hoverLift={true}
                onClick={() => setSelectedProject(project)}
                className="border border-white/90 cursor-pointer transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left info */}
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar
                      src={project.freelancerAvatar}
                      name={project.freelancerName}
                      size="lg"
                      className="shrink-0 mt-0.5"
                    />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {project.title}
                        </h3>
                        <Badge variant={statusConfig.variant} size="sm">
                          {statusConfig.label}
                        </Badge>
                        <span className="text-xs text-slate-400 font-medium">#{project.id}</span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-1">{project.description}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        <span className="font-semibold text-slate-700">
                          Specialist: <span className="text-indigo-600">{project.freelancerName}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Deadline: {project.deadline}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {completedMilestones} of {totalMilestones} Milestones done
                        </span>
                      </div>

                      {/* Milestone progress bar */}
                      <div className="pt-2 max-w-md">
                        <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                          <span>Milestone Completion</span>
                          <span className="font-bold text-slate-800">{progressPct}%</span>
                        </div>
                        <div className="h-2 rounded-full neu-inset overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              progressPct === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Budget & Actions */}
                  <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200/60 shrink-0">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Contract Value
                      </span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        ${project.budget.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold block flex items-center gap-1 justify-start lg:justify-end">
                        <ShieldCheck className="w-3 h-3" />
                        Escrow Protected
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/messages?to=${encodeURIComponent(project.freelancerName)}`);
                        }}
                        className="gap-1 text-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}
                        className="gap-1 text-xs"
                      >
                        <span>Milestones</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
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

export default Projects;
