/**
 * TẬP TRUNG TOÀN BỘ CÁC TYPE VÀ ĐẶC TẢ THEO 25 BẢNG SQL SERVER (DATABASE: clinic_managerment)
 * Tài liệu chuẩn: clinic_managerment_25_bang_dac_ta_backend.md
 */

// ==========================================
// 1. ENUMS & CONSTANTS (CHECK CONSTRAINTS)
// ==========================================

// 01. roles & staff_users
export type RoleCode = 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST';
export type StaffUserStatus = 'ACTIVE' | 'LOCKED' | 'DISABLED';

// 04. patients
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'UNSPECIFIED';

// 05. patient_phone_links
export type PhoneRelationship = 'SELF' | 'PARENT_GUARDIAN' | 'CAREGIVER' | 'OTHER';

// 06. otp_challenges
export type OtpPurpose = 'HISTORY_LOOKUP';

// 07. appointments & 08. appointment_status_history
export type AppointmentSource = 'ONLINE' | 'PHONE' | 'AT_DESK';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | 'NO_SHOW';

// 09. receptions
export type ReceptionType = 'APPOINTMENT' | 'WALK_IN';
export type ReceptionStatus = 'WAITING' | 'IN_EXAM' | 'COMPLETED' | 'CANCELLED';

// 10. examinations
export type ExaminationStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// 11. ent_findings
export type EntRegion = 'EAR' | 'NOSE' | 'THROAT' | 'HEAD_NECK';
export type EntSide = 'LEFT' | 'RIGHT' | 'BOTH' | 'NA';

// 12. medical_records
export type MedicalRecordStatus = 'DRAFT' | 'FINALIZED';

// 13. medicines
export type MedicineStatus = 'ACTIVE' | 'INACTIVE';

// 14. medicine_lots
export type MedicineLotStatus = 'AVAILABLE' | 'BLOCKED' | 'QUARANTINED';

// 15. medicine_suppliers
export type SupplierStatus = 'ACTIVE' | 'INACTIVE';

// 16. inventory_movements
export type InventoryMovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

// 17. prescriptions
export type PrescriptionStatus = 'DRAFT' | 'SIGNED' | 'CANCELLED';

// 19. dispensations
export type DispensationStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

// 21. clinical_services
export type ClinicalServiceStatus = 'ACTIVE' | 'INACTIVE';

// 23. invoices
export type InvoiceStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'CANCELLED';

// 24. invoice_items
export type InvoiceItemType = 'SERVICE' | 'MEDICINE' | 'OTHER';

// 25. payments
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

// ==========================================
// 2. 25 DOMAIN ENTITIES (MAPPING SQL SERVER)
// ==========================================

// Table 01: roles
export interface RoleEntity {
  id: number;
  code: RoleCode;
  name: string;
  description?: string | null;
}

// Table 02: staff_users
export interface StaffUserEntity {
  id: number;
  staff_code: string;
  username: string;
  password_hash?: string; // Hidden in API responses
  full_name: string;
  email?: string | null;
  phone?: string | null;
  role_id: number;
  license_number?: string | null;
  status: StaffUserStatus;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
  // Navigation / join
  role?: RoleEntity;
}

// Table 03: staff_sessions
export interface StaffSessionEntity {
  id: number;
  staff_id: number;
  refresh_token_hash: string;
  created_at: string;
  expires_at: string;
  revoked_at?: string | null;
}

// Table 04: patients
export interface PatientEntity {
  id: number;
  patient_code: string;
  full_name: string;
  birth_date?: string | null;
  gender: Gender;
  phone?: string | null;
  address?: string | null;
  occupation?: string | null;
  insurance_number?: string | null;
  allergy_notes?: string | null;
  medical_history_notes?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  created_at: string;
  updated_at: string;
}

// Table 05: patient_phone_links
export interface PatientPhoneLinkEntity {
  id: number;
  patient_id: number;
  phone_e164: string;
  relationship_to_patient: PhoneRelationship;
  is_primary: boolean;
  verified_at?: string | null;
  created_at: string;
}

// Table 06: otp_challenges
export interface OtpChallengeEntity {
  id: number;
  phone_e164: string;
  purpose: OtpPurpose;
  otp_hash: string;
  expires_at: string;
  verified_at?: string | null;
  consumed_at?: string | null;
  attempt_count: number;
  max_attempts: number;
  created_at: string;
}

// Table 07: appointments
export interface AppointmentEntity {
  id: number;
  appointment_code: string;
  patient_id?: number | null;
  full_name: string;
  phone: string;
  birth_date?: string | null;
  gender: Gender;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:mm:ss
  symptoms?: string | null;
  notes?: string | null;
  source: AppointmentSource;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
  // Join helpers
  patient?: PatientEntity | null;
}

// Table 08: appointment_status_history
export interface AppointmentStatusHistoryEntity {
  id: number;
  appointment_id: number;
  old_status?: AppointmentStatus | null;
  new_status: AppointmentStatus;
  changed_by_staff_id?: number | null;
  reason?: string | null;
  changed_at: string;
  // Join
  staff?: StaffUserEntity | null;
}

// Table 09: receptions
export interface ReceptionEntity {
  id: number;
  reception_code: string;
  patient_id: number;
  appointment_id?: number | null;
  received_by_staff_id: number;
  reception_type: ReceptionType;
  status: ReceptionStatus;
  received_at: string;
  notes?: string | null;
  // Joins
  patient?: PatientEntity;
  appointment?: AppointmentEntity | null;
  staff?: StaffUserEntity;
}

// Table 10: examinations
export interface ExaminationEntity {
  id: number;
  examination_code: string;
  reception_id: number;
  doctor_staff_id: number;
  chief_complaint?: string | null;
  status: ExaminationStatus;
  started_at: string;
  completed_at?: string | null;
  // Joins
  reception?: ReceptionEntity;
  doctor?: StaffUserEntity;
  findings?: EntFindingEntity[];
}

// Table 11: ent_findings
export interface EntFindingEntity {
  id: number;
  examination_id: number;
  region: EntRegion;
  side: EntSide;
  description: string;
  created_at: string;
}

// Table 12: medical_records
export interface MedicalRecordEntity {
  id: number;
  medical_record_code: string;
  examination_id: number;
  diagnosis?: string | null;
  conclusion?: string | null;
  treatment_plan?: string | null;
  doctor_advice?: string | null;
  follow_up_date?: string | null;
  status: MedicalRecordStatus;
  finalized_at?: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  examination?: ExaminationEntity;
}

// Table 13: medicines
export interface MedicineEntity {
  id: number;
  medicine_code: string;
  medicine_name: string;
  active_ingredient?: string | null;
  strength?: string | null;
  dosage_form?: string | null;
  unit: string;
  sale_price: number;
  status: MedicineStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

// Table 14: medicine_lots
export interface MedicineLotEntity {
  id: number;
  medicine_id: number;
  lot_number: string;
  expiry_date: string;
  quantity: number;
  status: MedicineLotStatus;
  created_at: string;
  // Join
  medicine?: MedicineEntity;
}

// Table 15: medicine_suppliers
export interface MedicineSupplierEntity {
  id: number;
  supplier_code: string;
  supplier_name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  tax_code?: string | null;
  status: SupplierStatus;
  created_at: string;
}

// Table 16: inventory_movements
export interface InventoryMovementEntity {
  id: number;
  medicine_lot_id: number;
  movement_type: InventoryMovementType;
  quantity_change: number; // Positive for IN, Negative for OUT, Non-zero for ADJUSTMENT
  performed_by_staff_id: number;
  notes?: string | null;
  created_at: string;
  // Joins
  medicine_lot?: MedicineLotEntity;
  performed_by?: StaffUserEntity;
}

// Table 17: prescriptions
export interface PrescriptionEntity {
  id: number;
  prescription_code: string;
  examination_id: number;
  doctor_staff_id: number;
  status: PrescriptionStatus;
  instructions?: string | null;
  created_at: string;
  signed_at?: string | null;
  updated_at: string;
  // Joins
  examination?: ExaminationEntity;
  doctor?: StaffUserEntity;
  items?: PrescriptionItemEntity[];
}

// Table 18: prescription_items
export interface PrescriptionItemEntity {
  id: number;
  prescription_id: number;
  medicine_id: number;
  dosage: string;
  frequency: string;
  duration_days?: number | null;
  quantity: number;
  instructions?: string | null;
  created_at: string;
  // Join
  medicine?: MedicineEntity;
}

// Table 19: dispensations
export interface DispensationEntity {
  id: number;
  dispensation_code: string;
  prescription_id: number;
  dispensed_by_staff_id: number;
  status: DispensationStatus;
  dispensed_at?: string | null;
  notes?: string | null;
  created_at: string;
  // Joins
  prescription?: PrescriptionEntity;
  dispensed_by?: StaffUserEntity;
  items?: DispensationItemEntity[];
}

// Table 20: dispensation_items
export interface DispensationItemEntity {
  id: number;
  dispensation_id: number;
  prescription_item_id: number;
  medicine_lot_id: number;
  quantity: number;
  unit_price: number;
  // Joins
  medicine_lot?: MedicineLotEntity;
  prescription_item?: PrescriptionItemEntity;
}

// Table 21: clinical_services
export interface ClinicalServiceEntity {
  id: number;
  service_code: string;
  service_name: string;
  description?: string | null;
  price: number;
  status: ClinicalServiceStatus;
  created_at: string;
  updated_at: string;
}

// Table 22: visit_services
export interface VisitServiceEntity {
  id: number;
  reception_id: number;
  service_id: number;
  quantity: number;
  unit_price: number;
  notes?: string | null;
  created_at: string;
  // Join
  service?: ClinicalServiceEntity;
}

// Table 23: invoices
export interface InvoiceEntity {
  id: number;
  invoice_code: string;
  reception_id: number;
  created_by_staff_id: number;
  subtotal: number;
  discount: number;
  total_amount: number; // COMPUTED: subtotal - discount
  status: InvoiceStatus;
  created_at: string;
  paid_at?: string | null;
  notes?: string | null;
  // Joins
  reception?: ReceptionEntity;
  created_by?: StaffUserEntity;
  items?: InvoiceItemEntity[];
  payments?: PaymentEntity[];
}

// Table 24: invoice_items
export interface InvoiceItemEntity {
  id: number;
  invoice_id: number;
  item_type: InvoiceItemType;
  visit_service_id?: number | null;
  dispensation_item_id?: number | null;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number; // COMPUTED: quantity * unit_price
}

// Table 25: payments
export interface PaymentEntity {
  id: number;
  payment_code: string;
  invoice_id: number;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  received_by_staff_id: number;
  transaction_code?: string | null;
  paid_at?: string | null;
  created_at: string;
  notes?: string | null;
  // Join
  received_by?: StaffUserEntity;
}

// ==========================================
// 3. VIETNAMESE LABELS & DISPLAY HELPERS
// ==========================================

export const GENDER_MAP: Record<Gender, string> = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác',
  UNSPECIFIED: 'Chưa xác định',
};

export const GENDER_META_MAP: Record<Gender, { label: string; color: string }> = {
  MALE: { label: 'Nam', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  FEMALE: { label: 'Nữ', color: 'text-rose-700 bg-rose-50 border-rose-200' },
  OTHER: { label: 'Khác', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  UNSPECIFIED: { label: 'Chưa xác định', color: 'text-slate-600 bg-slate-50 border-slate-200' },
};

export const APPOINTMENT_STATUS_MAP: Record<AppointmentStatus, { label: string; color: string }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  CHECKED_IN: { label: 'Đã đến khám', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  CANCELLED: { label: 'Đã hủy', color: 'text-slate-600 bg-slate-100 border-slate-200' },
  NO_SHOW: { label: 'Không đến', color: 'text-red-700 bg-red-50 border-red-200' },
};

export const APPOINTMENT_SOURCE_MAP: Record<AppointmentSource, string> = {
  ONLINE: 'Website trực tuyến',
  PHONE: 'Tổng đài / Điện thoại',
  AT_DESK: 'Đăng ký tại quầy',
};

export const RECEPTION_TYPE_MAP: Record<ReceptionType, { label: string; badge: string }> = {
  APPOINTMENT: { label: 'Đã đặt lịch', badge: 'bg-blue-100 text-blue-800 border-blue-200 font-bold' },
  WALK_IN: { label: 'Đến trực tiếp', badge: 'bg-slate-100 text-slate-800 border-slate-200 font-medium' },
};

export const RECEPTION_STATUS_MAP: Record<ReceptionStatus, { label: string; color: string }> = {
  WAITING: { label: 'Đang chờ khám', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  IN_EXAM: { label: 'Đang khám', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  COMPLETED: { label: 'Đã hoàn tất', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  CANCELLED: { label: 'Đã hủy', color: 'text-slate-500 bg-slate-100 border-slate-200' },
};

export const EXAMINATION_STATUS_MAP: Record<ExaminationStatus, { label: string; color: string }> = {
  IN_PROGRESS: { label: 'Đang khám', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  COMPLETED: { label: 'Hoàn tất khám', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  CANCELLED: { label: 'Đã hủy', color: 'text-slate-500 bg-slate-100 border-slate-200' },
};

export const ENT_REGION_MAP: Record<EntRegion, string> = {
  EAR: 'Tai',
  NOSE: 'Mũi',
  THROAT: 'Họng',
  HEAD_NECK: 'Đầu / Cổ',
};

export const ENT_SIDE_MAP: Record<EntSide, string> = {
  LEFT: 'Bên trái',
  RIGHT: 'Bên phải',
  BOTH: 'Cả hai bên',
  NA: 'Không phân bên',
};

export const MEDICAL_RECORD_STATUS_MAP: Record<MedicalRecordStatus, { label: string; color: string }> = {
  DRAFT: { label: 'Bản nháp', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  FINALIZED: { label: 'Đã chốt bệnh án', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
};

export const MEDICINE_LOT_STATUS_MAP: Record<MedicineLotStatus, { label: string; color: string }> = {
  AVAILABLE: { label: 'Cho phép phát', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  BLOCKED: { label: 'Khóa lô', color: 'text-red-700 bg-red-50 border-red-200' },
  QUARANTINED: { label: 'Tạm giữ kiểm tra', color: 'text-amber-700 bg-amber-50 border-amber-200' },
};

export const PRESCRIPTION_STATUS_MAP: Record<PrescriptionStatus, { label: string; color: string }> = {
  DRAFT: { label: 'Đang kê (Nháp)', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  SIGNED: { label: 'Bác sĩ đã ký', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  CANCELLED: { label: 'Đã hủy', color: 'text-slate-500 bg-slate-100 border-slate-200' },
};

export const DISPENSATION_STATUS_MAP: Record<DispensationStatus, { label: string; color: string }> = {
  PENDING: { label: 'Chờ phát thuốc', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  COMPLETED: { label: 'Đã phát hoàn tất', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  CANCELLED: { label: 'Hủy phát', color: 'text-slate-500 bg-slate-100 border-slate-200' },
};

export const INVOICE_STATUS_MAP: Record<InvoiceStatus, { label: string; color: string }> = {
  UNPAID: { label: 'Chưa thanh toán', color: 'text-red-700 bg-red-50 border-red-200' },
  PARTIAL: { label: 'Thanh toán 1 phần', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  PAID: { label: 'Đã thu đủ', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  CANCELLED: { label: 'Đã hủy', color: 'text-slate-500 bg-slate-100 border-slate-200' },
};

export const PAYMENT_METHOD_MAP: Record<PaymentMethod, string> = {
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
};

export const PAYMENT_STATUS_MAP: Record<PaymentStatus, { label: string; color: string }> = {
  PENDING: { label: 'Chờ đối soát', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  SUCCESS: { label: 'Thành công', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  FAILED: { label: 'Thất bại', color: 'text-red-700 bg-red-50 border-red-200' },
  CANCELLED: { label: 'Đã hủy', color: 'text-slate-500 bg-slate-100 border-slate-200' },
};

export const STAFF_STATUS_MAP: Record<StaffUserStatus, { label: string; color: string }> = {
  ACTIVE: { label: 'Đang hoạt động', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  LOCKED: { label: 'Đang khóa', color: 'text-red-700 bg-red-50 border-red-200' },
  DISABLED: { label: 'Ngừng sử dụng', color: 'text-slate-500 bg-slate-100 border-slate-200' },
};

export const ROLE_MAP: Record<'ADMIN' | 'DOCTOR' | 'RECEPTIONIST', string> = {
  ADMIN: 'Quản trị viên',
  DOCTOR: 'Bác sĩ',
  RECEPTIONIST: 'Lễ tân',
};

export type PhoneLinkRelationship = PhoneRelationship;

export const PHONE_LINK_RELATIONSHIP_MAP: Record<PhoneRelationship, string> = {
  SELF: 'Bản thân (SELF)',
  PARENT_GUARDIAN: 'Cha/Mẹ/Giám hộ (PARENT_GUARDIAN)',
  CAREGIVER: 'Người chăm sóc (CAREGIVER)',
  OTHER: 'Khác (OTHER)',
};

export const INVENTORY_MOVEMENT_TYPE_MAP: Record<InventoryMovementType, string> = {
  IN: 'Nhập thêm vào kho (IN)',
  OUT: 'Xuất kho / Hủy hỏng (OUT)',
  ADJUSTMENT: 'Điều chỉnh kiểm kê (ADJUSTMENT)',
};

export type OtpChallenge = OtpChallengeEntity;
