import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { StaffRole } from '../services/authService';

const landingByRole: Record<StaffRole, string> = {
  ADMIN: '/admin', DOCTOR: '/doctor', RECEPTIONIST: '/receptionist',
};

export function ProtectedRoute({ role }: { role: StaffRole }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Đang kiểm tra phiên đăng nhập...</div>;
  if (!user) return <Navigate to="/staff/login" replace state={{ from: location.pathname }} />;
  if (user.roleCode !== role) return <Navigate to={landingByRole[user.roleCode]} replace />;
  return <Outlet />;
}
