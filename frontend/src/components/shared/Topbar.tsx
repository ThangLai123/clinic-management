import React from 'react';
import { Bell, Search, Clock } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ title, subtitle, badge, actions }) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Date & Time pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/60 rounded-full text-xs text-slate-600 font-medium">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>{dateStr}</span>
        </div>

        {/* Global Search shortcut mock */}
        <div className="hidden lg:flex items-center relative">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm nhanh BN, thuốc, mã đơn..."
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-52 focus:w-64 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Notification Bell */}
        <button
          className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Thông báo hệ thống"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};

