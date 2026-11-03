import { MenuIcon, ShieldIcon } from './Icons'

export default function TopHeader({ title = 'Trang làm việc', role, onOpenMobileSidebar, mobileSidebarOpen }) {
  const roleLabel = role === 'doctor' ? 'Bác sĩ' : 'Lễ tân'

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onOpenMobileSidebar} className="flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Mở danh mục thanh bên" aria-controls="staff-navigation" aria-expanded={mobileSidebarOpen}><MenuIcon className="size-5" /></button>
        <div>
          <h1 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h1>
          <p className="mt-1 text-xs font-semibold text-amber-800">PREVIEW ONLY · Chưa xác thực</p>
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-xs sm:w-auto sm:border-0 sm:pt-0">
        <ShieldIcon className="size-5 shrink-0 text-slate-500" />
        <dl className="space-y-1 text-slate-600">
          <div className="flex gap-2"><dt>Nhân viên:</dt><dd className="font-semibold text-slate-900">Chưa đăng nhập</dd></div>
          <div className="flex gap-2"><dt>Vai trò đang xem:</dt><dd>{roleLabel} (preview)</dd></div>
          <div className="flex gap-2"><dt>Ca trực:</dt><dd>Chưa có dữ liệu</dd></div>
        </dl>
        <div className="ml-auto space-y-1 sm:ml-0">
          <button type="button" disabled className="min-h-11 rounded-lg border border-slate-200 bg-slate-100 px-3 font-semibold text-slate-500" aria-describedby="logout-hint">Đăng xuất</button>
          <p id="logout-hint" className="text-slate-600">Chưa có phiên đăng nhập</p>
        </div>
      </div>
    </header>
  )
}
