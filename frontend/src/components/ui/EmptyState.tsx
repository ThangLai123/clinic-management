import React from 'react';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Inbox className="h-10 w-10 text-slate-300" />,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-slate-200 ${className}`}
    >
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400">
        {icon}
      </div>
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      {description && <p className="mt-1 text-xs text-slate-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

