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
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
import { useClinicStore } from '../../../mock/clinicStore';
import type { Reception, Patient } from '../../../types/clinic';

export const EntExaminationPage: React.FC = () => {
  const store = useClinicStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const receptionIdParam = searchParams.get('receptionId') || store.receptions[0]?.id;

  // Find active reception & patient
  const [activeReception, setActiveReception] = useState<Reception | null>(null);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);

  useEffect(() => {
    const rec = store.receptions.find((r) => r.id === receptionIdParam) || store.receptions[0] || null;
    setActiveReception(rec);
    if (rec) {
      const p = store.patients.find((item) => item.id === rec.patientId) || null;
      setActivePatient(p);
      setChiefComplaint(rec.reason);
    }
  }, [receptionIdParam, store.receptions, store.patients]);

  // Tab state
  const [activeTab, setActiveTab] = useState<'HOI_BENH' | 'TAI' | 'MUI' | 'HONG' | 'DAU_CO' | 'NOI_SOI' | 'KET_LUAN'>('HOI_BENH');

  // Form states:
  // B. Hỏi bệnh
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptomOnset, setSymptomOnset] = useState('Khoảng 3 ngày trước');
  const [diseaseProgress, setDiseaseProgress] = useState('Bắt đầu bằng hắt hơi, sổ mũi trong, sau đó nghẹt mũi tăng dần kèm đau căng trán');
  const [currentMeds, setCurrentMeds] = useState('Chưa dùng kháng sinh, chỉ rửa nước muối sinh lý');
  const [pastEntSurgeries, setPastEntSurgeries] = useState('Chưa từng phẫu thuật tai mũi họng');

  // C. Khám Tai
  const [earLeftStatus, setEarLeftStatus] = useState<'BINH_THUONG' | 'BAT_THUONG' | 'CHUA_KHAM'>('BINH_THUONG');
  const [earLeftNotes, setEarLeftNotes] = useState('Ống tai sạch, màng nhĩ sáng bóng, nón sáng rõ, không ứ dịch');
  const [earRightStatus, setEarRightStatus] = useState<'BINH_THUONG' | 'BAT_THUONG' | 'CHUA_KHAM'>('BINH_THUONG');
  const [earRightNotes, setEarRightNotes] = useState('Ống tai thông thoáng, màng nhĩ nguyên vẹn');

  // D. Khám Mũi
  const [noseStatus, setNoseStatus] = useState<'BINH_THUONG' | 'BAT_THUONG' | 'CHUA_KHAM'>('BAT_THUONG');
  const [noseMucosa, setNoseMucosa] = useState('Niêm mạc cuốn dưới phù nề sung huyết đỏ, che lấp 1/2 hốc mũi 2 bên');
  const [noseSeptum, setNoseSeptum] = useState('Vách ngăn vẹo nhẹ sang bên trái, có gai xương nhỏ');
  const [noseDischarge, setNoseDischarge] = useState('Khe giữa 2 bên đọng dịch nhầy mủ vàng đục');
  const [nosePolyp, setNosePolyp] = useState('Chưa thấy polyp rõ ràng ở khe giữa');

  // E. Khám Họng - Thanh quản
  const [throatStatus, setThroatStatus] = useState<'BINH_THUONG' | 'BAT_THUONG' | 'CHUA_KHAM'>('BAT_THUONG');
  const [oralCavity, setOralCavity] = useState('Răng miệng sạch, niêm mạc má hồng');
  const [tonsils, setTonsils] = useState('Amidan 2 bên quá phát độ II, bề mặt sung huyết, có vài hốc mủ nhỏ');
  const [pharyngealWall, setPharyngealWall] = useState('Thành sau họng có nhiều hạt lympho viêm nổi cộm, có dải dịch nhầy chảy từ vòm xuống');
  const [larynx, setLarynx] = useState('Dây thanh 2 bên di động tốt, khép kín khi phát âm');

  // F. Khám Đầu cổ
  const [neckStatus, setNeckStatus] = useState<'BINH_THUONG' | 'BAT_THUONG' | 'CHUA_KHAM'>('BINH_THUONG');
  const [neckNodes, setNeckNodes] = useState('Sờ thấy 1 hạch nhỏ vùng góc hàm dưới trái 0.5cm, di động, ấn hơi tức nhẹ');
  const [salivaryGlands, setSalivaryGlands] = useState('Tuyến mang tai và dưới hàm 2 bên mềm, không sưng đau');

  // G. Nội soi NBI
  const [endoscopyPerformed, setEndoscopyPerformed] = useState(true);
  const [endoscopyType, setEndoscopyType] = useState('Nội soi Tai Mũi Họng ống mềm dải tần hẹp NBI');
  const [endoscopyFindings, setEndoscopyFindings] = useState('Nội soi NBI cho thấy: Niêm mạc hốc mũi phù nề mạnh, khe giữa 2 bên ứ mủ nhầy. Vòm họng sạch, không thấy khối u sùi bất thường. Hạ họng - thanh quản sạch, dây thanh khép kín.');

  // H. Kết luận
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('Viêm mũi xoang cấp mủ trên nền Viêm mũi dị ứng / Viêm amidan mạn');
  const [icdCode, setIcdCode] = useState('J01.9');
  const [treatmentPlan, setTreatmentPlan] = useState('Kháng sinh Cefuroxime 5 ngày + Kháng Histamin + Xịt mũi Steroid + Khí dung mũi xoang tại phòng khám');
  const [followUpDate, setFollowUpDate] = useState('2026-11-14');

  const handleSaveDraft = () => {
    alert('Đã lưu bản nháp kết quả khám Tai Mũi Họng thành công!');
  };

  const handleFinalizeAndProceed = () => {
    if (!activeReception || !activePatient) return;

    // Save medical record
    const record = store.saveMedicalRecord({
      receptionId: activeReception.id,
      patientId: activePatient.id,
      patientName: activePatient.fullName,
      gender: activePatient.gender,
      birthDate: activePatient.birthDate,
      examDate: new Date().toISOString().slice(0, 10),
      doctorName: activeReception.assignedDoctorName || 'BS.CKI Lê Hoàng Nam',
      chiefComplaint,
      medicalHistory: `${symptomOnset}. ${diseaseProgress}. Tiền sử: ${pastEntSurgeries}`,
      examinationSummary: `Mũi: ${noseMucosa}. Khe giữa: ${noseDischarge}. Họng: ${tonsils}. ${pharyngealWall}. Tai: T (${earLeftNotes}), P (${earRightNotes}).`,
      endoscopySummary: endoscopyPerformed ? endoscopyFindings : undefined,
      diagnosis: primaryDiagnosis,
      icdCode,
      treatmentPlan,
      followUpDate,
      status: 'HOAN_TAT',
    });

    // Navigate to Prescriptions builder (UC-12)
    navigate(`/doctor/prescriptions?receptionId=${activeReception.id}&diagnosis=${encodeURIComponent(primaryDiagnosis)}`);
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Màn Hình Thăm Khám Tai Mũi Họng Chuyên Sâu"
        subtitle="Use Case 10: Khám lâm sàng phân khu Tai, Mũi, Họng, Đầu cổ, Nội soi NBI và kết luận điều trị."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveDraft} leftIcon={<Save className="h-4 w-4" />}>
              Lưu bản nháp
            </Button>
            <Button size="sm" variant="success" onClick={handleFinalizeAndProceed} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Hoàn tất khám & Kê đơn thuốc (UC-12)
            </Button>
          </div>
        }
      />

      {/* Patient Header Card */}
      {activePatient && activeReception && (
        <Card className="bg-gradient-to-r from-blue-50/60 via-slate-50 to-white border-blue-200">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                <User className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">{activePatient.fullName}</h3>
                  <Badge variant="blue">{activePatient.gender}</Badge>
                  <span className="font-mono text-slate-500 font-bold">{activePatient.id}</span>
                  <span className="text-slate-400">|</span>
                  <span className="font-semibold text-slate-700">Mã tiếp nhận: {activeReception.id}</span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  Ngày sinh: <strong>{activePatient.birthDate}</strong> • SĐT: <strong>{activePatient.phoneNumber}</strong>
                  {activePatient.address && ` • Đ/c: ${activePatient.address}`}
                </p>
              </div>
            </div>

            {/* Vital Signs Pills */}
            {activeReception.vitalSigns && (
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-400 block font-semibold">HUYẾT ÁP</span>
                  <span className="font-bold text-slate-900">{activeReception.vitalSigns.bloodPressure}</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-400 block font-semibold">MẠCH</span>
                  <span className="font-bold text-slate-900">{activeReception.vitalSigns.pulse} l/p</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-400 block font-semibold">THÂN NHIỆT</span>
                  <span className="font-bold text-slate-900">{activeReception.vitalSigns.temperature}°C</span>
                </div>
              </div>
            )}
          </div>

          {/* Allergy alert bar */}
          {activePatient.allergies && activePatient.allergies.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-100 flex items-center gap-2 text-rose-800 text-xs font-semibold">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>CẢNH BÁO DỊ ỨNG ĐÃ GHI NHẬN: {activePatient.allergies.join(', ')}</span>
            </div>
          )}
        </Card>
      )}

      {/* Specialized Examination Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
        variant="pills"
        tabs={[
          { id: 'HOI_BENH', label: '1. Hỏi bệnh & Bệnh sử' },
          { id: 'TAI', label: '2. Khám Tai (P & T)' },
          { id: 'MUI', label: '3. Khám Mũi - Xoang' },
          { id: 'HONG', label: '4. Khám Họng - Thanh quản' },
          { id: 'DAU_CO', label: '5. Khám Đầu Cổ' },
          { id: 'NOI_SOI', label: '6. Nội Soi NBI' },
          { id: 'KET_LUAN', label: '7. Chẩn Đoán & Kết Luận' },
        ]}
      />

      {/* TAB CONTENT: 1. Hỏi bệnh */}
      {activeTab === 'HOI_BENH' && (
        <Card title="Phần B: Hỏi bệnh & Diễn biến triệu chứng">
          <div className="space-y-4 text-xs">
            <Input
              label="Lý do đến khám chính"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Thời điểm khởi phát triệu chứng"
                value={symptomOnset}
                onChange={(e) => setSymptomOnset(e.target.value)}
              />
              <Input
                label="Thuốc đang dùng tại nhà"
                value={currentMeds}
                onChange={(e) => setCurrentMeds(e.target.value)}
              />
            </div>
            <Textarea
              label="Diễn biến bệnh lý chi tiết"
              value={diseaseProgress}
              onChange={(e) => setDiseaseProgress(e.target.value)}
              rows={3}
            />
            <Input
              label="Tiền sử phẫu thuật / can thiệp Tai Mũi Họng trước đây"
              value={pastEntSurgeries}
              onChange={(e) => setPastEntSurgeries(e.target.value)}
            />
          </div>
        </Card>
      )}

      {/* TAB CONTENT: 2. Khám Tai */}
      {activeTab === 'TAI' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            title="Khám Tai Phải (Right Ear)"
            action={
              <Select
                value={earRightStatus}
                onChange={(e) => setEarRightStatus(e.target.value as any)}
                options={[
                  { value: 'BINH_THUONG', label: 'Bình thường' },
                  { value: 'BAT_THUONG', label: 'Bất thường' },
                  { value: 'CHUA_KHAM', label: 'Chưa khám' },
                ]}
              />
            }
          >
            <div className="space-y-3 text-xs">
              <Textarea
                label="Mô tả ống tai ngoài & Màng nhĩ phải"
                value={earRightNotes}
                onChange={(e) => setEarRightNotes(e.target.value)}
                rows={3}
                placeholder="Màng nhĩ sáng bóng, nón sáng rõ, không dịch đọng..."
              />
            </div>
          </Card>

          <Card
            title="Khám Tai Trái (Left Ear)"
            action={
              <Select
                value={earLeftStatus}
                onChange={(e) => setEarLeftStatus(e.target.value as any)}
                options={[
                  { value: 'BINH_THUONG', label: 'Bình thường' },
                  { value: 'BAT_THUONG', label: 'Bất thường' },
                  { value: 'CHUA_KHAM', label: 'Chưa khám' },
                ]}
              />
            }
          >
            <div className="space-y-3 text-xs">
              <Textarea
                label="Mô tả ống tai ngoài & Màng nhĩ trái"
                value={earLeftNotes}
                onChange={(e) => setEarLeftNotes(e.target.value)}
                rows={3}
                placeholder="Màng nhĩ, dịch tiết ống tai..."
              />
            </div>
          </Card>
        </div>
      )}

      {/* TAB CONTENT: 3. Khám Mũi */}
      {activeTab === 'MUI' && (
        <Card
          title="Phần D: Khám Mũi & Các Vùng Xoang Cạnh Mũi"
          action={
            <Select
              value={noseStatus}
              onChange={(e) => setNoseStatus(e.target.value as any)}
              options={[
                { value: 'BAT_THUONG', label: 'Bất thường' },
                { value: 'BINH_THUONG', label: 'Bình thường' },
                { value: 'CHUA_KHAM', label: 'Chưa khám' },
              ]}
            />
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Niêm mạc mũi & Cuốn mũi"
                value={noseMucosa}
                onChange={(e) => setNoseMucosa(e.target.value)}
              />
              <Input
                label="Vách ngăn mũi"
                value={noseSeptum}
                onChange={(e) => setNoseSeptum(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Dịch tiết mũi & Khe giữa"
                value={noseDischarge}
                onChange={(e) => setNoseDischarge(e.target.value)}
              />
              <Input
                label="Tổn thương polyp / Khối bất thường"
                value={nosePolyp}
                onChange={(e) => setNosePolyp(e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: 4. Khám Họng */}
      {activeTab === 'HONG' && (
        <Card
          title="Phần E: Khám Họng, Amidan & Thanh Quản"
          action={
            <Select
              value={throatStatus}
              onChange={(e) => setThroatStatus(e.target.value as any)}
              options={[
                { value: 'BAT_THUONG', label: 'Bất thường' },
                { value: 'BINH_THUONG', label: 'Bình thường' },
                { value: 'CHUA_KHAM', label: 'Chưa khám' },
              ]}
            />
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Khoang miệng & Lưỡi"
                value={oralCavity}
                onChange={(e) => setOralCavity(e.target.value)}
              />
              <Input
                label="Amidan 2 bên (Độ quá phát, hốc mủ)"
                value={tonsils}
                onChange={(e) => setTonsils(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Thành sau họng (Hạt lympho, dịch vòm)"
                value={pharyngealWall}
                onChange={(e) => setPharyngealWall(e.target.value)}
              />
              <Input
                label="Thanh quản & Dây thanh âm"
                value={larynx}
                onChange={(e) => setLarynx(e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: 5. Khám Đầu Cổ */}
      {activeTab === 'DAU_CO' && (
        <Card
          title="Phần F: Khám Hạch Vùng Cổ & Tuyến Nước Bọt"
          action={
            <Select
              value={neckStatus}
              onChange={(e) => setNeckStatus(e.target.value as any)}
              options={[
                { value: 'BINH_THUONG', label: 'Bình thường' },
                { value: 'BAT_THUONG', label: 'Bất thường' },
                { value: 'CHUA_KHAM', label: 'Chưa khám' },
              ]}
            />
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Hạch vùng cổ / Góc hàm"
                value={neckNodes}
                onChange={(e) => setNeckNodes(e.target.value)}
              />
              <Input
                label="Tuyến nước bọt (Mang tai, Dưới hàm)"
                value={salivaryGlands}
                onChange={(e) => setSalivaryGlands(e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: 6. Nội soi NBI */}
      {activeTab === 'NOI_SOI' && (
        <Card title="Phần G: Kết quả Thăm Dò & Nội Soi NBI Ống Mềm">
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={endoscopyPerformed}
                  onChange={(e) => setEndoscopyPerformed(e.target.checked)}
                  className="rounded text-blue-600"
                />
                Đã thực hiện nội soi trong lần khám này
              </label>
            </div>

            {endoscopyPerformed && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <Input
                  label="Loại thủ thuật nội soi"
                  value={endoscopyType}
                  onChange={(e) => setEndoscopyType(e.target.value)}
                />

                <Textarea
                  label="Mô tả hình ảnh nội soi & Vị trí tổn thương"
                  value={endoscopyFindings}
                  onChange={(e) => setEndoscopyFindings(e.target.value)}
                  rows={3}
                />

                {/* Sample Image attachment box */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <Camera className="h-4 w-4 text-blue-600" />
                    <span>Hình ảnh chụp từ máy nội soi (Minh họa demo):</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-500 font-mono">
                      [Ảnh nội soi Khe giữa mũi]
                    </div>
                    <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-500 font-mono">
                      [Ảnh nội soi Vòm họng]
                    </div>
                    <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-500 font-mono">
                      [Ảnh nội soi Dây thanh quản]
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* TAB CONTENT: 7. Kết luận */}
      {activeTab === 'KET_LUAN' && (
        <Card title="Phần H: Chẩn Đoán Xác Định & Phác Đồ Điều Trị">
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Chẩn đoán lâm sàng của Bác sĩ"
                  value={primaryDiagnosis}
                  onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                  required
                />
              </div>
              <Input
                label="Mã ICD-10 Tai Mũi Họng"
                value={icdCode}
                onChange={(e) => setIcdCode(e.target.value)}
                placeholder="Ví dụ: J01.9, J30.1..."
              />
            </div>

            <Textarea
              label="Hướng xử trí & Phác đồ điều trị"
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              rows={3}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Hẹn ngày tái khám"
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="outline" onClick={handleSaveDraft} leftIcon={<Save className="h-4 w-4" />}>
                Lưu bản nháp hồ sơ
              </Button>
              <Button variant="success" onClick={handleFinalizeAndProceed} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Chuyển sang bước Kê đơn thuốc (UC-12)
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

