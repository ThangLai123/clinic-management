import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  UserCheck,
  Search,
  Plus,
  Calendar,
  AlertTriangle,
  HeartPulse,
  DoorOpen,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import type { ReceptionPriority, Patient } from '../../../types/clinic';

export const PatientReceptionPage: React.FC = () => {
  const store = useClinicStore();
  const [searchParams] = useSearchParams();
  const fromAptId = searchParams.get('fromApt');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states for Reception
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // New patient inputs if creating fresh
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('1990-01-01');
  const [newGender, setNewGender] = useState<'Nam' | 'Nữ' | 'Khác'>('Nam');
  const [newAddress, setNewAddress] = useState('');
  const [newAllergies, setNewAllergies] = useState('');

  // Clinical & Triage info
  const [receptionType, setReceptionType] = useState<'DAT_LICH' | 'TRUC_TIEP'>('TRUC_TIEP');
  const [appointmentId, setAppointmentId] = useState<string | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('Nghẹt mũi, đau họng');
  const [priority, setPriority] = useState<ReceptionPriority>('BINH_THUONG');

  // Vital signs
  const [pulse, setPulse] = useState(76);
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [temperature, setTemperature] = useState(36.8);
  const [spO2, setSpO2] = useState(99);

  // Auto-fill from appointment if navigated from URL
  useEffect(() => {
    if (fromAptId) {
      const apt = store.appointments.find((a) => a.id === fromAptId);
      if (apt) {
        setReceptionType('DAT_LICH');
        setAppointmentId(apt.id);
        setReason(apt.reason);
        setSymptoms(apt.symptoms.join(', '));

        // Find or prepare patient
        const existing = store.patients.find((p) => p.phoneNumber === apt.phoneNumber);
        if (existing) {
          setSelectedPatient(existing);
          setSelectedPatientId(existing.id);
        } else {
          setIsNewPatient(true);
          setNewFullName(apt.patientName);
          setNewPhone(apt.phoneNumber);
          if (apt.birthDate) setNewBirthDate(apt.birthDate);
          if (apt.gender) setNewGender(apt.gender);
          if (apt.address) setNewAddress(apt.address);
        }
        setIsModalOpen(true);
      }
    }
  }, [fromAptId, store.appointments, store.patients]);

  const handleOpenNewReception = () => {
    setIsNewPatient(false);
    setSelectedPatientId(store.patients[0]?.id || '');
    setSelectedPatient(store.patients[0] || null);
    setReceptionType('TRUC_TIEP');
    setAppointmentId(undefined);
    setReason('');
    setIsModalOpen(true);
  };

  const handlePatientSelectChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    const p = store.patients.find((item) => item.id === patientId);
    setSelectedPatient(p || null);
  };

  const handleConfirmReception = () => {
    let finalPatient: Patient;

    if (isNewPatient) {
      if (!newFullName.trim() || !newPhone.trim()) return;
      finalPatient = store.addPatient({
        fullName: newFullName.trim(),
        phoneNumber: newPhone.trim(),
        birthDate: newBirthDate,
        gender: newGender,
        address: newAddress.trim() || undefined,
        allergies: newAllergies ? newAllergies.split(',').map((s) => s.trim()) : undefined,
      });
    } else {
      if (!selectedPatient) return;
      finalPatient = selectedPatient;
    }

    store.addReception({
      patientId: finalPatient.id,
      patientName: finalPatient.fullName,
      phoneNumber: finalPatient.phoneNumber,
      appointmentId,
      receptionType,
      reason: reason.trim() || 'Khám Tai Mũi Họng tổng quát',
      symptoms: symptoms.split(',').map((s) => s.trim()).filter(Boolean),
      priority,
      vitalSigns: {
        pulse,
        bloodPressure,
        temperature,
        spO2,
      },
    });

    setIsModalOpen(false);
  };

  // Receptions in waiting queue
  const recentReceptions = store.receptions.filter(
    (r) => r.status === 'CHO_PHAN_PHONG' || r.status === 'CHO_KHAM'
  );

  return (
    <div className="space-y-6">
      <Topbar
        title="Tiếp Nhận & Đón Tiếp Bệnh Nhân"
        subtitle="Use Case 04: Đăng ký khám trực tiếp, tiếp nhận lịch hẹn online, phân loại ưu tiên và đo dấu hiệu sinh tồn."
        actions={
          <Button onClick={handleOpenNewReception} leftIcon={<Plus className="h-4 w-4" />}>
            Lập phiếu tiếp nhận mới
          </Button>
        }
      />

      {/* Grid: Pending Appointments & Today's Receptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Receptions List */}
        <div className="lg:col-span-8 space-y-4">
          <Card
            title={`Danh sách bệnh nhân vừa tiếp nhận hôm nay (${recentReceptions.length})`}
            subtitle="Các lượt tiếp nhận đang chờ lễ tân phân buồng khám hoặc đang chờ bác sĩ khám"
          >
            {recentReceptions.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                Chưa có lượt tiếp nhận nào trong hàng đợi. Nhấn "Lập phiếu tiếp nhận mới" để đón tiếp bệnh nhân.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Mã TN / Giờ</th>
                      <th className="py-2.5 px-3">Họ Tên & SĐT</th>
                      <th className="py-2.5 px-3">Hình thức</th>
                      <th className="py-2.5 px-3">Ưu tiên</th>
                      <th className="py-2.5 px-3">Trạng thái</th>
                      <th className="py-2.5 px-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentReceptions.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-blue-700 block">{rec.id}</span>
                          <span className="text-[11px] text-slate-400">{rec.receptionTime}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{rec.patientName}</span>
                          <span className="text-[11px] text-slate-500">{rec.phoneNumber}</span>
                        </td>
                        <td className="py-3 px-3">
                          {rec.receptionType === 'DAT_LICH' ? (
                            <Badge variant="blue">Có lịch hẹn</Badge>
                          ) : (
                            <Badge variant="slate">Khám trực tiếp</Badge>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge type="priority" value={rec.priority} />
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge type="reception" value={rec.status} />
                          {rec.assignedDoctorName && (
                            <span className="block text-[10px] text-slate-500 mt-0.5">
                              {rec.assignedDoctorName}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {rec.status === 'CHO_PHAN_PHONG' ? (
                            <Link to="/receptionist/room-assignment">
                              <Button size="sm" variant="outline" className="text-[11px]">
                                Phân phòng (UC-06)
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-medium">
                              Đã gán {rec.assignedRoomId}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Online Appointments waiting check-in */}
        <div className="lg:col-span-4 space-y-4">
          <Card
            title="Lịch hẹn trực tuyến chờ đón tiếp"
            subtitle="Bệnh nhân đặt trước qua website (UC-01)"
          >
            <div className="space-y-3">
              {store.appointments
                .filter((a) => a.status === 'DA_XAC_NHAN' || a.status === 'CHO_XAC_NHAN')
                .map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{apt.patientName}</span>
                      <span className="font-mono text-[10px] text-blue-700 font-bold">{apt.timeSlot}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{apt.phoneNumber} • {apt.appointmentDate}</p>
                    <p className="text-slate-600 italic line-clamp-1">"{apt.reason}"</p>

                    <div className="pt-2 flex justify-end">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setFromAppointment(apt);
                          setIsModalOpen(true);
                        }}
                      >
                        Tiếp nhận ca này
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>

      {/* MODAL: Reception Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Lập Phiếu Tiếp Nhận Bệnh Nhân (Check-in)"
        subtitle="Nhập thông tin người bệnh, đo dấu hiệu sinh tồn và phân loại mức độ khẩn cấp"
        maxWidth="2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy bỏ
            </Button>
            <Button onClick={handleConfirmReception} variant="primary">
              Xác nhận tiếp nhận & Chuyển phân buồng
            </Button>
          </>
        }
      >
        <div className="space-y-5 text-xs">
          {/* Section 1: Patient source */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="source"
                  checked={!isNewPatient}
                  onChange={() => setIsNewPatient(false)}
                />
                Chọn bệnh nhân đã có hồ sơ
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="source"
                  checked={isNewPatient}
                  onChange={() => setIsNewPatient(true)}
                />
                Đăng ký hồ sơ mới
              </label>
            </div>
            <span className="text-[11px] font-bold text-blue-700">
              {receptionType === 'DAT_LICH' ? 'Có lịch hẹn trước' : 'Đến khám trực tiếp'}
            </span>
          </div>

          {!isNewPatient ? (
            <div className="space-y-3">
              <Select
                label="Chọn hồ sơ bệnh nhân trong hệ thống"
                value={selectedPatientId}
                onChange={(e) => handlePatientSelectChange(e.target.value)}
                options={store.patients.map((p) => ({
                  value: p.id,
                  label: `${p.fullName} - SĐT: ${p.phoneNumber} (Mã: ${p.id})`,
                }))}
              />

              {selectedPatient && (
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 grid grid-cols-2 gap-2 text-xs">
                  <p><strong>Ngày sinh:</strong> {selectedPatient.birthDate}</p>
                  <p><strong>Giới tính:</strong> {selectedPatient.gender}</p>
                  <p className="col-span-2"><strong>Địa chỉ:</strong> {selectedPatient.address || 'Chưa cập nhật'}</p>
                  <p className="col-span-2 text-rose-700">
                    <strong>Tiền sử dị ứng:</strong> {selectedPatient.allergies?.join(', ') || 'Không ghi nhận'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs">Đăng ký thông tin hành chính mới:</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Họ và tên"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Văn Tuấn"
                  required
                />
                <Input
                  label="Số điện thoại"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0912345678"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Ngày sinh"
                  type="date"
                  value={newBirthDate}
                  onChange={(e) => setNewBirthDate(e.target.value)}
                />
                <Select
                  label="Giới tính"
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value as any)}
                  options={[
                    { value: 'Nam', label: 'Nam' },
                    { value: 'Nữ', label: 'Nữ' },
                    { value: 'Khác', label: 'Khác' },
                  ]}
                />
              </div>
              <Input
                label="Địa chỉ cư trú"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Số nhà, đường, quận/huyện..."
              />
              <Input
                label="Tiền sử dị ứng thuốc / thức ăn (nếu có)"
                value={newAllergies}
                onChange={(e) => setNewAllergies(e.target.value)}
                placeholder="Ví dụ: Dị ứng Penicillin, Paracetamol..."
              />
            </div>
          )}

          {/* Section 2: Medical reason & Triage priority */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1">
              Phân loại & Lý do đến khám:
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Mức độ ưu tiên tiếp nhận"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                options={[
                  { value: 'BINH_THUONG', label: 'Bình thường (Khám theo lượt)' },
                  { value: 'UU_TIEN', label: 'Ưu tiên (Trẻ em dưới 6t, người cao tuổi, sốt cao)' },
                  { value: 'CAP_BACH', label: 'Cấp bách (Cần hỗ trợ buồng khám ngay)' },
                ]}
              />
              <Input
                label="Lý do đến khám"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ví dụ: Đau rát họng, ù tai trái, nghẹt mũi..."
              />
            </div>
            <Input
              label="Triệu chứng ban đầu ghi nhận"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Cách nhau bởi dấu phẩy"
            />
          </div>

          {/* Section 3: Vital Signs */}
          <div className="space-y-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <HeartPulse className="h-4 w-4 text-emerald-700" />
              <span>Dấu hiệu sinh tồn đo tại bàn tiếp nhận:</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <Input
                label="Mạch (lần/ph)"
                type="number"
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value))}
              />
              <Input
                label="Huyết áp (mmHg)"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="120/80"
              />
              <Input
                label="Thân nhiệt (°C)"
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
              />
              <Input
                label="SpO2 (%)"
                type="number"
                value={spO2}
                onChange={(e) => setSpO2(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );

  function setFromAppointment(apt: any) {
    setReceptionType('DAT_LICH');
    setAppointmentId(apt.id);
    setReason(apt.reason);
    setSymptoms(apt.symptoms.join(', '));
    const existing = store.patients.find((p) => p.phoneNumber === apt.phoneNumber);
    if (existing) {
      setSelectedPatient(existing);
      setSelectedPatientId(existing.id);
      setIsNewPatient(false);
    } else {
      setIsNewPatient(true);
      setNewFullName(apt.patientName);
      setNewPhone(apt.phoneNumber);
      if (apt.birthDate) setNewBirthDate(apt.birthDate);
      if (apt.gender) setNewGender(apt.gender);
    }
  }
};

