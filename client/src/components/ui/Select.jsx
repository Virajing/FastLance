import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  label,
  options = [],
  value,
  onChange,
  className = '',
  id,
  disabled = false,
  placeholder = 'Select an option',
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-600"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full appearance-none neu-inset rounded-xl py-2.5 pl-4 pr-10 text-sm text-slate-800 bg-transparent transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option
              key={typeof opt === 'string' ? opt : opt.value}
              value={typeof opt === 'string' ? opt : opt.value}
              className="bg-[#f0f3f8] text-slate-800 py-1"
            >
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
      </div>
    </div>
  );
};

export default Select;
