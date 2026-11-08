import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Stethoscope,
  HeartPulse,
  User,
  AlertTriangle,
  Save,
  CheckCircle2,
  FileText,
  Pill,
  Camera,
  Activity,
  ArrowRight,
  ClipboardList,
  Plus,
  Trash2,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import type {
  Reception,
  Patient,
  Examination,
  EntFinding,
  EntRegion,
  EntSide,
} from '../../../types/clinic';
import {
  ENT_REGION_MAP,
  ENT_SIDE_MAP,
  GENDER_MAP,
} from '../../../types/database';

export const EntExaminationPage: React.FC = () => {
  const store = useClinicStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const receptionIdParam = searchParams.get('receptionId') || store.receptions[0]?.id;

  // Active Reception, Patient & Examination
  const [activeReception, setActiveReception] = useState<Reception | null>(null);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [activeExam, setActiveExam] = useState<Examination | null>(null);

  // Form states
  const [chiefComplaint, setChiefComplaint] = useState('');

  // Add Finding Modal state (Bảng ent_findings)
  const [isFindingModalOpen, setIsFindingModalOpen] = useState(false);
  const [findingRegion, setFindingRegion] = useState<EntRegion>('NOSE');
  const [findingSide, setFindingSide] = useState<EntSide>('BOTH');
  const [findingDescription, setFindingDescription] = useState('Niêm mạc cuốn dưới phù nề sung huyết đỏ, khe giữa đọng dịch mủ');

  useEffect(() => {
    const rec = store.receptions.find((r) => r.id === receptionIdParam) || store.receptions[0] || null;
    setActiveReception(rec);
    if (rec) {
      const p = store.patients.find((item) => item.id === rec.patientId) || null;
      setActivePatient(p);

      // Find or start examination
      let exam = store.examinations.find((e) => e.receptionId === rec.id);
      if (!exam) {
        exam = store.startExamination(rec.id, '2', rec.notes || 'Khám chuyên khoa Tai Mũi Họng');
      }
      setActiveExam(exam);
      setChiefComplaint(exam.chiefComplaint || rec.notes || 'Khám chuyên khoa Tai Mũi Họng');
    }
  }, [receptionIdParam, store.receptions, store.patients, store.examinations]);

  // Current findings for this examination
  const currentFindings = activeExam
    ? store.entFindings.filter((f) => f.examinationId === activeExam.id)
    : [];

  const handleSaveChiefComplaint = () => {
    if (!activeExam) return;
    activeExam.chiefComplaint = chiefComplaint;
    alert('Đã cập nhật lý do đến khám!');
  };

  const handleAddFinding = () => {
    if (!activeExam || !findingDescription.trim()) return;

    store.addEntFinding({
      examinationId: activeExam.id,
      region: findingRegion,
      side: findingSide,
      description: findingDescription.trim(),
    });

    setIsFindingModalOpen(false);
    setFindingDescription('');
  };

  const handleProceedToRecord = () => {
    if (!activeExam) return;
    navigate(`/doctor/medical-records?examId=${activeExam.id}`);
  };

  const handleProceedToPrescription = () => {
    if (!activeExam) return;
    navigate(`/doctor/prescriptions?examId=${activeExam.id}`);
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Khám Tai Mũi Họng"
        subtitle="Khám lâm sàng và ghi nhận kết quả theo từng vùng."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleProceedToRecord}
              leftIcon={<ClipboardList className="h-4 w-4 text-emerald-700" />}
            >
              Lập bệnh án
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleProceedToPrescription}
              leftIcon={<Pill className="h-4 w-4" />}
            >
              Kê đơn thuốc
            </Button>
          </div>
        }
      />

      {/* Patient Information Bar */}
      {activePatient && (
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{activePatient.fullName}</h3>
                <span className="text-xs text-slate-500 font-mono">({activePatient.patientCode})</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {GENDER_MAP[activePatient.gender]}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ngày sinh: {activePatient.birthDate || 'Chưa cập nhật'} • SĐT: {activePatient.phone || 'Chưa cập nhật'}
                {activePatient.insuranceNumber && ` • BHYT: ${activePatient.insuranceNumber}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activePatient.allergyNotes && (
              <div className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5 max-w-full">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                <span className="break-words">Dị ứng: {activePatient.allergyNotes}</span>
              </div>
            )}
            {activeExam && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Mã lần khám:</span>
                <span className="text-xs font-mono font-bold text-blue-700">{activeExam.examinationCode}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chief Complaint Card */}
      <Card
        title="Lý do đến khám"
        action={
          <Button size="sm" variant="outline" onClick={handleSaveChiefComplaint} leftIcon={<Save className="h-3.5 w-3.5" />}>
            Lưu lý do khám
          </Button>
        }
      >
        <Input
          label="Lý do đến khám do bệnh nhân khai báo"
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          placeholder="Ví dụ: Đau rát họng, nghẹt mũi trái 3 ngày, chảy dịch nhầy vàng đục..."
        />
      </Card>

      {/* ENT Findings Section */}
      <Card
        title={`Kết quả khám Tai Mũi Họng (${currentFindings.length})`}
        subtitle="Ghi nhận vùng khám, vị trí và mô tả kết quả."
        action={
          <Button size="sm" onClick={() => setIsFindingModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
            Thêm kết quả
          </Button>
        }
      >
        {currentFindings.length === 0 ? (
          <p className="py-8 text-center text-xs text-slate-400">
            Chưa có tổn thương thực thể nào được ghi nhận cho ca khám này. Nhấn "Ghi nhận tổn thương mới" để thêm.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentFindings.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded">
                      Vị trí: {ENT_REGION_MAP[f.region]}
                    </span>
                    <span className="font-semibold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      Bên: {ENT_SIDE_MAP[f.side]}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{f.createdAt}</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* MODAL: Add ENT Finding */}
      <Modal
        isOpen={isFindingModalOpen}
        onClose={() => setIsFindingModalOpen(false)}
        title="Ghi Nhận Tổn Thương Thực Thể TMH"
        subtitle="Lựa chọn phân vùng Tai / Mũi / Họng / Đầu cổ và vị trí bên tổn thương"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsFindingModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddFinding} variant="primary">
              Lưu kết quả khám
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Phân vùng giải phẫu"
              value={findingRegion}
              onChange={(e) => setFindingRegion(e.target.value as EntRegion)}
              options={[
                { value: 'EAR', label: 'Tai' },
                { value: 'NOSE', label: 'Mũi - Xoang' },
                { value: 'THROAT', label: 'Họng - Thanh quản' },
                { value: 'HEAD_NECK', label: 'Đầu cổ - Tuyến nước bọt' },
              ]}
            />

            <Select
              label="Vị trí bên tổn thương"
              value={findingSide}
              onChange={(e) => setFindingSide(e.target.value as EntSide)}
              options={[
                { value: 'LEFT', label: 'Bên trái' },
                { value: 'RIGHT', label: 'Bên phải' },
                { value: 'BOTH', label: 'Cả hai bên' },
                { value: 'NA', label: 'Không phân biệt bên' },
              ]}
            />
          </div>

          <Input
            label="Mô tả chi tiết tổn thương *"
            value={findingDescription}
            onChange={(e) => setFindingDescription(e.target.value)}
            placeholder="Ví dụ: Màng nhĩ xung huyết đục, nón sáng biến dạng, có bóng khí sau màng nhĩ..."
            required
          />

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-xs">
            Kết quả tổn thương sẽ được liên kết trực tiếp với mã lượt khám <strong>{activeExam?.examinationCode}</strong>.
          </div>
        </div>
      </Modal>
    </div>
  );
};