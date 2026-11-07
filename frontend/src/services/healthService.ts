import { apiClient } from '../api/client';
import type { HealthCheckResponse } from '../types/health';

export const healthService = {
  getPublicHealth(): Promise<HealthCheckResponse> {
    return apiClient<HealthCheckResponse>('/api/v1/health');
  },

  getAdminHealth(): Promise<HealthCheckResponse> {
    return apiClient<HealthCheckResponse>('/api/v1/admin/health');
  },

  getDoctorHealth(): Promise<HealthCheckResponse> {
    return apiClient<HealthCheckResponse>('/api/v1/doctor/health');
  },

  getReceptionistHealth(): Promise<HealthCheckResponse> {
    return apiClient<HealthCheckResponse>('/api/v1/receptionist/health');
  },
};

