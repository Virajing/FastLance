import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  className = '',
  id,
  type = 'text',
  disabled = false,
  required = false,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={`
            w-full neu-inset rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400
            transition-all duration-200 outline-none
            focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
            disabled:opacity-50 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || error ? 'pr-10' : ''}
            ${error ? 'border-rose-400 focus:ring-rose-500/30' : 'border-slate-300/40'}
          `}
          {...props}
        />

        {error ? (
          <div className="absolute right-3 text-rose-500 pointer-events-none">
            <AlertCircle className="w-4 h-4" />
          </div>
        ) : (
          rightIcon && (
            <div className="absolute right-3.5 text-slate-400 flex items-center">
              {rightIcon}
            </div>
          )
        )}
      </div>

      {error ? (
        <p className="text-xs font-medium text-rose-600 mt-0.5">{error}</p>
      ) : (
        helperText && (
          <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
        )
      )}
    </div>
  );
};

export default Input;
