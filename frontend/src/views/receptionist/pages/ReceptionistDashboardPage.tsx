import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  UserCheck,
  Pill,
  CheckSquare,
  Receipt,
  Users,
  Clock,
  ArrowRight,
  AlertCircle,
  Stethoscope,
  ShieldCheck,
  PackageCheck,
  CreditCard,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Topbar } from '../../../components/shared/Topbar';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import { GENDER_MAP } from '../../../types/database';

export const ReceptionistDashboardPage: React.FC = () => {
  const store = useClinicStore();

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAppointments = store.appointments.filter((a) => a.appointmentDate === todayStr);
  const pendingAppointments = todayAppointments.filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED');

  // Query 28.1 Priority Sorted Waiting Queue
  const waitingQueue = store.getWaitingQueue();
  const inExam = waitingQueue.find((q) => q.status === 'IN_EXAM');
  const waitingList = waitingQueue.filter((q) => q.status === 'WAITING');

  const pendingDispensations = store.dispensations.filter((d) => d.status === 'PENDING');
  const unpaidInvoices = store.invoices.filter((i) => i.status === 'UNPAID' || i.status === 'PARTIAL');

  // Low stock medicine lots (< 20 units or expiring soon)
  const lowStockLots = store.medicineLots.filter(
    (l) => l.quantity <= 30 || l.expiryDate <= '2026-12-31'
  );

  return (
    <div className="space-y-6">
      <Topbar
        title="Tổng quan lễ tân"
        subtitle="Tiếp nhận, hàng chờ, phát thuốc và thanh toán."
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Lịch hẹn hôm nay</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{todayAppointments.length}</p>
              <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
                {pendingAppointments.length} ca chờ đón tiếp
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Hàng chờ khám bệnh</p>
              <p className="text-2xl font-black text-amber-800 mt-1">{waitingList.length}</p>
              <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                {inExam ? '1 ca đang trong buồng khám' : 'Buồng khám đang trống'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-teal-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Đơn thuốc chờ phát</p>
              <p className="text-2xl font-black text-teal-800 mt-1">{pendingDispensations.length}</p>
              <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                Đơn thuốc đã ký duyệt
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Hóa đơn chờ thu</p>
              <p className="text-2xl font-black text-emerald-800 mt-1">{unpaidInvoices.length}</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                Viện phí & Dược phẩm
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions Bar */}
      <Card title="Thao tác nhanh">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
          <Link to="/receptionist/reception">
            <Button variant="outline" className="w-full justify-start !text-[11px] !h-9 !min-h-9 !px-2" leftIcon={<UserCheck className="h-4 w-4 text-blue-700" />}>
              Tiếp nhận bệnh nhân
            </Button>
          </Link>
          <Link to="/receptionist/queue">
            <Button variant="outline" className="w-full justify-start !text-[11px] !h-9 !min-h-9 !px-2" leftIcon={<Clock className="h-4 w-4 text-amber-600" />}>
              Hàng chờ ưu tiên
            </Button>
          </Link>
          <Link to="/receptionist/appointments">
            <Button variant="outline" className="w-full justify-start !text-[11px] !h-9 !min-h-9 !px-2" leftIcon={<Calendar className="h-4 w-4 text-blue-600" />}>
              Quản lý lịch hẹn
            </Button>
          </Link>
          <Link to="/receptionist/pharmacy">
            <Button variant="outline" className="w-full justify-start !text-[11px] !h-9 !min-h-9 !px-2" leftIcon={<Pill className="h-4 w-4 text-purple-600" />}>
              Kho thuốc & Lô FEFO
            </Button>
          </Link>
          <Link to="/receptionist/dispensing">
            <Button variant="outline" className="w-full justify-start !text-[11px] !h-9 !min-h-9 !px-2" leftIcon={<PackageCheck className="h-4 w-4 text-teal-600" />}>
              Phát thuốc theo đơn
            </Button>
          </Link>
          <Link to="/receptionist/billing">
            <Button variant="outline" className="w-full justify-start !text-[11px] !h-9 !min-h-9 !px-2" leftIcon={<Receipt className="h-4 w-4 text-emerald-600" />}>
              Thu ngân viện phí
            </Button>
          </Link>
        </div>
      </Card>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Waiting Queue (Query 28.1) */}
        <div className="lg:col-span-7 space-y-6">
          <Card
            title={`Hàng chờ khám bệnh ưu tiên (${waitingQueue.length})`}
            subtitle="Thứ tự gọi khám tự động: Ca đang khám ghim đầu, có lịch hẹn xếp trước vãng lai"
            action={
              <Link to="/receptionist/queue" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
                Xem toàn bộ <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            {waitingQueue.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Hiện tại không có bệnh nhân nào trong hàng chờ khám.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {waitingQueue.slice(0, 5).map((item, idx) => {
                  const isCurrent = item.status === 'IN_EXAM';

                  return (
                    <div
                      key={item.id}
                      className={`py-3 flex items-center justify-between text-xs gap-3 ${
                        isCurrent ? 'bg-blue-50/70 p-2.5 rounded-lg' : ''
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{item.patientName || 'Chưa có thông tin'}</span>
                          <StatusBadge type="receptionType" status={item.receptionType} />
                          <StatusBadge type="reception" status={item.status} />
                        </div>
                        <p className="text-slate-500">
                          Mã TN: <strong className="font-mono text-slate-700">{item.receptionCode}</strong> • Tiếp nhận:{' '}
                          {item.receivedAt ? item.receivedAt.slice(11, 16) : '--:--'}
                        </p>
                        <p className="text-slate-600 line-clamp-1 italic">
                          "{item.notes || 'Khám chuyên khoa Tai Mũi Họng'}"
                        </p>
                      </div>

                      <span className="font-mono text-xs font-bold text-slate-400 shrink-0">
                        #{idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Today's Appointments */}
          <Card
            title="Lịch hẹn bệnh nhân cần đón tiếp hôm nay"
            action={
              <Link to="/receptionist/appointments" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
                Xem tất cả ({todayAppointments.length}) <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            {todayAppointments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Chưa có lịch hẹn nào cho ngày hôm nay.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {todayAppointments.slice(0, 4).map((apt) => (
                  <div key={apt.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{apt.fullName || apt.patientName || 'Chưa có thông tin'}</span>
                        <StatusBadge type="appointment" status={apt.status} />
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        {apt.phone || apt.phoneNumber || 'Chưa cập nhật'} • Giờ hẹn: <strong className="text-blue-700">{apt.timeSlot}</strong>
                      </p>
                    </div>

                    {apt.status === 'CONFIRMED' && (
                      <Link to={`/receptionist/reception?fromApt=${apt.id}`}>
                        <Button size="sm" variant="outline" className="text-[11px]">
                          Tiếp nhận
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Pharmacy Alerts & Quick Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pharmacy Low-Stock & Expiry Alert */}
          <Card
            title="Cảnh báo lô thuốc & Hạn sử dụng"
            subtitle="Theo dõi các lô tồn kho thấp hoặc cận hạn sử dụng"
            action={
              <Link to="/receptionist/pharmacy" className="text-xs font-semibold text-blue-700 hover:underline">
                Kho thuốc
              </Link>
            }
          >
            {lowStockLots.length === 0 ? (
              <p className="text-xs text-emerald-700 py-4 text-center font-medium">
                Tất cả các lô thuốc đều đang ở mức an toàn.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {lowStockLots.slice(0, 4).map((lot) => {
                  const isExpiring = lot.expiryDate <= '2026-12-31';

                  return (
                    <div
                      key={lot.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isExpiring
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div>
                        <p className="font-bold">{lot.medicineName}</p>
                        <p className="text-[11px] font-mono">
                          Lô: {lot.lotNumber} • HSD: <strong>{lot.expiryDate}</strong>
                        </p>
                        <p className="text-[10px] mt-0.5">
                          Tồn kho hiện tại: <strong className="font-mono">{lot.quantity}</strong> đơn vị
                        </p>
                      </div>
                      <Link to="/receptionist/pharmacy">
                        <Button size="sm" variant="outline" className="text-[11px] bg-white shrink-0">
                          Điều chỉnh
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Quick Security & Audit Note */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              <span>Chính sách kiểm soát thu ngân & kho dược:</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Mọi giao dịch thu tiền viện phí qua tiền mặt hoặc chuyển khoản VietQR đều được lưu vết đầy đủ trên hệ thống kèm mã giao dịch ngân hàng và nhân viên thu ngân chịu trách nhiệm đối soát cuối ca.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};