import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { NavLink, Link, useNavigate } from 'react-router-dom';
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
  Activity,
  History,
  LogOut,
  Clock,
} from 'lucide-react';

interface SidebarProps {
  role: 'RECEPTIONIST' | 'DOCTOR' | 'ADMIN';
  userName?: string;
  userTitle?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, userName, userTitle }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getNavItems = () => {
    switch (role) {
      case 'RECEPTIONIST':
        return [
          { to: '/receptionist', label: 'Tổng quan', icon: LayoutDashboard, end: true },
          { to: '/receptionist/appointments', label: 'Quản lý lịch hẹn', icon: Calendar },
          { to: '/receptionist/reception', label: 'Tiếp nhận bệnh nhân', icon: UserCheck },
          { to: '/receptionist/queue', label: 'Hàng chờ khám bệnh', icon: Clock },
          { to: '/receptionist/patients', label: 'Hồ sơ hành chính', icon: Users },
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
          { to: '/admin/access-history', label: 'Lịch sử truy cập', icon: History },
          { to: '/admin/permissions', label: 'Phân quyền & Vai trò', icon: ShieldCheck },
        ];
    }
  };

  const navItems = getNavItems();

  const roleMeta = {
    RECEPTIONIST: {
      badgeLabel: 'Bàn Lễ Tân & Dược',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      avatarBg: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    DOCTOR: {
      badgeLabel: 'Bác Sĩ Chuyên Khoa',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    ADMIN: {
      badgeLabel: 'Quản Trị Hệ Thống',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
  }[role];

  // Helper to extract 2 initial letters for avatar
  const getInitials = (name?: string) => {
    if (!name) return 'NV';
    const cleanName = name.replace(/^(BS\.CKI|TS\.BS|BS|ThS)\s+/i, '').trim();
    const parts = cleanName.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return cleanName.slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    try { await logout(); }
    catch { /* Luôn xóa phiên cục bộ kể cả khi mất kết nối. */ }
    navigate('/staff/login', { replace: true });
  };

  return (
    <aside className="w-16 lg:w-60 bg-white border-r border-slate-200/90 flex flex-col shrink-0 h-screen sticky top-0 z-30 select-none">
      {/* Clinic Logo Header */}
      <div className="h-14 lg:h-16 px-2 lg:px-4 border-b border-slate-100 flex items-center justify-center lg:justify-between">
        <Link to="/" aria-label="Về trang chủ phòng khám" className="flex items-center gap-2.5">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white shadow-xs">
            <Activity className="h-5 w-5" />
          </div>
          <div className="hidden lg:block">
            <span className="text-sm font-bold text-slate-900 tracking-tight block leading-tight">
              ENT CLINIC
            </span>
            <span className="text-[11px] font-medium text-slate-500 block leading-tight">
              Tai Mũi Họng Tư Nhân
            </span>
          </div>
        </Link>
      </div>

      {/* Role Workspace Banner */}
      <div className="hidden lg:flex px-3 py-2 bg-slate-50/80 border-b border-slate-100 items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500">Phân hệ làm việc:</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${roleMeta.badgeColor}`}>
          {roleMeta.badgeLabel}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 lg:px-3 py-3 space-y-1 overflow-y-auto">
        <div className="hidden lg:block px-2 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Chức năng nghiệp vụ
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={item.label}
            aria-label={item.label}
            className={({ isActive }) =>
              `flex items-center justify-center lg:justify-start gap-2.5 px-2 lg:px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-800 font-semibold shadow-2xs border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="hidden lg:block truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Employee Profile & Logout Section */}
      <div className="p-1.5 lg:p-3 border-t border-slate-200/90 bg-slate-50/70 space-y-2">
        <div className="hidden lg:flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
          {/* Avatar chữ */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${roleMeta.avatarBg}`}
          >
            {getInitials(userName)}
          </div>
          {/* Thông tin nhân viên */}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate" title={userName}>
              {userName || 'Nhân viên y tế'}
            </p>
            <p className="text-[11px] text-slate-500 truncate" title={userTitle || roleMeta.badgeLabel}>
              {userTitle || roleMeta.badgeLabel}
            </p>
          </div>
        </div>

        {/* Nút Đăng xuất */}
        <button
          type="button"
          onClick={handleLogout}
          title="Đăng xuất"
          aria-label="Đăng xuất"
          className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50/70 hover:border-red-200 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};
