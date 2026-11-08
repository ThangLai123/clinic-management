import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  Printer,
  Calendar,
  User,
  Stethoscope,
  Pill,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Save,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import type { MedicalRecord } from '../../../types/clinic';
import { MEDICAL_RECORD_STATUS_MAP } from '../../../types/database';

export const MedicalRecordDetailPage: React.FC = () => {
  const store = useClinicStore();
  const [searchParams] = useSearchParams();
  const examIdParam = searchParams.get('examId');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // Form states for active record
  const [diagnosis, setDiagnosis] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [doctorAdvice, setDoctorAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-11-14');

  // Load record on mount or parameter change
  useEffect(() => {
    let rec: MedicalRecord | undefined;
    if (examIdParam) {
      rec = store.medicalRecords.find((r) => r.examinationId === examIdParam);
    }
    if (!rec) {
      rec = store.medicalRecords[0];
    }

    if (rec) {
      setSelectedRecord(rec);
      setDiagnosis(rec.diagnosis || '');
      setConclusion(rec.conclusion || '');
      setTreatmentPlan(rec.treatmentPlan || '');
      setDoctorAdvice(rec.doctorAdvice || '');
      setFollowUpDate(rec.followUpDate || '2026-11-14');
    }
  }, [examIdParam, store.medicalRecords]);

  const handleSelectRecord = (rec: MedicalRecord) => {
    setSelectedRecord(rec);
    setDiagnosis(rec.diagnosis || '');
    setConclusion(rec.conclusion || '');
    setTreatmentPlan(rec.treatmentPlan || '');
    setDoctorAdvice(rec.doctorAdvice || '');
    setFollowUpDate(rec.followUpDate || '2026-11-14');
  };

  const handleSaveDraft = () => {
    if (!selectedRecord) return;
    store.saveMedicalRecord({
      examinationId: selectedRecord.examinationId,
      diagnosis,
      conclusion,
      treatmentPlan,
      doctorAdvice,
      followUpDate,
      status: 'DRAFT',
    });
    alert('Đã lưu bản nháp bệnh án (DRAFT)!');
  };

  const handleFinalize = () => {
    if (!selectedRecord) return;
    if (!diagnosis.trim()) {
      alert('Chẩn đoán bệnh là bắt buộc để chốt bệnh án.');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn chốt bệnh án (FINALIZED)? Sau khi chốt, hồ sơ sẽ được khóa và không thể chỉnh sửa.')) {
      const updated = store.saveMedicalRecord({
        examinationId: selectedRecord.examinationId,
        diagnosis,
        conclusion,
        treatmentPlan,
        doctorAdvice,
        followUpDate,
        status: 'FINALIZED',
      });
      setSelectedRecord(updated);
    }
  };

  const filteredRecords = store.medicalRecords.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.medicalRecordCode.toLowerCase().includes(q) ||
      (r.patientName || '').toLowerCase().includes(q) ||
      (r.diagnosis || '').toLowerCase().includes(q)
    );
  });

  const isFinalized = selectedRecord?.status === 'FINALIZED';

  return (
    <div className="space-y-6">
      <Topbar
        title="Hồ sơ bệnh án"
        subtitle="Chẩn đoán, điều trị và hướng dẫn tái khám."
        actions={
          selectedRecord && (
            <div className="flex flex-wrap gap-2">
              <Link to={`/doctor/prescriptions?examId=${selectedRecord.examinationId}`}>
                <Button size="sm" variant="outline" leftIcon={<Pill className="h-4 w-4" />}>
                  Kê đơn thuốc
                </Button>
              </Link>
              <Button size="sm" onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
                In bệnh án
              </Button>
            </div>
          )
        }
      />

      {/* Grid: Records List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Records list */}
        <div className="lg:col-span-4 min-w-0 space-y-4">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo Mã BA, tên người bệnh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2.5">
            {filteredRecords.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">Không tìm thấy bệnh án nào.</p>
            ) : (
              filteredRecords.map((rec) => {
                const isSelected = selectedRecord?.id === rec.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => handleSelectRecord(rec)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{rec.patientName || 'Chưa có thông tin'}</span>
                      <StatusBadge type="medicalRecord" status={rec.status} />
                    </div>

                    <p className="text-xs font-semibold text-slate-700 line-clamp-1">{rec.diagnosis}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 font-mono">
                      <span>{rec.medicalRecordCode}</span>
                      <span>{rec.createdAt.slice(0, 10)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Record Detail Form View */}
        <div className="lg:col-span-8 min-w-0">
          {selectedRecord ? (
            <Card
              title={`Hồ sơ bệnh án: ${selectedRecord.medicalRecordCode}`}
              subtitle={`Bệnh nhân: ${selectedRecord.patientName || 'Chưa có thông tin'} • Bác sĩ điều trị: ${selectedRecord.doctorName || 'Chưa cập nhật'}`}
              action={<StatusBadge type="medicalRecord" status={selectedRecord.status} />}
            >
              <div className="space-y-5 text-xs">
                {isFinalized && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span>
                      Hồ sơ bệnh án đã được ký số và hoàn tất vào lúc <strong>{selectedRecord.finalizedAt || selectedRecord.updatedAt}</strong>. Toàn bộ thông tin đã được khóa bảo mật và không thể chỉnh sửa.
                    </span>
                  </div>
                )}

                {/* 1. Diagnosis */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs block">
                    1. Chẩn đoán xác định *
                  </label>
                  <input
                    type="text"
                    disabled={isFinalized}
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Ví dụ: Viêm mũi xoang cấp mủ / Viêm tai giữa thanh dịch..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-600 font-bold"
                  />
                </div>

                {/* 2. Conclusion */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs block">
                    2. Kết luận chuyên môn
                  </label>
                  <textarea
                    rows={2}
                    disabled={isFinalized}
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    placeholder="Nhận định lâm sàng, mức độ tổn thương thực thể..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>

                {/* 3. Treatment Plan */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs block">
                    3. Kế hoạch điều trị & Can thiệp
                  </label>
                  <textarea
                    rows={2}
                    disabled={isFinalized}
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    placeholder="Phác đồ kháng sinh, kháng viêm, khí dung, rửa mũi xoang..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>

                {/* 4. Doctor Advice */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs block">
                    4. Lời dặn dò của Bác sĩ
                  </label>
                  <textarea
                    rows={2}
                    disabled={isFinalized}
                    value={doctorAdvice}
                    onChange={(e) => setDoctorAdvice(e.target.value)}
                    placeholder="Uống thuốc đúng giờ, súc họng nước muối, đeo khẩu trang..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-600 italic"
                  />
                </div>

                {/* 5. Follow-up Date */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs block">
                    5. Lịch hẹn tái khám
                  </label>
                  <input
                    type="date"
                    disabled={isFinalized}
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>

                {/* Action Buttons if Draft */}
                {!isFinalized && (
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button variant="outline" onClick={handleSaveDraft} leftIcon={<Save className="h-4 w-4" />}>
                      Lưu bản nháp
                    </Button>
                    <Button variant="success" onClick={handleFinalize} leftIcon={<CheckCircle2 className="h-4 w-4" />}>
                      Ký số & Hoàn tất bệnh án
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <p className="text-center py-12 text-slate-400 text-xs">Vui lòng chọn một bệnh án để xem chi tiết.</p>
          )}
        </div>
      </div>
    </div>
  );
};