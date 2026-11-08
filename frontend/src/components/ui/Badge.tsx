import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'teal' | 'green' | 'amber' | 'rose' | 'slate' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  const dotStyles = {
    blue: 'bg-blue-500',
    teal: 'bg-teal-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-400',
    purple: 'bg-indigo-500',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-[11px] px-2 py-0.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap leading-4 font-medium border rounded-full select-none ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 shrink-0 rounded-full ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
};

