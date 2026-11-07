import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/shared/Sidebar';

export const ReceptionistLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#F7F8FA] text-[#20242B]">
      <Sidebar
        role="RECEPTIONIST"
        userName="Hoàng Thu Trang"
        userTitle="Lễ tân & Điều phối viện phí"
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
