import React from 'react';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Đang tải dữ liệu...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center">
        <div className="absolute h-10 w-10 animate-ping rounded-full bg-blue-100 opacity-75"></div>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500">{message}</p>
    </div>
  );
};

