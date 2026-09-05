import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Check, Clock, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

export const PackagePricing = ({ packages, onSelectTier }) => {
  const [selectedTier, setSelectedTier] = useState('standard');

  if (!packages) return null;

  const currentPkg = packages[selectedTier] || packages.standard || packages.basic;

  return (
    <Card variant="raised" padding="none" className="overflow-hidden border border-white sticky top-28">
      {/* Tier Switcher Header */}
      <div className="grid grid-cols-3 border-b border-slate-200/80 bg-slate-100/50 p-1.5 gap-1">
        {['basic', 'standard', 'premium'].map((tierKey) => {
          const pkg = packages[tierKey];
          if (!pkg) return null;
          const isActive = selectedTier === tierKey;

          return (
            <button
              key={tierKey}
              onClick={() => setSelectedTier(tierKey)}
              className={`
                py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 capitalize cursor-pointer
                ${
                  isActive
                    ? 'neu-sm text-indigo-700 bg-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                }
              `}
            >
              {tierKey}
              {tierKey === 'standard' && (
                <span className="hidden sm:inline-block ml-1 text-[9px] text-indigo-600">★</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Package Content */}
      <div className="p-6">
        <div className="flex items-baseline justify-between mb-3">
          <h4 className="text-base font-bold text-slate-900">{currentPkg.name}</h4>
          <div className="text-right">
            <span className="text-2xl font-black text-slate-900 tracking-tight">${currentPkg.price}</span>
            <span className="text-xs text-slate-500 block">USD</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          {currentPkg.description}
        </p>

        {/* Delivery & Revisions info */}
        <div className="grid grid-cols-2 gap-3 py-3 px-4 rounded-xl neu-inset mb-6 text-xs text-slate-700 font-semibold">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{currentPkg.deliveryDays} Days Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{currentPkg.revisions} Revisions</span>
          </div>
        </div>

        {/* Feature Checkmarks */}
        <div className="space-y-3 mb-8">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            What's Included:
          </p>
          <ul className="space-y-2.5">
            {currentPkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => onSelectTier(selectedTier, currentPkg)}
          rightIcon={<Sparkles className="w-4 h-4" />}
          className="shadow-indigo-500/20"
        >
          Continue (${currentPkg.price})
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium mt-4">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <span>FastLance Escrow Guarantee Protection</span>
        </div>
      </div>
    </Card>
  );
};

export default PackagePricing;
