import React from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
      
      {/* Footer copyright */}
      <div className="mt-8 text-center text-xs text-slate-400">
        <p>© 2026 ENT Clinic Management System. All rights reserved.</p>
      </div>
    </div>
  );
};
