import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Search,
  Activity,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { getBaseUrl } from '../../../api/client';
import type { Gender } from '../../../types/clinic';

const TIME_SLOTS = [
  '08:00 - 08:30',
  '08:30 - 09:00',
  '09:00 - 09:30',
  '09:30 - 10:00',
  '10:00 - 10:30',
  '10:30 - 11:00',
  '11:00 - 11:30',
  '14:00 - 14:30',
  '14:30 - 15:00',
  '15:00 - 15:30',
  '15:30 - 16:00',
  '16:00 - 16:30',
  '16:30 - 17:00',
  '17:30 - 18:00',
  '18:00 - 18:30',
  '18:30 - 19:00',
  '19:00 - 19:30',
];

const COMMON_SYMPTOMS = [
  'Nghẹt mũi / Tắc mũi',
  'Chảy nước mũi trong / đục',
  'Đau nhức vùng mũi xoang',
  'Đau tai / Chảy dịch tai',
  'Ù tai / Giảm thính lực',
  'Đau họng',
  'Khàn tiếng',
  'Ho kéo dài',
  'Khó nuốt / vướng họng',
  'Sốt nhẹ / Mệt mỏi',
];

interface ServiceInfo {
  id: string;
  serviceCode: string;
  serviceName: string;
  categoryName?: string;
  price: number;
  durationMin?: number | null;
  durationMax?: number | null;
}

interface BookedAppointmentResponse {
  appointmentCode: string;
  fullName: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceCode?: string | null;
  serviceName?: string | null;
  status: string;
  message: string;
}

export const AppointmentBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const serviceCodeParam = searchParams.get('serviceCode');

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Info, 2: Symptoms & Date, 3: Review, 4: Success
  const [createdAppointment, setCreatedAppointment] = useState<BookedAppointmentResponse | null>(null);

  // Service selected from BE-04
  const [selectedService, setSelectedService] = useState<ServiceInfo | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [isServiceLoading, setIsServiceLoading] = useState<boolean>(false);

  // Form states matching appointments table
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>('MALE');
  const [notes, setNotes] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);
  const [appointmentDate, setAppointmentDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[1]);
  const [availableSlots, setAvailableSlots] = useState<string[]>(TIME_SLOTS);
  const [isSlotsLoading, setIsSlotsLoading] = useState<boolean>(false);
  const [reason, setReason] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  // Errors & Loading state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 1. Fetch service details if serviceCode query param is present
  useEffect(() => {
    if (!serviceCodeParam) {
      setSelectedService(null);
      setServiceError(null);
      return;
    }

    const fetchServiceDetail = async () => {
      setIsServiceLoading(true);
      setServiceError(null);
      try {
        const res = await fetch(`${getBaseUrl()}/api/services/${encodeURIComponent(serviceCodeParam.trim())}`);
        if (!res.ok) {
          if (res.status === 404) {
            setServiceError(
              `Dịch vụ với mã '${serviceCodeParam}' không tìm thấy hoặc đã ngừng tiếp nhận. Bạn có thể tiếp tục đặt lịch khám tổng quát.`
            );
          } else {
            setServiceError('Không thể tải thông tin dịch vụ đã chọn.');
          }
          setSelectedService(null);
          return;
        }
        const data: ServiceInfo = await res.json();
        setSelectedService(data);
      } catch {
        setServiceError('Không thể kết nối đến máy chủ để xác nhận thông tin dịch vụ.');
        setSelectedService(null);
      } finally {
        setIsServiceLoading(false);
      }
    };

    fetchServiceDetail();
  }, [serviceCodeParam]);

  // 2. Fetch available time slots when appointmentDate changes
  useEffect(() => {
    if (!appointmentDate) return;

    const fetchTimeSlots = async () => {
      setIsSlotsLoading(true);
      try {
        const res = await fetch(`${getBaseUrl()}/api/appointments/time-slots?date=${appointmentDate}`);
        if (res.ok) {
          const slots: string[] = await res.json();
          setAvailableSlots(slots);
          if (slots.length > 0 && !slots.includes(timeSlot)) {
            setTimeSlot(slots[0]);
          } else if (slots.length === 0) {
            setTimeSlot('');
          }
        } else {
          setAvailableSlots(TIME_SLOTS);
        }
      } catch {
        setAvailableSlots(TIME_SLOTS);
      } finally {
        setIsSlotsLoading(false);
      }
    };

    fetchTimeSlots();
  }, [appointmentDate]);

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
    if (!timeSlot) {
      err.timeSlot = 'Vui lòng chọn khung giờ khám';
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

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      fullName: fullName.trim(),
      phone: phoneNumber.trim(),
      birthDate: birthDate || undefined,
      gender,
      appointmentDate,
      appointmentTime: timeSlot,
      serviceCode: selectedService ? selectedService.serviceCode : undefined,
      symptoms: selectedSymptoms,
      symptomDescription: reason.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      const res = await fetch(`${getBaseUrl()}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        const data: BookedAppointmentResponse = await res.json();
        setCreatedAppointment(data);
        setStep(4);
      } else {
        let errorMsg = 'Đặt lịch không thành công. Vui lòng thử lại sau.';
        try {
          const errData = await res.json();
          if (errData.detail) {
            errorMsg = errData.detail;
          } else if (errData.title) {
            errorMsg = errData.title;
          }
        } catch {
          const text = await res.text();
          if (text) errorMsg = text;
        }
        setSubmitError(errorMsg);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Không thể kết nối đến máy chủ phòng khám. Vui lòng kiểm tra lại kết nối mạng.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      {/* Selected Service Banner if coming from BE-04 */}
      {selectedService && step < 4 && (
        <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Activity className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-900 truncate">{selectedService.serviceName}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                  {selectedService.serviceCode}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Dịch vụ chỉ định Tai Mũi Họng • Giá niêm yết:{' '}
                <strong className="text-blue-700">
                  {selectedService.price === 0
                    ? 'Miễn phí (có điều kiện)'
                    : `${selectedService.price.toLocaleString('vi-VN')} đ`}
                </strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedService(null)}
            className="text-slate-400 hover:text-slate-700 text-[11px] underline shrink-0 cursor-pointer"
            title="Bỏ chọn dịch vụ để chuyển sang khám tổng quát"
          >
            Bỏ chọn
          </button>
        </div>
      )}

      {serviceError && step < 4 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>{serviceError}</span>
        </div>
      )}

      {/* Step Indicators */}
      {step < 4 && (
        <div className="space-y-3">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Đặt lịch khám trực tuyến
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Đặt lịch khám Tai Mũi Họng
            </h1>
            <p className="text-xs text-slate-500">
              Điền thông tin và mô tả triệu chứng ban đầu để được bố trí lịch tiếp nhận nhanh chóng.
            </p>
          </div>

          <div className="flex items-center justify-between max-w-xl mx-auto pt-2">
            {[
              { num: 1, label: 'Thông tin' },
              { num: 2, label: 'Ngày & Giờ' },
              { num: 3, label: 'Xác nhận' },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      step === s.num
                        ? 'bg-blue-700 text-white shadow-md'
                        : step > s.num
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${
                      step >= s.num ? 'text-slate-900' : 'text-slate-400'
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
                helperText="Dùng để nhận mã lịch hẹn và tra cứu hồ sơ khám qua OTP sau này."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ngày sinh (không bắt buộc)"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                helperText="Để trống nếu người bệnh chưa nhớ rõ ngày tháng năm sinh"
              />
              <Select
                label="Giới tính"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                options={[
                  { value: 'MALE', label: 'Nam' },
                  { value: 'FEMALE', label: 'Nữ' },
                  { value: 'OTHER', label: 'Khác' },
                  { value: 'UNSPECIFIED', label: 'Chưa xác định' },
                ]}
              />
            </div>

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
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Khung giờ dự kiến <span className="text-red-500">*</span>
                  {isSlotsLoading && <span className="text-slate-400 font-normal ml-2">(Đang tải...)</span>}
                </label>
                <div className="relative">
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    disabled={availableSlots.length === 0}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 text-slate-800 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-700 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))
                    ) : (
                      <option value="">Không còn khung giờ tiếp nhận trong ngày</option>
                    )}
                  </select>
                  <Clock className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
                {errors.timeSlot && <p className="text-[11px] text-red-500 mt-1">{errors.timeSlot}</p>}
                {availableSlots.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    Các khung giờ khám trong ngày đã kết thúc. Vui lòng chọn ngày tiếp theo.
                  </p>
                )}
              </div>
            </div>

            {/* Symptoms Tags */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Triệu chứng phổ biến (nhấp chọn nhiều mục nếu có):
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SYMPTOMS.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      type="button"
                      key={sym}
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected ? `✓ ${sym}` : `+ ${sym}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <Textarea
              label="Mô tả triệu chứng cụ thể / Lý do đến khám (không bắt buộc)"
              placeholder="Ví dụ: Đau tai phải 3 ngày nay, có sốt nhẹ về chiều, đã uống panadol nhưng chưa đỡ..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />

            <Textarea
              label="Ghi chú khác cho phòng khám (không bắt buộc)"
              placeholder="Ví dụ: Có người nhà đi cùng, muốn khám bác sĩ tai mũi họng người lớn..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Quay lại
              </Button>
              <Button
                onClick={handleNextToStep3}
                disabled={availableSlots.length === 0}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Xem lại thông tin đặt hẹn
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
                <span className="text-[11px] font-bold text-blue-700 uppercase">1. Thông tin người bệnh</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-slate-700">
                  <p>
                    <strong>Họ và tên:</strong> {fullName}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {phoneNumber}
                  </p>
                  <p>
                    <strong>Ngày sinh:</strong> {birthDate || 'Chưa cung cấp'}
                  </p>
                  <p>
                    <strong>Giới tính:</strong>{' '}
                    {gender === 'MALE'
                      ? 'Nam'
                      : gender === 'FEMALE'
                      ? 'Nữ'
                      : gender === 'OTHER'
                      ? 'Khác'
                      : 'Chưa xác định'}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase">2. Chi tiết lịch hẹn</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-slate-700">
                  <p>
                    <strong>Ngày hẹn khám:</strong> {appointmentDate}
                  </p>
                  <p>
                    <strong>Khung giờ:</strong> {timeSlot}
                  </p>
                  <p className="col-span-2">
                    <strong>Dịch vụ đăng ký:</strong>{' '}
                    {selectedService ? (
                      <span className="font-semibold text-blue-700">
                        {selectedService.serviceName} ({selectedService.serviceCode}) -{' '}
                        {selectedService.price === 0
                          ? 'Miễn phí (có điều kiện)'
                          : `${selectedService.price.toLocaleString('vi-VN')} đ`}
                      </span>
                    ) : (
                      <span className="text-slate-600">Khám tổng quát Tai Mũi Họng</span>
                    )}
                  </p>
                  <p className="col-span-2">
                    <strong>Triệu chứng khai báo:</strong>{' '}
                    {selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : 'Chưa chọn'}
                  </p>
                  {reason && (
                    <p className="col-span-2">
                      <strong>Mô tả chi tiết:</strong> {reason}
                    </p>
                  )}
                  {notes && (
                    <p className="col-span-2">
                      <strong>Ghi chú:</strong> {notes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {submitError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Yêu cầu đặt lịch của bạn sẽ được gửi tới bộ phận Tiếp đón & Lễ tân để liên hệ xác nhận.</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setStep(2)}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Chỉnh sửa lại
              </Button>
              <Button
                onClick={handleConfirmBooking}
                variant="primary"
                disabled={isSubmitting}
                leftIcon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck className="h-4 w-4" />}
              >
                {isSubmitting ? 'Đang gửi yêu cầu đặt lịch...' : 'Xác nhận đặt lịch khám'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: Success Screen */}
      {step === 4 && createdAppointment && (
        <Card className="text-center py-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900">Đặt Lịch Hẹn Thành Công!</h2>
              <p className="text-xs text-slate-500">
                Yêu cầu đặt hẹn của bạn đã được ghi nhận trên hệ thống phòng khám với trạng thái chờ xác nhận.
              </p>
            </div>

            {/* Status notice */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Đặt lịch thành công – Đang chờ phòng khám xác nhận.</span>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Mã lịch hẹn:</span>
                <span className="font-mono font-bold text-base text-blue-700">{createdAppointment.appointmentCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Họ và tên bệnh nhân:</span>
                <span className="font-semibold text-slate-900">{createdAppointment.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Số điện thoại:</span>
                <span className="font-semibold text-slate-900">{createdAppointment.phone}</span>
              </div>
              {createdAppointment.serviceName && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Dịch vụ đăng ký:</span>
                  <span className="font-semibold text-blue-700">{createdAppointment.serviceName}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ngày khám:</span>
                <span className="font-semibold text-slate-900">{createdAppointment.appointmentDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Giờ hẹn:</span>
                <span className="font-semibold text-blue-700">
                  {createdAppointment.appointmentTime.length > 5
                    ? createdAppointment.appointmentTime.slice(0, 5)
                    : createdAppointment.appointmentTime}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500">Trạng thái:</span>
                <StatusBadge type="appointment" value={createdAppointment.status} />
              </div>
            </div>

            {/* Instructions */}
            <div className="text-xs text-slate-500 text-left bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-1.5">
              <p className="font-bold text-blue-900">Hướng dẫn dành cho bệnh nhân khi đến khám:</p>
              <p>• Vui lòng có mặt tại quầy Lễ tân trước giờ hẹn 10 phút để được kiểm tra và tiếp nhận.</p>
              <p>
                • Đọc <strong>Mã lịch hẹn ({createdAppointment.appointmentCode})</strong> hoặc{' '}
                <strong>Số điện thoại</strong> để nhân viên làm thủ tục vào khám theo thứ tự ưu tiên.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/medical-history" className="flex-1">
                <Button variant="outline" className="w-full text-xs justify-center" leftIcon={<Search className="h-4 w-4" />}>
                  Tra cứu lịch sử khám
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button variant="primary" className="w-full text-xs justify-center">
                  Về trang chủ phòng khám
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AppointmentBookingPage;
