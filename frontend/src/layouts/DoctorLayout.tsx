import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/shared/Sidebar';

export const DoctorLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#F7F8FA] text-[#20242B]">
      <Sidebar
        role="DOCTOR"
        userName="BS.CKI Lê Hoàng Nam"
        userTitle="Bác sĩ Phụ trách PK Tai Mũi Họng 1"
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
