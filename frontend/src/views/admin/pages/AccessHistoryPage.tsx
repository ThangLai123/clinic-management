import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  Activity,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useAuth } from '../../../auth/AuthContext';
import { getBaseUrl } from '../../../api/client';
import type { StaffUser, RoleCode } from '../../../types/clinic';
import { ROLE_MAP } from '../../../types/database';
import {
  MOCK_ACCESS_HISTORY,
  getAccessLogsByStaff,
  ACTIVITY_MAP,
  STATUS_MAP,
  type StaffAccessRecord,
  type AccessActivityType,
} from '../../../mock/accessHistoryMock';

export const AccessHistoryPage: React.FC = () => {
  const { accessToken } = useAuth();

  // State danh sách nhân viên
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Bộ lọc danh sách nhân viên
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Nhân viên đang được chọn xem chi tiết lịch sử (null = hiển thị danh sách)
  const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);

  // Bộ lọc lịch sử chi tiết
  const [activityFilter, setActivityFilter] = useState<string>('ALL');
  const [periodFilter, setPeriodFilter] = useState<'ALL' | 'TODAY' | '7DAYS' | '30DAYS'>('ALL');
  const [detailSearch, setDetailSearch] = useState('');

  // Tải danh sách nhân viên từ Backend API (DOCTOR & RECEPTIONIST)
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
          throw new Error('Bạn không có quyền truy cập trang lịch sử nhân viên.');
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
        status: item.status,
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

  useEffect(() => {
    fetchStaffUsers();
  }, [fetchStaffUsers]);

  // Format ngày giờ hiển thị
  const formatDateTime = (isoString?: string | null) => {
    if (!isoString) return '--';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '--';
    const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${timeStr} • ${dateStr}`;
  };

  // Tính toán 3 chỉ số thống kê tổng quan từ dữ liệu minh họa
  const kpiStats = useMemo(() => {
    const totalAccess = MOCK_ACCESS_HISTORY.length;

    // Lượt truy cập hôm nay (so sánh theo ngày)
    const todayStr = new Date().toDateString();
    const todayAccess = MOCK_ACCESS_HISTORY.filter(
      (log) => new Date(log.timestamp).toDateString() === todayStr
    ).length;

    // Lần truy cập gần nhất
    const sortedLogs = [...MOCK_ACCESS_HISTORY].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const mostRecentLog = sortedLogs[0];
    const mostRecentTime = mostRecentLog ? formatDateTime(mostRecentLog.timestamp) : '--';

    return {
      totalAccess,
      todayAccess,
      mostRecentTime,
      recentUser: mostRecentLog ? `${mostRecentLog.fullName} (@${mostRecentLog.username})` : '',
    };
  }, []);

  // Lọc danh sách nhân viên
  const filteredStaffList = useMemo(() => {
    return staffUsers.filter((u) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.staffCode.toLowerCase().includes(q);

      const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [staffUsers, searchTerm, roleFilter]);

  // Lấy lịch sử truy cập của nhân viên đang chọn
  const selectedStaffLogs = useMemo(() => {
    if (!selectedStaff) return [];
    return getAccessLogsByStaff({ id: selectedStaff.id, username: selectedStaff.username });
  }, [selectedStaff]);

  // Lọc lịch sử chi tiết theo loại hoạt động, khoảng ngày và từ khóa
  const filteredDetailLogs = useMemo(() => {
    if (!selectedStaffLogs.length) return [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

    return selectedStaffLogs.filter((log) => {
      const matchActivity = activityFilter === 'ALL' || log.activity === activityFilter;

      const logTime = new Date(log.timestamp).getTime();
      let matchPeriod = true;
      if (periodFilter === 'TODAY') {
        matchPeriod = logTime >= startOfToday;
      } else if (periodFilter === '7DAYS') {
        matchPeriod = logTime >= sevenDaysAgo;
      } else if (periodFilter === '30DAYS') {
        matchPeriod = logTime >= thirtyDaysAgo;
      }

      const q = detailSearch.toLowerCase();
      const matchSearch =
        !q ||
        log.ipAddress.toLowerCase().includes(q) ||
        log.device.toLowerCase().includes(q) ||
        log.browser.toLowerCase().includes(q) ||
        (log.notes && log.notes.toLowerCase().includes(q)) ||
        (log.failureReason && log.failureReason.toLowerCase().includes(q));

      return matchActivity && matchPeriod && matchSearch;
    });
  }, [selectedStaffLogs, activityFilter, periodFilter, detailSearch]);

  // Render Icon thiết bị
  const renderDeviceIcon = (device: StaffAccessRecord['device']) => {
    switch (device) {
      case 'Mobile':
        return <Smartphone className="h-3.5 w-3.5 text-slate-500" />;
      case 'Tablet':
        return <Tablet className="h-3.5 w-3.5 text-slate-500" />;
      default:
        return <Laptop className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Topbar */}
      <Topbar
        title="Lịch sử truy cập"
        subtitle="Theo dõi nhật ký đăng nhập, đăng xuất và hoạt động của nhân viên phòng khám."
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
          </div>
        }
      />

      {/* Banner ghi chú dữ liệu minh họa */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold text-[11px] bg-amber-200/70 text-amber-900 px-2.5 py-1 rounded-md mr-2">
              Dữ liệu minh họa – Chưa kết nối lịch sử truy cập
            </span>
            <span className="hidden sm:inline">Chức năng giao diện mẫu, chưa kết nối lịch sử truy cập thực tế từ cơ sở dữ liệu.</span>
          </div>
        </div>
        <span className="text-[11px] text-amber-700/80 font-medium hidden lg:inline">
          Backend API chưa triển khai bảng Audit Log
        </span>
      </div>

      {/* 3 Chỉ số thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chỉ số 1: Tổng lượt truy cập */}
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Tổng lượt truy cập
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
                {kpiStats.totalAccess}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ghi nhận qua hệ thống minh họa
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Chỉ số 2: Lượt truy cập hôm nay */}
        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Lượt truy cập hôm nay
              </p>
              <p className="text-2xl font-black text-emerald-700 mt-1 tabular-nums">
                {kpiStats.todayAccess}
              </p>
              <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                Trong 24 giờ qua
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Chỉ số 3: Lần truy cập gần nhất */}
        <Card className="border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Lần truy cập gần nhất
              </p>
              <p className="text-sm font-bold text-slate-900 mt-1 truncate">
                {kpiStats.mostRecentTime}
              </p>
              <p className="text-[11px] text-indigo-700 font-medium truncate mt-0.5">
                {kpiStats.recentUser || 'Chưa ghi nhận'}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Nội dung chính: Danh sách nhân viên HOẶC Xem lịch sử chi tiết */}
      {selectedStaff ? (
        /* ================= VIEW 2: CHI TIẾT LỊCH SỬ TỪNG NHÂN VIÊN ================= */
        <div className="space-y-4">
          {/* Header Thông tin nhân viên được chọn */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStaff(null)}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                className="text-xs font-semibold"
              >
                Quay lại danh sách
              </Button>
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{selectedStaff.fullName}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedStaff.role === 'DOCTOR'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {ROLE_MAP[selectedStaff.role]}
                  </span>
                  <StatusBadge type="staff" status={selectedStaff.status} />
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Mã NV: <strong className="text-blue-700">{selectedStaff.staffCode}</strong> • Tên đăng nhập: @{selectedStaff.username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-semibold border border-slate-200">
                Tổng lượt minh họa: <strong className="text-blue-700">{selectedStaffLogs.length}</strong>
              </span>
            </div>
          </div>

          {/* Bộ lọc chi tiết cho bảng lịch sử */}
          <div className="flex flex-wrap gap-3 justify-between items-center bg-white px-4 py-3 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              {/* Hoạt động */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-700">Hoạt động:</span>
                <select
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">Tất cả hoạt động</option>
                  <option value="LOGIN">Đăng nhập</option>
                  <option value="LOGOUT">Đăng xuất</option>
                  <option value="PAGE_ACCESS">Truy cập hệ thống</option>
                </select>
              </div>

              {/* Khoảng ngày */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Thời gian:</span>
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value as any)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">Toàn bộ thời gian</option>
                  <option value="TODAY">Hôm nay</option>
                  <option value="7DAYS">7 ngày gần đây</option>
                  <option value="30DAYS">30 ngày gần đây</option>
                </select>
              </div>
            </div>

            {/* Tìm kiếm IP/thiết bị */}
            <div className="relative w-full sm:w-64">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm IP, thiết bị, ghi chú..."
                value={detailSearch}
                onChange={(e) => setDetailSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Bảng chi tiết lượt truy cập */}
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Loại hoạt động</th>
                    <th className="py-3 px-4 font-mono">Địa chỉ IP</th>
                    <th className="py-3 px-4">Thiết bị</th>
                    <th className="py-3 px-4">Trình duyệt</th>
                    <th className="py-3 px-4 text-center">Kết quả</th>
                    <th className="py-3 px-4">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedStaffLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <History className="h-8 w-8 text-slate-300" />
                          <p className="font-bold text-slate-700 text-sm">Chưa có dữ liệu lịch sử minh họa</p>
                          <p className="text-xs text-slate-400">
                            Tài khoản @{selectedStaff.username} chưa có bản ghi minh họa trong hệ thống mô phỏng.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredDetailLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Không tìm thấy lượt truy cập nào phù hợp với bộ lọc đã chọn.
                      </td>
                    </tr>
                  ) : (
                    filteredDetailLogs.map((log) => {
                      const actMeta = ACTIVITY_MAP[log.activity] || { label: log.activity, color: 'bg-slate-100 text-slate-700' };
                      const isSuccess = log.status === 'SUCCESS';

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-800 whitespace-nowrap">
                            {formatDateTime(log.timestamp)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border ${actMeta.color}`}>
                              {actMeta.label}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">
                            {log.ipAddress}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                              {renderDeviceIcon(log.device)}
                              <span>{log.device}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium">
                            {log.browser}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {isSuccess ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                                Thành công
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full"
                                title={log.failureReason || 'Lỗi xác thực'}
                              >
                                <XCircle className="h-3 w-3 text-rose-600 shrink-0" />
                                Thất bại
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {log.failureReason ? (
                              <span className="text-rose-600 font-medium">{log.failureReason}</span>
                            ) : (
                              log.notes || '--'
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        /* ================= VIEW 1: DANH SÁCH NHÂN VIÊN ================= */
        <div className="space-y-4">
          {/* Bộ lọc và Tìm kiếm nhân viên */}
          <div className="flex flex-wrap gap-3 justify-between items-center bg-white px-4 py-3 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-700">Vai trò:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">Tất cả vai trò</option>
                  <option value="DOCTOR">Bác sĩ chuyên khoa</option>
                  <option value="RECEPTIONIST">Lễ tân & Dược tá</option>
                </select>
              </div>
            </div>

            <div className="relative w-full sm:w-64 lg:w-72">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm nhân viên, username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Bảng danh sách nhân viên */}
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Mã NV / Username</th>
                    <th className="py-3 px-4">Họ và Tên nhân viên</th>
                    <th className="py-3 px-4 text-center">Vai trò</th>
                    <th className="py-3 px-4">Lần truy cập gần nhất</th>
                    <th className="py-3 px-4 text-center">Số lượt truy cập</th>
                    <th className="py-3 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                          <span className="text-xs font-medium">Đang tải danh sách nhân viên từ cơ sở dữ liệu...</span>
                        </div>
                      </td>
                    </tr>
                  ) : fetchError ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="p-2 bg-rose-50 text-rose-600 rounded-full border border-rose-200">
                            <ShieldAlert className="h-5 w-5" />
                          </div>
                          <p className="font-bold text-rose-800 text-xs">{fetchError}</p>
                          <Button size="sm" variant="outline" onClick={fetchStaffUsers} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                            Thử lại
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredStaffList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Không tìm thấy tài khoản nhân viên nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredStaffList.map((user) => {
                      const userLogs = getAccessLogsByStaff({ id: user.id, username: user.username });
                      const recentLog = userLogs[0];
                      const recentAccessText = recentLog ? formatDateTime(recentLog.timestamp) : (user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '--');

                      return (
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
                          <td className="py-3.5 px-4 font-mono text-slate-700">
                            {recentAccessText}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-800 tabular-nums">
                            {userLogs.length > 0 ? (
                              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                {userLogs.length} lượt
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal">0 lượt</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedStaff(user)}
                              leftIcon={<History className="h-3.5 w-3.5 text-blue-600" />}
                              className="!px-3 !py-1 text-[11px] font-semibold"
                            >
                              Xem lịch sử
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
