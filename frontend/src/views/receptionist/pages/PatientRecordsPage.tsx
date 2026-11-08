import React, { useState } from 'react';
import {
  Users,
  Search,
  Edit2,
  Calendar,
  Phone,
  MapPin,
  ShieldCheck,
  AlertCircle,
  FileText,
  UserPlus,
  Plus,
  Link as LinkIcon,
  CheckCircle,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { useClinicStore } from '../../../mock/clinicStore';
import type { Patient, Gender, PhoneLinkRelationship } from '../../../types/clinic';
import {
  GENDER_MAP,
  PHONE_LINK_RELATIONSHIP_MAP,
} from '../../../types/database';

export const PatientRecordsPage: React.FC = () => {
  const store = useClinicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  // Edit / Create Form fields (Bảng patients)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [gender, setGender] = useState<Gender>('MALE');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [allergyNotes, setAllergyNotes] = useState('');
  const [medicalHistoryNotes, setMedicalHistoryNotes] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  // Phone Link Form fields (Bảng patient_phone_links)
  const [newLinkedPhone, setNewLinkedPhone] = useState('');
  const [newLinkedRelation, setNewLinkedRelation] = useState<PhoneLinkRelationship>('PARENT_GUARDIAN');
  const [newLinkedIsPrimary, setNewLinkedIsPrimary] = useState(false);

  const filteredPatients = store.patients.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      (p.fullName || '').toLowerCase().includes(q) ||
      (p.phone || '').includes(q) ||
      p.patientCode.toLowerCase().includes(q) ||
      (p.insuranceNumber && p.insuranceNumber.toLowerCase().includes(q))
    );
  });

  const handleOpenCreate = () => {
    setFullName('');
    setPhone('');
    setBirthDate('1990-01-01');
    setGender('MALE');
    setAddress('');
    setOccupation('');
    setInsuranceNumber('');
    setAllergyNotes('');
    setMedicalHistoryNotes('');
    setEmergencyContactName('');
    setEmergencyContactPhone('');
    setIsCreateModalOpen(true);
  };

  const handleSaveCreate = () => {
    if (!fullName.trim() || !phone.trim()) {
      alert('Họ tên và Số điện thoại là bắt buộc.');
      return;
    }

    store.addPatient({
      fullName: fullName.trim(),
      phone: phone.trim(),
      birthDate: birthDate || undefined,
      gender,
      address: address.trim() || undefined,
      occupation: occupation.trim() || undefined,
      insuranceNumber: insuranceNumber.trim() || undefined,
      allergyNotes: allergyNotes.trim() || undefined,
      medicalHistoryNotes: medicalHistoryNotes.trim() || undefined,
      emergencyContactName: emergencyContactName.trim() || undefined,
      emergencyContactPhone: emergencyContactPhone.trim() || undefined,
    });

    setIsCreateModalOpen(false);
  };

  const handleOpenEdit = (p: Patient) => {
    setSelectedPatient(p);
    setFullName(p.fullName);
    setPhone(p.phone || '');
    setBirthDate(p.birthDate || '');
    setGender(p.gender);
    setAddress(p.address || '');
    setOccupation(p.occupation || '');
    setInsuranceNumber(p.insuranceNumber || '');
    setAllergyNotes(p.allergyNotes || '');
    setMedicalHistoryNotes(p.medicalHistoryNotes || '');
    setEmergencyContactName(p.emergencyContactName || '');
    setEmergencyContactPhone(p.emergencyContactPhone || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedPatient || !fullName.trim() || !phone.trim()) return;

    store.updatePatient(selectedPatient.id, {
      fullName: fullName.trim(),
      phone: phone.trim(),
      birthDate: birthDate || undefined,
      gender,
      address: address.trim() || undefined,
      occupation: occupation.trim() || undefined,
      insuranceNumber: insuranceNumber.trim() || undefined,
      allergyNotes: allergyNotes.trim() || undefined,
      medicalHistoryNotes: medicalHistoryNotes.trim() || undefined,
      emergencyContactName: emergencyContactName.trim() || undefined,
      emergencyContactPhone: emergencyContactPhone.trim() || undefined,
    });

    setIsEditModalOpen(false);
  };

  const handleOpenPhoneLinks = (p: Patient) => {
    setSelectedPatient(p);
    setNewLinkedPhone('');
    setNewLinkedRelation('PARENT_GUARDIAN');
    setNewLinkedIsPrimary(false);
    setIsPhoneModalOpen(true);
  };

  const handleAddPhoneLink = () => {
    if (!selectedPatient || !newLinkedPhone.trim()) return;
    store.addPatientPhoneLink({
      patientId: selectedPatient.id,
      phone: newLinkedPhone.trim(),
      relationship: newLinkedRelation,
      isPrimary: newLinkedIsPrimary,
    });
    setNewLinkedPhone('');
  };

  // Get linked phone list for selected patient
  const currentPhoneLinks = selectedPatient
    ? store.phoneLinks.filter((l) => l.patientId === selectedPatient.id)
    : [];

  return (
    <div className="space-y-6">
      <Topbar
        title="Hồ sơ bệnh nhân"
        subtitle="Thông tin hành chính, liên hệ và ghi chú y tế."
        actions={
          <Button size="sm" onClick={handleOpenCreate} leftIcon={<UserPlus className="h-4 w-4" />}>
            Thêm bệnh nhân
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white px-4 py-3 rounded-xl border border-slate-200">
        <div className="text-xs text-slate-500">
          Tổng số hồ sơ trong hệ thống: <strong className="text-slate-800">{store.patients.length} bệnh nhân</strong>
        </div>

        <div className="relative w-full sm:w-64 lg:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo Mã BN, Họ tên, SĐT, BHYT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Patients Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã BN</th>
                <th className="py-3 px-4">Họ và Tên</th>
                <th className="py-3 px-4">Ngày sinh / Giới tính</th>
                <th className="py-3 px-4">Số điện thoại chính</th>
                <th className="py-3 px-4">Địa chỉ & BHYT</th>
                <th className="py-3 px-4">Ghi chú dị ứng</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không tìm thấy bệnh nhân nào theo điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => {
                  const linkedCount = store.phoneLinks.filter((l) => l.patientId === p.id).length;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {p.patientCode || p.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {p.fullName || 'Chưa có thông tin'}
                        {p.occupation && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Nghề: {p.occupation}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span>{p.birthDate || 'Chưa cập nhật'}</span>
                        <span className="block text-[11px] text-slate-400">
                          {GENDER_MAP[p.gender]}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">{p.phone || 'Chưa cập nhật'}</span>
                        <button
                          onClick={() => handleOpenPhoneLinks(p)}
                          className="text-[10px] text-blue-700 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <LinkIcon className="h-2.5 w-2.5" />
                          <span>{linkedCount} liên kết SĐT</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-slate-600">
                        <p className="line-clamp-1">{p.address || 'Chưa cập nhật'}</p>
                        {p.insuranceNumber && (
                          <p className="text-[10px] text-emerald-700 font-mono mt-0.5">
                            BHYT: {p.insuranceNumber}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {p.allergyNotes ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            {p.allergyNotes}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Không ghi nhận</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEdit(p)}
                            leftIcon={<Edit2 className="h-3 w-3" />}
                            className="text-[11px]"
                          >
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenPhoneLinks(p)}
                            className="text-[11px] text-blue-700 hover:bg-blue-50"
                          >
                            SĐT OTP
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: Create New Patient */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm Hồ Sơ Bệnh Nhân Mới"
        subtitle="Tạo mới hồ sơ hành chính phục vụ đón tiếp và khám chữa bệnh"
        maxWidth="2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveCreate} variant="primary">
              Tạo hồ sơ bệnh nhân
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn An"
              required
            />
            <Input
              label="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912345678"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Ngày sinh"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Địa chỉ thường trú"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, đường, quận/huyện..."
            />
            <Input
              label="Nghề nghiệp"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="Ví dụ: Giáo viên, Kỹ sư..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Số thẻ BHYT"
              value={insuranceNumber}
              onChange={(e) => setInsuranceNumber(e.target.value)}
              placeholder="GD401..."
            />
            <Input
              label="Tiền sử dị ứng"
              value={allergyNotes}
              onChange={(e) => setAllergyNotes(e.target.value)}
              placeholder="Dị ứng Penicillin, Aspirin..."
            />
          </div>

          <Input
            label="Tiền sử bệnh lý bản thân"
            value={medicalHistoryNotes}
            onChange={(e) => setMedicalHistoryNotes(e.target.value)}
            placeholder="Từng phẫu thuật xoang, hen suyễn..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Người liên hệ khẩn cấp"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
              placeholder="Họ tên người thân"
            />
            <Input
              label="SĐT khẩn cấp"
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
              placeholder="09..."
            />
          </div>
        </div>
      </Modal>

      {/* MODAL: Edit Existing Patient */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh Sửa Hồ Sơ Bệnh Nhân"
        subtitle={selectedPatient ? `Mã BN: ${selectedPatient.patientCode || selectedPatient.id}` : ''}
        maxWidth="2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveEdit} variant="primary">
              Lưu thay đổi
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Ngày sinh"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Địa chỉ thường trú"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              label="Nghề nghiệp"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Mã thẻ BHYT"
              value={insuranceNumber}
              onChange={(e) => setInsuranceNumber(e.target.value)}
            />
            <Input
              label="Tiền sử dị ứng"
              value={allergyNotes}
              onChange={(e) => setAllergyNotes(e.target.value)}
            />
          </div>

          <Input
            label="Tiền sử bệnh lý bản thân"
            value={medicalHistoryNotes}
            onChange={(e) => setMedicalHistoryNotes(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Người liên hệ khẩn cấp"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
            />
            <Input
              label="SĐT khẩn cấp"
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* MODAL: Manage Phone Links */}
      <Modal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        title="Quản Lý Số Điện Thoại Liên Kết"
        subtitle={selectedPatient ? `Bệnh nhân: ${selectedPatient.fullName} (${selectedPatient.patientCode || selectedPatient.id})` : ''}
        footer={
          <Button variant="outline" onClick={() => setIsPhoneModalOpen(false)}>
            Đóng
          </Button>
        }
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Hỗ trợ cơ chế 1 số điện thoại liên kết nhiều người bệnh (ví dụ: cha mẹ dùng 1 SĐT đặt lịch và tra cứu OTP cho các con):
          </p>

          {/* Current Links Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="py-2 px-3">Số điện thoại</th>
                  <th className="py-2 px-3">Mối quan hệ</th>
                  <th className="py-2 px-3 text-center">SĐT Chính</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentPhoneLinks.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-slate-400">
                      Chưa có số điện thoại liên kết nào.
                    </td>
                  </tr>
                ) : (
                  currentPhoneLinks.map((link) => (
                    <tr key={link.id}>
                      <td className="py-2 px-3 font-mono font-bold text-blue-700">
                        {link.phoneE164}
                      </td>
                      <td className="py-2 px-3">
                        {PHONE_LINK_RELATIONSHIP_MAP[link.relationshipToPatient]}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {link.isPrimary ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Chính
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Phụ</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Add New Phone Link */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 block text-xs">
              Thêm số điện thoại liên kết mới:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Số điện thoại mới"
                placeholder="09..."
                value={newLinkedPhone}
                onChange={(e) => setNewLinkedPhone(e.target.value)}
              />
              <Select
                label="Quan hệ với người bệnh"
                value={newLinkedRelation}
                onChange={(e) => setNewLinkedRelation(e.target.value as PhoneLinkRelationship)}
                options={[
                  { value: 'SELF', label: 'Bản thân (SELF)' },
                  { value: 'PARENT_GUARDIAN', label: 'Cha/Mẹ/Giám hộ (PARENT_GUARDIAN)' },
                  { value: 'CAREGIVER', label: 'Người chăm sóc (CAREGIVER)' },
                  { value: 'OTHER', label: 'Khác (OTHER)' },
                ]}
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={newLinkedIsPrimary}
                  onChange={(e) => setNewLinkedIsPrimary(e.target.checked)}
                />
                Đặt làm số điện thoại chính
              </label>
              <Button size="sm" onClick={handleAddPhoneLink} leftIcon={<Plus className="h-3.5 w-3.5" />}>
                Thêm liên kết
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};