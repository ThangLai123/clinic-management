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
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
      {footer && (
        <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
};

