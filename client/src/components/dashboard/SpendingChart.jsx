import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { TrendingUp, DollarSign } from 'lucide-react';

export const SpendingChart = ({ data = [] }) => {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const maxAmount = Math.max(...data.map((d) => d.amount), 2500);

  return (
    <Card variant="raised" padding="md" className="border border-white/80">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Financial Velocity
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">Monthly Escrow Volume</h3>
        </div>
        <Badge variant="success" size="sm" className="font-bold">
          <TrendingUp className="w-3 h-3 mr-1 inline" /> +18.4%
        </Badge>
      </div>

      {/* Chart Canvas */}
      <div className="pt-8 pb-2">
        <div className="h-44 flex items-end justify-between gap-3 px-2 border-b border-slate-200/80">
          {data.map((item, index) => {
            const heightPct = Math.round((item.amount / maxAmount) * 100);
            const isHovered = hoveredMonth === item.month;

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer"
                onMouseEnter={() => setHoveredMonth(item.month)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Floating tooltip */}
                <div
                  className={`
                    absolute -top-10 px-2.5 py-1 rounded-lg neu-sm bg-slate-900 text-white text-[11px] font-bold transition-all duration-200 pointer-events-none whitespace-nowrap z-10
                    ${isHovered ? 'opacity-100 scale-100 -translate-y-1' : 'opacity-0 scale-95'}
                  `}
                >
                  ${item.amount.toLocaleString()}
                </div>

                {/* Soft bar */}
                <div className="w-full max-w-[40px] h-full flex items-end">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`
                      w-full rounded-t-xl transition-all duration-300
                      ${
                        index === data.length - 1
                          ? 'bg-linear-to-t from-indigo-600 to-indigo-400 shadow-md'
                          : 'neu-sm bg-slate-300/80 group-hover:bg-indigo-300'
                      }
                      ${isHovered ? 'scale-y-[1.03] origin-bottom' : ''}
                    `}
                  />
                </div>

                <span className="text-[11px] font-bold text-slate-500 mt-1">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Footer summary */}
      <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Average monthly: <strong className="text-slate-800 font-bold">$1,545</strong></span>
        <span className="text-indigo-600 font-semibold">100% Escrow Backed</span>
      </div>
    </Card>
  );
};

export default SpendingChart;
