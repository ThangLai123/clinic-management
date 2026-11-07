import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  UserCheck,
  Stethoscope,
  Activity,
  Lock,
  ArrowRight,
  Server,
  Database,
  History,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useClinicStore } from '../../../mock/clinicStore';

export const AdminDashboardPage: React.FC = () => {
  const store = useClinicStore();

  const totalUsers = store.staffUsers.length;
  const doctorsCount = store.staffUsers.filter((u) => u.role === 'DOCTOR').length;
  const receptionistsCount = store.staffUsers.filter((u) => u.role === 'RECEPTIONIST').length;
  const adminsCount = store.staffUsers.filter((u) => u.role === 'ADMIN').length;
  const activeCount = store.staffUsers.filter((u) => u.isActive).length;

  return (
    <div className="space-y-6">
      <Topbar
        title="Trung Tâm Quản Trị Hệ Thống Phòng Khám"
        subtitle="Giám sát tài khoản nhân viên, phân quyền vai trò y tế và bảo mật hệ thống thông tin phòng khám."
        badge={<Badge variant="purple" dot>Phiên bản Quản trị v1.0</Badge>}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Tổng tài khoản nhân sự</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{totalUsers}</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                {activeCount} tài khoản đang hoạt động
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Bác sĩ chuyên khoa</p>
              <p className="text-2xl font-black text-emerald-800 mt-1">{doctorsCount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Quyền: Khám & Kê đơn</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Lễ tân & Dược tá</p>
              <p className="text-2xl font-black text-amber-800 mt-1">{receptionistsCount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Quyền: Tiếp nhận & Thu viện phí</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Quản trị viên (Admin)</p>
              <p className="text-2xl font-black text-purple-800 mt-1">{adminsCount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Toàn quyền hệ thống</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Staff Accounts Summary */}
        <div className="lg:col-span-8 space-y-4">
          <Card
            title="Danh sách tài khoản nhân viên y tế (UC-13)"
            subtitle="Phân quyền vai trò: Admin, Doctor, Receptionist"
            action={
              <Link to="/admin/users">
                <Button size="sm" variant="outline" rightIcon={<ArrowRight className="h-3 w-3" />}>
                  Quản lý chi tiết
                </Button>
              </Link>
            }
          >
            <div className="divide-y divide-slate-100 text-xs">
              {store.staffUsers.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{u.fullName}</span>
                      <span className="font-mono text-[10px] text-slate-400">{u.username}</span>
                    </div>
                    <p className="text-slate-500 mt-0.5">{u.specialty || u.email}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'DOCTOR'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {u.role}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        u.isActive ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {u.isActive ? '● Đang hoạt động' : '○ Bị khóa'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Security & Architecture Info */}
        <div className="lg:col-span-4 space-y-4">
          <Card title="Nguyên tắc an toàn & Phân quyền">
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1">
                <p className="font-bold text-blue-900">Bảo vệ quyền truy cập thật:</p>
                <p className="text-blue-800 leading-relaxed text-[11px]">
                  Việc ẩn menu ở giao diện React chỉ phục vụ trải nghiệm người dùng. Khi tích hợp thực tế, Backend ASP.NET Core sẽ thực thi JWT và Role-based Authorization cho mọi request.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">Quyền hạn Bác sĩ (Doctor):</p>
                <p className="text-slate-500 text-[11px]">
                  Truy cập buồng khám, ghi bệnh án Tai Mũi Họng, chỉ định nội soi NBI và kê đơn thuốc. Không được lập hóa đơn hay thu tiền.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">Quyền hạn Lễ tân (Receptionist):</p>
                <p className="text-slate-500 text-[11px]">
                  Tiếp nhận, phân phòng, quản lý kho thuốc, phát thuốc theo đơn đã hoàn tất và thu viện phí. Không được sửa chẩn đoán y khoa.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
