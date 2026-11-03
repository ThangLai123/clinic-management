import { useState } from 'react'
import StaffLayout from '../../layouts/StaffLayout'
import {
  StethoscopeIcon,
  UsersIcon,
  FileTextIcon,
  PillIcon,
  ActivityIcon,
  ClockIcon,
  ClipboardIcon
} from '../../components/Icons'

export default function DoctorDashboard() {
  const [activeMenu, setActiveMenu] = useState('waiting')

  const menuItems = [
    { id: 'waiting', label: 'Danh sách chờ khám', icon: UsersIcon, tag: 'Hàng đợi' },
    { id: 'exam', label: 'Buồng khám lâm sàng', icon: StethoscopeIcon, tag: 'Chuyên khoa' },
    { id: 'records', label: 'Hồ sơ Bệnh án điện tử', icon: FileTextIcon, tag: 'Lịch sử' },
    { id: 'prescriptions', label: 'Kê đơn thuốc điện tử', icon: PillIcon, tag: 'Toa thuốc' },
    { id: 'inventory', label: 'Tra cứu Kho thuốc', icon: ActivityIcon, tag: 'Tồn kho' },
  ]

  const activeLabel = menuItems.find(m => m.id === activeMenu)?.label || 'Danh sách chờ khám'

  return (
    <StaffLayout role="doctor" menuItems={menuItems} activeId={activeMenu} onSelectMenu={setActiveMenu}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span>Buồng khám Chuyên khoa Tai Mũi Họng số 01</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{activeLabel}</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <ClockIcon className="w-3.5 h-3.5 text-slate-600" />
          <span>Ca khám mẫu · Chưa có nhân viên đăng nhập</span>
        </div>
      </div>

      {/* View: Danh sách chờ khám */}
      {activeMenu === 'waiting' && (
        <div className="space-y-6">
          {/* Status summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Bệnh nhân đang chờ vào buồng</span>
              <p className="mt-2 text-2xl font-bold text-slate-600" aria-label="Chưa có dữ liệu">—</p>
              <span className="text-[11px] text-slate-600 mt-2 block">Xếp theo số thứ tự tiếp đón</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Ca khám đã hoàn thành hôm nay</span>
              <p className="mt-2 text-2xl font-bold text-slate-600" aria-label="Chưa có dữ liệu">—</p>
              <span className="text-[11px] text-slate-600 mt-2 block">Đã có kết luận chẩn đoán</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Chỉ định nội soi kỹ thuật số</span>
              <p className="mt-2 text-2xl font-bold text-slate-600" aria-label="Chưa có dữ liệu">—</p>
              <span className="text-[11px] text-slate-600 mt-2 block">Chờ kết quả quan sát ống soi</span>
            </div>
          </div>

          {/* Waiting List Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hàng đợi khám lâm sàng</h3>
                <p className="text-xs text-slate-500">Bệnh nhân đã qua khâu lễ tân, sẵn sàng gọi vào khám</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMenu('exam')}
                className="inline-flex items-center gap-1.5 min-h-11 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors"
              >
                <StethoscopeIcon className="w-3.5 h-3.5" />
                <span>Mở Buồng khám lâm sàng</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Số khám</th>
                    <th className="px-4 py-3">Họ và tên</th>
                    <th className="px-4 py-3">Tuổi / Giới tính</th>
                    <th className="px-4 py-3">Triệu chứng ban đầu</th>
                    <th className="px-4 py-3">Hình thức tiếp nhận</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {[1, 2, 3].map((num) => (
                    <tr key={num} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-mono font-bold text-teal-700">STT-0{num}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">[Bệnh nhân mẫu {num}]</td>
                      <td className="px-4 py-3 text-slate-500">-- tuổi</td>
                      <td className="px-4 py-3 text-slate-600">Đau họng, nghẹt mũi kéo dài</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          Có hẹn trước
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setActiveMenu('exam')}
                          className="inline-flex min-h-11 items-center text-xs font-semibold text-teal-700 hover:text-teal-800"
                        >
                          Xem buồng khám mẫu
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View: Buồng khám lâm sàng */}
      {activeMenu === 'exam' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1: Bệnh nhân hiện tại */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Bệnh nhân đang khám</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-medium">STT-01</span>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-600 block">Họ và tên:</span>
                <strong className="text-slate-800 text-sm block">[Họ và tên bệnh nhân mẫu]</strong>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-600 block">Năm sinh:</span>
                  <span className="text-slate-700 font-medium">1990</span>
                </div>
                <div>
                  <span className="text-slate-600 block">Giới tính:</span>
                  <span className="text-slate-700 font-medium">Nam</span>
                </div>
              </div>
              <div>
                <span className="text-slate-600 block">Lý do đến khám:</span>
                <span className="text-slate-700">Ngạt mũi hai bên, chảy dịch mũi sau, khàn tiếng nhẹ.</span>
              </div>
              <div>
                <span className="text-slate-600 block">Tiền sử dị ứng:</span>
                <span className="text-slate-700">Chưa ghi nhận dị ứng thuốc.</span>
              </div>
            </div>
          </div>

          {/* Col 2: Kết quả thăm khám & Nội soi */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Nội soi Tai Mũi Họng</h3>
              <span className="text-[10px] text-slate-600">Khung xem trước</span>
            </div>
            <div className="aspect-video bg-slate-100 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-600 p-4 text-center">
              <ActivityIcon className="w-8 h-8 mb-2 text-slate-300" />
              <span className="text-xs font-medium">Khung hiển thị hình ảnh nội soi Tai Mũi Họng</span>
              <span className="text-[10px] text-slate-600 mt-1">(Tích hợp camera ở Task sau)</span>
            </div>
            <div className="space-y-2 text-xs">
              <label className="text-slate-600 font-medium block">Chẩn đoán sơ bộ:</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                [Chẩn đoán minh họa · Chưa có dữ liệu]
              </div>
            </div>
          </div>

          {/* Col 3: Phác đồ & Đơn thuốc */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Kê đơn thuốc & Lời dặn</h3>
              <span className="text-[10px] text-slate-600">Khung phác đồ</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-semibold text-slate-800 block">Vị trí hiển thị đơn thuốc:</span>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>[Tên thuốc · Chưa có dữ liệu]</li>
                  <li>[Liều dùng · Chưa có dữ liệu]</li>
                  <li>[Thời gian dùng · Chưa có dữ liệu]</li>
                </ul>
              </div>
              <div>
                <span className="text-slate-600 block mb-1">Lời dặn bác sĩ:</span>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs">
                  [Hướng dẫn sau khám · Chưa có dữ liệu]
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs */}
      {activeMenu !== 'waiting' && activeMenu !== 'exam' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
            <ClipboardIcon className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-bold text-slate-900">Mục chức năng: {activeLabel}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Phân hệ chuyên môn này sẽ được kết nối với cơ sở dữ liệu PostgreSQL và phân quyền RBAC trong các Task tiếp theo.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setActiveMenu('waiting')}
              className="min-h-11 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
            >
              Quay lại Danh sách chờ khám
            </button>
          </div>
        </div>
      )}
    </StaffLayout>
  )
}
