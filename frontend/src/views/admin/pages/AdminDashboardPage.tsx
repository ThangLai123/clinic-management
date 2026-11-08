import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  UserCheck,
  Stethoscope,
  Activity,
  Lock,
  ArrowRight,
  Database,
  History,
  Calendar,
  DollarSign,
  TrendingUp,
  Receipt,
  Pill,
  CreditCard,
  Building,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import { ROLE_MAP } from '../../../types/database';

export const AdminDashboardPage: React.FC = () => {
  const store = useClinicStore();

  const [period, setPeriod] = useState<'DAY' | 'MONTH' | 'YEAR'>('MONTH');

  // Dynamic Aggregations across the 25 tables (No statistics table)
  const totalStaff = store.staffUsers.length;
  const activeStaff = store.staffUsers.filter((u) => u.status === 'ACTIVE').length;
  const totalPatients = store.patients.length;
  const totalAppointments = store.appointments.length;
  const totalReceptions = store.receptions.length;
  const totalExams = store.examinations.length;
  const totalPrescriptions = store.prescriptions.length;

  // Invoices & Revenue calculation
  const totalRevenue = store.invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const pendingRevenue = store.invoices
    .filter((inv) => inv.status === 'UNPAID' || inv.status === 'PARTIAL')
    .reduce((sum, inv) => sum + (inv.remainingAmount || inv.totalAmount), 0);

  // Cash vs Bank transfer
  const allPayments = store.invoices.flatMap((inv) => inv.payments || []);
  const cashPayments = allPayments.filter((p) => p.paymentMethod === 'CASH');
  const bankPayments = allPayments.filter((p) => p.paymentMethod === 'BANK_TRANSFER');
  const cashTotal = cashPayments.reduce((sum, p) => sum + p.amount, 0);
  const bankTotal = bankPayments.reduce((sum, p) => sum + p.amount, 0);

  // Reception type breakdown
  const appointmentReceptions = store.receptions.filter((r) => r.receptionType === 'APPOINTMENT').length;
  const walkInReceptions = store.receptions.filter((r) => r.receptionType === 'WALK_IN').length;

  return (
    <div className="space-y-6">
      <Topbar
        title="Tổng quan phòng khám"
        subtitle="Thống kê lượt khám, doanh thu và nhân sự."
        actions={
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200" role="group" aria-label="Kỳ báo cáo">
            {(['DAY', 'MONTH', 'YEAR'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 text-xs font-semibold whitespace-nowrap rounded-md transition-all ${
                  period === p
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p === 'DAY' ? 'Ngày' : p === 'MONTH' ? 'Tháng' : 'Năm'}
              </button>
            ))}
          </div>
        }
      />

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Doanh thu đã thu</p>
              <p className="text-xl font-extrabold text-emerald-800 mt-1 tabular-nums break-words">
                {totalRevenue.toLocaleString('vi-VN')} ₫
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 break-words">
                Chờ thu: {pendingRevenue.toLocaleString('vi-VN')} ₫
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Lượt tiếp nhận khám</p>
              <p className="text-2xl font-black text-blue-900 mt-1">{totalReceptions}</p>
              <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
                {appointmentReceptions} có hẹn • {walkInReceptions} vãng lai
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Hồ sơ bệnh nhân</p>
              <p className="text-2xl font-black text-purple-900 mt-1">{totalPatients}</p>
              <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
                {store.phoneLinks.length} liên kết SĐT OTP
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Nhân sự phòng khám</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{totalStaff}</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                {activeStaff} tài khoản ACTIVE
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Grid: Financial & Operational Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Financial & Service Breakdown */}
        <div className="lg:col-span-6 space-y-6">
          {/* Revenue by Payment Method */}
          <Card
            title="Cơ cấu doanh thu theo phương thức thanh toán"
            subtitle="Phân bổ theo hình thức thanh toán của người bệnh"
          >
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">
                      Chuyển khoản / VietQR
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {bankPayments.length} giao dịch thành công
                    </span>
                  </div>
                </div>
                <span className="text-base font-extrabold text-blue-800">
                  {bankTotal.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">
                      Tiền mặt tại quầy
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {cashPayments.length} giao dịch thành công
                    </span>
                  </div>
                </div>
                <span className="text-base font-extrabold text-emerald-800">
                  {cashTotal.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>
          </Card>

          {/* Clinical Services Volume */}
          <Card
            title="Dịch vụ khám & thủ thuật thực hiện"
            subtitle="Thống kê theo các gói dịch vụ và kỹ thuật chuyên khoa"
          >
            <div className="space-y-2 text-xs">
              {store.clinicalServices.map((svc) => {
                const count = store.visitServices.filter((vs) => vs.clinicalServiceId === svc.id).length;
                const revenue = count * svc.price;

                return (
                  <div
                    key={svc.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-blue-300 transition-all"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{svc.serviceName}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {svc.serviceCode} • Đơn giá: {svc.price.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">{count} lượt</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {revenue.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Reception & Staff Breakdown */}
        <div className="lg:col-span-6 space-y-6">
          {/* Patient Stream Breakdown */}
          <Card
            title="Cơ cấu luồng bệnh nhân tiếp nhận"
            subtitle="Tỷ lệ người bệnh đặt hẹn trước so với đến khám trực tiếp"
          >
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-center space-y-1">
                <span className="text-slate-500 block">Có lịch hẹn trước</span>
                <span className="text-3xl font-black text-blue-900">{appointmentReceptions}</span>
                <span className="text-[11px] text-blue-700 font-medium block">
                  Ưu tiên theo khung giờ
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                <span className="text-slate-500 block">Khám vãng lai trực tiếp</span>
                <span className="text-3xl font-black text-slate-800">{walkInReceptions}</span>
                <span className="text-[11px] text-slate-600 font-medium block">
                  Xếp hàng theo thời điểm đến
                </span>
              </div>
            </div>
          </Card>

          {/* Active Staff List */}
          <Card
            title="Nhân sự y tế đang hoạt động"
            action={
              <Link to="/admin/users" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
                Quản lý <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            <div className="divide-y divide-slate-100 text-xs">
              {store.staffUsers.map((user) => (
                <div key={user.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{user.fullName}</span>
                    <span className="block text-[11px] text-slate-400 font-mono">
                      {user.staffCode} • @{user.username}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 block mb-0.5">
                      {ROLE_MAP[user.role]}
                    </span>
                    <StatusBadge type="staff" status={user.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};