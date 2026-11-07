import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Card } from '../../../components/ui/Card';
import { clinicStore } from '../../../mock/clinicStore';
import type { Appointment } from '../../../types/clinic';

const TIME_SLOTS = [
  '08:00 - 08:30',
  '08:30 - 09:00',
  '09:00 - 09:30',
  '09:30 - 10:00',
  '10:00 - 10:30',
  '10:30 - 11:00',
  '14:00 - 14:30',
  '14:30 - 15:00',
  '15:00 - 15:30',
  '15:30 - 16:00',
  '16:00 - 16:30',
  '16:30 - 17:00',
  '17:30 - 18:00',
  '18:00 - 18:30',
];

const COMMON_SYMPTOMS = [
  'Đau tai',
  'Ù tai',
  'Nghe kém',
  'Chảy dịch tai',
  'Nghẹt mũi',
  'Chảy nước mũi',
  'Đau vùng mũi xoang',
  'Đau họng',
  'Khàn tiếng',
  'Ho kéo dài',
  'Khó nuốt / vướng họng',
  'Sốt nhẹ / Mệt mỏi',
];

export const AppointmentBookingPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Info, 2: Symptoms & Date, 3: Review, 4: Success
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác'>('Nam');
  const [address, setAddress] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);
  const [appointmentDate, setAppointmentDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[1]);
  const [reason, setReason] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomDuration, setSymptomDuration] = useState('Khoảng 2 - 3 ngày');
  const [notes, setNotes] = useState('');

  // Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const validateStep1 = () => {
    const err: { [key: string]: string } = {};
    if (!fullName.trim()) err.fullName = 'Vui lòng nhập họ và tên';
    if (!phoneNumber.trim()) {
      err.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(phoneNumber.replace(/\s+/g, ''))) {
      err.phoneNumber = 'Số điện thoại không hợp lệ (cần 10 chữ số chuẩn)';
    }
    if (!birthDate) err.birthDate = 'Vui lòng chọn ngày sinh';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep2 = () => {
    const err: { [key: string]: string } = {};
    if (!appointmentDate) {
      err.appointmentDate = 'Vui lòng chọn ngày khám';
    } else if (appointmentDate < todayStr) {
      err.appointmentDate = 'Không thể đặt lịch vào ngày trong quá khứ';
    }
    if (!timeSlot) err.timeSlot = 'Vui lòng chọn khung giờ khám';
    if (!reason.trim() && selectedSymptoms.length === 0) {
      err.reason = 'Vui lòng nhập lý do khám hoặc chọn ít nhất 1 triệu chứng';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNextToStep2 = () => {
    if (validateStep1()) setStep(2);
  };

  const handleNextToStep3 = () => {
    if (validateStep2()) setStep(3);
  };

  const handleConfirmBooking = () => {
    const newApt = clinicStore.addAppointment({
      patientName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      birthDate,
      gender,
      address: address.trim() || undefined,
      appointmentDate,
      timeSlot,
      reason: reason.trim() || selectedSymptoms.join(', '),
      symptoms: selectedSymptoms,
      symptomDuration,
      notes: notes.trim() || undefined,
    });

    setCreatedAppointment(newApt);
    setStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Step Indicators */}
      {step < 4 && (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Use Case 01: Đặt lịch hẹn khám bệnh
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Đăng Ký Khám Tai Mũi Họng Trực Tuyến
            </h1>
            <p className="text-xs text-slate-500">
              Điền thông tin và mô tả triệu chứng ban đầu để được bố trí lịch khám nhanh chóng.
            </p>
          </div>

          <div className="flex items-center justify-center max-w-xl mx-auto pt-2">
            {[
              { num: 1, label: 'Thông tin cá nhân' },
              { num: 2, label: 'Thời gian & Triệu chứng' },
              { num: 3, label: 'Xem lại & Xác nhận' },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step === s.num
                        ? 'bg-blue-700 text-white shadow-md'
                        : step > s.num
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-medium mt-1 ${
                      step === s.num ? 'text-blue-700 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`h-0.5 flex-1 mx-3 -mt-4 transition-colors ${
                      step > idx + 1 ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Warning */}
      {step < 4 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-amber-900 text-xs">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Lưu ý:</strong> Khung giờ đặt hẹn chỉ có giá trị tiếp nhận ưu tiên tại phòng khám. Nếu có dấu hiệu khó thở cấp hoặc nuốt dị vật sắc nhọn, xin vui lòng đến trực tiếp cơ sở y tế gần nhất.
          </p>
        </div>
      )}

      {/* STEP 1: Personal Info */}
      {step === 1 && (
        <Card title="Bước 1: Thông tin người bệnh">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Họ và tên bệnh nhân"
                placeholder="Ví dụ: Nguyễn Văn An"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                required
                leftIcon={<User className="h-4 w-4" />}
              />
              <Input
                label="Số điện thoại liên hệ"
                placeholder="Ví dụ: 0912345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                error={errors.phoneNumber}
                required
                leftIcon={<Phone className="h-4 w-4" />}
                helperText="Dùng để nhận mã lịch hẹn và tra cứu hồ sơ khám sau này."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ngày sinh"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                error={errors.birthDate}
                required
              />
              <Select
                label="Giới tính"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                options={[
                  { value: 'Nam', label: 'Nam' },
                  { value: 'Nữ', label: 'Nữ' },
                  { value: 'Khác', label: 'Khác' },
                ]}
              />
            </div>

            <Input
              label="Địa chỉ cư trú (không bắt buộc)"
              placeholder="Ví dụ: Số 15 Phố Huế, Q. Hoàn Kiếm, Hà Nội"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              leftIcon={<MapPin className="h-4 w-4" />}
            />

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button onClick={handleNextToStep2} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Tiếp tục: Chọn ngày giờ & Triệu chứng
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 2: Date & Symptoms */}
      {step === 2 && (
        <Card title="Bước 2: Thời gian khám & Triệu chứng Tai Mũi Họng">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ngày muốn khám"
                type="date"
                min={todayStr}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                error={errors.appointmentDate}
                required
                leftIcon={<Calendar className="h-4 w-4" />}
              />
              <Select
                label="Khung giờ hẹn mong muốn"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                error={errors.timeSlot}
                options={TIME_SLOTS.map((t) => ({ value: t, label: t }))}
              />
            </div>

            {/* Symptoms selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Các triệu chứng bạn đang gặp phải (chọn các mục phù hợp):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COMMON_SYMPTOMS.map((sym) => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="h-3 w-3" />}
                      </div>
                      <span className="truncate">{sym}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Thời gian triệu chứng xuất hiện"
                value={symptomDuration}
                onChange={(e) => setSymptomDuration(e.target.value)}
                options={[
                  { value: 'Mới bị trong ngày hôm nay', label: 'Mới bị trong ngày hôm nay' },
                  { value: 'Khoảng 2 - 3 ngày', label: 'Khoảng 2 - 3 ngày' },
                  { value: 'Khoảng 1 tuần nay', label: 'Khoảng 1 tuần nay' },
                  { value: 'Kéo dài trên 2 tuần', label: 'Kéo dài trên 2 tuần' },
                  { value: 'Bị mạn tính tái phát nhiều đợt', label: 'Bị mạn tính tái phát nhiều đợt' },
                ]}
              />

              <Input
                label="Lý do khám chính"
                placeholder="Ví dụ: Nghẹt mũi, đau nhức hốc mắt và trán"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                error={errors.reason}
              />
            </div>

            <Textarea
              label="Ghi chú thêm cho Bác sĩ (nếu có tiền sử dị ứng, thuốc đang dùng...)"
              placeholder="Ví dụ: Có tiền sử dị ứng Penicillin, đang dùng thuốc hạ huyết áp..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Quay lại
              </Button>
              <Button onClick={handleNextToStep3} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Kiểm tra lại thông tin
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 3: Review */}
      {step === 3 && (
        <Card title="Bước 3: Xác nhận thông tin phiếu đặt hẹn">
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4 text-xs">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[11px] font-bold text-blue-700 uppercase">1. Thông tin bệnh nhân</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <p><strong>Họ và tên:</strong> {fullName}</p>
                  <p><strong>Số điện thoại:</strong> {phoneNumber}</p>
                  <p><strong>Ngày sinh:</strong> {birthDate}</p>
                  <p><strong>Giới tính:</strong> {gender}</p>
                  {address && <p className="col-span-2"><strong>Địa chỉ:</strong> {address}</p>}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase">2. Chi tiết lịch hẹn</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <p><strong>Ngày hẹn khám:</strong> {appointmentDate}</p>
                  <p><strong>Khung giờ:</strong> {timeSlot}</p>
                  <p className="col-span-2">
                    <strong>Triệu chứng khai báo:</strong>{' '}
                    {selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : 'Chưa chọn'}
                  </p>
                  <p><strong>Thời gian bị bệnh:</strong> {symptomDuration}</p>
                  <p><strong>Lý do khám:</strong> {reason || selectedSymptoms.join(', ')}</p>
                  {notes && <p className="col-span-2"><strong>Ghi chú:</strong> {notes}</p>}
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Dữ liệu đặt lịch sẽ được chuyển ngay đến bàn Lễ tân phòng khám để chuẩn bị hồ sơ tiếp nhận.</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Chỉnh sửa lại
              </Button>
              <Button onClick={handleConfirmBooking} variant="primary" leftIcon={<FileCheck className="h-4 w-4" />}>
                Xác nhận đặt lịch khám
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: Success Screen */}
      {step === 4 && createdAppointment && (
        <Card className="text-center py-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900">Đặt Lịch Hẹn Thành Công!</h2>
              <p className="text-xs text-slate-500">
                Yêu cầu đặt hẹn của bạn đã được ghi nhận trên hệ thống tiếp nhận của phòng khám.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Mã lịch hẹn:</span>
                <span className="font-mono font-bold text-sm text-blue-700">{createdAppointment.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Bệnh nhân:</span>
                <span className="font-semibold text-slate-900">{createdAppointment.patientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Số điện thoại:</span>
                <span className="font-semibold text-slate-900">{createdAppointment.phoneNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ngày khám:</span>
                <span className="font-semibold text-slate-900">{createdAppointment.appointmentDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Khung giờ hẹn:</span>
                <span className="font-semibold text-blue-700">{createdAppointment.timeSlot}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500">Trạng thái:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Chờ Lễ Tân Tiếp Nhận (UC-04/05)
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-xs text-slate-500 text-left bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-1.5">
              <p className="font-bold text-blue-900">Hướng dẫn dành cho bệnh nhân khi đến khám:</p>
              <p>• Vui lòng có mặt tại quầy Lễ tân trước giờ hẹn 10 phút.</p>
              <p>• Đọc <strong>Mã lịch hẹn</strong> hoặc <strong>Số điện thoại</strong> để nhân viên làm thủ tục vào phòng khám ngay.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/medical-history" className="flex-1">
                <Button variant="outline" className="w-full text-xs justify-center" leftIcon={<Search className="h-4 w-4" />}>
                  Tra cứu lịch sử khám
                </Button>
              </Link>
              <Link to="/receptionist/appointments" className="flex-1">
                <Button variant="primary" className="w-full text-xs justify-center" leftIcon={<ArrowRight className="h-4 w-4" />}>
                  Xem tại Cổng Lễ Tân (UC-05)
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

