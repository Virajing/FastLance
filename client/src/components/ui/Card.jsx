import React from 'react';

export const Card = ({
  children,
  variant = 'raised',
  hoverLift = false,
  padding = 'md',
  className = '',
  onClick,
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const variantStyles = {
    raised: 'neu-flat rounded-2xl',
    sm: 'neu-sm rounded-xl',
    inset: 'neu-inset rounded-2xl',
    flat: 'bg-[#f0f3f8] border border-slate-200/70 rounded-2xl'
  };

  const hoverStyles = hoverLift ? (variant === 'sm' ? 'neu-sm-hover' : 'neu-flat-hover cursor-pointer') : '';

  return (
    <div
      onClick={onClick}
      className={`
        ${variantStyles[variant] || variantStyles.raised}
        ${paddingStyles[padding] || paddingStyles.md}
        ${hoverStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
