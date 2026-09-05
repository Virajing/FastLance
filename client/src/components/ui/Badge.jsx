import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  };

  const variantStyles = {
    default: 'neu-sm text-slate-700 border border-white/80',
    primary: 'bg-indigo-50/80 text-indigo-700 border border-indigo-200/70 neu-sm shadow-xs',
    success: 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/70 neu-sm shadow-xs',
    warning: 'bg-amber-50/80 text-amber-800 border border-amber-200/70 neu-sm shadow-xs',
    danger: 'bg-rose-50/80 text-rose-700 border border-rose-200/70 neu-sm shadow-xs',
    accent: 'bg-purple-50/80 text-purple-700 border border-purple-200/70 neu-sm shadow-xs',
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200'
  };

  const dotColors = {
    default: 'bg-slate-400',
    primary: 'bg-indigo-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    accent: 'bg-purple-500',
    neutral: 'bg-slate-400'
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full select-none
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.default}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-current'} shrink-0`} />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
