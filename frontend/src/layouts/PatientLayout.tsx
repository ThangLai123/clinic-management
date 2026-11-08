import { Link, Outlet } from 'react-router-dom';

export function PatientLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{
        backgroundColor: '#0284c7',
        color: '#ffffff',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
          🏥 Phòng Khám Tai Mũi Họng - Cổng Bệnh Nhân (Patient Portal)
        </div>
        <nav style={{ display: 'flex', gap: '16px' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Trang chủ</Link>
        </nav>
      </header>

      <main style={{ flex: 1, padding: '24px', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <Outlet />
      </main>

      <footer style={{ backgroundColor: '#f1f5f9', padding: '16px 24px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
        Hệ thống Quản lý Phòng khám Tai Mũi Họng © 2026 - Patient Area (Default Web)
      </footer>
    </div>
  );
}

