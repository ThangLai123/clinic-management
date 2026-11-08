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
  History,
  PhoneCall,
  Globe,
  Building,
  UserX,
  Eye,
  Info,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import type { Appointment, AppointmentStatus, AppointmentSource } from '../../../types/clinic';
import {
  APPOINTMENT_STATUS_MAP,
  APPOINTMENT_SOURCE_MAP,
  GENDER_MAP,
} from '../../../types/database';

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
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Modal Reschedule State
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState(TIME_SLOTS[0]);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal Cancel State
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Bệnh nhân bận công tác đột xuất');

  // Modal View Details & History
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredAppointments = store.appointments.filter((apt) => {
    const matchSearch =
      (apt.fullName || apt.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.phone || apt.phoneNumber || '').includes(searchTerm) ||
      apt.appointmentCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    const matchSource = sourceFilter === 'ALL' || apt.source === sourceFilter;
    const matchDate = !dateFilter || apt.appointmentDate === dateFilter;

    return matchSearch && matchStatus && matchSource && matchDate;
  });

  const getSourceIcon = (source: AppointmentSource) => {
    switch (source) {
      case 'ONLINE':
        return <Globe className="h-3 w-3 text-blue-600 inline mr-1" />;
      case 'PHONE':
        return <PhoneCall className="h-3 w-3 text-emerald-600 inline mr-1" />;
      case 'AT_DESK':
        return <Building className="h-3 w-3 text-amber-600 inline mr-1" />;
    }
  };

  const handleOpenDetail = (apt: Appointment) => {
    setSelectedApt(apt);
    setIsDetailOpen(true);
  };

  const handleOpenReschedule = (apt: Appointment) => {
    setSelectedApt(apt);
    setNewDate(apt.appointmentDate);
    setNewSlot(apt.timeSlot || TIME_SLOTS[0]);
    setRescheduleError(null);
    setIsRescheduleOpen(true);
  };

  const handleConfirmReschedule = () => {
    if (!selectedApt) return;
    const todayStr = new Date().toISOString().slice(0, 10);
    if (!newDate) {
      setRescheduleError('Vui lòng chọn ngày khám mới.');
      return;
    }
    if (newDate < todayStr) {
      setRescheduleError('Không thể dời lịch khám về thời điểm trong quá khứ.');
      return;
    }
    const currentSlot = selectedApt.timeSlot || TIME_SLOTS[0];
    if (newDate === selectedApt.appointmentDate && newSlot === currentSlot) {
      setRescheduleError('Vui lòng chọn ngày hoặc khung giờ mới khác với lịch hẹn hiện tại.');
      return;
    }

    setIsRescheduling(true);
    setRescheduleError(null);

    setTimeout(() => {
      try {
        store.rescheduleAppointment(selectedApt.id, newDate, newSlot);
        setIsRescheduling(false);
        setIsRescheduleOpen(false);
        setFeedbackMsg({
          type: 'success',
          text: `Đã dời lịch hẹn của bệnh nhân ${selectedApt.fullName || selectedApt.patientName || 'Chưa có thông tin'} sang ngày ${newDate} (${newSlot}) thành công!`,
        });
        setTimeout(() => setFeedbackMsg(null), 4000);
      } catch {
        setIsRescheduling(false);
        setRescheduleError('Có lỗi xảy ra khi dời lịch hẹn. Vui lòng thử lại.');
      }
    }, 300);
  };

  const handleOpenCancel = (apt: Appointment) => {
    setSelectedApt(apt);
    setIsCancelOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedApt) return;
    store.updateAppointmentStatus(selectedApt.id, 'CANCELLED', cancelReason);
    setIsCancelOpen(false);
    setFeedbackMsg({
      type: 'success',
      text: `Đã hủy lịch hẹn của bệnh nhân ${selectedApt.fullName || selectedApt.patientName || 'Chưa có thông tin'}.`,
    });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleConfirmApt = (id: string) => {
    const apt = store.appointments.find((a) => a.id === id);
    store.updateAppointmentStatus(id, 'CONFIRMED', 'Lễ tân đã liên hệ xác nhận lịch khám thành công');
    setFeedbackMsg({
      type: 'success',
      text: `Đã duyệt xác nhận lịch hẹn của bệnh nhân ${apt?.fullName || apt?.patientName || 'Chưa có thông tin'}.`,
    });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleMarkNoShow = (id: string) => {
    const apt = store.appointments.find((a) => a.id === id);
    store.updateAppointmentStatus(id, 'NO_SHOW', 'Quá giờ hẹn 30 phút, bệnh nhân không đến và không liên lạc được');
    setFeedbackMsg({
      type: 'success',
      text: `Đã đánh dấu vắng mặt cho lịch hẹn của bệnh nhân ${apt?.fullName || apt?.patientName || 'Chưa có thông tin'}.`,
    });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Get history for selected appointment
  const currentHistory = selectedApt
    ? store.appointmentHistory.filter((h) => h.appointmentId === selectedApt.id)
    : [];

  return (
    <div className="space-y-6">
      <Topbar
        title="Quản lý lịch hẹn"
        subtitle="Xác nhận, dời, hủy lịch và tiếp nhận bệnh nhân."
      />

      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-400 hover:text-slate-600 text-xs px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs Filter by Status */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { key: 'ALL', label: 'Tất cả', count: store.appointments.length },
          { key: 'PENDING', label: 'Chờ duyệt', count: store.appointments.filter((a) => a.status === 'PENDING').length },
          { key: 'CONFIRMED', label: 'Đã duyệt', count: store.appointments.filter((a) => a.status === 'CONFIRMED').length },
          { key: 'CHECKED_IN', label: 'Đã tiếp nhận', count: store.appointments.filter((a) => a.status === 'CHECKED_IN').length },
          { key: 'NO_SHOW', label: 'Không đến', count: store.appointments.filter((a) => a.status === 'NO_SHOW').length },
          { key: 'CANCELLED', label: 'Đã hủy', count: store.appointments.filter((a) => a.status === 'CANCELLED').length },
        ].map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white px-4 py-3 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {/* Filter Source */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Nguồn:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">Tất cả nguồn</option>
              <option value="ONLINE">Đặt trực tuyến</option>
              <option value="PHONE">Qua điện thoại</option>
              <option value="AT_DESK">Tại quầy lễ tân</option>
            </select>
          </div>

          {/* Filter Date */}
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
                Xóa ngày
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 lg:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm mã hẹn, bệnh nhân, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Appointments Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[930px] text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã lịch hẹn</th>
                <th className="py-3 px-4">Bệnh nhân & SĐT</th>
                <th className="py-3 px-4">Ngày khám / Giờ hẹn</th>
                <th className="py-3 px-4">Nguồn</th>
                <th className="py-3 px-4">Triệu chứng & Ghi chú</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác xử lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không tìm thấy lịch hẹn nào theo điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-700 block">
                        {apt.appointmentCode || apt.id}
                      </span>
                      <span className="text-[11px] text-slate-400">{apt.createdAt}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{apt.fullName || apt.patientName || 'Chưa có thông tin'}</span>
                      <span className="text-[11px] text-slate-500">
                        {apt.phone || apt.phoneNumber || 'Chưa cập nhật'} • {GENDER_MAP[apt.gender] || apt.gender}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{apt.appointmentDate}</span>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {apt.timeSlot}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium text-slate-700 flex items-center">
                        {getSourceIcon(apt.source)}
                        {APPOINTMENT_SOURCE_MAP[apt.source]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-800 font-medium line-clamp-1">{apt.reason || apt.symptoms || 'Khám Tai Mũi Họng'}</p>
                      {apt.symptoms && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {apt.symptoms}
                        </p>
                      )}
                      {apt.notes && (
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 italic">
                          Ghi chú: {apt.notes}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge type="appointment" status={apt.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Xem chi tiết & lịch sử trạng thái"
                          onClick={() => handleOpenDetail(apt)}
                          leftIcon={<Eye className="h-3.5 w-3.5 text-slate-500" />}
                        >
                          Chi tiết
                        </Button>

                        {apt.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleConfirmApt(apt.id)}
                            leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                          >
                            Duyệt
                          </Button>
                        )}

                        {apt.status === 'CONFIRMED' && (
                          <>
                            <Link to={`/receptionist/reception?fromApt=${apt.id}`}>
                              <Button size="sm" variant="primary" leftIcon={<UserCheck className="h-3.5 w-3.5" />}>
                                Tiếp nhận
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-amber-700 hover:bg-amber-50"
                              onClick={() => handleMarkNoShow(apt.id)}
                              title="Bệnh nhân không đến khám"
                            >
                              Không đến
                            </Button>
                          </>
                        )}

                        {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
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

      {/* MODAL: View Detail & Status History */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Chi Tiết Lịch Hẹn & Lịch Sử Trạng Thái"
        subtitle={
          selectedApt
            ? `Mã lịch hẹn: ${selectedApt.appointmentCode || selectedApt.id} — ${selectedApt.fullName || selectedApt.patientName || 'Chưa có thông tin'}`
            : ''
        }
        footer={
          <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
            Đóng
          </Button>
        }
      >
        {selectedApt && (
          <div className="space-y-5 text-xs text-slate-700">
            {/* Appointment information summary */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">Họ tên người khám:</span>
                <span className="font-bold text-slate-900">{selectedApt.fullName || selectedApt.patientName || 'Chưa có thông tin'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Số điện thoại:</span>
                <span className="font-mono font-bold text-blue-700">{selectedApt.phone || selectedApt.phoneNumber || 'Chưa cập nhật'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Ngày hẹn / Giờ hẹn:</span>
                <span className="font-semibold text-slate-800">
                  {selectedApt.appointmentDate} ({selectedApt.timeSlot})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Kênh đặt lịch:</span>
                <span className="font-semibold text-slate-800">
                  {APPOINTMENT_SOURCE_MAP[selectedApt.source]}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[11px]">Triệu chứng & Lý do:</span>
                <span className="font-medium text-slate-800">
                  {selectedApt.reason || selectedApt.symptoms || 'Không ghi'}
                </span>
              </div>
            </div>

            {/* Status History */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <History className="h-4 w-4 text-blue-600" />
                Lịch sử thay đổi trạng thái ({currentHistory.length})
              </h4>

              {currentHistory.length === 0 ? (
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 italic">
                  Chưa ghi nhận thay đổi trạng thái nào cho lịch hẹn này.
                </p>
              ) : (
                <div className="space-y-2">
                  {currentHistory.map((h) => (
                    <div
                      key={h.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-600">
                            {h.oldStatus ? APPOINTMENT_STATUS_MAP[h.oldStatus]?.label : 'Khởi tạo'}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="font-bold text-blue-700">
                            {APPOINTMENT_STATUS_MAP[h.newStatus]?.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          <strong>Lý do:</strong> {h.reason || 'Cập nhật hệ thống'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Nhân viên xử lý: <strong>{h.changedByStaffName}</strong>
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {h.changedAt}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: Reschedule */}
      <Modal
        isOpen={isRescheduleOpen}
        onClose={() => {
          setIsRescheduleOpen(false);
          setRescheduleError(null);
        }}
        title="Dời Lịch Hẹn Khám Bệnh"
        subtitle={
          selectedApt
            ? `Bệnh nhân: ${selectedApt.fullName || selectedApt.patientName || 'Chưa có thông tin'} — Mã lịch hẹn: ${selectedApt.appointmentCode || selectedApt.id}`
            : ''
        }
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsRescheduleOpen(false);
                setRescheduleError(null);
              }}
              disabled={isRescheduling}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmReschedule}
              variant="primary"
              disabled={
                isRescheduling ||
                !newDate ||
                (selectedApt !== null &&
                  newDate === selectedApt.appointmentDate &&
                  newSlot === (selectedApt.timeSlot || TIME_SLOTS[0]))
              }
            >
              {isRescheduling ? 'Đang cập nhật...' : 'Cập nhật lịch mới'}
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
            onChange={(e) => {
              setNewDate(e.target.value);
              setRescheduleError(null);
            }}
            required
          />

          <Select
            label="Khung giờ hẹn mới"
            value={newSlot}
            onChange={(e) => {
              setNewSlot(e.target.value);
              setRescheduleError(null);
            }}
            options={TIME_SLOTS.map((t) => ({ value: t, label: t }))}
          />

          {rescheduleError && (
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{rescheduleError}</span>
            </div>
          )}

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-xs">
            Thông tin lịch hẹn sẽ được cập nhật sau khi bạn xác nhận.
          </div>
        </div>
      </Modal>

      {/* MODAL: Cancel with Reason */}
      <Modal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        title="Xác Nhận Hủy Lịch Hẹn"
        subtitle={
          selectedApt
            ? `Lịch hẹn: ${selectedApt.appointmentCode || selectedApt.id} — ${selectedApt.fullName || selectedApt.patientName || 'Chưa có thông tin'}`
            : ''
        }
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