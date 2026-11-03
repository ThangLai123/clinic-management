import { AlertCircleIcon } from './Icons'

export default function NoticeBanner({ 
  title = "Chế độ xem trước giao diện (Task T2)", 
  message = "Hệ thống đang trong giai đoạn xây dựng nền tảng giao diện và điều hướng. Chưa kết nối API hoặc cơ sở dữ liệu.",
  variant = "info"
}) {
  const bgStyles = variant === 'warning' 
    ? 'bg-amber-50 border-amber-200 text-amber-900' 
    : 'bg-sky-50 border-sky-200 text-sky-900'
  const iconColor = variant === 'warning' ? 'text-amber-600' : 'text-sky-600'

  return (
    <div className={`border rounded-lg p-3.5 flex items-start gap-3 ${bgStyles}`} role="alert">
      <AlertCircleIcon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
      <div className="text-sm">
        <strong className="font-semibold block">{title}</strong>
        <p className="mt-0.5 opacity-90 leading-relaxed">{message}</p>
      </div>
    </div>
  )
}
