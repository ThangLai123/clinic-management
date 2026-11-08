import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/shared/Sidebar';
import { useAuth } from '../auth/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex bg-[#F7F8FA] text-[#20242B]">
      <Sidebar
        role="ADMIN"
        userName={user?.fullName}
        userTitle="Quản trị viên"
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <main className="flex-1 min-w-0 p-4 sm:p-5 xl:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
