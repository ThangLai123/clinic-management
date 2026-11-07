import React from 'react';
import { ShieldCheck, Check, X, Info } from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export const PermissionsAuditPage: React.FC = () => {
  const permissions = [
    {
      code: 'UC-01',
      name: 'Đặt lịch hẹn khám bệnh',
      patient: 'Có (Tự đăng ký)',
      receptionist: 'Đầy đủ',
      doctor: 'Chỉ xem',
      admin: 'Toàn quyền',
    },
    {
      code: 'UC-02',
      name: 'Tra cứu lịch sử khám bệnh qua OTP',
      patient: 'Có (Chính mình qua OTP)',
      receptionist: 'Xem hồ sơ HC',
      doctor: 'Xem bệnh án',
      admin: 'Toàn quyền',
    },
    {
      code: 'UC-03',
      name: 'Quản lý kho thuốc & nhập thuốc',
      patient: 'Không',
      receptionist: 'Đầy đủ',
      doctor: 'Xem tồn kho',
      admin: 'Toàn quyền',
    },
    {
      code: 'UC-04',
      name: 'Tiếp nhận người bệnh (Check-in)',
      patient: 'Không',
      receptionist: 'Đầy đủ',
      doctor: 'Không',
      admin: 'Toàn quyền',
    },
    {
      code: 'UC-05',
      name: 'Quản lý lịch hẹn (Xác nhận/Hủy/Đổi)',
      patient: 'Hủy lịch hẹn của mình',
      receptionist: 'Đầy đủ',
      doctor: 'Chỉ xem',
      admin: 'Toàn quyền',
    },
    {
      code: 'UC-06',
      name: 'Phân buồng khám Tai Mũi Họng',
      patient: 'Không',
      receptionist: 'Đầy đủ',
      doctor: 'Xem buồng của mình',
      admin: 'Toàn quyền',
    },
    {
      code: 'UC-07',
      name: 'Tra cứu hồ sơ hành chính',
      patient: 'Chỉ xem thông tin mình',
      receptionist: 'Đầy đủ (Không sửa chẩn đoán)',
      doctor: 'Xem tiền sử',
      admin: 'Toàn quyền',
    },
    {
      code: 'UC-08',
      name: 'Phát thuốc theo đơn Bác sĩ',
      patient: 'Không',
      receptionist: 'Đầy đủ (Không tự đổi thuốc)',
      doctor: 'Xem trạng thái',
      admin: 'Toàn quyền',
    },
    {
      code: 'UC-09',
      name: 'Lập hóa đơn & Thu tiền viện phí',
      patient: 'Xem biên lai',
      receptionist: 'Đầy đủ',
      doctor: 'Không',
      admin: 'Toàn quyền',
    },
    {
      code: 'UC-10',
      name: 'Khám chuyên khoa Tai Mũi Họng & Nội soi',
      patient: 'Không',
      receptionist: 'Không',
      doctor: 'Đầy đủ (Chuyên môn)',
      admin: 'Giám sát',
    },
    {
      code: 'UC-11',
      name: 'Lập & Hoàn tất hồ sơ bệnh án điện tử',
      patient: 'Không',
      receptionist: 'Không',
      doctor: 'Đầy đủ (Ký bệnh án)',
      admin: 'Giám sát',
    },
    {
      code: 'UC-12',
      name: 'Kê đơn thuốc điện tử',
      patient: 'Không',
      receptionist: 'Xem để phát thuốc',
      doctor: 'Đầy đủ (Chuyên môn)',
      admin: 'Giám sát',
    },
    {
      code: 'UC-13',
      name: 'Quản lý tài khoản & Phân quyền',
      patient: 'Không',
      receptionist: 'Không',
      doctor: 'Không',
      admin: 'Toàn quyền',
    },
  ];

  return (
    <div className="space-y-6">
      <Topbar
        title="Ma Trận Phân Quyền Vai Trò Hệ Thống (Role-Based Access Matrix)"
        subtitle="Chi tiết thẩm quyền của từng nhóm người dùng theo 13 Use Cases phòng khám Tai Mũi Họng."
      />

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã UC</th>
                <th className="py-3 px-4">Chức Năng Nghiệp Vụ</th>
                <th className="py-3 px-4 text-center">Bệnh Nhân (Patient)</th>
                <th className="py-3 px-4 text-center">Lễ Tân (Receptionist)</th>
                <th className="py-3 px-4 text-center">Bác Sĩ (Doctor)</th>
                <th className="py-3 px-4 text-center">Quản Trị (Admin)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissions.map((p) => (
                <tr key={p.code} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{p.code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{p.name}</td>
                  <td className="py-3 px-4 text-center text-slate-600">{p.patient}</td>
                  <td className="py-3 px-4 text-center font-medium text-amber-800 bg-amber-50/30">
                    {p.receptionist}
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-emerald-800 bg-emerald-50/30">
                    {p.doctor}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-indigo-800 bg-indigo-50/30">
                    {p.admin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
        <p className="font-bold flex items-center gap-1.5">
          <Info className="h-4 w-4 text-blue-700" />
          Nguyên tắc phân định trách nhiệm y tế:
        </p>
        <p>
          Bác sĩ chịu trách nhiệm hoàn toàn về nội dung lâm sàng, chẩn đoán và kê đơn thuốc (UC-10, 11, 12). Lễ tân phụ trách hành chính, kho dược và thu viện phí (UC-03, 04, 05, 06, 07, 08, 09). Quản trị viên phụ trách an toàn tài khoản và phân quyền (UC-13).
        </p>
      </div>
    </div>
  );
};

