import React from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Users,
  ClipboardList,
  FileText,
  Clock,
  ArrowRight,
  AlertCircle,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';

export const DoctorDashboardPage: React.FC = () => {
  const store = useClinicStore();

  const myRoomId = 'PK-01'; // BS.CKI Lê Hoàng Nam phụ trách PK-01
  const myRoom = store.rooms.find((r) => r.id === myRoomId);

  // Queue of patients assigned to my room
  const waitingPatients = store.receptions.filter(
    (r) => r.assignedRoomId === myRoomId && (r.status === 'CHO_KHAM' || r.status === 'DANG_KHAM')
  );

  const completedToday = store.medicalRecords.filter((r) => r.doctorName.includes('Nam'));
  const prescriptionsCount = store.prescriptions.filter((p) => p.doctorName.includes('Nam')).length;

  return (
    <div className="space-y-6">
      <Topbar
        title="Bảng Làm Việc Bác Sĩ Chuyên Khoa Tai Mũi Họng"
        subtitle={`Buồng khám: ${myRoom?.roomName} • Bác sĩ trực: ${myRoom?.doctorName}`}
        badge={<Badge variant="green" dot>Buồng khám đang hoạt động</Badge>}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Đang chờ trong buồng</p>
              <p className="text-2xl font-black text-blue-800 mt-1">{waitingPatients.length}</p>
              <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Cần thăm khám</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Bệnh án đã lập hôm nay</p>
              <p className="text-2xl font-black text-emerald-800 mt-1">{completedToday.length}</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Hồ sơ hoàn tất</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-teal-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Đơn thuốc đã kê</p>
              <p className="text-2xl font-black text-teal-800 mt-1">{prescriptionsCount}</p>
              <p className="text-[11px] text-teal-700 font-semibold mt-0.5">Chuyển quầy dược</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Nội soi NBI thực hiện</p>
              <p className="text-2xl font-black text-purple-800 mt-1">4 ca</p>
              <p className="text-[11px] text-purple-700 font-semibold mt-0.5">Ống mềm dải tần hẹp</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Waiting Queue for Doctor */}
      <Card
        title={`Hàng chờ bệnh nhân tại ${myRoom?.roomName} (${waitingPatients.length})`}
        subtitle="Chọn bệnh nhân để mở màn hình khám Tai Mũi Họng chuyên sâu (UC-10)"
        action={
          <Link to="/doctor/queue">
            <Button size="sm" variant="outline">
              Xem toàn bộ phòng
            </Button>
          </Link>
        }
      >
        {waitingPatients.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 space-y-2">
            <Stethoscope className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="font-medium text-slate-700">Hiện tại không có bệnh nhân nào chờ tại buồng khám này.</p>
            <p>Bàn Lễ tân sẽ phân buồng khi có lượt tiếp nhận mới (UC-06).</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Mã TN / Giờ</th>
                  <th className="py-3 px-4">Họ và Tên người bệnh</th>
                  <th className="py-3 px-4">Lý do khám & Triệu chứng</th>
                  <th className="py-3 px-4">Ưu tiên</th>
                  <th className="py-3 px-4">Dấu hiệu sinh tồn</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {waitingPatients.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-700 block">{rec.id}</span>
                      <span className="text-[11px] text-slate-400">{rec.receptionTime}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{rec.patientName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">Mã BN: {rec.patientId}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-medium text-slate-800">{rec.reason}</p>
                      <p className="text-[11px] text-slate-500">{rec.symptoms.join(', ')}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="priority" value={rec.priority} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {rec.vitalSigns ? (
                        <span>
                          HA: {rec.vitalSigns.bloodPressure} • M: {rec.vitalSigns.pulse} • {rec.vitalSigns.temperature}°C
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Today Completed Medical Records */}
      <Card
        title="Các hồ sơ bệnh án đã hoàn tất khám hôm nay"
        action={
          <Link to="/doctor/medical-records" className="text-xs font-semibold text-blue-700 hover:underline">
            Xem hồ sơ bệnh án
          </Link>
        }
      >
        <div className="divide-y divide-slate-100 text-xs">
          {completedToday.map((rec) => (
            <div key={rec.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{rec.patientName}</span>
                  <span className="text-[11px] font-mono text-slate-400">{rec.id}</span>
                </div>
                <p className="text-slate-600 mt-0.5">
                  Chẩn đoán: <strong>{rec.diagnosis}</strong> ({rec.icdCode})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/doctor/prescriptions?receptionId=${rec.receptionId}`}>
                  <Button size="sm" variant="outline" className="text-[11px]">
                    Xem đơn thuốc
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
