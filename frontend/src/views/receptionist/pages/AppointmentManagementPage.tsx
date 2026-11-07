import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import type { Appointment, AppointmentStatus } from '../../../types/clinic';

const TIME_SLOTS = [
  '08:00 - 08:30',
  '08:30 - 09:00',
  '09:00 - 09:30',
  '09:30 - 10:00',
  '10:00 - 10:30',
  '10:30 - 11:00',
  '14:00 - 14:30',
  '14:30 - 15:00',
  '15:00 - 15:30',
  '15:30 - 16:00',
  '16:00 - 16:30',
  '16:30 - 17:00',
];

export const AppointmentManagementPage: React.FC = () => {
  const store = useClinicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Modal Reschedule State
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState(TIME_SLOTS[0]);

  // Modal Cancel State
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Bệnh nhân bận công tác đột xuất');

  const filteredAppointments = store.appointments.filter((apt) => {
    const matchSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phoneNumber.includes(searchTerm) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    const matchDate = !dateFilter || apt.appointmentDate === dateFilter;

    return matchSearch && matchStatus && matchDate;
  });

  const handleOpenReschedule = (apt: Appointment) => {
    setSelectedApt(apt);
    setNewDate(apt.appointmentDate);
    setNewSlot(apt.timeSlot);
    setIsRescheduleOpen(true);
  };

  const handleConfirmReschedule = () => {
    if (!selectedApt || !newDate || !newSlot) return;
    store.rescheduleAppointment(selectedApt.id, newDate, newSlot);
    setIsRescheduleOpen(false);
  };

  const handleOpenCancel = (apt: Appointment) => {
    setSelectedApt(apt);
    setIsCancelOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedApt) return;
    store.updateAppointmentStatus(selectedApt.id, 'DA_HUY', cancelReason);
    setIsCancelOpen(false);
  };

  const handleConfirmApt = (id: string) => {
    store.updateAppointmentStatus(id, 'DA_XAC_NHAN');
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Quản Lý Lịch Hẹn Khám Bệnh"
        subtitle="Use Case 05: Theo dõi, xác nhận, dời lịch và hủy lịch hẹn của bệnh nhân đăng ký trực tuyến."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
              <option value="DA_XAC_NHAN">Đã xác nhận</option>
              <option value="DA_TIEP_NHAN">Đã tiếp nhận</option>
              <option value="DA_HUY">Đã hủy</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Lọc ngày:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-[11px] text-blue-700 hover:underline"
              >
                Xóa lọc ngày
              </button>
            )}
          </div>
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo mã LH, tên người bệnh, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Appointments Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã lịch hẹn</th>
                <th className="py-3 px-4">Bệnh nhân & SĐT</th>
                <th className="py-3 px-4">Ngày khám / Giờ hẹn</th>
                <th className="py-3 px-4">Lý do & Triệu chứng</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác xử lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Không tìm thấy lịch hẹn nào theo điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-700 block">{apt.id}</span>
                      <span className="text-[11px] text-slate-400">{apt.createdAt}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{apt.patientName}</span>
                      <span className="text-[11px] text-slate-500">{apt.phoneNumber}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{apt.appointmentDate}</span>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {apt.timeSlot}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-800 font-medium line-clamp-1">{apt.reason}</p>
                      {apt.symptoms.length > 0 && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          Triệu chứng: {apt.symptoms.join(', ')}
                        </p>
                      )}
                      {apt.cancelReason && (
                        <p className="text-[11px] text-rose-600 mt-0.5">Lý do hủy: {apt.cancelReason}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge type="appointment" value={apt.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {apt.status === 'CHO_XAC_NHAN' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleConfirmApt(apt.id)}
                            leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                          >
                            Xác nhận
                          </Button>
                        )}

                        {apt.status === 'DA_XAC_NHAN' && (
                          <Link to={`/receptionist/reception?fromApt=${apt.id}`}>
                            <Button size="sm" variant="primary" leftIcon={<UserCheck className="h-3.5 w-3.5" />}>
                              Tiếp nhận (UC-04)
                            </Button>
                          </Link>
                        )}

                        {apt.status !== 'DA_TIEP_NHAN' && apt.status !== 'DA_HUY' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenReschedule(apt)}
                            >
                              Đổi giờ
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                              onClick={() => handleOpenCancel(apt)}
                            >
                              Hủy
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: Reschedule */}
      <Modal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        title="Dời Lịch Hẹn Khám Bệnh"
        subtitle={selectedApt ? `Bệnh nhân: ${selectedApt.patientName} (${selectedApt.id})` : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmReschedule} variant="primary">
              Cập nhật lịch mới
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Ngày hẹn mới"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
          />

          <Select
            label="Khung giờ hẹn mới"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            options={TIME_SLOTS.map((t) => ({ value: t, label: t }))}
          />

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
            Sau khi dời lịch, hệ thống sẽ chuyển trạng thái lịch hẹn thành <strong>Đã xác nhận</strong> và cập nhật thông tin trong hàng đợi của Lễ tân.
          </div>
        </div>
      </Modal>

      {/* MODAL: Cancel with Reason */}
      <Modal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        title="Xác Nhận Hủy Lịch Hẹn"
        subtitle={selectedApt ? `Lịch hẹn: ${selectedApt.id} - ${selectedApt.patientName}` : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
              Đóng
            </Button>
            <Button onClick={handleConfirmCancel} variant="danger">
              Xác nhận hủy lịch hẹn
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Vui lòng nhập lý do hủy lịch để lưu vết quản lý trên hệ thống:
          </p>

          <Select
            label="Lý do hủy"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            options={[
              { value: 'Bệnh nhân bận công tác đột xuất', label: 'Bệnh nhân bận công tác đột xuất' },
              { value: 'Bệnh nhân đổi ý muốn khám cơ sở khác', label: 'Bệnh nhân đổi ý muốn khám cơ sở khác' },
              { value: 'Bệnh nhân không nghe máy khi gọi xác nhận', label: 'Bệnh nhân không nghe máy khi gọi xác nhận' },
              { value: 'Trùng lịch hẹn khác', label: 'Trùng lịch hẹn khác' },
              { value: 'Triệu chứng đã đỡ, không có nhu cầu khám nữa', label: 'Triệu chứng đã đỡ, không có nhu cầu khám nữa' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

