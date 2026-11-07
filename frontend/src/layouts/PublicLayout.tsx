import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Activity, Phone, Clock, MapPin, Calendar, Search, ShieldCheck, LogIn } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#20242B]">
      {/* Top Notice Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-teal-400" /> Giờ làm việc: Thứ 2 - Thứ 7: 07:30 - 20:00 | Chủ Nhật: 08:00 - 17:00
            </span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-blue-400" /> 125 Giải Phóng, Q. Đống Đa, Hà Nội
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a href="tel:19008899" className="text-teal-300 hover:text-white flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" /> Hotline: 1900 8899
            </a>
            <span className="text-slate-600">|</span>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white text-xs font-medium py-0.5 px-2.5 rounded-md hover:bg-slate-800 transition-colors"
            >
              <LogIn className="h-3.5 w-3.5 text-teal-400" />
              <span>Đăng nhập nhân viên</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 uppercase">
                  Phòng Khám Tai Mũi Họng
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                  ENT SPECIALIST
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Chuyên khoa Tai Mũi Họng Kỹ thuật cao • Nội soi NBI • Điều trị Chuyên sâu
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-blue-700 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-blue-700 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              Dịch vụ khám
            </NavLink>
            <NavLink
              to="/medical-history"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-blue-700 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Search className="h-4 w-4" />
              Tra cứu lịch sử khám
            </NavLink>
          </nav>

          {/* Action CTA */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50/50 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4 text-blue-600" />
              <span>Đăng nhập nhân viên</span>
            </Link>
            <Link
              to="/appointments/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all hover:shadow-md cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span>Đặt lịch khám ngay</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Activity className="h-5 w-5 text-teal-400" />
              <span>PHÒNG KHÁM TAI MŨI HỌNG TƯ NHÂN</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Hệ thống phòng khám chuyên khoa Tai Mũi Họng chuyên sâu, trang bị thiết bị nội soi NBI hiện đại, đo thính lực và điều trị các bệnh lý viêm xoang, amidan, viêm tai giữa.
            </p>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-medium">
              <ShieldCheck className="h-4 w-4" /> Giấy phép hoạt động Sở Y Tế cấp
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Dịch Vụ Nổi Bật</h4>
            <ul className="space-y-2">
              <li><Link to="/services" className="hover:text-white transition-colors">Nội soi Tai Mũi Họng ống mềm NBI</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Điều trị viêm xoang, viêm mũi dị ứng</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Khám & điều trị viêm tai giữa cấp/mạn</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Khám Amidan & VA trẻ em</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Đo thính lực đồ & nhĩ lượng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Dành Cho Bệnh Nhân</h4>
            <ul className="space-y-2">
              <li><Link to="/appointments/new" className="hover:text-white transition-colors">Đặt lịch khám trực tuyến (UC-01)</Link></li>
              <li><Link to="/medical-history" className="hover:text-white transition-colors">Tra cứu lịch sử khám bằng SĐT & OTP (UC-02)</Link></li>
              <li><span className="text-slate-500">Quy trình tiếp nhận & khám bệnh</span></li>
              <li><span className="text-slate-500">Bảng giá dịch vụ niêm yết</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Liên Hệ & Khám Bệnh</h4>
            <div className="space-y-2 text-slate-400">
              <p>📍 125 Giải Phóng, Q. Đống Đa, TP. Hà Nội</p>
              <p>☎️ Hotline cấp cứu & đặt lịch: <strong>1900 8899</strong></p>
              <p>🕒 Thứ 2 - Thứ 7: 07:30 - 20:00</p>
              <p>🕒 Chủ Nhật: 08:00 - 17:00</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 pt-6 flex flex-wrap justify-between items-center text-[11px] text-slate-500 gap-4">
          <p>© 2026 ENT Clinic Management System. Nền tảng quản lý phòng khám tư nhân chuẩn y tế.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-slate-300 flex items-center gap-1.5 transition-colors">
              <LogIn className="h-3.5 w-3.5 text-teal-400" />
              <span>Đăng nhập nhân viên</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

