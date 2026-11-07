import React, { useState } from 'react';
import {
  DoorOpen,
  Users,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import type { Reception } from '../../../types/clinic';

export const RoomAssignmentPage: React.FC = () => {
  const store = useClinicStore();

  const [selectedReception, setSelectedReception] = useState<Reception | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('PK-01');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Patients waiting for room assignment
  const waitingPatients = store.receptions.filter((r) => r.status === 'CHO_PHAN_PHONG');

  const handleOpenAssignModal = (rec: Reception) => {
    setSelectedReception(rec);
    // Suggest room based on priority/age (e.g. if pediatric or reason indicates child, suggest PK-02)
    if (rec.patientName.includes('Bé') || rec.reason.toLowerCase().includes('trẻ')) {
      setSelectedRoomId('PK-02');
    } else {
      setSelectedRoomId('PK-01');
    }
    setIsModalOpen(true);
  };

  const handleConfirmAssignment = () => {
    if (!selectedReception || !selectedRoomId) return;
    store.assignRoomToReception(selectedReception.id, selectedRoomId);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Phân Buồng Khám & Điều Phối Bác Sĩ"
        subtitle="Use Case 06: Gán bệnh nhân đã tiếp nhận vào buồng khám Tai Mũi Họng phù hợp để bác sĩ tiến hành thăm khám."
      />

      {/* Grid: Rooms Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {store.rooms.map((room) => {
          // Find patients currently waiting in this room
          const roomQueue = store.receptions.filter(
            (r) => r.assignedRoomId === room.id && (r.status === 'CHO_KHAM' || r.status === 'DANG_KHAM')
          );

          return (
            <Card
              key={room.id}
              className="border-t-4 border-t-blue-700 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {room.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{room.roomName}</h3>
                    <p className="text-xs text-blue-700 font-semibold">{room.doctorName}</p>
                  </div>
                  <StatusBadge type="room" value={room.status} />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <p className="text-slate-500">Chuyên môn:</p>
                  <p className="font-medium text-slate-800">{room.specialty}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Hàng chờ hiện tại:</span>
                  <span className="font-bold text-sm text-blue-700">{roomQueue.length} người</span>
                </div>

                {/* Queue Mini List */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Bệnh nhân đang chờ trong buồng:
                  </span>
                  {roomQueue.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">Buồng khám đang trống</p>
                  ) : (
                    roomQueue.map((q) => (
                      <div
                        key={q.id}
                        className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 block">{q.patientName}</span>
                          <span className="text-[10px] text-slate-500">{q.reason}</span>
                        </div>
                        <StatusBadge type="reception" value={q.status} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Waiting List for Room Assignment */}
      <Card
        title={`Bệnh nhân đã tiếp nhận đang chờ phân phòng (${waitingPatients.length})`}
        subtitle="Vui lòng chọn buồng khám phù hợp theo chuyên khoa người lớn hoặc nhi khoa"
      >
        {waitingPatients.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
            <p className="font-medium text-slate-700">Tất cả bệnh nhân tiếp nhận đã được phân phòng khám thành công!</p>
            <p>Hệ thống sẵn sàng đón tiếp các lượt khám tiếp theo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Mã tiếp nhận</th>
                  <th className="py-3 px-4">Bệnh nhân & SĐT</th>
                  <th className="py-3 px-4">Lý do & Triệu chứng</th>
                  <th className="py-3 px-4">Mức ưu tiên</th>
                  <th className="py-3 px-4">Sinh hiệu</th>
                  <th className="py-3 px-4 text-center">Phân buồng khám</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {waitingPatients.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-700 block">{rec.id}</span>
                      <span className="text-[11px] text-slate-400">Tiếp nhận lúc: {rec.receptionTime}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{rec.patientName}</span>
                      <span className="text-[11px] text-slate-500">{rec.phoneNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-800 font-medium">{rec.reason}</p>
                      <p className="text-[11px] text-slate-500">{rec.symptoms.join(', ')}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="priority" value={rec.priority} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {rec.vitalSigns ? (
                        <span>
                          HA: {rec.vitalSigns.bloodPressure} • Mạch: {rec.vitalSigns.pulse} • T°: {rec.vitalSigns.temperature}°C
                        </span>
                      ) : (
                        <span className="text-slate-400">Chưa đo</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleOpenAssignModal(rec)}
                        leftIcon={<DoorOpen className="h-4 w-4" />}
                      >
                        Chọn buồng khám
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* MODAL: Assign Room */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gán Bệnh Nhân Vào Buồng Khám"
        subtitle={selectedReception ? `${selectedReception.patientName} (${selectedReception.id})` : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmAssignment} variant="primary">
              Xác nhận chuyển buồng khám
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 space-y-1">
            <p><strong>Lý do khám:</strong> {selectedReception?.reason}</p>
            <p><strong>Triệu chứng:</strong> {selectedReception?.symptoms.join(', ')}</p>
          </div>

          <Select
            label="Chọn buồng khám Tai Mũi Họng"
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            options={store.rooms.map((r) => ({
              value: r.id,
              label: `${r.roomName} - ${r.doctorName} (Đang chờ: ${r.waitingCount} người)`,
            }))}
          />

          <p className="text-slate-500 text-[11px]">
            * Sau khi xác nhận, bệnh nhân sẽ ngay lập tức xuất hiện trong danh sách chờ khám trên màn hình Bác sĩ (UC-10).
          </p>
        </div>
      </Modal>
    </div>
  );
};

