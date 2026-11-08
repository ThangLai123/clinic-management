import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Users,
  Search,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Calendar,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import { GENDER_MAP, RECEPTION_TYPE_MAP } from '../../../types/database';

export const ReceptionQueuePage: React.FC = () => {
  const store = useClinicStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'APPOINTMENT' | 'WALK_IN'>('ALL');

  // Query 28.1 Priority Sorted Waiting Queue
  const queue = store.getWaitingQueue();

  const filteredQueue = queue.filter((item) => {
    const matchSearch =
      (item.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.receptionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.patient?.phone && item.patient.phone.includes(searchTerm));

    const matchType = typeFilter === 'ALL' || item.receptionType === typeFilter;

    return matchSearch && matchType;
  });

  const inExamItem = queue.find((item) => item.status === 'IN_EXAM');
  const waitingItems = queue.filter((item) => item.status === 'WAITING');
  const appointmentCount = waitingItems.filter((i) => i.receptionType === 'APPOINTMENT').length;
  const walkInCount = waitingItems.filter((i) => i.receptionType === 'WALK_IN').length;

  const handleCancelReception = (receptionId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lượt tiếp nhận này không?')) {
      store.updateReceptionStatus(receptionId, 'CANCELLED');
    }
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Hàng chờ khám bệnh"
        subtitle="Theo dõi thứ tự khám và ưu tiên người đã đặt lịch."
        actions={
          <Link to="/receptionist/reception">
            <Button size="sm" leftIcon={<UserCheck className="h-4 w-4" />}>
              Tiếp nhận mới
            </Button>
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Đang khám</p>
            <p className="mt-1 text-[26px] leading-8 font-bold tracking-tight tabular-nums text-blue-700">
              {inExamItem ? 1 : 0}<span className="ml-1.5 text-xs font-medium text-slate-500">người</span>
            </p>
          </div>
          <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Stethoscope className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Đang chờ khám</p>
            <p className="mt-1 text-[26px] leading-8 font-bold tracking-tight tabular-nums text-slate-900">
              {waitingItems.length}<span className="ml-1.5 text-xs font-medium text-slate-500">người</span>
            </p>
          </div>
          <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-blue-50/30 p-3.5 rounded-xl border border-blue-200 shadow-xs flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-blue-700">Có lịch hẹn trước</p>
            <p className="mt-1 text-[26px] leading-8 font-bold tracking-tight tabular-nums text-blue-900">
              {appointmentCount}<span className="ml-1.5 text-xs font-medium text-slate-500">người</span>
            </p>
          </div>
          <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Khám trực tiếp</p>
            <p className="mt-1 text-[26px] leading-8 font-bold tracking-tight tabular-nums text-slate-800">
              {walkInCount}<span className="ml-1.5 text-xs font-medium text-slate-500">người</span>
            </p>
          </div>
          <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Priority Rule Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold text-sm text-blue-900">Quy tắc sắp xếp thứ tự gọi khám tự động:</p>
            <p className="text-blue-800 mt-0.5 leading-relaxed">
              1. Bệnh nhân đang khám được xếp ở vị trí đầu tiên • 
              2. Bệnh nhân có lịch hẹn trước được ưu tiên gọi khám đúng theo khung giờ đã đặt • 
              3. Bệnh nhân đến khám trực tiếp được phục vụ lần lượt theo số thứ tự tiếp nhận tại quầy.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Phân loại:</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: 'ALL', label: 'Tất cả' },
              { key: 'APPOINTMENT', label: 'Có hẹn trước' },
              { key: 'WALK_IN', label: 'Khám trực tiếp' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTypeFilter(tab.key as any)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  typeFilter === tab.key
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm bệnh nhân, mã tiếp nhận..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Queue Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 text-center w-14">STT</th>
                <th className="py-3 px-4">Mã tiếp nhận</th>
                <th className="py-3 px-4">Bệnh nhân & Thông tin</th>
                <th className="py-3 px-4 text-center">Phân loại</th>
                <th className="py-3 px-4">Thời gian tiếp nhận / Giờ hẹn</th>
                <th className="py-3 px-4">Ghi chú & Lý do</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Hiện không có bệnh nhân nào trong hàng chờ khám.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((item, index) => {
                  const isCurrentExam = item.status === 'IN_EXAM';
                  const patient = item.patient;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isCurrentExam
                          ? 'bg-blue-50/80 font-medium'
                          : index % 2 === 0
                          ? 'bg-white'
                          : 'bg-slate-50/40'
                      } hover:bg-blue-50/40`}
                    >
                      <td className="py-3.5 px-4 text-center font-bold">
                        {isCurrentExam ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-[11px]">
                            ★
                          </span>
                        ) : (
                          <span className="text-slate-600">{index + 1}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-blue-700 block">
                          {item.receptionCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">
                          {item.patientName || 'Chưa có thông tin'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {patient?.phone || 'Chưa cập nhật'} •{' '}
                          {patient?.gender ? GENDER_MAP[patient.gender] : 'Chưa rõ'}
                          {patient?.birthDate && ` • ${patient.birthDate}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge type="receptionType" status={item.receptionType} />
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {item.receivedAt ? item.receivedAt.slice(11, 16) : '--:--'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.receivedAt ? item.receivedAt.slice(0, 10) : ''}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-700 line-clamp-1">
                          {item.notes || 'Khám chuyên khoa Tai Mũi Họng'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge type="reception" status={item.status} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {item.status === 'WAITING' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 text-[11px]"
                              onClick={() => handleCancelReception(item.id)}
                            >
                              Hủy
                            </Button>
                          )}
                          <Link to="/receptionist/patients">
                            <Button size="sm" variant="outline" className="text-[11px]">
                              Hồ sơ BN
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};