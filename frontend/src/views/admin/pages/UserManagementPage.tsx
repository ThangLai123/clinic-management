import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Lock,
  Unlock,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { Toast, type ToastType } from '../../../components/ui/Toast';
import { useAuth } from '../../../auth/AuthContext';
import { getBaseUrl } from '../../../api/client';
import type { StaffUser, StaffUserStatus, RoleCode } from '../../../types/clinic';
import { ROLE_MAP } from '../../../types/database';

export const UserManagementPage: React.FC = () => {
  const { accessToken } = useAuth();

  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Toast Notification
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  // Modal Create Staff
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'DOCTOR' | 'RECEPTIONIST'>('DOCTOR');
  const [newLicenseNumber, setNewLicenseNumber] = useState('');
  const [createErrors, setCreateErrors] = useState<{ [key: string]: string }>({});
  const [createErrorMsg, setCreateErrorMsg] = useState('');
  const [createdStaffInfo, setCreatedStaffInfo] = useState<{
    id: string;
    staffCode: string;
    fullName: string;
    username: string;
    roleCode: string;
    status: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Edit Staff
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<'DOCTOR' | 'RECEPTIONIST'>('DOCTOR');
  const [editLicenseNumber, setEditLicenseNumber] = useState('');
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});
  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // Modal Lock / Unlock Status
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [userToChangeStatus, setUserToChangeStatus] = useState<StaffUser | null>(null);
  const [statusErrorMsg, setStatusErrorMsg] = useState('');
  const [isStatusSubmitting, setIsStatusSubmitting] = useState(false);

  // API Call: GET /api/admin/staff (chỉ trả DOCTOR và RECEPTIONIST, loại bỏ ADMIN)
  const fetchStaffUsers = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${getBaseUrl()}/api/admin/staff`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        if (res.status === 403) {
          throw new Error('Bạn không có quyền truy cập trang quản lý nhân viên.');
        }
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || errorData?.title || `Lỗi máy chủ (${res.status})`);
      }

      const data = await res.json();
      const mapped: StaffUser[] = data.map((item: any) => ({
        id: String(item.id),
        staffCode: item.staffCode,
        fullName: item.fullName,
        username: item.username,
        role: item.roleCode as RoleCode,
        roleId: item.roleCode === 'ADMIN' ? '1' : item.roleCode === 'DOCTOR' ? '2' : '3',
        status: item.status as StaffUserStatus,
        email: item.email || null,
        phone: item.phone || null,
        licenseNumber: item.licenseNumber || null,
        lastLoginAt: item.lastLoginAt || null,
        createdAt: item.createdAt || '',
        updatedAt: item.updatedAt || '',
      }));
      setStaffUsers(mapped);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ.');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  // Load staff on mount
  useEffect(() => {
    fetchStaffUsers();
  }, [fetchStaffUsers]);

  const filteredUsers = staffUsers.filter((u) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.staffCode.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q));

    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  // --- Handlers for Create Staff ---
  const handleOpenCreate = () => {
    setNewFullName('');
    setNewUsername('');
    setNewPassword('');
    setNewConfirmPassword('');
    setNewEmail('');
    setNewPhone('');
    setNewRole('DOCTOR');
    setNewLicenseNumber('');
    setCreateErrors({});
    setCreateErrorMsg('');
    setCreatedStaffInfo(null);
    setIsCreateOpen(true);
  };

  const handleConfirmCreate = async () => {
    const errors: { [key: string]: string } = {};

    if (!newFullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên nhân viên.';
    }

    if (!newUsername.trim()) {
      errors.username = 'Vui lòng nhập tên đăng nhập.';
    } else if (newUsername.trim().length > 80) {
      errors.username = 'Tên đăng nhập không được vượt quá 80 ký tự.';
    }

    if (!newPassword) {
      errors.password = 'Vui lòng nhập mật khẩu.';
    } else if (newPassword.length < 12) {
      errors.password = 'Mật khẩu phải có tối thiểu 12 ký tự.';
    }

    if (!newConfirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận lại mật khẩu.';
    } else if (newConfirmPassword !== newPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    if (newEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
      errors.email = 'Định dạng email không hợp lệ.';
    }

    if (newRole !== 'DOCTOR' && newRole !== 'RECEPTIONIST') {
      errors.role = 'Chỉ được phép chọn vai trò Bác sĩ hoặc Lễ tân.';
    }

    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors);
      return;
    }

    setCreateErrors({});
    setCreateErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${getBaseUrl()}/api/admin/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: newFullName.trim(),
          username: newUsername.trim(),
          password: newPassword,
          roleCode: newRole,
          email: newEmail.trim() || undefined,
          phone: newPhone.trim() || undefined,
          licenseNumber: newRole === 'DOCTOR' ? newLicenseNumber.trim() || undefined : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const detail = errorData?.detail || errorData?.title || `Lỗi máy chủ (${res.status})`;
        setCreateErrorMsg(detail);
        setToast({ type: 'error', message: detail });
        setNewPassword('');
        setNewConfirmPassword('');
        return;
      }

      const created = await res.json();
      setCreatedStaffInfo(created);
      setToast({
        type: 'success',
        message: 'Tạo tài khoản thành công',
      });

      // Tự động tải lại danh sách trực tiếp từ SQL Server
      await fetchStaffUsers();

      setNewPassword('');
      setNewConfirmPassword('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ.';
      setCreateErrorMsg(msg);
      setToast({ type: 'error', message: msg });
      setNewPassword('');
      setNewConfirmPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Handlers for Edit Staff ---
  const handleOpenEdit = (user: StaffUser) => {
    setSelectedUser(user);
    setEditFullName(user.fullName);
    setEditEmail(user.email || '');
    setEditPhone(user.phone || '');
    setEditRole(user.role === 'DOCTOR' ? 'DOCTOR' : 'RECEPTIONIST');
    setEditLicenseNumber(user.licenseNumber || '');
    setEditErrors({});
    setEditErrorMsg('');
    setIsEditOpen(true);
  };

  const handleConfirmEdit = async () => {
    if (!selectedUser) return;

    const errors: { [key: string]: string } = {};

    if (!editFullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên nhân viên.';
    }

    if (editEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail.trim())) {
      errors.email = 'Định dạng email không hợp lệ.';
    }

    if (editRole !== 'DOCTOR' && editRole !== 'RECEPTIONIST') {
      errors.role = 'Chỉ được phép chọn vai trò Bác sĩ hoặc Lễ tân.';
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setEditErrors({});
    setEditErrorMsg('');
    setIsEditSubmitting(true);

    try {
      const res = await fetch(`${getBaseUrl()}/api/admin/staff/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: editFullName.trim(),
          email: editEmail.trim() || undefined,
          phone: editPhone.trim() || undefined,
          roleCode: editRole,
          licenseNumber: editRole === 'DOCTOR' ? editLicenseNumber.trim() || undefined : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const detail = errorData?.detail || errorData?.title || `Lỗi máy chủ (${res.status})`;
        setEditErrorMsg(detail);
        setToast({ type: 'error', message: detail });
        return;
      }

      setIsEditOpen(false);
      setToast({
        type: 'success',
        message: 'Cập nhật thông tin thành công',
      });

      // Tải lại danh sách từ SQL Server
      await fetchStaffUsers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ.';
      setEditErrorMsg(msg);
      setToast({ type: 'error', message: msg });
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // --- Handlers for Lock / Unlock Staff ---
  const handleOpenStatusModal = (user: StaffUser) => {
    setUserToChangeStatus(user);
    setStatusErrorMsg('');
    setIsStatusModalOpen(true);
  };

  const handleConfirmChangeStatus = async () => {
    if (!userToChangeStatus) return;

    const targetStatus = userToChangeStatus.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    setStatusErrorMsg('');
    setIsStatusSubmitting(true);

    try {
      const res = await fetch(`${getBaseUrl()}/api/admin/staff/${userToChangeStatus.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: targetStatus,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const detail = errorData?.detail || errorData?.title || `Lỗi máy chủ (${res.status})`;
        setStatusErrorMsg(detail);
        setToast({ type: 'error', message: detail });
        return;
      }

      setIsStatusModalOpen(false);
      const actionNotice = targetStatus === 'LOCKED' ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản';
      setToast({
        type: 'success',
        message: actionNotice,
      });

      // Tải lại danh sách từ SQL Server
      await fetchStaffUsers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ.';
      setStatusErrorMsg(msg);
      setToast({ type: 'error', message: msg });
    } finally {
      setIsStatusSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={5000}
          onClose={() => setToast(null)}
        />
      )}

      <Topbar
        title="Quản lý nhân viên"
        subtitle="Tài khoản Bác sĩ, Lễ tân và trạng thái hoạt động trong hệ thống."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchStaffUsers}
              disabled={isLoading}
              leftIcon={<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />}
              title="Tải lại danh sách từ cơ sở dữ liệu"
            >
              Làm mới
            </Button>
            <Button size="sm" onClick={handleOpenCreate} leftIcon={<Plus className="h-4 w-4" />}>
              Thêm nhân viên
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white px-4 py-3 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Vai trò:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="DOCTOR">Bác sĩ chuyên khoa</option>
              <option value="RECEPTIONIST">Lễ tân & Dược tá</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="LOCKED">Bị tạm khóa</option>
              <option value="DISABLED">Đã vô hiệu hóa</option>
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-64 lg:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm nhân viên, tài khoản..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Staff Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã NV / Username</th>
                <th className="py-3 px-4">Họ và Tên nhân viên</th>
                <th className="py-3 px-4">Thông tin liên hệ</th>
                <th className="py-3 px-4">Chứng chỉ hành nghề</th>
                <th className="py-3 px-4 text-center">Vai trò phân quyền</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                      <span className="text-xs font-medium">Đang tải danh sách nhân viên từ cơ sở dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-full border border-rose-200">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <p className="font-bold text-rose-800 text-xs">{fetchError}</p>
                      <Button size="sm" variant="outline" onClick={fetchStaffUsers} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                        Thử lại
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không tìm thấy nhân viên nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {user.staffCode}
                      <span className="block text-[11px] text-slate-500 font-mono font-normal">
                        @{user.username}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {user.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <p>{user.email || 'Chưa cập nhật email'}</p>
                      <p className="text-[11px] text-slate-400">{user.phone || 'Chưa có SĐT'}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {user.licenseNumber || '--'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          user.role === 'DOCTOR'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {ROLE_MAP[user.role]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge type="staff" status={user.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(user)}
                          leftIcon={<Edit2 className="h-3 w-3" />}
                          className="!px-2.5 !py-1 text-[11px]"
                          title="Chỉnh sửa thông tin nhân viên"
                        >
                          Sửa
                        </Button>
                        {user.status === 'ACTIVE' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenStatusModal(user)}
                            leftIcon={<Lock className="h-3 w-3 text-rose-600" />}
                            title="Khóa tài khoản nhân viên"
                            className="!px-2.5 !py-1 text-[11px] text-rose-700 hover:bg-rose-50 border border-rose-200"
                          >
                            Khóa
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenStatusModal(user)}
                            leftIcon={<Unlock className="h-3 w-3 text-emerald-600" />}
                            title="Mở khóa tài khoản nhân viên"
                            className="!px-2.5 !py-1 text-[11px] text-emerald-700 hover:bg-emerald-50 border border-emerald-200"
                          >
                            Mở khóa
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: Create Staff Account */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Thêm Mới Tài Khoản Nhân Viên"
        subtitle="Cấp tài khoản đăng nhập nội bộ cho Bác sĩ hoặc Lễ tân"
        maxWidth="2xl"
        footer={
          createdStaffInfo ? (
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Đóng
              </Button>
              <Button onClick={handleOpenCreate} variant="primary">
                Tạo thêm nhân viên khác
              </Button>
            </div>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button
                onClick={handleConfirmCreate}
                variant="primary"
                disabled={isSubmitting}
                leftIcon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
              >
                {isSubmitting ? 'Đang tạo...' : 'Tạo tài khoản'}
              </Button>
            </>
          )
        }
      >
        {createdStaffInfo ? (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900 text-sm">Tạo tài khoản thành công!</p>
                <p className="text-emerald-700 mt-0.5">
                  Tài khoản nhân viên đã được kích hoạt trong cơ sở dữ liệu SQL Server và danh sách đã được đồng bộ tự động.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Thông tin tài khoản vừa tạo:</h4>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-slate-400 block text-[11px]">Mã nhân viên:</span>
                  <span className="font-mono font-bold text-blue-700 text-sm">{createdStaffInfo.staffCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Họ và tên:</span>
                  <span className="font-bold text-slate-900">{createdStaffInfo.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tên đăng nhập:</span>
                  <span className="font-mono font-semibold text-slate-800">@{createdStaffInfo.username}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Vai trò:</span>
                  <span className="font-semibold text-slate-800">
                    {createdStaffInfo.roleCode === 'DOCTOR' ? 'Bác sĩ chuyên khoa' : 'Lễ tân & Dược tá'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Trạng thái:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    Đang hoạt động (ACTIVE)
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {createErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Không thể tạo tài khoản:</p>
                  <p className="mt-0.5">{createErrorMsg}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Họ và tên nhân viên *"
                value={newFullName}
                onChange={(e) => {
                  setNewFullName(e.target.value);
                  if (createErrors.fullName) setCreateErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                error={createErrors.fullName}
                placeholder="Ví dụ: Bác sĩ Nguyễn Văn A"
                required
              />
              <Input
                label="Tên đăng nhập *"
                value={newUsername}
                onChange={(e) => {
                  setNewUsername(e.target.value);
                  if (createErrors.username) setCreateErrors((prev) => ({ ...prev, username: '' }));
                }}
                error={createErrors.username}
                placeholder="doctor01"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Mật khẩu khởi tạo *"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (createErrors.password) setCreateErrors((prev) => ({ ...prev, password: '' }));
                }}
                error={createErrors.password}
                placeholder="Tối thiểu 12 ký tự"
                helperText="Mật khẩu bảo mật tối thiểu 12 ký tự."
                required
              />
              <Input
                label="Xác nhận mật khẩu *"
                type="password"
                value={newConfirmPassword}
                onChange={(e) => {
                  setNewConfirmPassword(e.target.value);
                  if (createErrors.confirmPassword) setCreateErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                error={createErrors.confirmPassword}
                placeholder="Nhập lại đúng mật khẩu"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Vai trò hệ thống *"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'DOCTOR' | 'RECEPTIONIST')}
                options={[
                  { value: 'DOCTOR', label: 'Bác sĩ chuyên khoa' },
                  { value: 'RECEPTIONIST', label: 'Lễ tân & Dược tá' },
                ]}
              />
              <Input
                label="Email nội bộ"
                type="email"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  if (createErrors.email) setCreateErrors((prev) => ({ ...prev, email: '' }));
                }}
                error={createErrors.email}
                placeholder="doctor01@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Số điện thoại di động"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="0912345678"
              />
              {newRole === 'DOCTOR' ? (
                <Input
                  label="Số chứng chỉ hành nghề y tế"
                  value={newLicenseNumber}
                  onChange={(e) => setNewLicenseNumber(e.target.value)}
                  placeholder="CCHN001"
                />
              ) : (
                <div />
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: Edit Staff Account */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Chỉnh Sửa Thông Tin Nhân Viên"
        subtitle={selectedUser ? `Mã NV: ${selectedUser.staffCode} • @${selectedUser.username}` : ''}
        maxWidth="2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isEditSubmitting}>
              Hủy
            </Button>
            <Button
              onClick={handleConfirmEdit}
              variant="primary"
              disabled={isEditSubmitting}
              leftIcon={isEditSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            >
              {isEditSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          {editErrorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Không thể lưu thay đổi:</p>
                <p className="mt-0.5">{editErrorMsg}</p>
              </div>
            </div>
          )}

          {selectedUser && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-[11px] text-slate-400 block">Mã nhân viên:</span>
                <span className="font-mono font-bold text-blue-700">{selectedUser.staffCode}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Tên đăng nhập:</span>
                <span className="font-mono font-semibold">@{selectedUser.username}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Họ và tên nhân viên *"
              value={editFullName}
              onChange={(e) => {
                setEditFullName(e.target.value);
                if (editErrors.fullName) setEditErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              error={editErrors.fullName}
              placeholder="Nguyễn Văn A"
              required
            />
            <Select
              label="Vai trò hệ thống *"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value as 'DOCTOR' | 'RECEPTIONIST')}
              options={[
                { value: 'DOCTOR', label: 'Bác sĩ chuyên khoa' },
                { value: 'RECEPTIONIST', label: 'Lễ tân & Dược tá' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email nội bộ"
              type="email"
              value={editEmail}
              onChange={(e) => {
                setEditEmail(e.target.value);
                if (editErrors.email) setEditErrors((prev) => ({ ...prev, email: '' }));
              }}
              error={editErrors.email}
              placeholder="doctor@example.com"
            />
            <Input
              label="Số điện thoại di động"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="0987654321"
            />
          </div>

          {editRole === 'DOCTOR' && (
            <div>
              <Input
                label="Số chứng chỉ hành nghề y tế"
                value={editLicenseNumber}
                onChange={(e) => setEditLicenseNumber(e.target.value)}
                placeholder="CCHN..."
              />
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
            Lưu ý: Nếu thay đổi vai trò của nhân viên, toàn bộ phiên đăng nhập hiện có của nhân viên sẽ bị thu hồi và nhân viên sẽ phải đăng nhập lại với vai trò mới.
          </div>
        </div>
      </Modal>

      {/* MODAL: Confirmation Lock / Unlock Account */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={
          userToChangeStatus?.status === 'ACTIVE'
            ? 'Khóa Tài Khoản Nhân Viên'
            : 'Mở Khóa Tài Khoản Nhân Viên'
        }
        subtitle={
          userToChangeStatus
            ? `Mã NV: ${userToChangeStatus.staffCode} • @${userToChangeStatus.username}`
            : ''
        }
        maxWidth="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsStatusModalOpen(false)}
              disabled={isStatusSubmitting}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmChangeStatus}
              variant={userToChangeStatus?.status === 'ACTIVE' ? 'danger' : 'primary'}
              disabled={isStatusSubmitting}
              leftIcon={isStatusSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            >
              {isStatusSubmitting
                ? 'Đang xử lý...'
                : userToChangeStatus?.status === 'ACTIVE'
                ? 'Xác nhận khóa'
                : 'Xác nhận mở khóa'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          {statusErrorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Thao tác không thành công:</p>
                <p className="mt-0.5">{statusErrorMsg}</p>
              </div>
            </div>
          )}

          {userToChangeStatus?.status === 'ACTIVE' ? (
            <div className="space-y-3">
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 leading-relaxed">
                <p className="font-bold">Cảnh báo khóa tài khoản:</p>
                <p className="mt-1">
                  Bạn có chắc chắn muốn khóa tài khoản của <strong>{userToChangeStatus.fullName}</strong> (@{userToChangeStatus.username})?
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-[11px] text-rose-800">
                  <li>Tài khoản sẽ bị chuyển sang trạng thái <strong>Tạm khóa (LOCKED)</strong>.</li>
                  <li>Mọi phiên đăng nhập hiện tại và Refresh Token sẽ bị thu hồi ngay lập tức.</li>
                  <li>Nhân viên không thể đăng nhập cho đến khi được quản trị viên mở khóa.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 leading-relaxed">
                <p className="font-bold">Xác nhận mở khóa tài khoản:</p>
                <p className="mt-1">
                  Bạn có chắc chắn muốn mở khóa tài khoản của <strong>{userToChangeStatus?.fullName}</strong> (@{userToChangeStatus?.username})?
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-[11px] text-emerald-800">
                  <li>Tài khoản sẽ được chuyển lại sang trạng thái <strong>Đang hoạt động (ACTIVE)</strong>.</li>
                  <li>Nhân viên sẽ có thể đăng nhập lại vào cổng nhân viên của phòng khám.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
