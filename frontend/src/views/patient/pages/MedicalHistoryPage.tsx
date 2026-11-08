import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  KeyRound,
  ShieldCheck,
  Calendar,
  User,
  Clock,
  FileText,
  Pill,
  ArrowRight,
  ArrowLeft,
  Printer,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  Users,
  Activity,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { clinicStore, useClinicStore } from '../../../mock/clinicStore';
import type { Patient, PatientPhoneLink } from '../../../types/clinic';
import {
  ENT_REGION_MAP,
  ENT_SIDE_MAP,
  GENDER_MAP,
  PHONE_LINK_RELATIONSHIP_MAP,
} from '../../../types/database';

export const MedicalHistoryPage: React.FC = () => {
  const store = useClinicStore();

  // Step 1: Phone input | Step 2: OTP verification | Step 3: Select patient & view history
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [phone, setPhone] = useState('0912345678'); // Pre-fill with demo phone
  const [phoneError, setPhoneError] = useState('');

  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [demoOtp, setDemoOtp] = useState('123456');

  // Loaded data
  const [linkedPatients, setLinkedPatients] = useState<{ phoneLink?: PatientPhoneLink; patient: Patient }[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedVisitIndex, setSelectedVisitIndex] = useState<number>(0);

  // OTP Countdown timer
  useEffect(() => {
    let timer: any;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendOtp = () => {
    const clean = phone.replace(/\s+/g, '');
    if (!clean) {
      setPhoneError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(clean)) {
      setPhoneError('Số điện thoại không đúng định dạng (10 chữ số)');
      return;
    }

    setPhoneError('');
    setDemoOtp(store.getDemoOtpForPhone(clean));
    setCountdown(60);
    setOtpInput('');
    setOtpError('');
    setStep(2);
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim() !== demoOtp) {
      setOtpError('Mã OTP không chính xác. Vui lòng nhập mã gợi ý thử nghiệm.');
      return;
    }

    // OTP Verified! Fetch patient phone links
    const matches = store.getPatientsByPhone(phone);
    if (matches.length > 0) {
      setLinkedPatients(matches);
      setSelectedPatientId(matches[0].patient.id);
    } else {
      // Check direct phone match in patients table
      const directPatient = store.patients.find((p) => p.phone === phone);
      if (directPatient) {
        setLinkedPatients([{ patient: directPatient }]);
        setSelectedPatientId(directPatient.id);
      } else {
        setLinkedPatients([]);
        setSelectedPatientId('');
      }
    }

    setSelectedVisitIndex(0);
    setStep(3);
  };

  const currentPatientData = linkedPatients.find((p) => p.patient.id === selectedPatientId);
  const currentPatient = currentPatientData?.patient;
  const currentHistory = currentPatient ? store.getPatientHistory(currentPatient.id) : { visits: [] };
  const currentVisits = currentHistory.visits;
  const activeVisit = currentVisits[selectedVisitIndex] || null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Cổng thông tin bệnh nhân
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Tra cứu lịch sử khám bệnh
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Xác thực bảo mật qua OTP gửi đến số điện thoại đăng ký khám để tra cứu kết quả chẩn đoán, tổn thương Tai - Mũi - Họng và đơn thuốc điện tử.
        </p>
      </div>

      {/* STEP 1: Phone number input */}
      {step === 1 && (
        <div className="max-w-md mx-auto">
          <Card title="Bước 1: Nhập số điện thoại đã khám">
            <div className="space-y-5">
              <Input
                label="Số điện thoại của bạn"
                placeholder="Ví dụ: 0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={phoneError}
                leftIcon={<Phone className="h-4 w-4" />}
                helperText="Gợi ý dữ liệu mẫu: 0912345678 (Nguyễn Văn An), 0988776655 (Trần Thị Thu Hà), 0903456789 (Lê Hoàng Long)."
              />

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  <span>Chính sách bảo mật y tế:</span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Vì lý do bảo mật hồ sơ sức khỏe cá nhân, hệ thống gửi mã xác thực OTP 6 chữ số đến số điện thoại của bạn trước khi hiển thị kết quả chẩn đoán và đơn thuốc.
                </p>
              </div>

              <Button onClick={handleSendOtp} className="w-full justify-center" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Gửi mã xác thực OTP
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* STEP 2: OTP Verification */}
      {step === 2 && (
        <div className="max-w-md mx-auto">
          <Card title="Bước 2: Nhập mã xác thực OTP">
            <div className="space-y-5">
              <div className="text-xs text-slate-600">
                Mã xác thực đã được gửi đến số điện thoại: <strong>{phone}</strong>
              </div>

              {/* Demo OTP Helper Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <KeyRound className="h-4 w-4 text-blue-700" />
                  <span>Mã OTP thử nghiệm (Demo Mode):</span>
                </div>
                <p>
                  Nhập mã: <strong className="font-mono text-sm tracking-widest text-blue-700">{demoOtp}</strong>
                </p>
                <p className="text-[11px] text-blue-600">
                  (Trong môi trường thực tế, mã sẽ được hệ thống SMS Brandname gửi về tin nhắn)
                </p>
              </div>

              <Input
                label="Mã xác thực OTP (6 chữ số)"
                placeholder="Nhập 123456"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                error={otpError}
                maxLength={6}
                className="text-center font-mono tracking-widest text-lg font-bold"
              />

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Thời hạn mã còn: <strong>{countdown}s</strong></span>
                {countdown === 0 ? (
                  <button onClick={handleSendOtp} className="text-blue-700 font-semibold hover:underline">
                    Gửi lại mã
                  </button>
                ) : (
                  <span className="text-slate-400">Gửi lại mã sau {countdown}s</span>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 justify-center">
                  Đổi số điện thoại
                </Button>
                <Button onClick={handleVerifyOtp} className="flex-1 justify-center">
                  Xác nhận tra cứu
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* STEP 3: Results Display */}
      {step === 3 && (
        <div className="space-y-6">
          {linkedPatients.length === 0 ? (
            <EmptyState
              title="Chưa tìm thấy hồ sơ bệnh nhân"
              description={`Số điện thoại ${phone} chưa có hồ sơ bệnh án trên hệ thống phòng khám.`}
              action={
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Tra cứu số khác
                  </Button>
                  <Link to="/appointments/new">
                    <Button>Đặt lịch khám ngay</Button>
                  </Link>
                </div>
              }
            />
          ) : (
            <>
              {/* Linked Patients Selector (hỗ trợ 1 SĐT nhiều bệnh nhân) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-700" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Hồ sơ liên kết với số điện thoại {phone} ({linkedPatients.length} hồ sơ)
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStep(1);
                      setLinkedPatients([]);
                      setSelectedPatientId('');
                    }}
                    leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
                  >
                    Đổi số điện thoại khác
                  </Button>
                </div>

                {/* Patient selection tabs if multiple */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {linkedPatients.map(({ phoneLink, patient: p }) => {
                    const isSelected = p.id === selectedPatientId;
                    const relationLabel = phoneLink?.relationshipToPatient
                      ? PHONE_LINK_RELATIONSHIP_MAP[phoneLink.relationshipToPatient]
                      : 'Bản thân';

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedPatientId(p.id);
                          setSelectedVisitIndex(0);
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{p.fullName}</span>
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                            {relationLabel}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                          <p>Mã BN: <strong className="font-mono text-slate-700">{p.patientCode || p.id}</strong></p>
                          <p>Giới tính: {GENDER_MAP[p.gender] || p.gender} • Ngày sinh: {p.birthDate || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Patient detailed bio summary */}
                {currentPatient && (
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[11px]">BHYT:</span>
                      <span className="font-semibold text-slate-800">{currentPatient.insuranceNumber || 'Chưa cập nhật'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Địa chỉ:</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">{currentPatient.address || 'Chưa cập nhật'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Dị ứng:</span>
                      <span className="font-semibold text-rose-700">{currentPatient.allergyNotes || 'Không ghi nhận'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Tiền sử bệnh:</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">{currentPatient.medicalHistoryNotes || 'Bình thường'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Visits list and Detail */}
              {currentVisits.length === 0 ? (
                <EmptyState
                  title="Chưa có lần khám nào"
                  description={`Bệnh nhân ${currentPatient?.fullName} chưa có dữ liệu khám bệnh trên hệ thống.`}
                  action={
                    <Link to="/appointments/new">
                      <Button size="sm">Đặt lịch khám ngay</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Visits List */}
                  <div className="lg:col-span-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                      Lịch sử khám ({currentVisits.length} lần)
                    </h3>

                    {currentVisits.map((v, idx) => {
                      const isSelected = selectedVisitIndex === idx;
                      const dateStr = v.reception.receivedAt || v.examination?.startedAt || 'Chưa có ngày';

                      return (
                        <div
                          key={v.reception.id}
                          onClick={() => setSelectedVisitIndex(idx)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-blue-600" />
                              {dateStr.slice(0, 10)}
                            </span>
                            <StatusBadge status={v.reception.status} type="reception" />
                          </div>

                          <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                            {v.medicalRecord?.diagnosis || v.examination?.chiefComplaint || 'Khám Tai Mũi Họng'}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            BS: {v.examination?.doctorName || 'Bác sĩ chuyên khoa'}
                          </p>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-700 font-semibold">
                            <span>Xem chi tiết phiếu khám</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Active Visit Details */}
                  <div className="lg:col-span-8">
                    {activeVisit && (
                      <Card
                        title={
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-blue-700" />
                            <span>
                              Chi tiết lần khám ngày {activeVisit.reception.receivedAt?.slice(0, 10)}
                            </span>
                          </div>
                        }
                        action={
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.print()}
                            leftIcon={<Printer className="h-3.5 w-3.5" />}
                          >
                            In phiếu kết quả
                          </Button>
                        }
                      >
                        <div className="space-y-6 text-xs text-slate-700">
                          {/* Visit Meta Information */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                              <span className="text-slate-400 block text-[11px]">Mã tiếp nhận:</span>
                              <span className="font-mono font-bold text-slate-900">
                                {activeVisit.reception.receptionCode}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">Mã bệnh án:</span>
                              <span className="font-mono font-bold text-blue-700">
                                {activeVisit.medicalRecord?.medicalRecordCode || 'Chưa lập'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">Bác sĩ phụ trách:</span>
                              <span className="font-bold text-slate-900">
                                {activeVisit.examination?.doctorName || 'BS.CKI Lê Hoàng Nam'}
                              </span>
                            </div>
                          </div>

                          {/* 1. Reason for Examination */}
                          <div className="space-y-2">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <Activity className="h-4 w-4 text-blue-600" />
                              1. Lý do đến khám & Triệu chứng ban đầu
                            </h4>
                            <div className="p-3 bg-white border border-slate-200 rounded-xl">
                              <p className="font-medium text-slate-800">
                                {activeVisit.examination?.chiefComplaint || activeVisit.reception.notes || 'Khám chuyên khoa Tai Mũi Họng'}
                              </p>
                            </div>
                          </div>

                          {/* 2. ENT Findings (Bảng ent_findings) */}
                          <div className="space-y-2">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <Stethoscope className="h-4 w-4 text-blue-600" />
                              2. Kết quả khám chuyên khoa Tai - Mũi - Họng
                            </h4>
                            {activeVisit.findings.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {activeVisit.findings.map((f) => (
                                  <div
                                    key={f.id}
                                    className="p-3 rounded-xl border border-blue-100 bg-blue-50/40 space-y-1"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-blue-900">
                                        Vị trí: {ENT_REGION_MAP[f.region]}
                                      </span>
                                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-200/60 text-blue-800">
                                        Bên: {ENT_SIDE_MAP[f.side]}
                                      </span>
                                    </div>
                                    <p className="text-slate-700">{f.description}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 italic">
                                Chưa ghi nhận chi tiết tổn thương khu trú Tai - Mũi - Họng.
                              </p>
                            )}
                          </div>

                          {/* 3. Diagnosis & Treatment Plan (Bảng medical_records) */}
                          {activeVisit.medicalRecord && (
                            <div className="space-y-2">
                              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                <FileText className="h-4 w-4 text-emerald-600" />
                                3. Chẩn đoán & Kết luận của Bác sĩ
                              </h4>
                              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-emerald-950">
                                <div>
                                  <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
                                    Chẩn đoán xác định:
                                  </span>
                                  <p className="text-sm font-bold text-emerald-950 mt-0.5">
                                    {activeVisit.medicalRecord.diagnosis}
                                  </p>
                                </div>

                                {activeVisit.medicalRecord.conclusion && (
                                  <div>
                                    <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
                                      Kết luận:
                                    </span>
                                    <p className="text-slate-700 mt-0.5">
                                      {activeVisit.medicalRecord.conclusion}
                                    </p>
                                  </div>
                                )}

                                <div>
                                  <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
                                    Kế hoạch điều trị:
                                  </span>
                                  <p className="text-slate-700 mt-0.5">
                                    {activeVisit.medicalRecord.treatmentPlan}
                                  </p>
                                </div>

                                {activeVisit.medicalRecord.doctorAdvice && (
                                  <div>
                                    <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
                                      Lời dặn của Bác sĩ:
                                    </span>
                                    <p className="text-slate-700 italic mt-0.5">
                                      "{activeVisit.medicalRecord.doctorAdvice}"
                                    </p>
                                  </div>
                                )}

                                {activeVisit.medicalRecord.followUpDate && (
                                  <div className="pt-2 border-t border-emerald-200/60 font-bold text-blue-900">
                                    📅 Lịch hẹn tái khám: {activeVisit.medicalRecord.followUpDate}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* 4. Prescription (Bảng prescriptions & prescription_items) */}
                          {activeVisit.prescription && activeVisit.prescription.items.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                  <Pill className="h-4 w-4 text-teal-600" />
                                  4. Đơn thuốc điện tử ({activeVisit.prescription.prescriptionCode})
                                </h4>
                                <StatusBadge status={activeVisit.prescription.status} type="prescription" />
                              </div>

                              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                                    <tr>
                                      <th className="py-2.5 px-3">Tên thuốc</th>
                                      <th className="py-2.5 px-3 text-center">Số lượng</th>
                                      <th className="py-2.5 px-3">Liều dùng / Tần suất</th>
                                      <th className="py-2.5 px-3">Số ngày</th>
                                      <th className="py-2.5 px-3">Hướng dẫn sử dụng</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {activeVisit.prescription.items.map((item, idx) => (
                                      <tr key={idx} className="hover:bg-slate-50/50">
                                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                                          {item.medicineName}
                                        </td>
                                        <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                                          {item.quantity} {item.unit}
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-700">
                                          {item.dosage} • {item.frequency}
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-700">
                                          {item.durationDays} ngày
                                        </td>
                                        <td className="py-2.5 px-3 text-teal-800 font-medium">
                                          {item.instructions || 'Theo chỉ dẫn của bác sĩ'}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {activeVisit.prescription.instructions && (
                                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                  Lưu ý đơn thuốc: "{activeVisit.prescription.instructions}"
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};