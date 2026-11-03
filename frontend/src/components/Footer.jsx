import { Link } from 'react-router-dom'
import { MedicalCrossIcon } from './Icons'

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <MedicalCrossIcon className="size-7 shrink-0 text-sky-300" />
              <span className="text-lg font-bold tracking-tight text-white">Clinic Management</span>
            </div>
            <p className="text-sm leading-7">Thông tin dành cho bệnh nhân tìm hiểu về chuyên khoa Tai Mũi Họng và thủ tục thăm khám.</p>
          </div>
          <nav aria-label="Thông tin dành cho bệnh nhân">
            <h2 className="mb-3 text-sm font-semibold text-white">Khám phá</h2>
            <div className="flex flex-col items-start">
              <Link to="/#about" className="inline-flex min-h-11 items-center hover:text-white">Giới thiệu</Link>
              <Link to="/#services" className="inline-flex min-h-11 items-center hover:text-white">Dịch vụ</Link>
              <Link to="/#process" className="inline-flex min-h-11 items-center hover:text-white">Quy trình</Link>
              <Link to="/#contact" className="inline-flex min-h-11 items-center hover:text-white">Liên hệ</Link>
            </div>
          </nav>
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white">Trạng thái website</h2>
            <p className="text-sm leading-7">Đặt lịch trực tuyến đang phát triển. Thông tin liên hệ, giờ làm việc và giấy phép hoạt động sẽ được cập nhật sau khi xác nhận.</p>
            <Link to="/booking-notice" className="inline-flex min-h-11 items-center text-sm font-semibold text-sky-300 hover:text-white">Thông tin đặt lịch khám →</Link>
          </div>
        </div>
        <p className="mt-8 border-t border-slate-700 pt-6 text-xs leading-6 text-slate-300">© 2026 Clinic Management. Website đang trong quá trình xây dựng.</p>
      </div>
    </footer>
  )
}
