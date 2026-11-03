import { Link } from 'react-router-dom'
import { CalendarIcon, ArrowLeftIcon } from '../../components/Icons'
import NoticeBanner from '../../components/NoticeBanner'

export default function BookingNoticePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10" aria-labelledby="booking-title">
        <span className="flex size-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><CalendarIcon className="size-6" /></span>
        <div className="space-y-3">
          <h1 id="booking-title" className="text-2xl font-bold tracking-tight text-slate-900">Đặt lịch khám trực tuyến</h1>
          <p className="text-sm leading-7 text-slate-600">Tính năng đặt lịch đang được phát triển.</p>
        </div>
        <NoticeBanner variant="warning" title="Chưa thể đặt lịch trên website" message="Hệ thống chưa kết nối Backend đặt lịch. Website hiện chưa tiếp nhận thông tin cá nhân, thông tin sức khỏe hoặc tạo lịch hẹn." />
        <div className="space-y-3 text-sm leading-7 text-slate-600">
          <h2 className="text-base font-semibold text-slate-900">Thông tin trước khi đăng ký khám</h2>
          <p>Số điện thoại, địa chỉ và giờ tiếp nhận chính thức đang chờ xác nhận. Vui lòng xem mục Liên hệ để theo dõi thông tin cập nhật.</p>
          <p>Chưa có lịch khám nào được ghi nhận khi bạn truy cập trang này.</p>
        </div>
        <div className="flex flex-wrap gap-4 border-t border-slate-200 pt-5">
          <Link to="/#contact" className="inline-flex min-h-11 items-center rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white hover:bg-sky-800">Xem thông tin liên hệ</Link>
          <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"><ArrowLeftIcon className="size-4" /> Quay lại trang chủ</Link>
        </div>
      </section>
    </div>
  )
}
