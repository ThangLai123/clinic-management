import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MedicalCrossIcon, ArrowLeftIcon, CloseIcon } from './Icons'

export default function Sidebar({
  subsystemTitle = "Phân hệ Nhân viên",
  badgeColor = "bg-sky-600",
  menuItems = [],
  activeId,
  onSelectMenu,
  isOpen = false,
  onClose
}) {
  const sidebarRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const opener = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = sidebarRef.current
    const controls = () => [...panel.querySelectorAll('a[href], button:not(:disabled)')]
    controls()[0]?.focus()
    function handleKey(event) {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const items = controls()
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 768px)')
    function handleResize() { if (desktop.matches) onClose() }
    panel.addEventListener('keydown', handleKey)
    desktop.addEventListener('change', handleResize)
    return () => {
      panel.removeEventListener('keydown', handleKey)
      desktop.removeEventListener('change', handleResize)
      document.body.style.overflow = originalOverflow
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-label="Đóng danh mục bên ngoài thanh điều hướng"
          tabIndex={-1}
        />
      )}

      {/* Sidebar container */}
      <aside
        ref={sidebarRef}
        id="staff-navigation"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-200 ease-in-out md:sticky md:top-0 md:h-screen md:shrink-0 md:translate-x-0 md:visible ${
          isOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'
        }`}
        aria-label="Điều hướng phân hệ làm việc"
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg ${badgeColor} text-white flex items-center justify-center font-bold`}>
              <MedicalCrossIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white block">Clinic Management</span>
              <span className="text-xs text-slate-400 font-medium">{subsystemTitle}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden shrink-0 size-11 flex items-center justify-center text-slate-300 hover:text-white rounded-md"
            aria-label="Đóng thanh điều hướng"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Subsystem label card */}
        <div className="p-3 mx-3 my-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
          <span className="text-slate-400 block mb-0.5">Không gian làm việc:</span>
          <span className="font-semibold text-white text-sm">{subsystemTitle}</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto" aria-label="Danh mục chức năng">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5">
            Chức năng nghiệp vụ
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeId === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectMenu?.(item.id)}
                className={`w-full min-h-11 flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="flex items-center gap-3 text-left">
                  {Icon && <Icon className="size-4 shrink-0" />}
                  <span>{item.label}</span>
                </span>
              </button>
            )
          })}
        </nav>

        {/* Bottom footer actions */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <Link
            to="/login"
            className="w-full min-h-11 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Về trang đăng nhập nhân viên</span>
          </Link>
          <div className="px-3 py-1.5 text-[11px] text-slate-300">
            PREVIEW ONLY · Chưa xác thực
          </div>
        </div>
      </aside>
    </>
  )
}
