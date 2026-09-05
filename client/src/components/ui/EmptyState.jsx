import React from 'react';
import Card from './Card';
import Button from './Button';
import { SearchX } from 'lucide-react';

export const EmptyState = ({
  icon,
  title = 'No results found',
  description = 'We couldn\'t find anything matching your filters or search terms. Try adjusting them.',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <Card variant="flat" padding="lg" className={`text-center flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="w-16 h-16 rounded-2xl neu-flat flex items-center justify-center text-slate-400 mb-4">
        {icon || <SearchX className="w-8 h-8 text-slate-400" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Card>
  );
};

export default EmptyState;
