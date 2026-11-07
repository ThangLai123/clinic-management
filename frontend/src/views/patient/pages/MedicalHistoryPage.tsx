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
  Lock,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { clinicStore } from '../../../mock/clinicStore';
import type { MedicalRecord, Patient, Prescription } from '../../../types/clinic';

export const MedicalHistoryPage: React.FC = () => {
  // Step 1: Phone input | Step 2: OTP verification | Step 3: Records list & detail
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [phone, setPhone] = useState('0912345678'); // Pre-fill with demo phone
  const [phoneError, setPhoneError] = useState('');

  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [demoOtp, setDemoOtp] = useState('123456');

  // Loaded records
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [associatedRx, setAssociatedRx] = useState<Prescription | null>(null);

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
    setDemoOtp(clinicStore.getDemoOtpForPhone(clean));
    setCountdown(60);
    setOtpInput('');
    setOtpError('');
    setStep(2);
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim() !== demoOtp) {
      setOtpError('Mã OTP không chính xác. Vui lòng nhập mã hiển thị trong hộp gợi ý thử nghiệm.');
      return;
    }

    // OTP Verified! Fetch patient's medical records
    const res = clinicStore.getMedicalRecordsByPhone(phone);
    if (!res.patient) {
      // Mock patient if not found
      setPatient({
        id: 'BN-DEMO',
        fullName: 'Bệnh nhân thử nghiệm',
        birthDate: '1990-01-01',
        gender: 'Nam',
        phoneNumber: phone,
        createdAt: '2026-11-01',
      });
      setRecords([]);
    } else {
      setPatient(res.patient);
      setRecords(res.records);
      if (res.records.length > 0) {
        setSelectedRecord(res.records[0]);
        // Find prescription if exists
        const rx = clinicStore.prescriptions.find((p) => p.patientId === res.patient?.id);
        setAssociatedRx(rx || null);
      }
    }

    setStep(3);
  };

  const handleSelectRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    const rx = clinicStore.prescriptions.find((p) => p.receptionId === record.receptionId || p.patientId === record.patientId);
    setAssociatedRx(rx || null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Use Case 02: Tra cứu lịch sử khám bệnh
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Tra Cứu Hồ Sơ & Kết Quả Khám Tai Mũi Họng
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Xác thực bảo mật qua OTP gửi đến số điện thoại đăng ký khám để tra cứu kết quả chẩn đoán, hình ảnh nội soi và đơn thuốc điện tử.
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
                helperText="Gợi ý dữ liệu mẫu có hồ sơ sẵn: 0912345678 (Nguyễn Văn An) hoặc 0988776655 (Trần Thị Thu Hà)."
              />

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  <span>Chính sách bảo mật y tế:</span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Vì lý do an toàn thông tin sức khỏe của người bệnh, hệ thống không tra cứu công khai hồ sơ mà bắt buộc phải xác thực danh tính qua mã OTP 6 chữ số.
                </p>
              </div>

              <Button onClick={handleSendOtp} className="w-full justify-center" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
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
                Mã xác thực đã được tạo cho số điện thoại: <strong>{phone}</strong>
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
                  (Trong môi trường thực tế, mã sẽ được tổng đài gửi qua tin nhắn SMS)
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
      {step === 3 && patient && (
        <div className="space-y-6">
          {/* Patient Overview Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                <User className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{patient.fullName}</h3>
                  <Badge variant="blue">{patient.gender}</Badge>
                  <span className="text-xs text-slate-400 font-mono">Mã BN: {patient.id}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ngày sinh: {patient.birthDate} | SĐT: {patient.phoneNumber}
                  {patient.address && ` | Đ/c: ${patient.address}`}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStep(1);
                setPatient(null);
                setRecords([]);
              }}
              leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
            >
              Tra cứu số khác
            </Button>
          </div>

          {/* Records & Details Columns */}
          {records.length === 0 ? (
            <EmptyState
              title="Chưa tìm thấy lịch sử khám bệnh"
              description={`Số điện thoại ${phone} chưa có hồ sơ bệnh án hoàn tất trên hệ thống phòng khám.`}
              action={
                <Link to="/appointments/new">
                  <Button size="sm">Đặt lịch khám ngay bây giờ</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: List of visits */}
              <div className="lg:col-span-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                  Danh sách lần khám ({records.length})
                </h3>

                {records.map((rec) => {
                  const isSelected = selectedRecord?.id === rec.id;
                  return (
                    <div
                      key={rec.id}
                      onClick={() => handleSelectRecord(rec)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-blue-600" />
                          {rec.examDate}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {rec.id}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-800 line-clamp-1">{rec.diagnosis}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">BS: {rec.doctorName}</p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-700 font-semibold">
                        <span>Xem chi tiết hồ sơ</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Detailed record view */}
              <div className="lg:col-span-8">
                {selectedRecord && (
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-blue-700" />
                        <span>Chi tiết lần khám: {selectedRecord.examDate}</span>
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
                      {/* Meta header */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Bác sĩ khám:</span>
                          <span className="font-bold text-slate-900">{selectedRecord.doctorName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Mã bệnh án:</span>
                          <span className="font-mono font-bold text-blue-700">{selectedRecord.id}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Trạng thái:</span>
                          <span className="font-semibold text-emerald-700">Đã hoàn tất kết luận</span>
                        </div>
                      </div>

                      {/* Complaint & History */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">1. Lý do khám & Bệnh sử</h4>
                        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                          <p><strong>Lý do đến khám:</strong> {selectedRecord.chiefComplaint}</p>
                          <p className="text-slate-600"><strong>Diễn biến & tiền sử:</strong> {selectedRecord.medicalHistory}</p>
                        </div>
                      </div>

                      {/* Examination Findings */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">2. Kết quả khám Tai Mũi Họng & Nội soi</h4>
                        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 leading-relaxed">
                          <p>• <strong>Khám lâm sàng:</strong> {selectedRecord.examinationSummary}</p>
                          {selectedRecord.endoscopySummary && (
                            <p className="text-blue-900 bg-blue-50/70 p-2.5 rounded-lg border border-blue-100">
                              • <strong>Kết quả nội soi NBI:</strong> {selectedRecord.endoscopySummary}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Diagnosis & Treatment */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">3. Chẩn đoán & Hướng xử trí</h4>
                        <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5 text-emerald-950">
                          <p className="text-sm font-bold text-emerald-900">
                            Chẩn đoán: {selectedRecord.diagnosis}{' '}
                            {selectedRecord.icdCode && (
                              <span className="text-xs font-mono font-normal bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800">
                                ICD-10: {selectedRecord.icdCode}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-emerald-800">
                            <strong>Phác đồ điều trị:</strong> {selectedRecord.treatmentPlan}
                          </p>
                          {selectedRecord.followUpDate && (
                            <p className="text-xs font-bold text-blue-800 pt-1">
                              📅 Hẹn tái khám vào ngày: {selectedRecord.followUpDate}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Prescription */}
                      {associatedRx && associatedRx.items.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <Pill className="h-4 w-4 text-teal-600" />
                              4. Đơn thuốc đã kê ({associatedRx.id})
                            </h4>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Trạng thái: Đã cấp phát tại quầy dược
                            </span>
                          </div>

                          <div className="overflow-x-auto border border-slate-200 rounded-xl">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                                <tr>
                                  <th className="py-2 px-3">Tên thuốc & Hàm lượng</th>
                                  <th className="py-2 px-3 text-center">Số lượng</th>
                                  <th className="py-2 px-3">Cách dùng & Liều lượng</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {associatedRx.items.map((item, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="py-2 px-3 font-semibold text-slate-900">
                                      {item.medicineName}
                                      <span className="block text-[10px] text-slate-400 font-normal">
                                        Đường dùng: {item.route}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 text-center font-bold text-slate-800">
                                      {item.quantity} {item.unit}
                                    </td>
                                    <td className="py-2 px-3 text-slate-600">
                                      <span>{item.frequency} - {item.dosage}</span>
                                      <span className="block text-[11px] text-teal-700 font-medium">
                                        {item.instructions}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {associatedRx.advice && (
                            <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              Lời dặn của Bác sĩ: "{associatedRx.advice}"
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
        </div>
      )}
    </div>
  );
};
