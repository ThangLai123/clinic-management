import React from 'react';
import { Badge } from '../ui/Badge';
import {
  APPOINTMENT_STATUS_MAP,
  RECEPTION_STATUS_MAP,
  RECEPTION_TYPE_MAP,
  EXAMINATION_STATUS_MAP,
  MEDICAL_RECORD_STATUS_MAP,
  MEDICINE_LOT_STATUS_MAP,
  PRESCRIPTION_STATUS_MAP,
  DISPENSATION_STATUS_MAP,
  INVOICE_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  STAFF_STATUS_MAP,
} from '../../types/clinic';
import type {
  AppointmentStatus,
  ReceptionStatus,
  ReceptionType,
  ExaminationStatus,
  MedicalRecordStatus,
  PrescriptionStatus,
  DispensationStatus,
  InvoiceStatus,
  PaymentStatus,
  MedicineLotStatus,
  StaffUserStatus,
} from '../../types/clinic';

export interface StatusBadgeProps {
  type:
    | 'appointment'
    | 'reception'
    | 'receptionType'
    | 'examination'
    | 'medicalRecord'
    | 'prescription'
    | 'dispensation'
    | 'invoice'
    | 'payment'
    | 'lot'
    | 'staff'
    | 'priority'
    | 'room';
  value?: string | null;
  status?: string | null;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, status }) => {
  const val = (status || value || '') as string;

  if (type === 'appointment') {
    const meta = APPOINTMENT_STATUS_MAP[val as AppointmentStatus];
    if (meta) {
      const variant =
        val === 'CONFIRMED'
          ? 'blue'
          : val === 'CHECKED_IN'
          ? 'green'
          : val === 'PENDING'
          ? 'amber'
          : val === 'CANCELLED'
          ? 'slate'
          : 'rose';
      return <Badge variant={variant} dot>{meta.label}</Badge>;
    }
  }

  if (type === 'reception') {
    const meta = RECEPTION_STATUS_MAP[val as ReceptionStatus];
    if (meta) {
      const variant =
        val === 'WAITING'
          ? 'amber'
          : val === 'IN_EXAM'
          ? 'blue'
          : val === 'COMPLETED'
          ? 'green'
          : 'slate';
      return <Badge variant={variant} dot>{meta.label}</Badge>;
    }
  }

  if (type === 'receptionType') {
    const meta = RECEPTION_TYPE_MAP[val as ReceptionType];
    if (meta) {
      return (
        <span className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded text-[11px] border ${meta.badge}`}>
          {meta.label}
        </span>
      );
    }
  }

  if (type === 'examination') {
    const meta = EXAMINATION_STATUS_MAP[val as ExaminationStatus];
    if (meta) {
      const variant = val === 'IN_PROGRESS' ? 'blue' : val === 'COMPLETED' ? 'green' : 'slate';
      return <Badge variant={variant} dot>{meta.label}</Badge>;
    }
  }

  if (type === 'medicalRecord') {
    const meta = MEDICAL_RECORD_STATUS_MAP[val as MedicalRecordStatus];
    if (meta) {
      const variant = val === 'FINALIZED' ? 'green' : 'amber';
      return <Badge variant={variant} dot>{meta.label}</Badge>;
    }
  }

  if (type === 'prescription') {
    const meta = PRESCRIPTION_STATUS_MAP[val as PrescriptionStatus];
    if (meta) {
      const variant = val === 'SIGNED' ? 'green' : val === 'DRAFT' ? 'amber' : 'slate';
      return <Badge variant={variant} dot>{meta.label}</Badge>;
    }
  }

  if (type === 'dispensation') {
    const meta = DISPENSATION_STATUS_MAP[val as DispensationStatus];
    if (meta) {
      const variant = val === 'COMPLETED' ? 'green' : val === 'PENDING' ? 'amber' : 'slate';
      return <Badge variant={variant} dot>{meta.label}</Badge>;
    }
  }

  if (type === 'invoice') {
    const meta = INVOICE_STATUS_MAP[val as InvoiceStatus];
    if (meta) {
      const variant =
        val === 'PAID'
          ? 'green'
          : val === 'PARTIAL'
          ? 'amber'
          : val === 'UNPAID'
          ? 'rose'
          : 'slate';
      return <Badge variant={variant} dot>{meta.label}</Badge>;
    }
  }

  if (type === 'payment') {
    const meta = PAYMENT_STATUS_MAP[val as PaymentStatus];
    if (meta) {
      const variant =
        val === 'SUCCESS'
          ? 'green'
          : val === 'PENDING'
          ? 'amber'
          : val === 'FAILED'
          ? 'rose'
          : 'slate';
      return <Badge variant={variant} dot>{meta.label}</Badge>;
    }
  }

  if (type === 'lot') {
    const meta = MEDICINE_LOT_STATUS_MAP[val as MedicineLotStatus];
    if (meta) {
      const variant = val === 'AVAILABLE' ? 'green' : val === 'QUARANTINED' ? 'amber' : 'rose';
      return <Badge variant={variant} dot>{meta.label}</Badge>;
    }
  }

  if (type === 'staff') {
    const meta = STAFF_STATUS_MAP[val as StaffUserStatus];
    if (meta) {
      const variant = val === 'ACTIVE' ? 'green' : val === 'LOCKED' ? 'rose' : 'slate';
      return <Badge variant={variant} dot>{meta.label}</Badge>;
    }
  }

  return <Badge variant="slate">{val}</Badge>;
};

export default StatusBadge;
