import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const titles = {
  '/': 'Thông tin dành cho bệnh nhân',
  '/booking-notice': 'Đặt lịch khám đang phát triển',
  '/staff/login': 'Đăng nhập nhân viên',
  '/receptionist': 'PREVIEW ONLY · Lễ tân',
  '/doctor': 'PREVIEW ONLY · Bác sĩ',
}

export default function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = `${titles[pathname] || 'Không tìm thấy trang'} | Clinic Management`
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}
