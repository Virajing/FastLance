import React from 'react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Clock, Calendar, ArrowRight, Eye } from 'lucide-react';

export const ActiveProjectsTable = ({ projects = [], onSelectProject, limit }) => {
  const displayProjects = limit ? projects.slice(0, limit) : projects;

  const statusMap = {
    active: { label: 'In Progress', variant: 'primary' },
    in_progress: { label: 'In Progress', variant: 'primary' },
    review: { label: 'Under Review', variant: 'warning' },
    completed: { label: 'Completed', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'danger' }
  };

  return (
    <div className="space-y-3">
      {displayProjects.map((project) => {
        const statusConfig = statusMap[project.status] || { label: project.status, variant: 'default' };

        return (
          <Card
            key={project.id}
            variant="raised"
            padding="md"
            hoverLift={true}
            onClick={() => onSelectProject && onSelectProject(project)}
            className="border border-white/90 cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Project title and talent info */}
              <div className="flex items-start sm:items-center gap-3.5">
                <Avatar
                  src={project.freelancerAvatar}
                  name={project.freelancerName}
                  size="md"
                  className="shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{project.title}</h4>
                    <Badge variant={statusConfig.variant} size="sm">
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Talent: <strong className="text-slate-700">{project.freelancerName}</strong> • {project.category}
                  </p>
                </div>
              </div>

              {/* Budget & Due Date */}
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Budget</span>
                  <span className="text-sm font-black text-slate-900">${project.budget}</span>
                </div>

                <div className="hidden md:block">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> Deadline
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{project.deadline}</span>
                </div>

                {/* Progress bar container */}
                <div className="w-24 md:w-32 text-right">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 neu-inset rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.progress === 100
                          ? 'bg-emerald-500'
                          : project.progress > 50
                          ? 'bg-indigo-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="p-2 h-auto text-slate-400 hover:text-indigo-600">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ActiveProjectsTable;
