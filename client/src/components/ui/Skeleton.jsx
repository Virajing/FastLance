import React from 'react';

export const Skeleton = ({
  variant = 'text', // 'text' | 'circle' | 'rect' | 'card'
  width,
  height,
  className = ''
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    circle: 'rounded-full shrink-0',
    rect: 'rounded-xl w-full',
    card: 'rounded-2xl w-full h-48 neu-flat'
  };

  const style = {
    width: width || undefined,
    height: height || undefined
  };

  return (
    <div
      style={style}
      className={`
        animate-pulse bg-slate-200/70 border border-white/50
        ${variantStyles[variant] || variantStyles.text}
        ${className}
      `}
    />
  );
};

export default Skeleton;
