import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MedicalCrossIcon, MenuIcon, CloseIcon, CalendarIcon } from './Icons'

const publicLinks = [
  { to: '/#about', label: 'Giới thiệu' },
  { to: '/#services', label: 'Dịch vụ' },
  { to: '/#process', label: 'Quy trình' },
  { to: '/#contact', label: 'Liên hệ' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 rounded-lg py-2">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-700 text-white"><MedicalCrossIcon className="size-6" /></span>
            <span>
              <span className="block text-base font-bold tracking-tight text-slate-900 sm:text-lg">Clinic Management</span>
              <span className="block text-xs font-medium text-sky-700">Chuyên khoa Tai Mũi Họng</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
            {publicLinks.map(link => (
              <Link key={link.to} to={link.to} className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-800">{link.label}</Link>
            ))}
          </nav>
          <Link to="/booking-notice" className="hidden min-h-11 items-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-sky-800 lg:inline-flex">
            <CalendarIcon className="size-4" /> Đặt lịch khám
          </Link>
          <button type="button" onClick={() => setMobileMenuOpen(open => !open)} onKeyDown={event => { if (event.key === 'Escape') setMobileMenuOpen(false) }} className="flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden" aria-expanded={mobileMenuOpen} aria-controls="public-mobile-menu" aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}>
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <nav id="public-mobile-menu" aria-label="Điều hướng trên điện thoại" className="space-y-1 border-t border-slate-200 bg-white px-4 py-3 lg:hidden" onKeyDown={event => { if (event.key === 'Escape') setMobileMenuOpen(false) }}>
          {publicLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-800">{link.label}</Link>
          ))}
          <Link to="/booking-notice" onClick={() => setMobileMenuOpen(false)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white hover:bg-sky-800"><CalendarIcon className="size-4" /> Đặt lịch khám</Link>
        </nav>
      )}
    </header>
  )
}
