import { useCallback, useState } from 'react'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import NoticeBanner from '../components/NoticeBanner'

export default function StaffLayout({ role, menuItems, activeId, onSelectMenu, children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const closeSidebar = useCallback(() => setMobileSidebarOpen(false), [])
  const roleLabel = role === 'doctor' ? 'Bác sĩ' : 'Lễ tân'
  const activeLabel = menuItems.find(item => item.id === activeId)?.label || 'Tổng quan'

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <a className="skip-link" href="#staff-main">Đến nội dung làm việc</a>
      <Sidebar
        subsystemTitle={roleLabel}
        badgeColor={role === 'doctor' ? 'bg-teal-700' : 'bg-sky-700'}
        menuItems={menuItems}
        activeId={activeId}
        onSelectMenu={id => { onSelectMenu(id); closeSidebar() }}
        isOpen={mobileSidebarOpen}
        onClose={closeSidebar}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader title={`Phân hệ ${roleLabel} · ${activeLabel}`} role={role} mobileSidebarOpen={mobileSidebarOpen} onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main id="staff-main" tabIndex={-1} className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          <NoticeBanner
            title="PREVIEW ONLY · Chỉ xem trước trong development"
            message="Chưa đăng nhập hoặc được cấp quyền. Chỉ có dữ liệu mẫu để đánh giá giao diện; chưa kết nối API, dữ liệu bệnh nhân hoặc thao tác nghiệp vụ thật."
          />
          {children}
        </main>
      </div>
    </div>
  )
}
