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
  ShieldAlert,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useAuth } from '../../../auth/AuthContext';
import { getBaseUrl } from '../../../api/client';
import { ROLE_MAP } from '../../../types/database';

// Kiểu dữ liệu tóm tắt nhân viên
interface StaffSummaryItem {
  id: string;
  staffCode: string;
  fullName: string;
  username: string;
  roleCode: string;
  status: string;
  lastAccessTime: string | null;
  totalLogins: number;
}

// Kiểu dữ liệu thống kê tổng quan
interface OverviewStats {
  totalAccess: number;
  todayAccess: number;
  mostRecentTime: string | null;
  recentUserFullName: string | null;
  recentUserUsername: string | null;
}

// Kiểu dữ liệu bản ghi nhật ký chi tiết
interface AccessLogItem {
  id: string;
  activity: 'LOGIN' | 'LOGOUT' | 'PAGE_ACCESS';
  status: 'SUCCESS' | 'FAILED';
  accessTime: string;
  ipAddress: string | null;
  device: string | null;
  browser: string | null;
  pagePath: string | null;
}

interface AccessLogListResponse {
  staffId: string | null;
  totalItems: number;
  page: number;
  pageSize: number;
  items: AccessLogItem[];
}

// Chế độ lọc thời gian
type TimeFilterMode = 'YEAR' | 'MONTH' | 'DAY' | 'HOUR' | 'RANGE';

// Hàm lấy thời điểm hiện tại theo giờ Việt Nam (UTC+7)
function getVietnamNow(): Date {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + 7 * 3600000);
}

// Format ngày giờ hiển thị theo vi-VN múi giờ Asia/Ho_Chi_Minh
function formatDateTimeVn(isoString?: string | null): string {
  if (!isoString) return '--';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '--';

  const timeStr = d.toLocaleTimeString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateStr = d.toLocaleDateString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return `${timeStr} • ${dateStr}`;
}

// Tính toán khoảng UTC từ cấu hình bộ lọc theo giờ Việt Nam
function calculateUtcRange(
  mode: TimeFilterMode,
  year: number,
  month: number,
  dateStr: string,
  hour: number,
  customFrom: string,
  customTo: string
): { fromUtc?: string; toUtc?: string; label: string } {
  if (mode === 'YEAR') {
    const from = new Date(`${year}-01-01T00:00:00+07:00`).toISOString();
    const to = new Date(`${year + 1}-01-01T00:00:00+07:00`).toISOString();
    return { fromUtc: from, toUtc: to, label: `Năm ${year}` };
  }

  if (mode === 'MONTH') {
    const mStr = String(month).padStart(2, '0');
    const from = new Date(`${year}-${mStr}-01T00:00:00+07:00`).toISOString();
    let toDate: Date;
    if (month === 12) {
      toDate = new Date(`${year + 1}-01-01T00:00:00+07:00`);
    } else {
      const nextMStr = String(month + 1).padStart(2, '0');
      toDate = new Date(`${year}-${nextMStr}-01T00:00:00+07:00`);
    }
    return { fromUtc: from, toUtc: toDate.toISOString(), label: `Tháng ${mStr}/${year}` };
  }

  if (mode === 'DAY') {
    if (!dateStr) return { label: 'Tất cả thời gian' };
    const from = new Date(`${dateStr}T00:00:00+07:00`);
    const nextDay = new Date(from.getTime() + 24 * 3600000);
    return {
      fromUtc: from.toISOString(),
      toUtc: nextDay.toISOString(),
      label: `Ngày ${dateStr.split('-').reverse().join('/')}`,
    };
  }

  if (mode === 'HOUR') {
    if (!dateStr) return { label: 'Tất cả thời gian' };
    const hStr = String(hour).padStart(2, '0');
    const from = new Date(`${dateStr}T${hStr}:00:00+07:00`);
    const nextHour = new Date(from.getTime() + 3600000);
    return {
      fromUtc: from.toISOString(),
      toUtc: nextHour.toISOString(),
      label: `${hStr}:00 - ${hStr}:59, ${dateStr.split('-').reverse().join('/')}`,
    };
  }

  if (mode === 'RANGE') {
    let from: string | undefined;
    let to: string | undefined;
    if (customFrom) {
      from = new Date(`${customFrom}:00+07:00`).toISOString();
    }
    if (customTo) {
      to = new Date(`${customTo}:00+07:00`).toISOString();
    }
    return {
      fromUtc: from,
      toUtc: to,
      label: `Khoảng: ${customFrom ? customFrom.replace('T', ' ') : '...'} đến ${customTo ? customTo.replace('T', ' ') : '...'}`,
    };
  }

  return { label: 'Tất cả thời gian' };
}

export const AccessHistoryPage: React.FC = () => {
  const { accessToken } = useAuth();

  // Khởi tạo thời gian mặc định theo múi giờ Việt Nam
  const vnNow = useMemo(() => getVietnamNow(), []);
  const defaultYear = vnNow.getFullYear();
  const defaultMonth = vnNow.getMonth() + 1;
  const defaultDateStr = useMemo(() => {
    const y = vnNow.getFullYear();
    const m = String(vnNow.getMonth() + 1).padStart(2, '0');
    const d = String(vnNow.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [vnNow]);
  const defaultHour = vnNow.getHours();

  // State danh sách nhân viên tóm tắt
  const [staffSummaryList, setStaffSummaryList] = useState<StaffSummaryItem[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // State thống kê tổng quan
  const [overviewStats, setOverviewStats] = useState<OverviewStats>({
    totalAccess: 0,
    todayAccess: 0,
    mostRecentTime: null,
    recentUserFullName: null,
    recentUserUsername: null,
  });

  // State bộ lọc danh sách nhân viên
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Nhân viên đang được chọn xem chi tiết lịch sử (null = hiển thị danh sách)
  const [selectedStaff, setSelectedStaff] = useState<StaffSummaryItem | null>(null);

  // State bộ lọc thời gian chi tiết (Mặc định: Năm hiện tại theo UTC+7)
  const [timeMode, setTimeMode] = useState<TimeFilterMode>('YEAR');
  const [filterYear, setFilterYear] = useState<number>(defaultYear);
  const [filterMonth, setFilterMonth] = useState<number>(defaultMonth);
  const [filterDateStr, setFilterDateStr] = useState<string>(defaultDateStr);
  const [filterHour, setFilterHour] = useState<number>(defaultHour);
  const [customFrom, setCustomFrom] = useState<string>('');
  const [customTo, setCustomTo] = useState<string>('');

  // Bộ lọc đang áp dụng
  const [appliedTimeFilter, setAppliedTimeFilter] = useState(() =>
    calculateUtcRange('YEAR', defaultYear, defaultMonth, defaultDateStr, defaultHour, '', '')
  );

  // Bộ lọc hoạt động và trạng thái
  const [activityFilter, setActivityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [detailSearch, setDetailSearch] = useState('');

  // Phân trang lịch sử chi tiết
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;

  // Dữ liệu nhật ký chi tiết từ Backend
  const [detailData, setDetailData] = useState<AccessLogListResponse>({
    staffId: null,
    totalItems: 0,
    page: 1,
    pageSize: 20,
    items: [],
  });
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // 1. Tải danh sách tóm tắt nhân viên và thống kê tổng quan
  const fetchSummaryAndStats = useCallback(async () => {
    if (!accessToken) return;
    setIsLoadingSummary(true);
    setSummaryError(null);

    try {
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'X-Requested-With': 'XMLHttpRequest',
      };

      const [summaryRes, statsRes] = await Promise.all([
        fetch(`${getBaseUrl()}/api/admin/access-logs/staff-summary`, { headers, credentials: 'include' }),
        fetch(`${getBaseUrl()}/api/admin/access-logs/overview-stats`, { headers, credentials: 'include' }),
      ]);

      if (!summaryRes.ok) {
        if (summaryRes.status === 401) throw new Error('Phiên đăng nhập đã hết hạn.');
        if (summaryRes.status === 403) throw new Error('Bạn không có quyền truy cập lịch sử nhân viên.');
        throw new Error(`Lỗi tải danh sách nhân viên (${summaryRes.status})`);
      }

      if (!statsRes.ok) {
        throw new Error(`Lỗi tải thống kê tổng quan (${statsRes.status})`);
      }

      const summaryJson: StaffSummaryItem[] = await summaryRes.json();
      const statsJson: OverviewStats = await statsRes.json();

      setStaffSummaryList(summaryJson);
      setOverviewStats(statsJson);
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ.');
    } finally {
      setIsLoadingSummary(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchSummaryAndStats();
  }, [fetchSummaryAndStats]);

  // 2. Tải lịch sử truy cập chi tiết của nhân viên được chọn
  const fetchDetailLogs = useCallback(
    async (pageToLoad = 1) => {
      if (!accessToken || !selectedStaff) return;
      setIsLoadingDetail(true);
      setDetailError(null);

      try {
        const queryParams = new URLSearchParams();
        queryParams.set('staffId', selectedStaff.id);
        queryParams.set('page', String(pageToLoad));
        queryParams.set('pageSize', String(pageSize));

        if (appliedTimeFilter.fromUtc) {
          queryParams.set('from', appliedTimeFilter.fromUtc);
        }
        if (appliedTimeFilter.toUtc) {
          queryParams.set('to', appliedTimeFilter.toUtc);
        }
        if (activityFilter !== 'ALL') {
          queryParams.set('activity', activityFilter);
        }
        if (statusFilter !== 'ALL') {
          queryParams.set('status', statusFilter);
        }

        const res = await fetch(`${getBaseUrl()}/api/admin/access-logs?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 401) throw new Error('Phiên đăng nhập đã hết hạn.');
          if (res.status === 403) throw new Error('Không có quyền xem chi tiết lịch sử.');
          throw new Error(`Lỗi tải nhật ký chi tiết (${res.status})`);
        }

        const data: AccessLogListResponse = await res.json();
        setDetailData(data);
        setCurrentPage(pageToLoad);
      } catch (err) {
        setDetailError(err instanceof Error ? err.message : 'Lỗi kết nối nhật ký.');
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [accessToken, selectedStaff, appliedTimeFilter, activityFilter, statusFilter]
  );

  // Khi chọn nhân viên hoặc thay đổi bộ lọc đã áp dụng -> Tải chi tiết
  useEffect(() => {
    if (selectedStaff) {
      fetchDetailLogs(1);
    }
  }, [selectedStaff, appliedTimeFilter, activityFilter, statusFilter, fetchDetailLogs]);

  // Xử lý nhấn Áp dụng bộ lọc thời gian
  const handleApplyTimeFilter = () => {
    const calculated = calculateUtcRange(
      timeMode,
      filterYear,
      filterMonth,
      filterDateStr,
      filterHour,
      customFrom,
      customTo
    );
    setAppliedTimeFilter(calculated);
    setCurrentPage(1);
  };

  // Xử lý nhấn Đặt lại bộ lọc thời gian
  const handleResetTimeFilter = () => {
    setTimeMode('YEAR');
    setFilterYear(defaultYear);
    setFilterMonth(defaultMonth);
    setFilterDateStr(defaultDateStr);
    setFilterHour(defaultHour);
    setCustomFrom('');
    setCustomTo('');
    setActivityFilter('ALL');
    setStatusFilter('ALL');
    setDetailSearch('');
    const defaultCalculated = calculateUtcRange('YEAR', defaultYear, defaultMonth, defaultDateStr, defaultHour, '', '');
    setAppliedTimeFilter(defaultCalculated);
    setCurrentPage(1);
  };

  // Lọc danh sách nhân viên tóm tắt
  const filteredStaffList = useMemo(() => {
    return staffSummaryList.filter((u) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.staffCode.toLowerCase().includes(q);

      const matchRole = roleFilter === 'ALL' || u.roleCode === roleFilter;
      return matchSearch && matchRole;
    });
  }, [staffSummaryList, searchTerm, roleFilter]);

  // Lọc tìm kiếm cục bộ trên kết quả bảng chi tiết (IP, thiết bị, trình duyệt, pagePath)
  const filteredDetailItems = useMemo(() => {
    if (!detailData.items.length) return [];
    if (!detailSearch.trim()) return detailData.items;

    const q = detailSearch.toLowerCase().trim();
    return detailData.items.filter((item) => {
      return (
        (item.ipAddress && item.ipAddress.toLowerCase().includes(q)) ||
        (item.device && item.device.toLowerCase().includes(q)) ||
        (item.browser && item.browser.toLowerCase().includes(q)) ||
        (item.pagePath && item.pagePath.toLowerCase().includes(q))
      );
    });
  }, [detailData.items, detailSearch]);

  // Render Icon thiết bị
  const renderDeviceIcon = (device?: string | null) => {
    switch (device) {
      case 'Mobile':
        return <Smartphone className="h-3.5 w-3.5 text-slate-500" />;
      case 'Tablet':
        return <Tablet className="h-3.5 w-3.5 text-slate-500" />;
      default:
        return <Laptop className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  // Tổng số trang chi tiết
  const totalPages = Math.ceil(detailData.totalItems / pageSize) || 1;

  // Lựa chọn danh sách năm (từ 2024 đến năm hiện tại + 1)
  const availableYears = useMemo(() => {
    const list: number[] = [];
    for (let y = defaultYear + 1; y >= 2024; y--) {
      list.push(y);
    }
    return list;
  }, [defaultYear]);

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
              onClick={fetchSummaryAndStats}
              disabled={isLoadingSummary}
              leftIcon={<RefreshCw className={`h-4 w-4 ${isLoadingSummary ? 'animate-spin' : ''}`} />}
              title="Tải lại dữ liệu từ cơ sở dữ liệu"
            >
              Làm mới
            </Button>
          </div>
        }
      />

      {/* 3 Chỉ số thống kê tổng quan (Dữ liệu thật từ SQL Server) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chỉ số 1: Tổng lượt truy cập */}
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Tổng lượt truy cập
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
                {overviewStats.totalAccess}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Đăng nhập thành công từ trước đến nay
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
                {overviewStats.todayAccess}
              </p>
              <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                Trong ngày (giờ Việt Nam UTC+7)
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
                {formatDateTimeVn(overviewStats.mostRecentTime)}
              </p>
              <p className="text-[11px] text-indigo-700 font-medium truncate mt-0.5">
                {overviewStats.recentUserFullName
                  ? `${overviewStats.recentUserFullName} (@${overviewStats.recentUserUsername})`
                  : 'Chưa có lượt đăng nhập nào'}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Nội dung chính: Xem lịch sử chi tiết HOẶC Danh sách nhân viên */}
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
                      selectedStaff.roleCode === 'DOCTOR'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {ROLE_MAP[selectedStaff.roleCode as keyof typeof ROLE_MAP] || selectedStaff.roleCode}
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
                Tổng lượt đăng nhập: <strong className="text-blue-700">{selectedStaff.totalLogins}</strong>
              </span>
            </div>
          </div>

          {/* BỘ LỌC THỜI GIAN THEO YÊU CẦU MỤC 7 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Bộ lọc thời gian (Múi giờ Việt Nam UTC+7)
                </span>
                <span className="text-[11px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md border border-blue-200">
                  Đang lọc: {appliedTimeFilter.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleResetTimeFilter}
                  leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                  className="!px-2.5 !py-1 text-xs"
                >
                  Đặt lại
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleApplyTimeFilter}
                  leftIcon={<Filter className="h-3.5 w-3.5" />}
                  className="!px-3 !py-1 text-xs"
                >
                  Áp dụng
                </Button>
              </div>
            </div>

            {/* Hàng chọn chế độ lọc và trường nhập */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Chọn chế độ */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-600">Chế độ:</span>
                <select
                  value={timeMode}
                  onChange={(e) => setTimeMode(e.target.value as TimeFilterMode)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="YEAR">Năm (Mặc định)</option>
                  <option value="MONTH">Tháng</option>
                  <option value="DAY">Ngày</option>
                  <option value="HOUR">Giờ</option>
                  <option value="RANGE">Khoảng thời gian</option>
                </select>
              </div>

              {/* Input tương ứng từng chế độ */}
              {timeMode === 'YEAR' && (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-600">Chọn năm:</span>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {availableYears.map((y) => (
                      <option key={y} value={y}>
                        Năm {y}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {timeMode === 'MONTH' && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-600">Tháng:</span>
                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>
                          Tháng {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-600">Năm:</span>
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      {availableYears.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {timeMode === 'DAY' && (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-600">Chọn ngày:</span>
                  <input
                    type="date"
                    value={filterDateStr}
                    onChange={(e) => setFilterDateStr(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {timeMode === 'HOUR' && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-600">Ngày:</span>
                    <input
                      type="date"
                      value={filterDateStr}
                      onChange={(e) => setFilterDateStr(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-600">Giờ (00–23):</span>
                    <select
                      value={filterHour}
                      onChange={(e) => setFilterHour(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                        <option key={h} value={h}>
                          {String(h).padStart(2, '0')}:00 - {String(h).padStart(2, '0')}:59
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {timeMode === 'RANGE' && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-600">Từ:</span>
                    <input
                      type="datetime-local"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-600">Đến:</span>
                    <input
                      type="datetime-local"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Hàng bộ lọc kết hợp: Hoạt động, Kết quả, Tìm kiếm IP */}
            <div className="flex flex-wrap gap-3 justify-between items-center pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-3">
                {/* Hoạt động */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-semibold text-slate-600">Hoạt động:</span>
                  <select
                    value={activityFilter}
                    onChange={(e) => {
                      setActivityFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="ALL">Tất cả hoạt động</option>
                    <option value="LOGIN">Đăng nhập</option>
                    <option value="LOGOUT">Đăng xuất</option>
                    <option value="PAGE_ACCESS">Truy cập trang</option>
                  </select>
                </div>

                {/* Trạng thái kết quả */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-semibold text-slate-600">Kết quả:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="ALL">Tất cả kết quả</option>
                    <option value="SUCCESS">Thành công</option>
                    <option value="FAILED">Thất bại</option>
                  </select>
                </div>
              </div>

              {/* Tìm kiếm IP/thiết bị */}
              <div className="relative w-full sm:w-64">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm IP, thiết bị, đường dẫn..."
                  value={detailSearch}
                  onChange={(e) => setDetailSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
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
                    <th className="py-3 px-4">Trang đã truy cập / Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingDetail ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                          <span className="text-xs font-medium">Đang tải nhật ký truy cập từ SQL Server...</span>
                        </div>
                      </td>
                    </tr>
                  ) : detailError ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="p-2 bg-rose-50 text-rose-600 rounded-full border border-rose-200">
                            <ShieldAlert className="h-5 w-5" />
                          </div>
                          <p className="font-bold text-rose-800 text-xs">{detailError}</p>
                          <Button size="sm" variant="outline" onClick={() => fetchDetailLogs(currentPage)} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                            Thử lại
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : detailData.totalItems === 0 || filteredDetailItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <History className="h-8 w-8 text-slate-300" />
                          <p className="font-bold text-slate-700 text-sm">
                            Không có lịch sử truy cập trong khoảng thời gian đã chọn
                          </p>
                          <p className="text-xs text-slate-400">
                            Thử thay đổi bộ lọc thời gian hoặc điều kiện tìm kiếm để xem thêm bản ghi.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredDetailItems.map((item) => {
                      const isSuccess = item.status === 'SUCCESS';
                      let actLabel: string = item.activity;
                      let actColor = 'bg-slate-100 text-slate-700 border-slate-200';

                      if (item.activity === 'LOGIN') {
                        actLabel = 'Đăng nhập';
                        actColor = 'bg-blue-50 text-blue-700 border-blue-200';
                      } else if (item.activity === 'LOGOUT') {
                        actLabel = 'Đăng xuất';
                        actColor = 'bg-slate-100 text-slate-700 border-slate-200';
                      } else if (item.activity === 'PAGE_ACCESS') {
                        actLabel = 'Truy cập trang';
                        actColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                      }

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-800 whitespace-nowrap">
                            {formatDateTimeVn(item.accessTime)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border ${actColor}`}>
                              {actLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">
                            {item.ipAddress || '--'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                              {renderDeviceIcon(item.device)}
                              <span>{item.device || 'Desktop'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium">
                            {item.browser || 'Chrome'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {isSuccess ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                                Thành công
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                <XCircle className="h-3 w-3 text-rose-600 shrink-0" />
                                Thất bại
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-[11px] font-mono">
                            {item.pagePath ? (
                              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                {item.pagePath}
                              </span>
                            ) : (
                              '--'
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            {detailData.totalItems > pageSize && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50 text-xs">
                <span className="text-slate-500">
                  Hiển thị trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong> ({detailData.totalItems} bản ghi)
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage <= 1 || isLoadingDetail}
                    onClick={() => fetchDetailLogs(currentPage - 1)}
                    leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
                  >
                    Trước
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage >= totalPages || isLoadingDetail}
                    onClick={() => fetchDetailLogs(currentPage + 1)}
                    rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
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
                    <th className="py-3 px-4 text-center">Số lượt đăng nhập</th>
                    <th className="py-3 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingSummary ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                          <span className="text-xs font-medium">Đang tải danh sách nhân viên từ cơ sở dữ liệu...</span>
                        </div>
                      </td>
                    </tr>
                  ) : summaryError ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="p-2 bg-rose-50 text-rose-600 rounded-full border border-rose-200">
                            <ShieldAlert className="h-5 w-5" />
                          </div>
                          <p className="font-bold text-rose-800 text-xs">{summaryError}</p>
                          <Button size="sm" variant="outline" onClick={fetchSummaryAndStats} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
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
                                user.roleCode === 'DOCTOR'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {ROLE_MAP[user.roleCode as keyof typeof ROLE_MAP] || user.roleCode}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-700">
                            {formatDateTimeVn(user.lastAccessTime)}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-800 tabular-nums">
                            {user.totalLogins > 0 ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                {user.totalLogins} lượt
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
