import React from 'react';
import { Info, ShieldCheck, Database, KeyRound, CheckCircle2, Lock } from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';

export const PermissionsAuditPage: React.FC = () => {
  const permissions = [
    {
      code: '01',
      name: 'Đặt lịch hẹn khám bệnh',
      tables: 'Đặt lịch hẹn & Lịch sử thay đổi',
      patient: 'Có (Đăng ký trực tuyến)',
      receptionist: 'Đầy đủ (Duyệt, Dời, Hủy, Tiếp nhận)',
      doctor: 'Chỉ xem',
      admin: 'Toàn quyền',
    },
    {
      code: '02',
      name: 'Tra cứu hồ sơ & Lịch sử qua OTP',
      tables: 'Số điện thoại liên kết & Xác thực mã OTP',
      patient: 'Có (Xác thực OTP 6 số)',
      receptionist: 'Xem & cập nhật hồ sơ',
      doctor: 'Xem tiền sử',
      admin: 'Toàn quyền',
    },
    {
      code: '03',
      name: 'Tiếp nhận bệnh nhân & Vào hàng chờ',
      tables: 'Tiếp nhận người bệnh',
      patient: 'Không',
      receptionist: 'Đầy đủ (Hẹn trước & Vãng lai)',
      doctor: 'Không',
      admin: 'Toàn quyền',
    },
    {
      code: '04',
      name: 'Điều phối hàng chờ khám ưu tiên',
      tables: 'Hàng chờ gọi khám ưu tiên',
      patient: 'Không',
      receptionist: 'Đầy đủ (Theo dõi & hủy lượt)',
      doctor: 'Xem & Bắt đầu ca khám',
      admin: 'Toàn quyền',
    },
    {
      code: '05',
      name: 'Quản lý hồ sơ hành chính & SĐT liên kết',
      tables: 'Hồ sơ người bệnh & Thông tin hành chính',
      patient: 'Chỉ xem thông tin mình',
      receptionist: 'Đầy đủ (Thêm/Sửa hành chính)',
      doctor: 'Xem tiền sử & dị ứng',
      admin: 'Toàn quyền',
    },
    {
      code: '06',
      name: 'Khám chuyên khoa & Ghi nhận tổn thương TMH',
      tables: 'Khám lâm sàng Tai - Mũi - Họng',
      patient: 'Không',
      receptionist: 'Không',
      doctor: 'Đầy đủ (Tai, Mũi, Họng, Đầu cổ)',
      admin: 'Giám sát',
    },
    {
      code: '07',
      name: 'Lập & Ký số bệnh án điện tử',
      tables: 'Bệnh án điện tử',
      patient: 'Không',
      receptionist: 'Không',
      doctor: 'Đầy đủ (Ký duyệt khóa hồ sơ)',
      admin: 'Giám sát',
    },
    {
      code: '08',
      name: 'Kê đơn thuốc điện tử',
      tables: 'Kê đơn thuốc điện tử',
      patient: 'Không',
      receptionist: 'Xem đơn để cấp phát thuốc',
      doctor: 'Đầy đủ (Ký duyệt gửi quầy dược)',
      admin: 'Giám sát',
    },
    {
      code: '09',
      name: 'Quản lý danh mục thuốc & Lô FEFO',
      tables: 'Danh mục thuốc & Lô thuốc',
      patient: 'Không',
      receptionist: 'Đầy đủ (Thêm thuốc, thêm lô)',
      doctor: 'Xem danh mục kê đơn',
      admin: 'Toàn quyền',
    },
    {
      code: '10',
      name: 'Ghi nhận biến động kho dược',
      tables: 'Nhật ký nhập xuất kho dược',
      patient: 'Không',
      receptionist: 'Đầy đủ (Ghi lý do bắt buộc)',
      doctor: 'Không',
      admin: 'Toàn quyền',
    },
    {
      code: '11',
      name: 'Cấp phát thuốc theo đơn đã ký',
      tables: 'Cấp phát thuốc theo đơn',
      patient: 'Không',
      receptionist: 'Đầy đủ (Chỉ phát đơn đã ký duyệt)',
      doctor: 'Xem trạng thái',
      admin: 'Toàn quyền',
    },
    {
      code: '12',
      name: 'Lập hóa đơn & Thu tiền viện phí',
      tables: 'Hóa đơn & Thanh toán viện phí',
      patient: 'Xem biên lai thu tiền',
      receptionist: 'Đầy đủ (Thu tiền mặt / VietQR)',
      doctor: 'Không',
      admin: 'Toàn quyền',
    },
    {
      code: '13',
      name: 'Quản lý tài khoản & Phân quyền nhân sự',
      tables: 'Quản trị tài khoản & Phân quyền',
      patient: 'Không',
      receptionist: 'Không',
      doctor: 'Không',
      admin: 'Toàn quyền',
    },
  ];

  return (
    <div className="space-y-6">
      <Topbar
        title="Phân quyền truy cập"
        subtitle="Quyền truy cập theo từng vai trò và chức năng."
      />

      {/* Info Card */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
        <Database className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm">Nguyên tắc bảo mật y tế & Kiểm soát truy cập:</p>
          <p className="text-blue-800 leading-relaxed">
            Hệ thống phân quyền theo vai trò gắn liền với 3 nhóm tài khoản: Quản trị viên, Bác sĩ và Lễ tân. 
            Toàn bộ quyền sửa hồ sơ bệnh án bị khóa khi bệnh án hoàn tất, và đơn thuốc được chuyển quầy dược chỉ khi bác sĩ đã ký duyệt.
          </p>
        </div>
      </div>

      {/* Permissions Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Chức năng nghiệp vụ</th>
                <th className="py-3 px-4">Phân hệ nghiệp vụ</th>
                <th className="py-3 px-4 text-center">Người bệnh</th>
                <th className="py-3 px-4 text-center">Lễ tân & Dược tá</th>
                <th className="py-3 px-4 text-center">Bác sĩ chuyên khoa</th>
                <th className="py-3 px-4 text-center">Quản trị viên</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissions.map((p) => (
                <tr key={p.code} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 text-center font-mono text-slate-400 font-bold">
                    {p.code}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {p.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-blue-700">
                    {p.tables}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-600">
                    {p.patient}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block text-left font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {p.receptionist}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {p.doctor}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {p.admin}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};