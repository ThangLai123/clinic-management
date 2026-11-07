import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  UserCheck,
  DoorOpen,
  Pill,
  CheckSquare,
  Receipt,
  Users,
  Clock,
  ArrowRight,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Topbar } from '../../../components/shared/Topbar';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';

export const ReceptionistDashboardPage: React.FC = () => {
  const store = useClinicStore();

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAppointments = store.appointments.filter((a) => a.appointmentDate === todayStr);
  const pendingAppointments = todayAppointments.filter((a) => a.status === 'CHO_XAC_NHAN' || a.status === 'DA_XAC_NHAN');

  const pendingReceptions = store.receptions.filter((r) => r.status === 'CHO_PHAN_PHONG');
  const waitingExams = store.receptions.filter((r) => r.status === 'CHO_KHAM' || r.status === 'DANG_KHAM');
  const pendingRx = store.prescriptions.filter((p) => p.status === 'CHO_PHAT');
  const pendingInvoices = store.invoices.filter((i) => i.status === 'CHO_THANH_TOAN');

  // Medicines with low stock or near expiry
  const lowStockMeds = store.medicines.filter((m) => m.stockQuantity <= m.minStockLevel);

  return (
    <div className="space-y-6">
      <Topbar
        title="Bàn Làm Việc Lễ Tân & Điều Phối Viện Phí"
        subtitle="Theo dõi tiếp nhận người bệnh, lịch hẹn, phân buồng khám và quản lý dược viện phí."
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Lịch hẹn hôm nay</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{todayAppointments.length}</p>
              <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
                {pendingAppointments.length} ca chờ tiếp nhận
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
              <p className="text-xs text-slate-500 font-medium">Chờ phân phòng</p>
              <p className="text-2xl font-black text-amber-800 mt-1">{pendingReceptions.length}</p>
              <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                {waitingExams.length} ca đang chờ khám
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <DoorOpen className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-teal-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Đơn thuốc chờ phát</p>
              <p className="text-2xl font-black text-teal-800 mt-1">{pendingRx.length}</p>
              <p className="text-[11px] text-teal-700 font-semibold mt-0.5">Quầy dược sẵn sàng</p>
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
              <p className="text-2xl font-black text-emerald-800 mt-1">{pendingInvoices.length}</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Tiền khám & thuốc</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions Bar */}
      <Card title="Thao tác nhanh cho Lễ tân">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/receptionist/reception">
            <Button variant="outline" className="w-full justify-start text-xs h-12" leftIcon={<UserCheck className="h-4 w-4 text-blue-700" />}>
              Tiếp nhận bệnh nhân (UC-04)
            </Button>
          </Link>
          <Link to="/receptionist/room-assignment">
            <Button variant="outline" className="w-full justify-start text-xs h-12" leftIcon={<DoorOpen className="h-4 w-4 text-amber-600" />}>
              Phân phòng khám (UC-06)
            </Button>
          </Link>
          <Link to="/receptionist/dispensing">
            <Button variant="outline" className="w-full justify-start text-xs h-12" leftIcon={<Pill className="h-4 w-4 text-teal-600" />}>
              Phát thuốc theo đơn (UC-08)
            </Button>
          </Link>
          <Link to="/receptionist/billing">
            <Button variant="outline" className="w-full justify-start text-xs h-12" leftIcon={<Receipt className="h-4 w-4 text-emerald-600" />}>
              Thu ngân & Viện phí (UC-09)
            </Button>
          </Link>
        </div>
      </Card>

      {/* Middle Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Receptions & Appointments */}
        <div className="lg:col-span-7 space-y-6">
          <Card
            title="Lịch hẹn bệnh nhân cần tiếp nhận hôm nay"
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
                {todayAppointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="py-3 flex items-center justify-between text-xs gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{apt.patientName}</span>
                        <StatusBadge type="appointment" value={apt.status} />
                      </div>
                      <p className="text-slate-500">
                        {apt.phoneNumber} • Giờ hẹn: <strong className="text-blue-700">{apt.timeSlot}</strong>
                      </p>
                      <p className="text-slate-600 line-clamp-1 italic">"{apt.reason}"</p>
                    </div>

                    {apt.status !== 'DA_TIEP_NHAN' && apt.status !== 'DA_HUY' && (
                      <Link to={`/receptionist/reception?fromApt=${apt.id}`}>
                        <Button size="sm" variant="outline">
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

        {/* Right: Room Statuses & Stock Alerts */}
        <div className="lg:col-span-5 space-y-6">
          <Card
            title="Trạng thái các buồng khám Tai Mũi Họng"
            action={
              <Link to="/receptionist/room-assignment" className="text-xs font-semibold text-blue-700 hover:underline">
                Điều phối
              </Link>
            }
          >
            <div className="space-y-3">
              {store.rooms.map((room) => (
                <div key={room.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{room.roomName}</h4>
                    <p className="text-slate-500">{room.doctorName}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge type="room" value={room.status} />
                      <span className="text-[11px] font-semibold text-blue-700">
                        {room.waitingCount} người đang chờ
                      </span>
                    </div>
                  </div>

                  <Link to="/receptionist/room-assignment">
                    <Button size="sm" variant="ghost">
                      Chi tiết
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>

          {/* Pharmacy Alert */}
          {lowStockMeds.length > 0 && (
            <Card title="Cảnh báo tồn kho thuốc (UC-03)">
              <div className="space-y-2 text-xs">
                {lowStockMeds.map((med) => (
                  <div key={med.id} className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between text-amber-900">
                    <div>
                      <p className="font-bold">{med.name} ({med.brandName})</p>
                      <p className="text-[11px] text-amber-700">
                        Tồn kho: <strong>{med.stockQuantity} {med.unit}</strong> (Mức an toàn: {med.minStockLevel})
                      </p>
                    </div>
                    <Link to="/receptionist/pharmacy">
                      <Button size="sm" variant="outline" className="text-[11px] bg-white">
                        Nhập kho
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
