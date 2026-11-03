import { lazy, Suspense } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import LandingPage from '../pages/public/LandingPage'
import BookingNoticePage from '../pages/public/BookingNoticePage'
import NotFoundPage from '../pages/public/NotFoundPage'
import StaffLoginPage from '../pages/staff/StaffLoginPage'

// This UI availability rule is not authentication. Never ship real data in previews.
const previews = import.meta.env.DEV ? {
  receptionist: lazy(() => import('../pages/receptionist/ReceptionistDashboard')),
  doctor: lazy(() => import('../pages/doctor/DoctorDashboard')),
} : {}

function StaffPreview({ role }) {
  if (!import.meta.env.DEV) return <Navigate to="/staff/login" replace />
  const Dashboard = previews[role]
  return (
    <Suspense fallback={<p className="p-8 text-slate-600" role="status">Đang tải giao diện xem trước…</p>}>
      <Dashboard />
    </Suspense>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/booking-notice" element={<BookingNoticePage />} />
      </Route>

      <Route path="/staff/login" element={<StaffLoginPage />} />
      <Route path="/receptionist" element={<StaffPreview role="receptionist" />} />
      <Route path="/doctor" element={<StaffPreview role="doctor" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
