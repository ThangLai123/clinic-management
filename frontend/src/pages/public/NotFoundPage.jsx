import { Link } from 'react-router-dom'
import { AlertCircleIcon, ArrowLeftIcon } from '../../components/Icons'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-6 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircleIcon className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-widest">Lỗi 404 • Không tìm thấy trang</span>
          <h1 className="text-2xl font-bold text-slate-900">Đường dẫn không tồn tại</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Trang bạn đang tìm kiếm không tồn tại trên hệ thống hoặc đã được điều chuyển. Vui lòng kiểm tra lại địa chỉ URL.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Trở về Trang chủ Clinic Management</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
