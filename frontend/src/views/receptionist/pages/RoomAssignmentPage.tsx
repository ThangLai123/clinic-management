import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Phân phòng khám đã được loại bỏ theo mô hình chuẩn hóa SQL Server (Query 28.1).
 * Hệ thống sử dụng một hàng chờ khám bệnh ưu tiên thống nhất (/receptionist/queue).
 */
export const RoomAssignmentPage: React.FC = () => {
  return <Navigate to="/receptionist/queue" replace />;
};

export default RoomAssignmentPage;
