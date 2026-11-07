import React from 'react';
import { Badge } from '../ui/Badge';
import type {
  AppointmentStatus,
  ReceptionStatus,
  RoomStatus,
  PrescriptionStatus,
  InvoiceStatus,
  ReceptionPriority,
} from '../../types/clinic';

export const StatusBadge: React.FC<{
  type: 'appointment' | 'reception' | 'room' | 'prescription' | 'invoice' | 'priority';
  value: string;
}> = ({ type, value }) => {
  if (type === 'appointment') {
    const status = value as AppointmentStatus;
    switch (status) {
      case 'CHO_XAC_NHAN':
        return <Badge variant="amber" dot>Chờ xác nhận</Badge>;
      case 'DA_XAC_NHAN':
        return <Badge variant="blue" dot>Đã xác nhận</Badge>;
      case 'DA_TIEP_NHAN':
        return <Badge variant="green" dot>Đã tiếp nhận</Badge>;
      case 'DA_HUY':
        return <Badge variant="rose" dot>Đã hủy</Badge>;
      case 'KHONG_DEN':
        return <Badge variant="slate" dot>Không đến</Badge>;
      default:
        return <Badge variant="slate">{value}</Badge>;
    }
  }

  if (type === 'reception') {
    const status = value as ReceptionStatus;
    switch (status) {
      case 'CHO_PHAN_PHONG':
        return <Badge variant="amber" dot>Chờ phân phòng</Badge>;
      case 'CHO_KHAM':
        return <Badge variant="blue" dot>Chờ khám</Badge>;
      case 'DANG_KHAM':
        return <Badge variant="purple" dot>Đang khám</Badge>;
      case 'CHO_PHAT_THUOC':
        return <Badge variant="teal" dot>Chờ phát thuốc</Badge>;
      case 'CHO_THANH_TOAN':
        return <Badge variant="amber" dot>Chờ thanh toán</Badge>;
      case 'HOAN_TAT':
        return <Badge variant="green" dot>Hoàn tất</Badge>;
      default:
        return <Badge variant="slate">{value}</Badge>;
    }
  }

  if (type === 'priority') {
    const priority = value as ReceptionPriority;
    switch (priority) {
      case 'BINH_THUONG':
        return <Badge variant="slate">Bình thường</Badge>;
      case 'UU_TIEN':
        return <Badge variant="amber" dot>Ưu tiên</Badge>;
      case 'CAP_BACH':
        return <Badge variant="rose" dot>Cấp bách</Badge>;
      default:
        return <Badge variant="slate">{value}</Badge>;
    }
  }

  if (type === 'room') {
    const status = value as RoomStatus;
    switch (status) {
      case 'SAN_SANG':
        return <Badge variant="green" dot>Sẵn sàng</Badge>;
      case 'DANG_KHAM':
        return <Badge variant="blue" dot>Đang khám</Badge>;
      case 'TAM_DUNG':
        return <Badge variant="slate" dot>Tạm dừng</Badge>;
      default:
        return <Badge variant="slate">{value}</Badge>;
    }
  }

  if (type === 'prescription') {
    const status = value as PrescriptionStatus;
    switch (status) {
      case 'BAN_NHAP':
        return <Badge variant="slate">Bản nháp</Badge>;
      case 'CHO_PHAT':
        return <Badge variant="amber" dot>Chờ phát thuốc</Badge>;
      case 'DA_PHAT':
        return <Badge variant="green" dot>Đã phát thuốc</Badge>;
      default:
        return <Badge variant="slate">{value}</Badge>;
    }
  }

  if (type === 'invoice') {
    const status = value as InvoiceStatus;
    switch (status) {
      case 'CHO_THANH_TOAN':
        return <Badge variant="amber" dot>Chưa thanh toán</Badge>;
      case 'DA_THANH_TOAN':
        return <Badge variant="green" dot>Đã thanh toán</Badge>;
      case 'DA_HUY':
        return <Badge variant="rose" dot>Đã hủy</Badge>;
      default:
        return <Badge variant="slate">{value}</Badge>;
    }
  }

  return <Badge variant="slate">{value}</Badge>;
};

