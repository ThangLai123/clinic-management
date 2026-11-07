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
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { useClinicStore } from '../../../mock/clinicStore';
import type { Patient } from '../../../types/clinic';

export const PatientRecordsPage: React.FC = () => {
  const store = useClinicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit fields
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editGender, setEditGender] = useState<'Nam' | 'Nữ' | 'Khác'>('Nam');
  const [editAddress, setEditAddress] = useState('');
  const [editEmergency, setEditEmergency] = useState('');
  const [editAllergies, setEditAllergies] = useState('');

  const filteredPatients = store.patients.filter((p) => {
    return (
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phoneNumber.includes(searchTerm) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenEdit = (p: Patient) => {
    setSelectedPatient(p);
    setEditFullName(p.fullName);
    setEditPhone(p.phoneNumber);
    setEditBirthDate(p.birthDate);
    setEditGender(p.gender);
    setEditAddress(p.address || '');
    setEditEmergency(p.emergencyContact || '');
    setEditAllergies(p.allergies?.join(', ') || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedPatient || !editFullName.trim() || !editPhone.trim()) return;

    store.updatePatient(selectedPatient.id, {
      fullName: editFullName.trim(),
      phoneNumber: editPhone.trim(),
      birthDate: editBirthDate,
      gender: editGender,
      address: editAddress.trim() || undefined,
      emergencyContact: editEmergency.trim() || undefined,
      allergies: editAllergies ? editAllergies.split(',').map((s) => s.trim()) : undefined,
    });

    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Tra Cứu & Quản Lý Hồ Sơ Hành Chính Bệnh Nhân"
        subtitle="Use Case 07: Quản lý thông tin định danh, địa chỉ liên hệ, thông tin BHYT và tiền sử dị ứng do bệnh nhân khai báo."
      />

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <div className="text-xs text-slate-500">
          Tổng số hồ sơ quản lý: <strong className="text-slate-800">{store.patients.length} bệnh nhân</strong>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo Mã BN, Họ tên, SĐT, CCCD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Patients Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã BN</th>
                <th className="py-3 px-4">Họ và Tên</th>
                <th className="py-3 px-4">Ngày sinh / Giới tính</th>
                <th className="py-3 px-4">Số điện thoại</th>
                <th className="py-3 px-4">Địa chỉ & Liên hệ khẩn cấp</th>
                <th className="py-3 px-4">Dị ứng ghi nhận</th>
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
                filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {p.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {p.fullName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span>{p.birthDate}</span>
                      <span className="block text-[11px] text-slate-400">Giới tính: {p.gender}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {p.phoneNumber}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-600">
                      <p className="line-clamp-1">{p.address || 'Chưa cập nhật'}</p>
                      {p.emergencyContact && (
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          Khẩn cấp: {p.emergencyContact}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.allergies && p.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {p.allergies.map((a, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Không ghi nhận</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(p)}
                        leftIcon={<Edit2 className="h-3 w-3" />}
                        className="text-[11px]"
                      >
                        Sửa hành chính
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Notice about Clinical Scope */}
      <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-800">Quy định phân quyền hồ sơ y tế:</p>
        <p>
          Lễ tân chỉ có quyền cập nhật thông tin hành chính, địa chỉ và thông tin liên hệ. Toàn bộ chẩn đoán lâm sàng, kết quả nội soi và phác đồ điều trị thuộc quyền bảo lưu chuyên môn của Bác sĩ (UC-10, UC-11).
        </p>
      </div>

      {/* MODAL: Edit Patient Admin Info */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh Sửa Hồ Sơ Hành Chính Bệnh Nhân"
        subtitle={selectedPatient ? `Mã BN: ${selectedPatient.id}` : ''}
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
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Họ và tên"
              value={editFullName}
              onChange={(e) => setEditFullName(e.target.value)}
              required
            />
            <Input
              label="Số điện thoại"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Ngày sinh"
              type="date"
              value={editBirthDate}
              onChange={(e) => setEditBirthDate(e.target.value)}
            />
            <Select
              label="Giới tính"
              value={editGender}
              onChange={(e) => setEditGender(e.target.value as any)}
              options={[
                { value: 'Nam', label: 'Nam' },
                { value: 'Nữ', label: 'Nữ' },
                { value: 'Khác', label: 'Khác' },
              ]}
            />
          </div>

          <Input
            label="Địa chỉ cư trú"
            value={editAddress}
            onChange={(e) => setEditAddress(e.target.value)}
          />

          <Input
            label="Người liên hệ khẩn cấp"
            value={editEmergency}
            onChange={(e) => setEditEmergency(e.target.value)}
            placeholder="Ví dụ: Vợ: Nguyễn Thị Mai - 0987654321"
          />

          <Input
            label="Tiền sử dị ứng thuốc do bệnh nhân khai báo"
            value={editAllergies}
            onChange={(e) => setEditAllergies(e.target.value)}
            placeholder="Cách nhau bởi dấu phẩy"
          />
        </div>
      </Modal>
    </div>
  );
};

