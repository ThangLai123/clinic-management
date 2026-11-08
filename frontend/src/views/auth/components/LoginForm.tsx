import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Lock, User, Eye, EyeOff, ArrowLeft, LogIn, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [loginError, setLoginError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (username.trim().length > 80) {
      newErrors.username = 'Tên đăng nhập không được vượt quá 80 ký tự';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoginError('');
    setSubmitting(true);
    try {
      const user = await login(username.trim(), password);
      const redirectByRole = {
        ADMIN: '/admin',
        DOCTOR: '/doctor',
        RECEPTIONIST: '/receptionist',
      };
      navigate(redirectByRole[user.roleCode], { replace: true });
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Đăng nhập không thành công.');
    } finally {
      setSubmitting(false);
    }
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
                placeholder="Nhập tên đăng nhập"
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
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LogIn className="h-4 w-4" />
            <span>{submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
          </button>
        </form>

        {loginError && (
          <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {loginError}
          </p>
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

