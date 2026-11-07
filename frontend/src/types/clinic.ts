export type UserRole = 'PATIENT' | 'DOCTOR' | 'RECEPTIONIST' | 'ADMIN';

export type AppointmentStatus =
  | 'CHO_XAC_NHAN'     // Chờ xác nhận
  | 'DA_XAC_NHAN'      // Đã xác nhận
  | 'DA_TIEP_NHAN'     // Đã tiếp nhận vào phòng khám
  | 'DA_HUY'           // Đã hủy
  | 'KHONG_DEN';       // Không đến

export type ReceptionPriority = 'BINH_THUONG' | 'UU_TIEN' | 'CAP_BACH';

export type ReceptionStatus =
  | 'CHO_PHAN_PHONG'   // Chờ phân phòng
  | 'CHO_KHAM'         // Đã vào phòng, chờ bác sĩ khám
  | 'DANG_KHAM'        // Đang trong buồng khám
  | 'CHO_PHAT_THUOC'   // Đã khám xong, chờ phát thuốc
  | 'CHO_THANH_TOAN'   // Chờ thu ngân
  | 'HOAN_TAT';        // Đã hoàn tất cả quy trình

export type RoomStatus = 'SAN_SANG' | 'DANG_KHAM' | 'TAM_DUNG';

export type PrescriptionStatus =
  | 'BAN_NHAP'         // Bác sĩ đang soạn
  | 'CHO_PHAT'         // Đã hoàn tất, chờ quầy dược/lễ tân phát
  | 'DA_PHAT';         // Đã phát cho bệnh nhân

export type InvoiceStatus =
  | 'CHO_THANH_TOAN'   // Chưa thu tiền
  | 'DA_THANH_TOAN'    // Đã thanh toán đầy đủ
  | 'DA_HUY';          // Hóa đơn bị hủy

export type PaymentMethod = 'TIEN_MAT' | 'CHUYEN_KHOAN_QR' | 'THE_POS';

// Bệnh nhân
export interface Patient {
  id: string;              // Mã BN: BN-001
  fullName: string;
  birthDate: string;       // YYYY-MM-DD
  gender: 'Nam' | 'Nữ' | 'Khác';
  phoneNumber: string;
  address?: string;
  idCardNumber?: string;   // CCCD
  insuranceNumber?: string; // BHYT
  emergencyContact?: string;
  allergies?: string[];    // Tiền sử dị ứng
  medicalHistory?: string; // Tiền sử bệnh lý
  createdAt: string;
}

// Lịch hẹn
export interface Appointment {
  id: string;              // Mã LH: LH-20261107-001
  patientName: string;
  phoneNumber: string;
  birthDate?: string;
  gender?: 'Nam' | 'Nữ' | 'Khác';
  address?: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string;        // 08:00 - 08:30
  reason: string;
  symptoms: string[];
  symptomDuration?: string;
  notes?: string;
  status: AppointmentStatus;
  cancelReason?: string;
  createdAt: string;
}

// Tiếp nhận khám
export interface Reception {
  id: string;              // Mã TN: TN-001
  patientId: string;
  patientName: string;
  phoneNumber: string;
  appointmentId?: string;
  receptionType: 'DAT_LICH' | 'TRUC_TIEP';
  receptionTime: string;
  reason: string;
  symptoms: string[];
  priority: ReceptionPriority;
  assignedRoomId?: string;
  assignedDoctorName?: string;
  status: ReceptionStatus;
  vitalSigns?: {
    pulse?: number;        // Mạch (lần/phút)
    bloodPressure?: string; // Huyết áp (mmHg)
    temperature?: number;  // Nhiệt độ (°C)
    spO2?: number;         // SpO2 (%)
  };
}

// Phòng khám
export interface ClinicRoom {
  id: string;              // PK-01
  roomName: string;        // Phòng Khám Tai Mũi Họng 1
  doctorName: string;      // BS.CKI Lê Hoàng Nam
  specialty: string;       // Khám Tai Mũi Họng tổng quát
  status: RoomStatus;
  currentPatientId?: string;
  waitingCount: number;
}

// Thuốc trong kho
export interface Medicine {
  id: string;              // TH-001
  name: string;            // Amoxicillin + Acid Clavulanic
  brandName: string;       // Augmentin 1g
  activeIngredient: string; // Amoxicillin 875mg + Clavulanic 125mg
  dosageForm: string;      // Viên nén bao phim
  unit: string;            // Hộp / Vỉ / Viên / Lọ
  batchNumber: string;     // Lô 240801
  expiryDate: string;      // YYYY-MM-DD
  stockQuantity: number;
  minStockLevel: number;
  importPrice: number;     // Giá nhập (VND)
  retailPrice: number;     // Giá bán (VND)
  supplier: string;        // Công ty Dược TW 1
  isActive: boolean;
}

// Chi tiết thuốc trong đơn
export interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  unit: string;
  quantity: number;
  route: string;           // Đường uống, nhỏ tai, xịt mũi...
  dosage: string;          // 1 viên/lần
  frequency: string;       // 2 lần/ngày (Sáng 1, Tối 1)
  days: number;            // 5 ngày
  instructions: string;    // Uống sau ăn 30 phút
}

// Đơn thuốc
export interface Prescription {
  id: string;              // DT-001
  patientId: string;
  patientName: string;
  receptionId: string;
  doctorName: string;
  diagnosis: string;
  items: PrescriptionItem[];
  advice?: string;
  followUpDate?: string;   // Ngày hẹn tái khám
  status: PrescriptionStatus;
  dispensedAt?: string;
  dispensedBy?: string;
  createdAt: string;
}

// Khám chuyên khoa TMH
export interface EntExaminationData {
  receptionId: string;
  patientId: string;
  doctorName: string;
  // Bệnh sử
  symptomDuration: string;
  diseaseProgress: string;
  pastEntSurgeries?: string;
  currentMedications?: string;
  // Khám Tai
  earLeft: {
    status: 'CHUA_KHAM' | 'BINH_THUONG' | 'BAT_THUONG';
    externalEar?: string;
    earCanal?: string;
    tympanicMembrane?: string; // Màng nhĩ
    discharge?: string;        // Dịch tiết
    notes?: string;
  };
  earRight: {
    status: 'CHUA_KHAM' | 'BINH_THUONG' | 'BAT_THUONG';
    externalEar?: string;
    earCanal?: string;
    tympanicMembrane?: string;
    discharge?: string;
    notes?: string;
  };
  // Khám Mũi
  nose: {
    status: 'CHUA_KHAM' | 'BINH_THUONG' | 'BAT_THUONG';
    mucosa?: string;           // Niêm mạc
    septum?: string;           // Vách ngăn
    turbinates?: string;       // Cuốn mũi
    discharge?: string;        // Dịch mũi
    polyps?: string;
    sinusArea?: string;        // Vùng xoang
    notes?: string;
  };
  // Khám Họng - Thanh quản
  throat: {
    status: 'CHUA_KHAM' | 'BINH_THUONG' | 'BAT_THUONG';
    oralCavity?: string;       // Khoang miệng
    tonsils?: string;          // Amidan (Quá phát độ mấy, có hốc mủ không)
    pharyngealWall?: string;   // Thành sau họng (hạt xơ, viêm sung huyết)
    larynx?: string;           // Thanh quản
    notes?: string;
  };
  // Khám Đầu Cổ
  neck: {
    status: 'CHUA_KHAM' | 'BINH_THUONG' | 'BAT_THUONG';
    lymphNodes?: string;       // Hạch cổ
    salivaryGlands?: string;   // Tuyến nước bọt
    masses?: string;           // Khối u
    notes?: string;
  };
  // Nội soi
  endoscopy?: {
    performed: boolean;
    procedureType?: string;    // Nội soi Mũi - Xoang - Họng - Tai
    findings?: string;
    imageSampleUrl?: string;
  };
  // Kết luận
  diagnosis: string;           // Chẩn đoán chính (kèm mã ICD-10)
  differentialDiagnosis?: string; // Chẩn đoán phân biệt
  treatmentPlan: string;       // Hướng xử trí
  followUpDate?: string;
  isDraft: boolean;
}

// Bệnh án tổng hợp
export interface MedicalRecord {
  id: string;                  // BA-001
  receptionId: string;
  patientId: string;
  patientName: string;
  gender: string;
  birthDate: string;
  examDate: string;
  doctorName: string;
  chiefComplaint: string;      // Lý do khám
  medicalHistory: string;      // Bệnh sử & tiền sử
  examinationSummary: string;  // Tóm tắt kết quả Tai - Mũi - Họng
  endoscopySummary?: string;
  diagnosis: string;
  icdCode?: string;
  treatmentPlan: string;
  prescriptionId?: string;
  followUpDate?: string;
  status: 'BAN_NHAP' | 'HOAN_TAT';
  createdAt: string;
}

// Hóa đơn
export interface InvoiceItem {
  id: string;
  category: 'KHAM_BENH' | 'NOI_SOI' | 'THUOC' | 'THU_THUAT';
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;                  // HD-001
  receptionId: string;
  patientId: string;
  patientName: string;
  phoneNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  changeAmount: number;
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  cashierName: string;
  createdAt: string;
}

// Tài khoản nhân viên
export interface StaffUser {
  id: string;                  // NV-001
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST';
  specialty?: string;
  isActive: boolean;
  createdAt: string;
}

