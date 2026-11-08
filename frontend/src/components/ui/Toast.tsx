import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  type?: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'success',
  message,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    if (!duration || duration <= 0) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [message, type, duration, onClose]);

  const config = {
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-900/10',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
      closeBtn: 'text-emerald-500 hover:text-emerald-800 hover:bg-emerald-100/70',
    },
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-900 shadow-rose-900/10',
      icon: <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />,
      closeBtn: 'text-rose-500 hover:text-rose-800 hover:bg-rose-100/70',
    },
    info: {
      container: 'bg-sky-50 border-sky-200 text-sky-900 shadow-sky-900/10',
      icon: <Info className="h-5 w-5 text-sky-600 shrink-0" />,
      closeBtn: 'text-sky-500 hover:text-sky-800 hover:bg-sky-100/70',
    },
  }[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-5 left-5 z-[9999] max-w-[calc(100vw-40px)] sm:max-w-md w-auto transition-all duration-300 ease-out transform translate-y-0 opacity-100"
      style={{
        animation: 'toastSlideIn 0.25s ease-out',
      }}
    >
      <div
        className={`flex items-start gap-3 p-3.5 rounded-xl border shadow-lg ${config.container}`}
      >
        <div className="mt-0.5">{config.icon}</div>
        <div className="flex-1 pr-1">
          <p className="text-xs sm:text-sm font-medium leading-relaxed break-words">
            {message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`shrink-0 p-1 rounded-lg transition-colors cursor-pointer ${config.closeBtn}`}
          aria-label="Đóng thông báo"
          title="Đóng thông báo"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

