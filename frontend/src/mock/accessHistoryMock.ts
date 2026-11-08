/**
 * MOCK DATA: LỊCH SỬ TRUY CẬP NHÂN VIÊN
 * Chú ý: Dữ liệu minh họa – Chưa kết nối lịch sử truy cập thực tế từ Backend/Database.
 * Không sử dụng thông tin đăng nhập thật, JWT token hay IP thực của người dùng.
 */

export type AccessActivityType = 'LOGIN' | 'LOGOUT' | 'PAGE_ACCESS';
export type AccessStatus = 'SUCCESS' | 'FAILED';
export type DeviceType = 'Desktop' | 'Mobile' | 'Tablet';
export type BrowserType = 'Chrome' | 'Edge' | 'Firefox' | 'Safari';

export interface StaffAccessRecord {
  id: string;
  staffId: string; // Khóa liên kết với StaffUser.id hoặc username
  username: string;
  fullName: string;
  roleCode: 'DOCTOR' | 'RECEPTIONIST';
  timestamp: string; // ISO 8601 YYYY-MM-DDTHH:mm:ss
  activity: AccessActivityType;
  ipAddress: string;
  device: DeviceType;
  browser: BrowserType;
  status: AccessStatus;
  failureReason?: string;
  notes?: string;
}

// Hàm hỗ trợ sinh timestamp tương đối gần với thời điểm hiện tại
const getRelativeDate = (daysAgo: number, hours: number, minutes: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

export const MOCK_ACCESS_HISTORY: StaffAccessRecord[] = [
  // --- Bác sĩ doctor01 (hoặc id = 2) ---
  {
    id: 'ACC-LOG-001',
    staffId: '2',
    username: 'doctor01',
    fullName: 'Bác sĩ Nguyễn Văn A',
    roleCode: 'DOCTOR',
    timestamp: getRelativeDate(0, 8, 15), // Hôm nay 08:15
    activity: 'LOGIN',
    ipAddress: '192.168.1.45',
    device: 'Desktop',
    browser: 'Chrome',
    status: 'SUCCESS',
    notes: 'Đăng nhập ca làm việc buổi sáng',
  },
  {
    id: 'ACC-LOG-002',
    staffId: '2',
    username: 'doctor01',
    fullName: 'Bác sĩ Nguyễn Văn A',
    roleCode: 'DOCTOR',
    timestamp: getRelativeDate(0, 9, 30), // Hôm nay 09:30
    activity: 'PAGE_ACCESS',
    ipAddress: '192.168.1.45',
    device: 'Desktop',
    browser: 'Chrome',
    status: 'SUCCESS',
    notes: 'Truy cập buồng khám Tai Mũi Họng',
  },
  {
    id: 'ACC-LOG-003',
    staffId: '2',
    username: 'doctor01',
    fullName: 'Bác sĩ Nguyễn Văn A',
    roleCode: 'DOCTOR',
    timestamp: getRelativeDate(0, 11, 45), // Hôm nay 11:45
    activity: 'LOGOUT',
    ipAddress: '192.168.1.45',
    device: 'Desktop',
    browser: 'Chrome',
    status: 'SUCCESS',
    notes: 'Đăng xuất nghỉ trưa',
  },
  {
    id: 'ACC-LOG-004',
    staffId: '2',
    username: 'doctor01',
    fullName: 'Bác sĩ Nguyễn Văn A',
    roleCode: 'DOCTOR',
    timestamp: getRelativeDate(1, 13, 20), // Hôm qua 13:20
    activity: 'LOGIN',
    ipAddress: '192.168.1.45',
    device: 'Desktop',
    browser: 'Chrome',
    status: 'SUCCESS',
    notes: 'Bắt đầu ca chiều',
  },
  {
    id: 'ACC-LOG-005',
    staffId: '2',
    username: 'doctor01',
    fullName: 'Bác sĩ Nguyễn Văn A',
    roleCode: 'DOCTOR',
    timestamp: getRelativeDate(1, 13, 18), // Hôm qua 13:18
    activity: 'LOGIN',
    ipAddress: '192.168.1.45',
    device: 'Desktop',
    browser: 'Chrome',
    status: 'FAILED',
    failureReason: 'Sai mật khẩu lần 1',
  },
  {
    id: 'ACC-LOG-006',
    staffId: '2',
    username: 'doctor01',
    fullName: 'Bác sĩ Nguyễn Văn A',
    roleCode: 'DOCTOR',
    timestamp: getRelativeDate(2, 17, 30), // 2 ngày trước
    activity: 'LOGOUT',
    ipAddress: '192.168.1.45',
    device: 'Desktop',
    browser: 'Edge',
    status: 'SUCCESS',
    notes: 'Kết thúc ca khám',
  },
  {
    id: 'ACC-LOG-007',
    staffId: '2',
    username: 'doctor01',
    fullName: 'Bác sĩ Nguyễn Văn A',
    roleCode: 'DOCTOR',
    timestamp: getRelativeDate(3, 8, 2),
    activity: 'LOGIN',
    ipAddress: '192.168.1.45',
    device: 'Desktop',
    browser: 'Edge',
    status: 'SUCCESS',
    notes: 'Đăng nhập ca làm việc',
  },

  // --- Lễ tân receptionist01 / letan01 (hoặc id = 3) ---
  {
    id: 'ACC-LOG-008',
    staffId: '3',
    username: 'letan01',
    fullName: 'Lễ tân Trần Thị B',
    roleCode: 'RECEPTIONIST',
    timestamp: getRelativeDate(0, 7, 45), // Hôm nay 07:45
    activity: 'LOGIN',
    ipAddress: '192.168.1.12',
    device: 'Desktop',
    browser: 'Chrome',
    status: 'SUCCESS',
    notes: 'Mở ca tiếp đón bệnh nhân',
  },
  {
    id: 'ACC-LOG-009',
    staffId: '3',
    username: 'letan01',
    fullName: 'Lễ tân Trần Thị B',
    roleCode: 'RECEPTIONIST',
    timestamp: getRelativeDate(0, 10, 15), // Hôm nay 10:15
    activity: 'PAGE_ACCESS',
    ipAddress: '192.168.1.12',
    device: 'Desktop',
    browser: 'Chrome',
    status: 'SUCCESS',
    notes: 'Tra cứu danh sách lịch hẹn',
  },
  {
    id: 'ACC-LOG-010',
    staffId: '3',
    username: 'letan01',
    fullName: 'Lễ tân Trần Thị B',
    roleCode: 'RECEPTIONIST',
    timestamp: getRelativeDate(1, 8, 0),
    activity: 'LOGIN',
    ipAddress: '192.168.1.12',
    device: 'Desktop',
    browser: 'Chrome',
    status: 'SUCCESS',
    notes: 'Đăng nhập ca sáng',
  },
  {
    id: 'ACC-LOG-011',
    staffId: '3',
    username: 'letan01',
    fullName: 'Lễ tân Trần Thị B',
    roleCode: 'RECEPTIONIST',
    timestamp: getRelativeDate(1, 18, 5),
    activity: 'LOGOUT',
    ipAddress: '192.168.1.12',
    device: 'Desktop',
    browser: 'Chrome',
    status: 'SUCCESS',
    notes: 'Bàn giao ca tiếp tân',
  },
  {
    id: 'ACC-LOG-012',
    staffId: '3',
    username: 'letan01',
    fullName: 'Lễ tân Trần Thị B',
    roleCode: 'RECEPTIONIST',
    timestamp: getRelativeDate(2, 7, 58),
    activity: 'LOGIN',
    ipAddress: '192.168.1.12',
    device: 'Desktop',
    browser: 'Chrome',
    status: 'FAILED',
    failureReason: 'Tài khoản chưa được kích hoạt phiên',
  },

  // --- Bác sĩ Bs.CKI Lê Hoàng Nam (username: doctor02) ---
  {
    id: 'ACC-LOG-013',
    staffId: 'doctor02',
    username: 'doctor02',
    fullName: 'BS.CKI Lê Hoàng Nam',
    roleCode: 'DOCTOR',
    timestamp: getRelativeDate(0, 8, 30),
    activity: 'LOGIN',
    ipAddress: '192.168.1.88',
    device: 'Tablet',
    browser: 'Safari',
    status: 'SUCCESS',
    notes: 'Đăng nhập máy tính bảng phòng khám',
  },
  {
    id: 'ACC-LOG-014',
    staffId: 'doctor02',
    username: 'doctor02',
    fullName: 'BS.CKI Lê Hoàng Nam',
    roleCode: 'DOCTOR',
    timestamp: getRelativeDate(0, 11, 20),
    activity: 'PAGE_ACCESS',
    ipAddress: '192.168.1.88',
    device: 'Tablet',
    browser: 'Safari',
    status: 'SUCCESS',
    notes: 'Kê đơn thuốc điện tử',
  },
  {
    id: 'ACC-LOG-015',
    staffId: 'doctor02',
    username: 'doctor02',
    fullName: 'BS.CKI Lê Hoàng Nam',
    roleCode: 'DOCTOR',
    timestamp: getRelativeDate(2, 14, 10),
    activity: 'LOGIN',
    ipAddress: '192.168.1.88',
    device: 'Desktop',
    browser: 'Firefox',
    status: 'SUCCESS',
  },
  {
    id: 'ACC-LOG-016',
    staffId: 'doctor02',
    username: 'doctor02',
    fullName: 'BS.CKI Lê Hoàng Nam',
    roleCode: 'DOCTOR',
    timestamp: getRelativeDate(3, 16, 45),
    activity: 'LOGOUT',
    ipAddress: '192.168.1.88',
    device: 'Desktop',
    browser: 'Firefox',
    status: 'SUCCESS',
  },

  // --- Lễ tân Phạm Hồng Nhung (username: letan02 / receptionist02) ---
  {
    id: 'ACC-LOG-017',
    staffId: 'letan02',
    username: 'letan02',
    fullName: 'Phạm Hồng Nhung',
    roleCode: 'RECEPTIONIST',
    timestamp: getRelativeDate(1, 8, 10),
    activity: 'LOGIN',
    ipAddress: '192.168.1.15',
    device: 'Desktop',
    browser: 'Edge',
    status: 'SUCCESS',
  },
  {
    id: 'ACC-LOG-018',
    staffId: 'letan02',
    username: 'letan02',
    fullName: 'Phạm Hồng Nhung',
    roleCode: 'RECEPTIONIST',
    timestamp: getRelativeDate(1, 12, 1),
    activity: 'LOGOUT',
    ipAddress: '192.168.1.15',
    device: 'Desktop',
    browser: 'Edge',
    status: 'SUCCESS',
  },
];

// Helper để lấy danh sách lịch sử theo nhân viên (tìm theo staffId hoặc username)
export const getAccessLogsByStaff = (staffIdentifier: { id?: string; username?: string }): StaffAccessRecord[] => {
  return MOCK_ACCESS_HISTORY.filter(
    (log) =>
      (staffIdentifier.id && String(log.staffId) === String(staffIdentifier.id)) ||
      (staffIdentifier.username && log.username.toLowerCase() === staffIdentifier.username.toLowerCase())
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Định dạng nhãn hoạt động tiếng Việt
export const ACTIVITY_MAP: Record<AccessActivityType, { label: string; color: string }> = {
  LOGIN: { label: 'Đăng nhập', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  LOGOUT: { label: 'Đăng xuất', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  PAGE_ACCESS: { label: 'Truy cập hệ thống', color: 'bg-blue-50 text-blue-700 border-blue-200' },
};

// Định dạng kết quả
export const STATUS_MAP: Record<AccessStatus, { label: string; color: string }> = {
  SUCCESS: { label: 'Thành công', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  FAILED: { label: 'Thất bại', color: 'bg-rose-100 text-rose-800 border-rose-200' },
};

