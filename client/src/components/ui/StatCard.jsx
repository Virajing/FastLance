import React from 'react';
import Card from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  change,
  changeType = 'positive', // 'positive' | 'negative' | 'neutral'
  changeLabel = 'vs last month',
  icon,
  className = ''
}) => {
  return (
    <Card variant="raised" padding="md" className={`flex flex-col justify-between ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">{value}</h4>
        </div>
        {icon && (
          <div className="p-3 rounded-xl neu-sm text-indigo-600 bg-white/80 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(change || changeLabel) && (
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`
                inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-md
                ${
                  changeType === 'positive'
                    ? 'bg-emerald-50 text-emerald-700'
                    : changeType === 'negative'
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-slate-100 text-slate-700'
                }
              `}
            >
              {changeType === 'positive' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {changeType === 'negative' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {changeLabel && <span className="text-slate-500 font-medium">{changeLabel}</span>}
        </div>
      )}
    </Card>
  );
};

export default StatCard;
