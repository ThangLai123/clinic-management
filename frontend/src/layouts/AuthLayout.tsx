import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="flex-1 flex flex-col justify-center">
        <Outlet />
      </div>

      {/* Internal Staff Portal Footer */}
      <footer className="mt-8 text-center text-xs text-slate-400">
        <p>© 2026 ENT Clinic Management System. Cổng xác thực nội bộ nhân viên y tế.</p>
        <p className="text-[11px] text-slate-400/80 mt-1">
          Hệ thống bảo mật phòng khám Tai Mũi Họng. Truy cập trái phép bị nghiêm cấm.
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout;

