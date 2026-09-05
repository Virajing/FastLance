import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const HireModal = ({ isOpen, onClose, service, tierKey, packageData }) => {
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (!service || !packageData) return null;

  const handleConfirmHire = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
      addToast(`Order placed for ${service.title}! Escrow funded with $${packageData.price}.`, 'success');
      navigate('/dashboard/projects');
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Secure Escrow Checkout"
      subtitle="Funds are held securely and only released when you approve the milestone."
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleConfirmHire}
            isLoading={isProcessing}
            rightIcon={<Sparkles className="w-4 h-4" />}
          >
            Fund Escrow (${packageData.price})
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Freelancer & Service Summary */}
        <div className="p-4 rounded-xl neu-sm bg-white/70 border border-white flex items-center gap-3">
          <Avatar
            src={service.freelancerAvatar}
            name={service.freelancerName}
            size="md"
            status="online"
          />
          <div>
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{service.title}</h4>
            <p className="text-[11px] text-slate-500">By {service.freelancerName}</p>
          </div>
        </div>

        {/* Selected Package Details */}
        <div className="p-4 rounded-xl neu-inset space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 capitalize">{tierKey} Tier: {packageData.name}</span>
            <span className="text-sm font-black text-slate-900">${packageData.price}</span>
          </div>
          <p className="text-xs text-slate-500 leading-tight">{packageData.description}</p>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 pt-1 border-t border-slate-200/50">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              {packageData.deliveryDays} Days Turnaround
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {packageData.revisions} Revisions
            </span>
          </div>
        </div>

        {/* Requirements brief */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
            Project Scope or Requirements (Optional)
          </label>
          <textarea
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share your Figma link, API specs, or project goals..."
            className="w-full neu-inset rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
          />
        </div>

        {/* Payment Summary */}
        <div className="space-y-1.5 pt-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>${packageData.price}.00</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Escrow Protection Fee</span>
            <span className="text-emerald-700 font-bold">$0.00 (Waived)</span>
          </div>
          <div className="flex justify-between font-black text-slate-900 pt-2 border-t border-slate-200/60 text-sm">
            <span>Total Due Today</span>
            <span>${packageData.price}.00 USD</span>
          </div>
        </div>

        {/* Trust badge */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200/60">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>FastLance 100% money-back guarantee if deliverables do not match agreed specifications.</span>
        </div>
      </div>
    </Modal>
  );
};

export default HireModal;
