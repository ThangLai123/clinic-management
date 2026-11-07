import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Lock, User, Eye, EyeOff, ArrowLeft, LogIn, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập hoặc mã nhân viên';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmittedNotice(false);
      return;
    }

    // Validation passed
    setErrors({});
    setSubmittedNotice(true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Clinic Header / Logo */}
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-md group-hover:bg-blue-800 transition-colors">
            <Activity className="h-6 w-6" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold tracking-wider text-blue-700 block uppercase">
              Hệ thống quản lý
            </span>
            <span className="text-base font-extrabold text-slate-900 block leading-tight">
              Phòng Khám Tai Mũi Họng
            </span>
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Đăng nhập nhân viên</h1>
        <p className="text-xs text-slate-500 mt-1.5">
          Cổng thông tin làm việc dành riêng cho cán bộ y tế, bác sĩ và nhân viên phòng khám
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tên đăng nhập <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) {
                    setErrors((prev) => ({ ...prev, username: undefined }));
                  }
                }}
                placeholder="Nhập tên đăng nhập hoặc mã nhân viên"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border text-sm rounded-xl outline-none transition-all placeholder:text-slate-400 ${
                  errors.username
                    ? 'border-red-400 bg-red-50/20 text-slate-900 focus:ring-2 focus:ring-red-100 focus:border-red-500'
                    : 'border-slate-200 text-slate-800 hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                }`}
              />
            </div>
            {errors.username && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                <span className="w-1 h-1 rounded-full bg-red-600"></span>
                {errors.username}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                placeholder="Nhập mật khẩu truy cập"
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border text-sm rounded-xl outline-none transition-all placeholder:text-slate-400 ${
                  errors.password
                    ? 'border-red-400 bg-red-50/20 text-slate-900 focus:ring-2 focus:ring-red-100 focus:border-red-500'
                    : 'border-slate-200 text-slate-800 hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                <span className="w-1 h-1 rounded-full bg-red-600"></span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>Đăng nhập</span>
          </button>
        </form>

        {/* Development Temporary Feedback */}
        {submittedNotice && (
          <div className="mt-5 p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Biểu mẫu đã xác thực dữ liệu đầu vào thành công!</p>
                <p className="text-blue-700/90 text-[11px] mt-0.5">
                  Backend API đăng nhập & xác thực JWT chưa được kết nối. Để phục vụ kiểm thử giao diện trong môi trường phát triển (Development), bạn có thể truy cập trực tiếp các phân hệ bên dưới:
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-blue-200/70">
              <button
                type="button"
                onClick={() => navigate('/doctor')}
                className="px-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors"
              >
                Cổng Bác Sĩ
              </button>
              <button
                type="button"
                onClick={() => navigate('/receptionist')}
                className="px-2 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold transition-colors"
              >
                Cổng Lễ Tân
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-2 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold transition-colors"
              >
                Cổng Quản Trị
              </button>
            </div>
          </div>
        )}

        {/* Security Notice Note */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-500">
          <ShieldAlert className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            Hệ thống chỉ dành cho nhân sự được phân quyền tại phòng khám Tai Mũi Họng. Mọi hành vi truy cập trái phép đều được ghi nhận vào nhật ký kiểm toán hệ thống.
          </p>
        </div>
      </div>

      {/* Return to Home Link */}
      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Quay lại trang chủ phòng khám</span>
        </Link>
      </div>
    </div>
  );
};
