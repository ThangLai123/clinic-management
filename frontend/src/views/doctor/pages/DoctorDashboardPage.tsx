import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Users,
  ClipboardList,
  FileText,
  Clock,
  ArrowRight,
  AlertCircle,
  Activity,
  PlayCircle,
  Pill,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import { GENDER_MAP } from '../../../types/database';

export const DoctorDashboardPage: React.FC = () => {
  const store = useClinicStore();
  const navigate = useNavigate();

  // Unified waiting queue
  const queue = store.getWaitingQueue();
  const inExam = queue.find((q) => q.status === 'IN_EXAM');
  const waitingPatients = queue.filter((q) => q.status === 'WAITING');

  const myExaminations = store.examinations.filter((e) => e.doctorStaffId === '2');
  const finalizedRecords = store.medicalRecords.filter((m) => m.status === 'FINALIZED');
  const signedPrescriptions = store.prescriptions.filter((p) => p.status === 'SIGNED');

  const handleStartExam = (receptionId: string) => {
    const exam = store.startExamination(receptionId, '2');
    navigate(`/doctor/examination?receptionId=${receptionId}&examId=${exam.id}`);
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Tổng quan bác sĩ"
        subtitle="BS.CKI Lê Hoàng Nam • Danh sách khám và hồ sơ bệnh án"
        badge={<Badge variant="green" dot>Phòng khám sẵn sàng</Badge>}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Bệnh nhân chờ khám</p>
              <p className="text-2xl font-black text-blue-800 mt-1">{waitingPatients.length}</p>
              <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                {inExam ? '1 ca đang khám' : 'Đang chờ gọi ca mới'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Bệnh án đã hoàn tất</p>
              <p className="text-2xl font-black text-emerald-800 mt-1">{finalizedRecords.length}</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Đã ký xác nhận</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-teal-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Đơn thuốc đã ký duyệt</p>
              <p className="text-2xl font-black text-teal-800 mt-1">{signedPrescriptions.length}</p>
              <p className="text-[11px] text-teal-700 font-semibold mt-0.5">Đã chuyển quầy dược</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Tổn thương TMH ghi nhận</p>
              <p className="text-2xl font-black text-purple-800 mt-1">{store.entFindings.length}</p>
              <p className="text-[11px] text-purple-700 font-semibold mt-0.5">Tai, Mũi, Họng, Cổ</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Active Exam Alert if exists */}
      {inExam && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                Ca bệnh đang thực hiện thăm khám:
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {inExam.patientName || 'Chưa có thông tin'} • Mã tiếp nhận: <span className="font-mono">{inExam.receptionCode}</span>
              </p>
              <p className="text-xs text-slate-500">
                Lý do: {inExam.notes || 'Khám chuyên khoa Tai Mũi Họng'}
              </p>
            </div>
          </div>

          <Link to={`/doctor/examination?receptionId=${inExam.id}`} className="shrink-0">
            <Button size="sm" variant="primary" leftIcon={<Stethoscope className="h-4 w-4" />}>
              Tiếp tục khám
            </Button>
          </Link>
        </div>
      )}

      {/* Main Waiting Queue for Doctor */}
      <Card
        title={`Hàng chờ ưu tiên (${queue.length})`}
        subtitle="Ca đang khám xếp đầu; sau đó ưu tiên bệnh nhân đặt lịch."
        action={
          <Link to="/doctor/queue" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
            Xem toàn bộ <ArrowRight className="h-3 w-3" />
          </Link>
        }
      >
        {queue.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            Hiện không có bệnh nhân nào trong hàng chờ.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {queue.slice(0, 5).map((item, idx) => {
              const isCurrent = item.status === 'IN_EXAM';
              const p = item.patient;

              return (
                <div
                  key={item.id}
                  className={`py-3 flex flex-wrap items-center justify-between text-xs gap-3 ${
                    isCurrent ? 'bg-blue-50/70 p-3 rounded-xl' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.patientName || 'Chưa có thông tin'}</span>
                      <StatusBadge type="receptionType" status={item.receptionType} />
                      <StatusBadge type="reception" status={item.status} />
                    </div>
                    <p className="text-slate-500">
                      Mã TN: <strong className="font-mono text-slate-700">{item.receptionCode}</strong> • Tiếp nhận:{' '}
                      {item.receivedAt ? item.receivedAt.slice(11, 16) : '--:--'}
                      {p?.gender && ` • ${GENDER_MAP[p.gender]}`}
                    </p>
                    <p className="text-slate-700 italic">
                      "{item.notes || 'Khám chuyên khoa Tai Mũi Họng'}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCurrent ? (
                      <Link to={`/doctor/examination?receptionId=${item.id}`}>
                        <Button size="sm" variant="primary" leftIcon={<Stethoscope className="h-3.5 w-3.5" />}>
                          Đang khám
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleStartExam(item.id)}
                        leftIcon={<PlayCircle className="h-3.5 w-3.5" />}
                      >
                        Khám ca này
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};