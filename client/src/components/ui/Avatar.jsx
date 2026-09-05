import React, { useState } from 'react';

export const Avatar = ({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md',
  status, // 'online' | 'busy' | 'offline'
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(!src);

  const sizeStyles = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl font-bold'
  };

  const statusSizeStyles = {
    xs: 'w-2 h-2 -bottom-0.5 -right-0.5',
    sm: 'w-2.5 h-2.5 bottom-0 right-0',
    md: 'w-3 h-3 bottom-0 right-0',
    lg: 'w-3.5 h-3.5 bottom-0.5 right-0.5',
    xl: 'w-4 h-4 bottom-1 right-1'
  };

  const statusColors = {
    online: 'bg-emerald-500 ring-2 ring-white',
    busy: 'bg-amber-500 ring-2 ring-white',
    offline: 'bg-slate-400 ring-2 ring-white'
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'FL';

  return (
    <div className={`relative inline-flex shrink-0 ${className}`} {...props}>
      <div
        className={`
          ${sizeStyles[size] || sizeStyles.md}
          rounded-full overflow-hidden neu-sm border border-white flex items-center justify-center font-semibold text-slate-700 bg-slate-200/80
        `}
      >
        {!hasError && src ? (
          <img
            src={src}
            alt={alt || name}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="select-none tracking-tight">{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={`
            absolute rounded-full
            ${statusSizeStyles[size] || statusSizeStyles.md}
            ${statusColors[status] || statusColors.online}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;
