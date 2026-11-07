import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  Users,
  DoorOpen,
  Pill,
  CheckSquare,
  Receipt,
  Stethoscope,
  ClipboardList,
  FileText,
  ShieldCheck,
  ExternalLink,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  role: 'RECEPTIONIST' | 'DOCTOR' | 'ADMIN';
  userName?: string;
  userTitle?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, userName, userTitle }) => {
  const getNavItems = () => {
    switch (role) {
      case 'RECEPTIONIST':
        return [
          { to: '/receptionist', label: 'Tổng quan', icon: LayoutDashboard, end: true },
          { to: '/receptionist/appointments', label: 'Quản lý lịch hẹn', icon: Calendar },
          { to: '/receptionist/reception', label: 'Tiếp nhận bệnh nhân', icon: UserCheck },
          { to: '/receptionist/patients', label: 'Hồ sơ hành chính', icon: Users },
          { to: '/receptionist/room-assignment', label: 'Phân phòng khám', icon: DoorOpen },
          { to: '/receptionist/pharmacy', label: 'Quản lý kho thuốc', icon: Pill },
          { to: '/receptionist/dispensing', label: 'Phát thuốc theo đơn', icon: CheckSquare },
          { to: '/receptionist/billing', label: 'Hóa đơn & Thanh toán', icon: Receipt },
        ];
      case 'DOCTOR':
        return [
          { to: '/doctor', label: 'Tổng quan buồng khám', icon: LayoutDashboard, end: true },
          { to: '/doctor/queue', label: 'Hàng chờ khám bệnh', icon: Users },
          { to: '/doctor/examination', label: 'Khám Tai Mũi Họng', icon: Stethoscope },
          { to: '/doctor/medical-records', label: 'Hồ sơ bệnh án', icon: ClipboardList },
          { to: '/doctor/prescriptions', label: 'Kê đơn thuốc', icon: FileText },
        ];
      case 'ADMIN':
        return [
          { to: '/admin', label: 'Tổng quan hệ thống', icon: LayoutDashboard, end: true },
          { to: '/admin/users', label: 'Quản lý tài khoản', icon: Users },
          { to: '/admin/permissions', label: 'Phân quyền & Vai trò', icon: ShieldCheck },
        ];
    }
  };

  const navItems = getNavItems();

  const roleBadge = {
    RECEPTIONIST: { label: 'Bàn Lễ Tân & Dược', color: 'bg-amber-100 text-amber-800' },
    DOCTOR: { label: 'Bác Sĩ Chuyên Khoa', color: 'bg-emerald-100 text-emerald-800' },
    ADMIN: { label: 'Quản Trị Hệ Thống', color: 'bg-indigo-100 text-indigo-800' },
  }[role];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col shrink-0 h-screen sticky top-0 z-30 select-none">
      {/* Clinic Logo Header */}
      <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white shadow-xs">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 tracking-tight block leading-tight">
              ENT CLINIC
            </span>
            <span className="text-[11px] font-medium text-slate-500 block leading-tight">
              Tai Mũi Họng Tư Nhân
            </span>
          </div>
        </Link>
      </div>

      {/* Role Banner */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-800 truncate">{userName || 'Nhân viên y tế'}</p>
          <p className="text-[11px] text-slate-500 truncate">{userTitle || role}</p>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleBadge.color}`}>
          {roleBadge.label}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Chức năng nghiệp vụ
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-800 font-semibold shadow-2xs border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Quick Switch Switcher & Portal Link */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <div className="text-[11px] font-medium text-slate-500 px-2">Khu vực làm việc khác:</div>
        <div className="grid grid-cols-3 gap-1 text-[11px]">
          <Link
            to="/receptionist"
            className={`p-1.5 text-center rounded-lg border transition-colors ${
              role === 'RECEPTIONIST'
                ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Lễ tân
          </Link>
          <Link
            to="/doctor"
            className={`p-1.5 text-center rounded-lg border transition-colors ${
              role === 'DOCTOR'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Bác sĩ
          </Link>
          <Link
            to="/admin"
            className={`p-1.5 text-center rounded-lg border transition-colors ${
              role === 'ADMIN'
                ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Admin
          </Link>
        </div>

        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between w-full px-2.5 py-1.5 text-[11px] font-medium text-blue-700 bg-blue-50/60 rounded-lg hover:bg-blue-100/60 transition-colors"
        >
          <span>Xem Cổng Bệnh Nhân (Public)</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
};

