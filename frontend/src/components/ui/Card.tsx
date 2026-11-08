import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  footer,
  noPadding = false,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden ${className}`}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-slate-100 px-4 sm:px-5 py-3">
          <div className="min-w-0 flex-1 basis-[220px]">
            {typeof title === 'string' ? (
              <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-xs leading-4 text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center flex-wrap gap-2 shrink-0 [&_button]:whitespace-nowrap">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-3.5 sm:p-4'}>{children}</div>
      {footer && (
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
};

