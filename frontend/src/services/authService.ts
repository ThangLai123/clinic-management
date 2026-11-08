import { getBaseUrl } from '../api/client';

export type StaffRole = 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST';

export interface CurrentUser {
  id: string;
  staffCode: string;
  username: string;
  fullName: string;
  roleCode: StaffRole;
  roleName: string;
  status: 'ACTIVE' | 'LOCKED' | 'DISABLED';
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: CurrentUser;
}

async function request(path: string, options: RequestInit): Promise<LoginResponse | void> {
  let response: Response;
  try {
    response = await fetch(`${getBaseUrl()}${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Không thể kết nối máy chủ. Hãy kiểm tra Backend và HTTPS.');
  }

  if (!response.ok) {
    if (response.status === 401) throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác, hoặc phiên đã hết hạn.');
    if (response.status === 429) throw new Error('Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.');
    if (response.status === 400) throw new Error('Thông tin đăng nhập không hợp lệ.');
    throw new Error('Không thể xử lý yêu cầu. Vui lòng thử lại.');
  }

  if (response.status === 204) return;
  return response.json() as Promise<LoginResponse>;
}

let pendingRefresh: Promise<LoginResponse> | null = null;

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    return await request('/api/auth/login', {
      method: 'POST', body: JSON.stringify({ username, password }),
    }) as LoginResponse;
  },

  refresh(): Promise<LoginResponse> {
    // React StrictMode gọi effect hai lần trong Development: chỉ gửi một request.
    pendingRefresh ??= (request('/api/auth/refresh', { method: 'POST' }) as Promise<LoginResponse>)
      .finally(() => { pendingRefresh = null; });
    return pendingRefresh;
  },

  async logout(): Promise<void> {
    await request('/api/auth/logout', { method: 'POST' });
  },
};
