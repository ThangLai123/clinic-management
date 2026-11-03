import { useState } from 'react'
import StaffLayout from '../../layouts/StaffLayout'
import {
  UsersIcon,
  CalendarIcon,
  UserCheckIcon,
  CreditCardIcon,
  PillIcon,
  ActivityIcon,
  ClockIcon,
  ClipboardIcon
} from '../../components/Icons'

export default function ReceptionistDashboard() {
  const [activeMenu, setActiveMenu] = useState('overview')

  const menuItems = [
    { id: 'overview', label: 'Tổng quan ca trực', icon: ActivityIcon, tag: 'Chính' },
    { id: 'patients', label: 'Quản lý Bệnh nhân', icon: UsersIcon, tag: 'Hồ sơ' },
    { id: 'appointments', label: 'Lịch hẹn đặt trước', icon: CalendarIcon, tag: 'Lịch khám' },
    { id: 'checkin', label: 'Tiếp nhận & Cấp số', icon: UserCheckIcon, tag: 'Hàng đợi' },
    { id: 'billing', label: 'Thanh toán & Viện phí', icon: CreditCardIcon, tag: 'Thu ngân' },
    { id: 'dispensation', label: 'Phát thuốc & Bàn giao', icon: PillIcon, tag: 'Dược' },
  ]

  const activeLabel = menuItems.find(m => m.id === activeMenu)?.label || 'Tổng quan'

  return (
    <StaffLayout role="receptionist" menuItems={menuItems} activeId={activeMenu} onSelectMenu={setActiveMenu}>
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>Khu vực bàn tiếp đón & điều phối bệnh nhân</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{activeLabel}</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <ClockIcon className="w-3.5 h-3.5 text-slate-600" />
          <span>Khung giờ tiếp nhận: 07:30 – 19:30</span>
        </div>
      </div>

      {/* Content views according to active menu */}
      {activeMenu === 'overview' && (
        <div className="space-y-6">
          {/* Skeleton Metrics Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Bệnh nhân chờ tiếp nhận", hint: "Chờ cấp số vào phòng khám", tag: "Hàng đợi" },
              { label: "Lịch hẹn hôm nay", hint: "Đăng ký trực tuyến/điện thoại", tag: "Đặt trước" },
              { label: "Đang khám chuyên khoa", hint: "Tại các buồng khám Tai Mũi Họng", tag: "Buồng khám" },
              { label: "Chờ thanh toán & nhận thuốc", hint: "Đã hoàn thành khám", tag: "Thu viện phí" },
            ].map((card, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{card.tag}</span>
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{card.label}</span>
                  <p className="mt-2 text-2xl font-bold text-slate-600" aria-label="Chưa có dữ liệu">—</p>
                </div>
                <span className="text-[11px] text-slate-600 block border-t border-slate-100 pt-2">{card.hint}</span>
              </div>
            ))}
          </div>

          {/* Skeleton Table of Patient Queue */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Danh sách tiếp nhận gần nhất</h3>
                <p className="text-xs text-slate-500">Khung bố cục danh sách bệnh nhân chờ phân luồng khám</p>
              </div>
              <div className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-medium">
                Khung giao diện mẫu (Chưa có dữ liệu thật)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">STT / Mã số</th>
                    <th className="px-4 py-3">Họ và tên</th>
                    <th className="px-4 py-3">Năm sinh / Giới tính</th>
                    <th className="px-4 py-3">Lý do khám (TMH)</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {[1, 2, 3].map((row) => (
                    <tr key={row} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-mono text-slate-500">TMH-00{row}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">[Họ tên bệnh nhân mẫu]</td>
                      <td className="px-4 py-3 text-slate-500">---</td>
                      <td className="px-4 py-3 text-slate-500">Khám Tai Mũi Họng</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          Chờ phân buồng
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-slate-600 text-xs italic">Xem chi tiết</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeMenu !== 'overview' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <ClipboardIcon className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-bold text-slate-900">Mục chức năng: {activeLabel}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Giao diện nghiệp vụ chi tiết cho phần này sẽ được hoàn thiện theo từng giai đoạn trong các Task tiếp theo (T3–T6).
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setActiveMenu('overview')}
              className="min-h-11 px-4 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
            >
              Quay lại Tổng quan ca trực
            </button>
          </div>
        </div>
      )}
    </StaffLayout>
  )
}
