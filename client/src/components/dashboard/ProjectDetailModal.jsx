import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { useToast } from '../../context/ToastContext';
import {
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  FileText,
  Lock
} from 'lucide-react';

export const ProjectDetailModal = ({ isOpen, onClose, project }) => {
  const { addToast } = useToast();
  const [activeMilestones, setActiveMilestones] = useState(project?.milestones || []);

  if (!project) return null;

  const handleApproveMilestone = (index) => {
    setActiveMilestones((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], status: 'completed' };
      }
      return updated;
    });
    addToast(`Milestone approved! Funds released from escrow to ${project.freelancerName}.`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.title}
      subtitle={`Project ID: ${project.id} • ${project.category}`}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Link to={`/dashboard/messages?to=${project.freelancerId}`}>
            <Button variant="ghost" size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>
              Chat with {project.freelancerName}
            </Button>
          </Link>
          <Button variant="raised" size="sm" onClick={onClose}>
            Close Window
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Talent & Status Header */}
        <div className="p-4 rounded-xl neu-sm bg-white/60 border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar src={project.freelancerAvatar} name={project.freelancerName} size="md" status="online" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">{project.freelancerName}</h4>
              <p className="text-xs text-slate-500">Lead Freelancer on this contract</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Contract Total</span>
              <span className="text-base font-black text-slate-900">${project.budget}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Released</span>
              <span className="text-base font-black text-emerald-600">${project.spent}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
            <span>Overall Contract Completion</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full h-2.5 neu-inset rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Milestones Schedule */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
            Milestones & Escrow Disbursal
          </h4>
          <div className="space-y-2.5">
            {activeMilestones.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl neu-flat bg-white/50 border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {m.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : m.status === 'in_progress' || m.status === 'review' ? (
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{m.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Target Due: {m.dueDate} • Amount: <strong>${m.amount} USD</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 shrink-0">
                  {m.status === 'completed' ? (
                    <Badge variant="success" size="sm">
                      Released
                    </Badge>
                  ) : m.status === 'review' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproveMilestone(idx)}
                      className="text-xs py-1.5"
                    >
                      Approve & Release
                    </Button>
                  ) : (
                    <Badge variant={m.status === 'in_progress' ? 'primary' : 'neutral'} size="sm">
                      {m.status === 'in_progress' ? 'Active Work' : 'Locked Escrow'}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables Checklist */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5">
            Key Project Deliverables
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {project.deliverables?.map((d, i) => (
              <li key={i} className="p-2.5 rounded-lg neu-inset flex items-center gap-2 text-slate-700">
                <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="line-clamp-1">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectDetailModal;
