import { apiClient } from '../api/client';
import type { HealthCheckResponse } from '../types/health';

export const healthService = {
  getPublicHealth(): Promise<HealthCheckResponse> {
    return apiClient<HealthCheckResponse>('/api/health');
  },

  getAdminHealth(): Promise<HealthCheckResponse> {
    return apiClient<HealthCheckResponse>('/api/admin/health');
  },

  getDoctorHealth(): Promise<HealthCheckResponse> {
    return apiClient<HealthCheckResponse>('/api/doctor/health');
  },

  getReceptionistHealth(): Promise<HealthCheckResponse> {
    return apiClient<HealthCheckResponse>('/api/receptionist/health');
  },
};

