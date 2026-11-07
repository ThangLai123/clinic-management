import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Stethoscope, Filter, Search, ArrowRight, HeartPulse, Clock } from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';

export const DoctorQueuePage: React.FC = () => {
  const store = useClinicStore();

  const [selectedRoom, setSelectedRoom] = useState<string>('PK-01');
  const [searchTerm, setSearchTerm] = useState('');

  const waitingReceptions = store.receptions.filter((r) => {
    const matchRoom = selectedRoom === 'ALL' || r.assignedRoomId === selectedRoom;
    const matchSearch =
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phoneNumber.includes(searchTerm);
    const isWaiting = r.status === 'CHO_KHAM' || r.status === 'DANG_KHAM';
    return matchRoom && matchSearch && isWaiting;
  });

  return (
    <div className="space-y-6">
      <Topbar
        title="Hàng Đợi Khám Bệnh Chuyên Khoa Tai Mũi Họng"
        subtitle="Theo dõi bệnh nhân đang chờ theo từng buồng khám để điều phối thứ tự khám hợp lý."
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Lọc theo buồng khám:</span>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">Tất cả buồng khám</option>
            {store.rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomName} - {r.doctorName}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo Mã TN, tên người bệnh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Queue Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã TN / Giờ vào</th>
                <th className="py-3 px-4">Họ và Tên bệnh nhân</th>
                <th className="py-3 px-4">Buồng khám chỉ định</th>
                <th className="py-3 px-4">Mức độ ưu tiên</th>
                <th className="py-3 px-4">Lý do đến khám</th>
                <th className="py-3 px-4">Sinh hiệu</th>
                <th className="py-3 px-4 text-center">Bắt đầu khám</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {waitingReceptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Hiện tại không có bệnh nhân nào trong hàng chờ theo bộ lọc đã chọn.
                  </td>
                </tr>
              ) : (
                waitingReceptions.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {rec.id}
                      <span className="block text-[10px] text-slate-400 font-normal">{rec.receptionTime}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{rec.patientName}</span>
                      <span className="text-[11px] text-slate-500">{rec.phoneNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {rec.assignedRoomId || 'Chưa gán'}
                      <span className="block text-[11px] text-slate-400">{rec.assignedDoctorName}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="priority" value={rec.priority} />
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-medium text-slate-800 line-clamp-1">{rec.reason}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{rec.symptoms.join(', ')}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {rec.vitalSigns ? (
                        <span>
                          HA: {rec.vitalSigns.bloodPressure} • M: {rec.vitalSigns.pulse} • T: {rec.vitalSigns.temperature}°C
                        </span>
                      ) : (
                        <span className="text-slate-400">Chưa đo</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link to={`/doctor/examination?receptionId=${rec.id}`}>
                        <Button size="sm" variant="primary" leftIcon={<Stethoscope className="h-3.5 w-3.5" />}>
                          Mời vào khám (UC-10)
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

