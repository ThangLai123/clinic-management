import { useState, useEffect } from 'react';
import type { HealthCheckResponse } from '../types/health';

interface HealthStatusCardProps {
  title: string;
  endpoint: string;
  fetchHealth: () => Promise<HealthCheckResponse>;
}

export function HealthStatusCard({ title, endpoint, fetchHealth }: HealthStatusCardProps) {
  const [data, setData] = useState<HealthCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchHealth();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: '#1e293b' }}>{title}</h4>
        <button
          onClick={loadData}
          disabled={loading}
          style={{
            padding: '6px 12px',
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Đang kiểm tra...' : 'Kiểm tra lại'}
        </button>
      </div>

      <p style={{ margin: '8px 0', fontSize: '13px', color: '#64748b' }}>
        Endpoint: <code>{endpoint}</code>
      </p>

      {loading && <p style={{ color: '#0369a1' }}>Đang kết nối tới Backend Web API...</p>}

      {error && (
        <div style={{ color: '#b91c1c', backgroundColor: '#fee2e2', padding: '8px', borderRadius: '4px' }}>
          <strong>Lỗi kết nối:</strong> {error}
        </div>
      )}

      {data && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          padding: '10px',
          borderRadius: '4px',
          color: '#065f46'
        }}>
          <div><strong>Trạng thái:</strong> {data.status}</div>
          <div><strong>Actor / Role:</strong> {data.role}</div>
          <div><strong>Kiến trúc:</strong> Standard Controller (Không dùng Area)</div>
          <div><strong>Timestamp (UTC):</strong> {data.timestamp}</div>
        </div>
      )}
    </div>
  );
}

