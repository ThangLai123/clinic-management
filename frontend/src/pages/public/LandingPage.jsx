import { Link } from 'react-router-dom'
import { CalendarIcon, StethoscopeIcon, ClipboardIcon, ChevronRightIcon, ClockIcon, ActivityIcon, PhoneIcon, MapPinIcon } from '../../components/Icons'

const services = [
  { title: 'Khám Tai', desc: 'Thông tin về danh mục khám tai và thính lực sẽ được cập nhật sau khi được phòng khám xác nhận.', icon: ActivityIcon },
  { title: 'Khám Mũi', desc: 'Thông tin về danh mục khám mũi, xoang sẽ được cập nhật sau khi được phòng khám xác nhận.', icon: StethoscopeIcon },
  { title: 'Khám Họng', desc: 'Thông tin về danh mục khám họng, thanh quản sẽ được cập nhật sau khi được phòng khám xác nhận.', icon: ClipboardIcon },
  { title: 'Thông tin trước buổi khám', desc: 'Hướng dẫn chuẩn bị hồ sơ và thủ tục thăm khám sẽ được công bố cùng thông tin hoạt động chính thức.', icon: CalendarIcon },
]

const steps = [
  { step: '01', title: 'Đăng ký khám', desc: 'Dự kiến tiếp nhận thông tin tại quầy. Đặt lịch trực tuyến hiện đang phát triển.' },
  { step: '02', title: 'Tiếp nhận & cấp số', desc: 'Dự kiến xác nhận thông tin và hướng dẫn thứ tự vào khám.' },
  { step: '03', title: 'Thăm khám', desc: 'Nội dung khám và chỉ định sẽ do bác sĩ phụ trách quyết định khi phòng khám hoạt động.' },
  { step: '04', title: 'Nhận hướng dẫn', desc: 'Dự kiến hoàn tất thủ tục và nhận hướng dẫn sau buổi khám.' },
]

export default function LandingPage() {
  return (
    <div className="space-y-16 py-8 sm:space-y-24 sm:py-12">
      <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="public-title">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 lg:p-14">
          <div className="max-w-3xl space-y-6">
            <p className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-900">Thông tin dành cho người bệnh</p>
            <h1 id="public-title" className="text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">Tìm hiểu trước khi đến khám.<br /><span className="text-sky-700">Chủ động cho buổi hẹn của bạn.</span></h1>
            <p className="text-base leading-8 text-slate-600 sm:text-lg">Tìm hiểu danh mục Tai Mũi Họng dự kiến, quy trình tiếp nhận và thông tin liên hệ tại một nơi.</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/booking-notice" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-sky-700 px-5 font-semibold text-white transition-colors hover:bg-sky-800"><CalendarIcon /> Đặt lịch khám</Link>
              <a href="#services" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-slate-100 px-5 font-semibold text-slate-700 transition-colors hover:bg-slate-200">Tìm hiểu dịch vụ <ChevronRightIcon /></a>
            </div>
            <p className="border-t border-slate-200 pt-5 text-sm leading-7 text-slate-600">Website đang được xây dựng. Đặt lịch trực tuyến chưa khả dụng; thông tin dịch vụ và hoạt động cần được xác nhận trước khi công bố chính thức.</p>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="services-title">
        <div className="mb-8 max-w-2xl space-y-3">
          <p className="text-xs font-bold tracking-wider text-sky-700 uppercase">Tìm hiểu dịch vụ</p>
          <h2 id="services-title" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Danh mục chuyên khoa dự kiến</h2>
          <p className="text-sm leading-7 text-slate-600">Nội dung minh họa cho giao diện. Danh mục dưới đây chưa phải thông báo dịch vụ đang được cung cấp.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map(service => {
            const Icon = service.icon
            return (
              <article key={service.title} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex size-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><Icon className="size-6" /></span>
                <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{service.desc}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section id="process" className="border-y border-teal-100 bg-teal-50/60 py-12 sm:py-16" aria-labelledby="process-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl space-y-3">
            <p className="text-xs font-bold tracking-wider text-teal-800 uppercase">Chuẩn bị trước buổi khám</p>
            <h2 id="process-title" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Quy trình tiếp nhận dự kiến</h2>
            <p className="text-sm leading-7 text-slate-600">Các bước minh họa để bạn hình dung hành trình thăm khám. Quy trình thực tế sẽ được cập nhật sau khi xác nhận.</p>
          </div>
          <ol className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(step => (
              <li key={step.step} className="space-y-3 rounded-2xl border border-teal-200 bg-white p-6">
                <span className="block font-mono text-3xl font-bold text-teal-700">{step.step}</span>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="contact-title">
        <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-bold tracking-wider text-sky-700 uppercase">Liên hệ</p>
            <h2 id="contact-title" className="text-2xl font-bold text-slate-900">Thông tin hỗ trợ bệnh nhân</h2>
            <p className="text-sm leading-7 text-slate-600">Các kênh liên hệ chính thức sẽ được công bố sau khi xác nhận. Website hiện chưa tiếp nhận lịch hẹn hoặc thông tin sức khỏe.</p>
          </div>
          <dl className="space-y-5 text-sm">
            {[
              { label: 'Số điện thoại', icon: PhoneIcon },
              { label: 'Địa chỉ phòng khám', icon: MapPinIcon },
              { label: 'Giờ tiếp nhận', icon: ClockIcon },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-sky-700" />
                  <div><dt className="font-semibold text-slate-900">{item.label}</dt><dd className="mt-1 text-slate-600">Đang chờ xác nhận và cập nhật.</dd></div>
                </div>
              )
            })}
          </dl>
        </div>
      </section>
    </div>
  )
}
