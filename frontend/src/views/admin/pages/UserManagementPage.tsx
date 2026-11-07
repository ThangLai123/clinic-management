import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Lock,
  Unlock,
  ShieldCheck,
  Filter,
  CheckCircle2,
  AlertTriangle,
  History,
  KeyRound,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { useClinicStore } from '../../../mock/clinicStore';
import type { StaffUser, UserRole } from '../../../types/clinic';

export const UserManagementPage: React.FC = () => {
  const store = useClinicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modal Create Staff
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'DOCTOR' | 'RECEPTIONIST'>('DOCTOR');
  const [newSpecialty, setNewSpecialty] = useState('');

  // Modal Edit Staff
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<'ADMIN' | 'DOCTOR' | 'RECEPTIONIST'>('DOCTOR');
  const [editSpecialty, setEditSpecialty] = useState('');

  // Dialog Toggle Lock Status
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<StaffUser | null>(null);

  const filteredUsers = store.staffUsers.filter((u) => {
    const matchSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleOpenCreate = () => {
    setNewFullName('');
    setNewUsername('');
    setNewEmail('');
    setNewPhone('');
    setNewRole('DOCTOR');
    setNewSpecialty('Tai Mũi Họng');
    setIsCreateOpen(true);
  };

  const handleConfirmCreate = () => {
    if (!newFullName.trim() || !newUsername.trim()) return;

    store.addStaffUser({
      fullName: newFullName.trim(),
      username: newUsername.trim(),
      email: newEmail.trim() || `${newUsername.trim()}@clinic.local`,
      phoneNumber: newPhone.trim() || '0901234567',
      role: newRole,
      specialty: newSpecialty.trim() || undefined,
      isActive: true,
    });

    setIsCreateOpen(false);
  };

  const handleOpenEdit = (user: StaffUser) => {
    setSelectedUser(user);
    setEditFullName(user.fullName);
    setEditEmail(user.email);
    setEditPhone(user.phoneNumber);
    setEditRole(user.role);
    setEditSpecialty(user.specialty || '');
    setIsEditOpen(true);
  };

  const handleConfirmEdit = () => {
    if (!selectedUser || !editFullName.trim()) return;

    store.updateStaffUser(selectedUser.id, {
      fullName: editFullName.trim(),
      email: editEmail.trim(),
      phoneNumber: editPhone.trim(),
      role: editRole,
      specialty: editSpecialty.trim() || undefined,
    });

    setIsEditOpen(false);
  };

  const handleOpenToggleLock = (user: StaffUser) => {
    // Safety check: Prevent locking the last active ADMIN
    if (user.role === 'ADMIN' && user.isActive) {
      const activeAdmins = store.staffUsers.filter((u) => u.role === 'ADMIN' && u.isActive);
      if (activeAdmins.length <= 1) {
        alert('CẢNH BÁO BẢO MẬT: Không thể khóa tài khoản Quản trị viên (ADMIN) cuối cùng của hệ thống!');
        return;
      }
    }

    setUserToToggle(user);
    setIsLockModalOpen(true);
  };

  const handleConfirmToggleLock = () => {
    if (!userToToggle) return;
    store.toggleStaffStatus(userToToggle.id);
    setIsLockModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Quản Lý Tài Khoản & Phân Quyền Nhân Sự"
        subtitle="Use Case 13: Cấp phát tài khoản nhân viên y tế, phân quyền vai trò (Admin, Doctor, Receptionist) và quản lý trạng thái khóa."
        actions={
          <Button onClick={handleOpenCreate} leftIcon={<Plus className="h-4 w-4" />}>
            Thêm tài khoản nhân viên
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Lọc vai trò:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
            <option value="DOCTOR">Bác sĩ (DOCTOR)</option>
            <option value="RECEPTIONIST">Lễ tân (RECEPTIONIST)</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo Mã NV, họ tên, username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Staff Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã NV / Username</th>
                <th className="py-3 px-4">Họ và Tên nhân viên</th>
                <th className="py-3 px-4">Thông tin liên hệ</th>
                <th className="py-3 px-4">Chuyên môn / Vị trí</th>
                <th className="py-3 px-4 text-center">Vai trò phân quyền</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không tìm thấy nhân viên nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-700 block">{user.id}</span>
                      <span className="text-[11px] text-slate-500 font-mono">@{user.username}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {user.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <p>{user.email}</p>
                      <p className="text-[11px] text-slate-400">{user.phoneNumber}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs">
                      {user.specialty || '--'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : user.role === 'DOCTOR'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          user.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {user.isActive ? '● Đang hoạt động' : '○ Bị tạm khóa'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(user)}
                          leftIcon={<Edit2 className="h-3 w-3" />}
                        >
                          Sửa quyền
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenToggleLock(user)}
                          className={user.isActive ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-700 hover:bg-emerald-50'}
                        >
                          {user.isActive ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Permission Matrix Info Card */}
      <Card title="Quy định phân quyền ma trận 3 vai trò (Role-Based Access Control)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1 text-purple-950">
            <h4 className="font-bold text-sm text-purple-900">ADMIN (Quản trị viên)</h4>
            <p>• Quản lý tài khoản nhân viên & phân quyền vai trò.</p>
            <p>• Giám sát trạng thái hoạt động toàn phòng khám.</p>
            <p>• Xem lịch sử thay đổi quyền và nhật ký bảo mật.</p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-emerald-950">
            <h4 className="font-bold text-sm text-emerald-900">DOCTOR (Bác sĩ chuyên khoa)</h4>
            <p>• Nhận danh sách bệnh nhân buồng khám Tai Mũi Họng.</p>
            <p>• Thăm khám lâm sàng, chỉ định nội soi NBI (UC-10).</p>
            <p>• Lập hồ sơ bệnh án điện tử (UC-11) & Kê đơn thuốc (UC-12).</p>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-amber-950">
            <h4 className="font-bold text-sm text-amber-900">RECEPTIONIST (Lễ tân & Dược)</h4>
            <p>• Quản lý lịch hẹn & Đón tiếp bệnh nhân (UC-04, 05).</p>
            <p>• Phân bệnh nhân vào buồng khám (UC-06).</p>
            <p>• Quản lý kho thuốc, phát thuốc (UC-03, 08) & Thu viện phí (UC-09).</p>
          </div>
        </div>
      </Card>

      {/* MODAL: Create Staff User */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Thêm Mới Tài Khoản Nhân Viên Y Tế"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmCreate} variant="primary">
              Tạo tài khoản
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Họ và tên nhân viên"
              placeholder="Ví dụ: BS. Nguyễn Văn C"
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              required
            />
            <Input
              label="Tên đăng nhập (Username)"
              placeholder="nguyenvanc"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email"
              type="email"
              placeholder="c.nv@clinic.local"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <Input
              label="Số điện thoại"
              placeholder="0912345678"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Vai trò hệ thống"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as any)}
              options={[
                { value: 'DOCTOR', label: 'Bác sĩ (DOCTOR)' },
                { value: 'RECEPTIONIST', label: 'Lễ tân / Dược tá (RECEPTIONIST)' },
                { value: 'ADMIN', label: 'Quản trị viên (ADMIN)' },
              ]}
            />
            <Input
              label="Chuyên môn / Vị trí phân công"
              placeholder="Khám Tai Mũi Họng, Đo thính lực..."
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-[11px]">
            * Mật khẩu khởi tạo ngẫu nhiên mặc định sẽ được gửi an toàn cho nhân viên khi tích hợp Backend.
          </div>
        </div>
      </Modal>

      {/* MODAL: Edit Staff User & Role */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Chỉnh Sửa Thông Tin & Phân Quyền Vai Trò"
        subtitle={selectedUser ? `Tài khoản: ${selectedUser.username} (${selectedUser.id})` : ''}
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmEdit} variant="primary">
              Lưu thay đổi
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Họ và tên"
            value={editFullName}
            onChange={(e) => setEditFullName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <Input
              label="Số điện thoại"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Vai trò phân quyền"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value as any)}
              options={[
                { value: 'DOCTOR', label: 'Bác sĩ (DOCTOR)' },
                { value: 'RECEPTIONIST', label: 'Lễ tân / Dược tá (RECEPTIONIST)' },
                { value: 'ADMIN', label: 'Quản trị viên (ADMIN)' },
              ]}
            />
            <Input
              label="Chuyên môn / Nhiệm vụ"
              value={editSpecialty}
              onChange={(e) => setEditSpecialty(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* DIALOG: Toggle Lock/Unlock User */}
      <Modal
        isOpen={isLockModalOpen}
        onClose={() => setIsLockModalOpen(false)}
        title={userToToggle?.isActive ? 'Xác Nhận Tạm Khóa Tài Khoản' : 'Mở Khóa Tài Khoản'}
        subtitle={userToToggle ? `${userToToggle.fullName} (@${userToToggle.username})` : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsLockModalOpen(false)}>
              Đóng
            </Button>
            <Button
              onClick={handleConfirmToggleLock}
              variant={userToToggle?.isActive ? 'danger' : 'success'}
            >
              {userToToggle?.isActive ? 'Khóa tài khoản này' : 'Kích hoạt lại'}
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-slate-600">
          {userToToggle?.isActive ? (
            <p>
              Khi bị khóa, nhân viên <strong>{userToToggle.fullName}</strong> sẽ không thể truy cập vào hệ thống phòng khám cho đến khi được Admin mở khóa lại.
            </p>
          ) : (
            <p>
              Xác nhận kích hoạt lại tài khoản cho nhân viên <strong>{userToToggle?.fullName}</strong>.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

