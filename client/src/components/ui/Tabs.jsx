import React from 'react';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'pill', // 'pill' or 'underline'
  className = ''
}) => {
  if (variant === 'underline') {
    return (
      <div className={`flex border-b border-slate-200/80 gap-6 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                pb-3 text-sm font-semibold relative transition-colors cursor-pointer flex items-center gap-2
                ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}
              `}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200/80 text-slate-600'}`}>
                  {tab.count}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`inline-flex p-1.5 neu-inset rounded-xl max-w-full overflow-x-auto gap-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 select-none cursor-pointer flex items-center gap-2 whitespace-nowrap
              ${
                isActive
                  ? 'neu-sm text-indigo-700 bg-white font-bold scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
              }
            `}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`
                  text-xs px-2 py-0.5 rounded-full font-medium
                  ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}
                `}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
