/**
 * CLINIC MANAGEMENT DOMAIN TYPES
 * Chuẩn hóa 100% theo 25 bảng Microsoft SQL Server (database: clinic_managerment)
 * Tài liệu chuẩn: clinic_managerment_25_bang_dac_ta_backend.md
 */

export * from './database';

import type {
  RoleCode,
  StaffUserStatus,
  Gender,
  PhoneRelationship,
  AppointmentSource,
  AppointmentStatus,
  ReceptionType,
  ReceptionStatus,
  ExaminationStatus,
  EntRegion,
  EntSide,
  MedicalRecordStatus,
  MedicineStatus,
  MedicineLotStatus,
  SupplierStatus,
  InventoryMovementType,
  PrescriptionStatus,
  DispensationStatus,
  ClinicalServiceStatus,
  InvoiceStatus,
  InvoiceItemType,
  PaymentMethod,
  PaymentStatus,
} from './database';

// User Roles in clinic
export type UserRole = RoleCode;

// Table 04: patients
export interface Patient {
  id: string; // BIGINT as string for safe JS representation
  patientCode: string; // patient_code (UNIQUE)
  fullName: string; // full_name
  birthDate?: string; // birth_date (DATE)
  gender: Gender; // gender ('MALE' | 'FEMALE' | 'OTHER' | 'UNSPECIFIED')
  phone?: string; // phone
  address?: string; // address
  occupation?: string; // occupation
  insuranceNumber?: string; // insurance_number
  allergyNotes?: string; // allergy_notes
  medicalHistoryNotes?: string; // medical_history_notes
  emergencyContactName?: string; // emergency_contact_name
  emergencyContactPhone?: string; // emergency_contact_phone
  createdAt: string; // created_at
  updatedAt: string; // updated_at
}

// Table 05: patient_phone_links
export interface PatientPhoneLink {
  id: string;
  patientId: string;
  phoneE164: string; // phone_e164 (chuẩn quốc tế)
  relationshipToPatient: PhoneRelationship; // 'SELF' | 'PARENT_GUARDIAN' | 'CAREGIVER' | 'OTHER'
  isPrimary: boolean;
  verifiedAt?: string;
  createdAt: string;
}

// Table 07: appointments
export interface Appointment {
  id: string;
  appointmentCode: string; // appointment_code (UNIQUE)
  patientId?: string | null; // patient_id (NULL khi đặt online)
  fullName: string; // full_name
  phone: string; // phone
  birthDate?: string; // birth_date
  gender: Gender; // gender
  appointmentDate: string; // appointment_date (YYYY-MM-DD)
  appointmentTime: string; // appointment_time (HH:mm:ss)
  symptoms?: string; // symptoms (NVARCHAR(MAX))
  reason?: string; // UI alias / chief reason
  address?: string; // address
  notes?: string; // notes (NVARCHAR(500))
  source: AppointmentSource; // source ('ONLINE' | 'PHONE' | 'AT_DESK')
  status: AppointmentStatus; // status ('PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | 'NO_SHOW')
  cancelReason?: string; // cancel reason
  createdAt: string;
  updatedAt: string;
  // Computed / join helper
  timeSlot?: string; // Hiển thị khung giờ (UI helper)
  patientName?: string; // UI alias
  phoneNumber?: string; // UI alias
}

// Table 08: appointment_status_history
export interface AppointmentStatusHistory {
  id: string;
  appointmentId: string;
  oldStatus?: AppointmentStatus | null;
  newStatus: AppointmentStatus;
  changedByStaffId?: string | null;
  changedByStaffName?: string; // Join helper
  reason?: string | null;
  changedAt: string;
}

// Table 09: receptions
export interface Reception {
  id: string;
  receptionCode: string; // reception_code (UNIQUE)
  patientId: string; // patient_id (NOT NULL)
  patientName?: string; // Join helper
  appointmentId?: string | null; // appointment_id (NULL nếu đến trực tiếp)
  receivedByStaffId: string; // received_by_staff_id
  receivedByStaffName?: string; // Join helper
  receptionType: ReceptionType; // 'APPOINTMENT' | 'WALK_IN'
  status: ReceptionStatus; // 'WAITING' | 'IN_EXAM' | 'COMPLETED' | 'CANCELLED'
  receivedAt: string; // received_at (DATETIME2)
  notes?: string | null;
  // UI helpers for patient info
  patient?: Patient;
  appointment?: Appointment | null;
}

// Table 10: examinations
export interface Examination {
  id: string;
  examinationCode: string; // examination_code (UNIQUE)
  receptionId: string; // reception_id (UNIQUE)
  doctorStaffId: string; // doctor_staff_id
  doctorName?: string; // Join helper
  chiefComplaint?: string | null; // chief_complaint
  status: ExaminationStatus; // 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  startedAt: string;
  completedAt?: string | null;
  findings?: EntFinding[];
}

// Table 11: ent_findings
export interface EntFinding {
  id: string;
  examinationId: string;
  region: EntRegion; // 'EAR' | 'NOSE' | 'THROAT' | 'HEAD_NECK'
  side: EntSide; // 'LEFT' | 'RIGHT' | 'BOTH' | 'NA'
  description: string;
  createdAt: string;
}

// Table 12: medical_records
export interface MedicalRecord {
  id: string;
  medicalRecordCode: string; // medical_record_code (UNIQUE)
  examinationId: string; // examination_id (UNIQUE)
  diagnosis?: string | null; // diagnosis
  conclusion?: string | null; // conclusion
  treatmentPlan?: string | null; // treatment_plan
  doctorAdvice?: string | null; // doctor_advice
  followUpDate?: string | null; // follow_up_date (DATE)
  status: MedicalRecordStatus; // 'DRAFT' | 'FINALIZED'
  finalizedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // Join helpers
  patientId?: string;
  patientName?: string;
  doctorName?: string;
}

// Table 13: medicines
export interface Medicine {
  id: string;
  medicineCode: string; // medicine_code (UNIQUE)
  medicineName: string; // medicine_name
  activeIngredient?: string | null; // active_ingredient
  strength?: string | null; // strength
  dosageForm?: string | null; // dosage_form
  unit: string; // unit
  salePrice: number; // sale_price (DECIMAL)
  status: MedicineStatus; // 'ACTIVE' | 'INACTIVE'
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  // Computed / join helper
  totalStock?: number; // Tổng tồn kho từ các lô AVAILABLE
  name?: string; // UI alias
}

// Table 14: medicine_lots
export interface MedicineLot {
  id: string;
  medicineId: string;
  medicineCode?: string;
  medicineName?: string;
  lotNumber: string; // lot_number
  expiryDate: string; // expiry_date (DATE)
  quantity: number; // quantity (DECIMAL)
  status: MedicineLotStatus; // 'AVAILABLE' | 'BLOCKED' | 'QUARANTINED'
  createdAt: string;
}

// Table 15: medicine_suppliers
export interface MedicineSupplier {
  id: string;
  supplierCode: string; // supplier_code (UNIQUE)
  supplierName: string; // supplier_name
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  taxCode?: string | null;
  status: SupplierStatus; // 'ACTIVE' | 'INACTIVE'
  createdAt: string;
}

// Table 16: inventory_movements
export interface InventoryMovement {
  id: string;
  medicineLotId: string;
  lotNumber?: string;
  medicineName?: string;
  movementType: InventoryMovementType; // 'IN' | 'OUT' | 'ADJUSTMENT'
  quantityChange: number; // quantity_change (+/-)
  performedByStaffId: string;
  performedByStaffName?: string;
  notes?: string | null;
  createdAt: string;
}

// Table 17: prescriptions
export interface Prescription {
  id: string;
  prescriptionCode: string; // prescription_code (UNIQUE)
  examinationId: string;
  doctorStaffId: string;
  doctorName?: string;
  status: PrescriptionStatus; // 'DRAFT' | 'SIGNED' | 'CANCELLED'
  instructions?: string | null; // instructions (hướng dẫn chung)
  signedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items: PrescriptionItem[];
  // Join helpers
  patientId?: string;
  patientName?: string;
  receptionId?: string;
  diagnosis?: string;
}

// Table 18: prescription_items
export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  medicineId: string;
  medicineName?: string;
  unit?: string;
  dosage: string; // dosage (liều dùng)
  frequency: string; // frequency (tần suất)
  durationDays?: number | null; // duration_days (số ngày)
  quantity: number; // quantity (tổng số lượng kê)
  instructions?: string | null; // instructions
  createdAt: string;
}

// Table 19: dispensations
export interface Dispensation {
  id: string;
  dispensationCode: string; // dispensation_code (UNIQUE)
  prescriptionId: string;
  prescriptionCode?: string;
  patientName?: string;
  dispensedByStaffId: string;
  dispensedByStaffName?: string;
  status: DispensationStatus; // 'PENDING' | 'COMPLETED' | 'CANCELLED'
  dispensedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  items: DispensationItem[];
}

// Table 20: dispensation_items
export interface DispensationItem {
  id: string;
  dispensationId: string;
  prescriptionItemId: string;
  medicineLotId: string;
  lotNumber?: string;
  medicineName?: string;
  unit?: string;
  quantity: number; // quantity (số lượng thực phát)
  unitPrice: number; // unit_price (đơn giá bán tại thời điểm phát)
  totalPrice?: number; // Computed: quantity * unitPrice
}

// Table 21: clinical_services
export interface ClinicalService {
  id: string;
  serviceCode: string; // service_code (UNIQUE)
  serviceName: string; // service_name
  description?: string | null;
  price: number; // price
  status: ClinicalServiceStatus; // 'ACTIVE' | 'INACTIVE'
  createdAt: string;
  updatedAt: string;
}

// Table 22: visit_services
export interface VisitService {
  id: string;
  receptionId: string;
  serviceId: string;
  clinicalServiceId?: string;
  serviceCode?: string;
  serviceName?: string;
  quantity: number; // quantity
  unitPrice: number; // unit_price
  notes?: string | null;
  createdAt: string;
}

// Table 23: invoices
export interface Invoice {
  id: string;
  invoiceCode: string; // invoice_code (UNIQUE)
  receptionId: string;
  patientId?: string;
  patientName?: string;
  phoneNumber?: string;
  createdByStaffId: string;
  createdByStaffName?: string;
  subtotal: number; // subtotal (tổng dòng chi tiết)
  discount: number; // discount (số tiền giảm)
  totalAmount: number; // total_amount (COMPUTED: subtotal - discount)
  status: InvoiceStatus; // 'UNPAID' | 'PARTIAL' | 'PAID' | 'CANCELLED'
  paidAt?: string | null;
  notes?: string | null;
  createdAt: string;
  items: InvoiceItem[];
  payments: Payment[];
  // Computed helpers for UI
  paidAmount?: number; // Tổng các giao dịch payment SUCCESS
  remainingAmount?: number; // totalAmount - paidAmount
}

// Table 24: invoice_items
export interface InvoiceItem {
  id: string;
  invoiceId: string;
  itemType: InvoiceItemType; // 'SERVICE' | 'MEDICINE' | 'OTHER'
  visitServiceId?: string | null; // NULL nếu là MEDICINE hoặc OTHER
  dispensationItemId?: string | null; // NULL nếu là SERVICE hoặc OTHER
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number; // COMPUTED: quantity * unitPrice
}

// Table 25: payments
export interface Payment {
  id: string;
  paymentCode: string; // payment_code (UNIQUE)
  invoiceId: string;
  amount: number; // amount
  paymentMethod: PaymentMethod; // 'CASH' | 'BANK_TRANSFER'
  status: PaymentStatus; // 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  receivedByStaffId: string;
  receivedByStaffName?: string;
  transactionCode?: string | null; // Mã giao dịch ngân hàng
  paidAt?: string | null;
  notes?: string | null;
  createdAt: string;
}

// Table 02: staff_users
export interface StaffUser {
  id: string;
  staffCode: string; // staff_code (UNIQUE)
  username: string; // username (UNIQUE)
  fullName: string; // full_name
  email?: string | null;
  phone?: string | null;
  roleId: string;
  role: RoleCode; // 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST'
  licenseNumber?: string | null; // license_number
  status: StaffUserStatus; // 'ACTIVE' | 'LOCKED' | 'DISABLED'
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
