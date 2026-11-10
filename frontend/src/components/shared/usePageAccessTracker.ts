import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { getBaseUrl } from '../../api/client';

export function usePageAccessTracker() {
  const location = useLocation();
  const { user, accessToken } = useAuth();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || !accessToken) return;
    if (user.roleCode !== 'DOCTOR' && user.roleCode !== 'RECEPTIONIST') return;

    const currentPath = location.pathname;

    // Chỉ theo dõi các route nghiệp vụ được phân quyền
    const isDoctorRoute = user.roleCode === 'DOCTOR' && (currentPath === '/doctor' || currentPath.startsWith('/doctor/'));
    const isReceptionistRoute = user.roleCode === 'RECEPTIONIST' && (currentPath === '/receptionist' || currentPath.startsWith('/receptionist/'));

    if (!isDoctorRoute && !isReceptionistRoute) return;

    // Chống gửi trùng lặp do React re-render hoặc StrictMode
    if (lastTrackedPathRef.current === currentPath) return;
    lastTrackedPathRef.current = currentPath;

    // Gửi sự kiện PAGE_ACCESS lên Backend
    fetch(`${getBaseUrl()}/api/access-logs/page`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
      body: JSON.stringify({ pagePath: currentPath }),
    }).catch(() => {
      // Bỏ qua lỗi ngầm để không làm ảnh hưởng trải nghiệm người dùng
    });
  }, [location.pathname, user, accessToken]);
}
