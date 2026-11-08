import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Search,
  Plus,
  Calendar,
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
  ShieldAlert,
  Activity,
  Phone,
  FileText,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import type { Patient, Gender, ReceptionType } from '../../../types/clinic';
import { GENDER_MAP, RECEPTION_TYPE_MAP } from '../../../types/database';

export const PatientReceptionPage: React.FC = () => {
  const store = useClinicStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromAptId = searchParams.get('fromApt');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mode: existing patient vs new patient
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  // New Patient Form fields (Bảng patients)
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('1990-01-01');
  const [newGender, setNewGender] = useState<Gender>('MALE');
  const [newAddress, setNewAddress] = useState('');
  const [newOccupation, setNewOccupation] = useState('');
  const [newInsuranceNumber, setNewInsuranceNumber] = useState('');
  const [newAllergyNotes, setNewAllergyNotes] = useState('');
  const [newMedicalHistoryNotes, setNewMedicalHistoryNotes] = useState('');
  const [newEmergencyContactName, setNewEmergencyContactName] = useState('');
  const [newEmergencyContactPhone, setNewEmergencyContactPhone] = useState('');

  // Reception fields (Bảng receptions)
  const [receptionType, setReceptionType] = useState<ReceptionType>('WALK_IN');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [receptionNotes, setReceptionNotes] = useState('Đau rát họng, ngứa tai');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('1'); // Default to ENT initial exam

  // Pre-fill if navigated from Appointments page
  useEffect(() => {
    if (fromAptId) {
      const apt = store.appointments.find((a) => a.id === fromAptId);
      if (apt) {
        setReceptionType('APPOINTMENT');
        setSelectedAppointmentId(apt.id);
        setReceptionNotes(apt.reason || apt.symptoms || 'Khám theo lịch hẹn');

        // Look for existing patient with this phone
        const existing = store.patients.find((p) => p.phone === (apt.phoneNumber || apt.phone));
        if (existing) {
          setSelectedPatientId(existing.id);
          setIsNewPatient(false);
        } else {
          setIsNewPatient(true);
          setNewFullName(apt.patientName || apt.fullName || '');
          setNewPhone(apt.phoneNumber || apt.phone || '');
          if (apt.birthDate) setNewBirthDate(apt.birthDate);
          if (apt.gender) setNewGender(apt.gender as Gender);
          if (apt.address) setNewAddress(apt.address);
        }
        setIsModalOpen(true);
      }
    }
  }, [fromAptId, store.appointments, store.patients]);

  const handleOpenWalkIn = () => {
    setIsNewPatient(false);
    setSelectedAppointmentId(null);
    setReceptionType('WALK_IN');
    setSelectedPatientId(store.patients[0]?.id || '');
    setReceptionNotes('Khám chuyên khoa Tai Mũi Họng trực tiếp');
    setIsModalOpen(true);
  };

  const handleOpenFromApt = (apt: any) => {
    setReceptionType('APPOINTMENT');
    setSelectedAppointmentId(apt.id);
    setReceptionNotes(apt.reason || apt.symptoms.join(', ') || 'Khám theo lịch hẹn');

    const existing = store.patients.find((p) => p.phone === apt.phoneNumber);
    if (existing) {
      setSelectedPatientId(existing.id);
      setIsNewPatient(false);
    } else {
      setIsNewPatient(true);
      setNewFullName(apt.patientName);
      setNewPhone(apt.phoneNumber);
      if (apt.birthDate) setNewBirthDate(apt.birthDate);
      if (apt.gender) setNewGender(apt.gender as Gender);
      if (apt.address) setNewAddress(apt.address || '');
    }
    setIsModalOpen(true);
  };

  const handleConfirmReception = () => {
    let finalPatientId = selectedPatientId;

    if (isNewPatient) {
      if (!newFullName.trim() || !newPhone.trim()) {
        alert('Vui lòng điền Họ tên và Số điện thoại của người bệnh.');
        return;
      }

      const createdPatient = store.addPatient({
        fullName: newFullName.trim(),
        phone: newPhone.trim(),
        birthDate: newBirthDate || undefined,
        gender: newGender,
        address: newAddress.trim() || undefined,
        occupation: newOccupation.trim() || undefined,
        insuranceNumber: newInsuranceNumber.trim() || undefined,
        allergyNotes: newAllergyNotes.trim() || undefined,
        medicalHistoryNotes: newMedicalHistoryNotes.trim() || undefined,
        emergencyContactName: newEmergencyContactName.trim() || undefined,
        emergencyContactPhone: newEmergencyContactPhone.trim() || undefined,
      });

      finalPatientId = createdPatient.id;
    }

    if (!finalPatientId) {
      alert('Vui lòng chọn hoặc nhập hồ sơ bệnh nhân.');
      return;
    }

    // 1. Create reception in receptions table
    const reception = store.addReception({
      patientId: finalPatientId,
      appointmentId: selectedAppointmentId,
      receptionType,
      notes: receptionNotes,
      receivedByStaffId: '3', // Lễ tân Hoàng Thu Trang
    });

    // 2. Add initial service if selected (Bảng visit_services)
    if (selectedServiceId) {
      const svc = store.clinicalServices.find((s) => s.id === selectedServiceId);
      if (svc) {
        store.addVisitService({
          receptionId: reception.id,
          clinicalServiceId: svc.id,
          serviceCode: svc.serviceCode,
          serviceName: svc.serviceName,
          unitPrice: svc.price,
          quantity: 1,
        });
      }
    }

    setIsModalOpen(false);
    navigate('/receptionist/queue');
  };

  // Filtered patients for dropdown/search
  const filteredPatients = store.patients.filter((p) => {
    if (!patientSearchQuery) return true;
    const q = patientSearchQuery.toLowerCase();
    return (
      (p.fullName || '').toLowerCase().includes(q) ||
      (p.phone || '').includes(q) ||
      p.patientCode.toLowerCase().includes(q)
    );
  });

  const selectedPatientObj = store.patients.find((p) => p.id === selectedPatientId);

  // Today's receptions
  const todayReceptions = store.receptions.filter((r) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (r.patientName || '').toLowerCase().includes(q) ||
      r.receptionCode.toLowerCase().includes(q) ||
      (r.patient?.phone && r.patient.phone.includes(q))
    );
  });

  // Confirmed appointments waiting for arrival
  const waitingAppointments = store.appointments.filter((a) => a.status === 'CONFIRMED');

  return (
    <div className="space-y-6">
      <Topbar
        title="Tiếp nhận bệnh nhân"
        subtitle="Xác nhận người có lịch hẹn hoặc đăng ký khám trực tiếp."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/receptionist/queue">
              <Button size="sm" variant="outline" leftIcon={<Clock className="h-4 w-4" />}>
                Hàng chờ
              </Button>
            </Link>
            <Button size="sm" onClick={handleOpenWalkIn} leftIcon={<Plus className="h-4 w-4" />}>
              Tiếp nhận trực tiếp
            </Button>
          </div>
        }
      />

      {/* Grid: Pending Appointments & Today's Receptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Today's Receptions List */}
        <div className="lg:col-span-8 min-w-0 space-y-3">
          <Card
            title={`Tiếp nhận hôm nay (${todayReceptions.length})`}
            subtitle="Danh sách bệnh nhân đã làm thủ tục."
            action={
              <div className="relative w-full sm:w-52">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Tìm tên, mã tiếp nhận..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
            }
          >
            {todayReceptions.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                Chưa có lượt tiếp nhận nào hôm nay.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[670px] text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Mã TN / Giờ</th>
                      <th className="py-2.5 px-3">Họ Tên & SĐT</th>
                      <th className="py-2.5 px-3 text-center">Hình thức</th>
                      <th className="py-2.5 px-3">Ghi chú tiếp nhận</th>
                      <th className="py-2.5 px-3 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {todayReceptions.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-blue-700 block">
                            {rec.receptionCode}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {rec.receivedAt ? rec.receivedAt.slice(11, 16) : '--:--'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{rec.patientName || 'Chưa có thông tin'}</span>
                          <span className="text-[11px] text-slate-500">
                            {rec.patient?.phone || 'Chưa cập nhật'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <StatusBadge type="receptionType" status={rec.receptionType} />
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <p className="text-slate-700 line-clamp-1">
                            {rec.notes || 'Khám chuyên khoa Tai Mũi Họng'}
                          </p>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <StatusBadge type="reception" status={rec.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Confirmed Appointments Waiting for Check-in */}
        <div className="lg:col-span-4 min-w-0 space-y-3">
          <Card
            title={`Lịch hẹn chờ đến (${waitingAppointments.length})`}
            subtitle="Lịch đã xác nhận, chưa tiếp nhận."
          >
            {waitingAppointments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Không có lịch hẹn nào đang chờ tiếp nhận.
              </p>
            ) : (
              <div className="space-y-2">
                {waitingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 hover:border-blue-300 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="font-bold text-slate-900">{apt.fullName || apt.patientName || 'Chưa có thông tin'}</span>
                      <span className="font-mono text-[10px] text-blue-700 font-bold bg-blue-100/60 px-1.5 py-0.5 rounded">
                        {apt.timeSlot}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      {apt.phone || apt.phoneNumber || 'Chưa cập nhật'} • {apt.appointmentDate}
                    </p>
                    <p className="text-slate-600 italic line-clamp-1">
                      "{apt.reason || apt.symptoms || 'Khám TMH'}"
                    </p>

                    <div className="pt-1.5 flex justify-end">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleOpenFromApt(apt)}
                        leftIcon={<UserCheck className="h-3.5 w-3.5" />}
                      >
                        Tiếp nhận
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* MODAL: Reception Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tiếp nhận bệnh nhân"
        subtitle={
          receptionType === 'APPOINTMENT'
            ? 'Tiếp nhận người bệnh đã có lịch hẹn trước'
            : 'Đăng ký tiếp nhận người bệnh đến khám trực tiếp'
        }
        maxWidth="2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy bỏ
            </Button>
            <Button onClick={handleConfirmReception} variant="primary">
              Xác nhận tiếp nhận & Vào hàng chờ
            </Button>
          </>
        }
      >
        <div className="space-y-5 text-xs">
          {/* Section 1: Reception Source Mode */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="sourceMode"
                  checked={!isNewPatient}
                  onChange={() => setIsNewPatient(false)}
                />
                Chọn hồ sơ bệnh nhân có sẵn
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="sourceMode"
                  checked={isNewPatient}
                  onChange={() => setIsNewPatient(true)}
                />
                Tạo hồ sơ bệnh nhân mới
              </label>
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {RECEPTION_TYPE_MAP[receptionType].label}
            </span>
          </div>

          {/* Section 2: Patient Selector OR Creation Form */}
          {!isNewPatient ? (
            <div className="space-y-3">
              <Input
                label="Tìm kiếm bệnh nhân (Tên, SĐT, Mã BN)"
                value={patientSearchQuery}
                onChange={(e) => setPatientSearchQuery(e.target.value)}
                placeholder="Nhập tên hoặc số điện thoại..."
                leftIcon={<Search className="h-4 w-4" />}
              />

              <Select
                label="Chọn bệnh nhân trong danh sách khớp"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                options={filteredPatients.map((p) => ({
                  value: p.id,
                  label: `${p.fullName} - SĐT: ${p.phone} (${p.patientCode})`,
                }))}
              />

              {selectedPatientObj && (
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 grid grid-cols-2 gap-2 text-xs">
                  <p><strong>Ngày sinh:</strong> {selectedPatientObj.birthDate || 'Chưa cập nhật'}</p>
                  <p><strong>Giới tính:</strong> {GENDER_MAP[selectedPatientObj.gender]}</p>
                  <p className="col-span-2"><strong>Địa chỉ:</strong> {selectedPatientObj.address || 'Chưa cập nhật'}</p>
                  <p className="col-span-2 text-rose-700">
                    <strong>Tiền sử dị ứng:</strong> {selectedPatientObj.allergyNotes || 'Không ghi nhận'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs">Đăng ký thông tin hành chính người bệnh:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Họ và tên"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Ngày sinh"
                  type="date"
                  value={newBirthDate}
                  onChange={(e) => setNewBirthDate(e.target.value)}
                />
                <Select
                  label="Giới tính"
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value as Gender)}
                  options={[
                    { value: 'MALE', label: 'Nam' },
                    { value: 'FEMALE', label: 'Nữ' },
                    { value: 'OTHER', label: 'Khác' },
                    { value: 'UNSPECIFIED', label: 'Chưa xác định' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Địa chỉ thường trú"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Số nhà, đường, quận/huyện..."
                />
                <Input
                  label="Nghề nghiệp"
                  value={newOccupation}
                  onChange={(e) => setNewOccupation(e.target.value)}
                  placeholder="Ví dụ: Giáo viên, Kỹ sư..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Mã thẻ BHYT (nếu có)"
                  value={newInsuranceNumber}
                  onChange={(e) => setNewInsuranceNumber(e.target.value)}
                  placeholder="GD401..."
                />
                <Input
                  label="Tiền sử dị ứng (nếu có)"
                  value={newAllergyNotes}
                  onChange={(e) => setNewAllergyNotes(e.target.value)}
                  placeholder="Dị ứng Penicillin, tôm cua..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Người liên hệ khẩn cấp"
                  value={newEmergencyContactName}
                  onChange={(e) => setNewEmergencyContactName(e.target.value)}
                  placeholder="Họ tên người thân"
                />
                <Input
                  label="SĐT người thân"
                  value={newEmergencyContactPhone}
                  onChange={(e) => setNewEmergencyContactPhone(e.target.value)}
                  placeholder="09..."
                />
              </div>
            </div>
          )}

          {/* Section 3: Reception Notes & Initial Clinical Service */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1">
              Thông tin tiếp nhận & Dịch vụ khám ban đầu:
            </h4>

            <Input
              label="Lý do khám / Triệu chứng ban đầu"
              value={receptionNotes}
              onChange={(e) => setReceptionNotes(e.target.value)}
              placeholder="Ví dụ: Đau rát họng 3 ngày, nghẹt mũi kèm sốt nhẹ..."
            />

            <Select
              label="Chỉ định dịch vụ khám ban đầu"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              options={store.clinicalServices
                .filter((s) => s.status === 'ACTIVE')
                .map((s) => ({
                  value: s.id,
                  label: `${s.serviceName} - ${s.price.toLocaleString('vi-VN')} ₫ (${s.serviceCode})`,
                }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};