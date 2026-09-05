import React, { useState, useRef, useEffect } from 'react';

export const Dropdown = ({
  trigger,
  items = [],
  align = 'right',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignStyles = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`
            absolute ${alignStyles} mt-2 w-56 rounded-2xl neu-flat border border-white/80 py-2 z-40
            animate-in fade-in zoom-in-95 duration-150 shadow-xl
          `}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="my-1.5 border-t border-slate-200/60" />;
            }

            return (
              <button
                key={index}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={`
                  w-full px-4 py-2 text-left text-xs font-medium flex items-center justify-between
                  transition-colors rounded-lg mx-1 max-w-[calc(100%-8px)]
                  ${item.danger ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-700 hover:bg-slate-200/50 hover:text-slate-900'}
                  ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon && <span className="text-slate-400 shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
                {item.badge && <span>{item.badge}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
