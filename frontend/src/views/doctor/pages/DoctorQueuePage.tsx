import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  Filter,
  Search,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle2,
  PlayCircle,
  FileText,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import { GENDER_MAP, RECEPTION_TYPE_MAP } from '../../../types/database';

export const DoctorQueuePage: React.FC = () => {
  const store = useClinicStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'APPOINTMENT' | 'WALK_IN'>('ALL');

  // Query 28.1 Priority Sorted Waiting Queue
  const queue = store.getWaitingQueue();

  const filteredQueue = queue.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (item.patientName || '').toLowerCase().includes(q) ||
      item.receptionCode.toLowerCase().includes(q) ||
      (item.patient?.phone && item.patient.phone.includes(q));

    const matchType = typeFilter === 'ALL' || item.receptionType === typeFilter;

    return matchSearch && matchType;
  });

  const handleStartExam = (receptionId: string) => {
    // Start examination via store
    const exam = store.startExamination(receptionId, '2'); // BS.CKI Lê Hoàng Nam
    navigate(`/doctor/examination?receptionId=${receptionId}&examId=${exam.id}`);
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Hàng chờ khám bệnh"
        subtitle="Ưu tiên người có lịch hẹn; giữ nguyên ca đang khám."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white px-4 py-3 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Lọc nguồn:</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: 'ALL', label: 'Tất cả' },
              { key: 'APPOINTMENT', label: 'Đã đặt lịch' },
              { key: 'WALK_IN', label: 'Đến trực tiếp' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTypeFilter(tab.key as any)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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

        <div className="relative w-full sm:w-64 lg:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm bệnh nhân, mã tiếp nhận..."
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
                <th className="py-3 px-4 text-center w-14">STT</th>
                <th className="py-3 px-4">Mã tiếp nhận</th>
                <th className="py-3 px-4">Bệnh nhân & Thông tin</th>
                <th className="py-3 px-4 text-center">Phân loại</th>
                <th className="py-3 px-4">Thời gian tiếp nhận</th>
                <th className="py-3 px-4">Triệu chứng & Lý do khám</th>
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
                          {patient?.gender ? GENDER_MAP[patient.gender] : 'Chưa rõ'} •{' '}
                          {patient?.birthDate || 'Chưa cập nhật'}
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
                        <p className="text-slate-800 font-medium line-clamp-1">
                          {item.notes || 'Khám chuyên khoa Tai Mũi Họng'}
                        </p>
                        {patient?.allergyNotes && (
                          <span className="inline-block text-[10px] text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.2 rounded mt-0.5">
                            Dị ứng: {patient.allergyNotes}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge type="reception" status={item.status} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isCurrentExam ? (
                          <Link to={`/doctor/examination?receptionId=${item.id}`}>
                            <Button size="sm" variant="primary" leftIcon={<Stethoscope className="h-3.5 w-3.5" />}>
                              Tiếp tục khám
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleStartExam(item.id)}
                            leftIcon={<PlayCircle className="h-3.5 w-3.5" />}
                          >
                            Bắt đầu khám
                          </Button>
                        )}
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