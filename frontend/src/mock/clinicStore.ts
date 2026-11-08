import { useState, useEffect } from 'react';
import type {
  RoleEntity,
  StaffUser,
  Patient,
  PatientPhoneLink,
  PhoneRelationship,
  OtpChallenge,
  Appointment,
  AppointmentStatusHistory,
  Reception,
  Examination,
  EntFinding,
  MedicalRecord,
  Medicine,
  MedicineLot,
  MedicineLotStatus,
  MedicineSupplier,
  InventoryMovement,
  Prescription,
  PrescriptionItem,
  Dispensation,
  DispensationItem,
  ClinicalService,
  VisitService,
  Invoice,
  InvoiceItem,
  Payment,
  AppointmentStatus,
  ReceptionStatus,
  ExaminationStatus,
  MedicalRecordStatus,
  PrescriptionStatus,
  DispensationStatus,
  InvoiceStatus,
  PaymentMethod,
  PaymentStatus,
  StaffUserStatus,
  Gender,
  EntRegion,
  EntSide,
} from '../types/clinic';

// ==========================================
// DỮ LIỆU KHỞI TẠO DEMO CHUẨN 25 BẢNG SQL SERVER
// ==========================================

// 01. roles
const INITIAL_ROLES: RoleEntity[] = [
  { id: 1, code: 'ADMIN', name: 'Quản trị viên hệ thống', description: 'Toàn quyền quản lý tài khoản và giám sát vận hành' },
  { id: 2, code: 'DOCTOR', name: 'Bác sĩ chuyên khoa', description: 'Khám bệnh, chẩn đoán, nội soi NBI, lập bệnh án và kê đơn thuốc' },
  { id: 3, code: 'RECEPTIONIST', name: 'Lễ tân & Điều phối dược', description: 'Quản lý lịch hẹn, tiếp nhận, kho thuốc, phát thuốc và thu viện phí' },
];

// 02. staff_users
const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: '1',
    staffCode: 'NV-ADM-001',
    username: 'admin',
    fullName: 'TS.BS Trần Quốc Hưng',
    email: 'hung.tq@clinic.ent.vn',
    phone: '0901234567',
    roleId: '1',
    role: 'ADMIN',
    licenseNumber: 'CCHN-00124/HN-BYT',
    status: 'ACTIVE',
    lastLoginAt: '2026-11-07 20:30',
    createdAt: '2026-01-01',
    updatedAt: '2026-11-01',
  },
  {
    id: '2',
    staffCode: 'NV-DOC-001',
    username: 'doctor.nam',
    fullName: 'BS.CKI Lê Hoàng Nam',
    email: 'nam.lh@clinic.ent.vn',
    phone: '0902345678',
    roleId: '2',
    role: 'DOCTOR',
    licenseNumber: 'CCHN-00892/HN-BYT',
    status: 'ACTIVE',
    lastLoginAt: '2026-11-07 19:45',
    createdAt: '2026-01-10',
    updatedAt: '2026-11-01',
  },
  {
    id: '3',
    staffCode: 'NV-REC-001',
    username: 'reception.trang',
    fullName: 'Hoàng Thu Trang',
    email: 'trang.ht@clinic.ent.vn',
    phone: '0903456789',
    roleId: '3',
    role: 'RECEPTIONIST',
    licenseNumber: null,
    status: 'ACTIVE',
    lastLoginAt: '2026-11-07 18:20',
    createdAt: '2026-02-15',
    updatedAt: '2026-11-01',
  },
];

// 04. patients
const INITIAL_PATIENTS: Patient[] = [
  {
    id: '1',
    patientCode: 'BN-1001',
    fullName: 'Nguyễn Văn An',
    birthDate: '1988-05-14',
    gender: 'MALE',
    phone: '0912345678',
    address: 'Số 15 Phố Huế, Q. Hoàn Kiếm, Hà Nội',
    occupation: 'Kỹ sư phần mềm',
    insuranceNumber: 'DN4010123456789',
    allergyNotes: 'Dị ứng Penicillin, dị ứng phấn hoa',
    medicalHistoryNotes: 'Viêm mũi xoang mạn tính 5 năm, hen phế quản nhẹ',
    emergencyContactName: 'Nguyễn Thị Mai (Vợ)',
    emergencyContactPhone: '0987654321',
    createdAt: '2026-11-01 08:30:00',
    updatedAt: '2026-11-07 08:30:00',
  },
  {
    id: '2',
    patientCode: 'BN-1002',
    fullName: 'Trần Thị Thu Hà',
    birthDate: '1995-10-22',
    gender: 'FEMALE',
    phone: '0988776655',
    address: 'Số 42 Cầu Giấy, Q. Cầu Giấy, Hà Nội',
    occupation: 'Giáo viên',
    insuranceNumber: 'GD4019988776655',
    allergyNotes: 'Không ghi nhận',
    medicalHistoryNotes: 'Từng nạo VA lúc 8 tuổi',
    emergencyContactName: 'Lê Thị Lan (Mẹ)',
    emergencyContactPhone: '0977112233',
    createdAt: '2026-11-03 09:15:00',
    updatedAt: '2026-11-07 09:15:00',
  },
  {
    id: '3',
    patientCode: 'BN-1003',
    fullName: 'Lê Hoàng Long (Bé)',
    birthDate: '2020-03-10',
    gender: 'MALE',
    phone: '0903456789', // Số của mẹ/bố
    address: 'Tòa Landmark 2, KĐT Ngoại Giao Đoàn, Hà Nội',
    occupation: 'Trẻ em',
    insuranceNumber: 'TE1010022334455',
    allergyNotes: 'Dị ứng tôm cua',
    medicalHistoryNotes: 'Viêm tai giữa thanh dịch tái phát',
    emergencyContactName: 'Lê Văn Tuấn (Bố)',
    emergencyContactPhone: '0903456789',
    createdAt: '2026-11-05 14:00:00',
    updatedAt: '2026-11-07 14:00:00',
  },
];

// 05. patient_phone_links (Hỗ trợ 1 SĐT nhiều bệnh nhân)
const INITIAL_PHONE_LINKS: PatientPhoneLink[] = [
  {
    id: '1',
    patientId: '1',
    phoneE164: '+84912345678',
    relationshipToPatient: 'SELF',
    isPrimary: true,
    verifiedAt: '2026-11-01 08:35:00',
    createdAt: '2026-11-01 08:30:00',
  },
  {
    id: '2',
    patientId: '2',
    phoneE164: '+84988776655',
    relationshipToPatient: 'SELF',
    isPrimary: true,
    verifiedAt: '2026-11-03 09:20:00',
    createdAt: '2026-11-03 09:15:00',
  },
  {
    id: '3',
    patientId: '3',
    phoneE164: '+84903456789',
    relationshipToPatient: 'PARENT_GUARDIAN',
    isPrimary: true,
    verifiedAt: '2026-11-05 14:05:00',
    createdAt: '2026-11-05 14:00:00',
  },
];

// 07. appointments
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    appointmentCode: 'AP202611070001',
    patientId: '1',
    fullName: 'Nguyễn Văn An',
    patientName: 'Nguyễn Văn An',
    phone: '0912345678',
    phoneNumber: '0912345678',
    birthDate: '1988-05-14',
    gender: 'MALE',
    appointmentDate: '2026-11-07',
    appointmentTime: '08:30:00',
    symptoms: 'Nghẹt mũi kéo dài, đau căng tức vùng trán xoang trán',
    notes: 'Có tiền sử viêm xoang dị ứng, muốn khám sớm',
    source: 'ONLINE',
    status: 'CHECKED_IN',
    createdAt: '2026-11-06 19:20:00',
    updatedAt: '2026-11-07 08:15:00',
    timeSlot: '08:30 - 09:00',
  },
  {
    id: '2',
    appointmentCode: 'AP202611070002',
    patientId: '2',
    fullName: 'Trần Thị Thu Hà',
    patientName: 'Trần Thị Thu Hà',
    phone: '0988776655',
    phoneNumber: '0988776655',
    birthDate: '1995-10-22',
    gender: 'FEMALE',
    appointmentDate: '2026-11-07',
    appointmentTime: '09:00:00',
    symptoms: 'Đau rát họng khi nuốt, sốt nhẹ 38 độ C, khàn tiếng',
    notes: 'Muốn khám và nội soi thanh quản',
    source: 'ONLINE',
    status: 'CONFIRMED',
    createdAt: '2026-11-06 20:15:00',
    updatedAt: '2026-11-07 07:30:00',
    timeSlot: '09:00 - 09:30',
  },
  {
    id: '3',
    appointmentCode: 'AP202611070003',
    patientId: null,
    fullName: 'Phạm Minh Đức',
    patientName: 'Phạm Minh Đức',
    phone: '0934123456',
    phoneNumber: '0934123456',
    birthDate: '1976-12-05',
    gender: 'MALE',
    appointmentDate: '2026-11-07',
    appointmentTime: '10:00:00',
    symptoms: 'Ù tai trái, giảm thính lực đột ngột sau khi đi bơi',
    notes: 'Cần kiểm tra màng nhĩ',
    source: 'PHONE',
    status: 'PENDING',
    createdAt: '2026-11-07 07:45:00',
    updatedAt: '2026-11-07 07:45:00',
    timeSlot: '10:00 - 10:30',
  },
];

// 08. appointment_status_history
const INITIAL_APT_HISTORY: AppointmentStatusHistory[] = [
  {
    id: '1',
    appointmentId: '1',
    oldStatus: 'PENDING',
    newStatus: 'CONFIRMED',
    changedByStaffId: '3',
    changedByStaffName: 'Hoàng Thu Trang',
    reason: 'Đã gọi điện thoại xác nhận giờ hẹn với người bệnh',
    changedAt: '2026-11-06 20:00:00',
  },
  {
    id: '2',
    appointmentId: '1',
    oldStatus: 'CONFIRMED',
    newStatus: 'CHECKED_IN',
    changedByStaffId: '3',
    changedByStaffName: 'Hoàng Thu Trang',
    reason: 'Người bệnh đã có mặt tại quầy lễ tân',
    changedAt: '2026-11-07 08:15:00',
  },
  {
    id: '3',
    appointmentId: '2',
    oldStatus: 'PENDING',
    newStatus: 'CONFIRMED',
    changedByStaffId: '3',
    changedByStaffName: 'Hoàng Thu Trang',
    reason: 'Xác nhận lịch hẹn tự động qua tin nhắn',
    changedAt: '2026-11-07 07:30:00',
  },
];

// 09. receptions
const INITIAL_RECEPTIONS: Reception[] = [
  {
    id: '1',
    receptionCode: 'RC202611070001',
    patientId: '1',
    patientName: 'Nguyễn Văn An',
    appointmentId: '1',
    receivedByStaffId: '3',
    receivedByStaffName: 'Hoàng Thu Trang',
    receptionType: 'APPOINTMENT',
    status: 'IN_EXAM',
    receivedAt: '2026-11-07 08:15:00',
    notes: 'Bệnh nhân có lịch hẹn trước, đến đúng giờ',
  },
  {
    id: '2',
    receptionCode: 'RC202611070002',
    patientId: '3',
    patientName: 'Lê Hoàng Long (Bé)',
    appointmentId: null,
    receivedByStaffId: '3',
    receivedByStaffName: 'Hoàng Thu Trang',
    receptionType: 'WALK_IN',
    status: 'WAITING',
    receivedAt: '2026-11-07 08:25:00',
    notes: 'Trẻ quấy khóc nhiều do đau tai phải, đến trực tiếp không đặt trước',
  },
];

// 10. examinations
const INITIAL_EXAMINATIONS: Examination[] = [
  {
    id: '1',
    examinationCode: 'EX202611070001',
    receptionId: '1',
    doctorStaffId: '2',
    doctorName: 'BS.CKI Lê Hoàng Nam',
    chiefComplaint: 'Nghẹt mũi, nhức đầu vùng trán, chảy dịch mũi vàng xanh',
    status: 'IN_PROGRESS',
    startedAt: '2026-11-07 08:20:00',
    completedAt: null,
  },
];

// 11. ent_findings
const INITIAL_ENT_FINDINGS: EntFinding[] = [
  {
    id: '1',
    examinationId: '1',
    region: 'NOSE',
    side: 'BOTH',
    description: 'Niêm mạc cuốn mũi hai bên phù nề, xung huyết đỏ rực; khe giữa có mủ nhầy đặc màu vàng xanh',
    createdAt: '2026-11-07 08:25:00',
  },
  {
    id: '2',
    examinationId: '1',
    region: 'THROAT',
    side: 'NA',
    description: 'Thành sau họng có dải dịch mủ nhầy chảy từ vòm họng xuống; niêm mạc xung huyết hạt nhẹ',
    createdAt: '2026-11-07 08:26:00',
  },
  {
    id: '3',
    examinationId: '1',
    region: 'EAR',
    side: 'BOTH',
    description: 'Màng nhĩ hai bên sáng bóng, nón sáng rõ, không ứ đọng dịch thanh dịch',
    createdAt: '2026-11-07 08:27:00',
  },
];

// 12. medical_records
const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: '1',
    medicalRecordCode: 'MR202611070001',
    examinationId: '1',
    diagnosis: 'Viêm mũi xoang cấp mủ đợt cấp trên nền viêm xoang dị ứng mạn tính (ICD-10: J01.0 / J30.4)',
    conclusion: 'Viêm mũi xoang cấp bùng phát kèm chảy mủ khe giữa, cần dùng kháng sinh phối hợp và xịt mũi chuyên sâu',
    treatmentPlan: 'Kháng sinh Augmentin 1g x 7 ngày, thuốc xịt Avamys, rửa mũi xoang đẳng trương hàng ngày',
    doctorAdvice: 'Uống thuốc đúng giờ, súc họng nước muối, đeo khẩu trang khi ra ngoài, tái khám nếu sốt cao hoặc đau đầu tăng',
    followUpDate: '2026-11-14',
    status: 'DRAFT',
    finalizedAt: null,
    createdAt: '2026-11-07 08:30:00',
    updatedAt: '2026-11-07 08:35:00',
    patientId: '1',
    patientName: 'Nguyễn Văn An',
    doctorName: 'BS.CKI Lê Hoàng Nam',
  },
];

// 13. medicines
const INITIAL_MEDICINES: Medicine[] = [
  {
    id: '1',
    medicineCode: 'TH-AUG-1G',
    medicineName: 'Augmentin 1g',
    activeIngredient: 'Amoxicillin 875mg + Clavulanic acid 125mg',
    strength: '1g',
    dosageForm: 'Viên nén bao phim',
    unit: 'Viên',
    salePrice: 18500,
    status: 'ACTIVE',
    notes: 'Kháng sinh phổ rộng beta-lactamase',
    createdAt: '2026-01-01',
    updatedAt: '2026-11-01',
    name: 'Augmentin 1g (Amoxicillin + Acid Clavulanic)',
    totalStock: 350,
  },
  {
    id: '2',
    medicineCode: 'TH-AVA-120',
    medicineName: 'Avamys Nasal Spray 120 sprays',
    activeIngredient: 'Fluticasone furoate 27.5mcg/liều',
    strength: '27.5mcg',
    dosageForm: 'Hỗn dịch xịt mũi',
    unit: 'Chai',
    salePrice: 245000,
    status: 'ACTIVE',
    notes: 'Corticoid xịt mũi điều trị viêm mũi dị ứng',
    createdAt: '2026-01-01',
    updatedAt: '2026-11-01',
    name: 'Avamys Nasal Spray 120 liều',
    totalStock: 48,
  },
  {
    id: '3',
    medicineCode: 'TH-OTI-15ML',
    medicineName: 'Otifar Ear Drops 15ml',
    activeIngredient: 'Cloramphenicol 0.5% + Dexamethason 0.05%',
    strength: '15ml',
    dosageForm: 'Dung dịch nhỏ tai',
    unit: 'Lọ',
    salePrice: 32000,
    status: 'ACTIVE',
    notes: 'Điều trị viêm tai ngoài, viêm tai giữa',
    createdAt: '2026-01-01',
    updatedAt: '2026-11-01',
    name: 'Otifar Ear Drops 15ml',
    totalStock: 12, // Low stock alert
  },
  {
    id: '4',
    medicineCode: 'TH-MED-16MG',
    medicineName: 'Medrol 16mg',
    activeIngredient: 'Methylprednisolone 16mg',
    strength: '16mg',
    dosageForm: 'Viên nén',
    unit: 'Viên',
    salePrice: 5200,
    status: 'ACTIVE',
    notes: 'Chống viêm mạnh đường uống',
    createdAt: '2026-01-01',
    updatedAt: '2026-11-01',
    name: 'Medrol 16mg (Methylprednisolone)',
    totalStock: 500,
  },
  {
    id: '5',
    medicineCode: 'TH-TEL-180',
    medicineName: 'Telfast HD 180mg',
    activeIngredient: 'Fexofenadine hydrochloride 180mg',
    strength: '180mg',
    dosageForm: 'Viên nén bao phim',
    unit: 'Viên',
    salePrice: 12000,
    status: 'ACTIVE',
    notes: 'Kháng histamin H1 thế hệ 2 không gây buồn ngủ',
    createdAt: '2026-01-01',
    updatedAt: '2026-11-01',
    name: 'Telfast HD 180mg (Fexofenadine)',
    totalStock: 280,
  },
];

// 14. medicine_lots
const INITIAL_MEDICINE_LOTS: MedicineLot[] = [
  {
    id: '1',
    medicineId: '1',
    medicineCode: 'TH-AUG-1G',
    medicineName: 'Augmentin 1g',
    lotNumber: 'L240812-AUG',
    expiryDate: '2027-08-30',
    quantity: 350,
    status: 'AVAILABLE',
    createdAt: '2026-08-15',
  },
  {
    id: '2',
    medicineId: '2',
    medicineCode: 'TH-AVA-120',
    medicineName: 'Avamys Nasal Spray 120 sprays',
    lotNumber: 'L240605-AVA',
    expiryDate: '2026-12-31',
    quantity: 48,
    status: 'AVAILABLE',
    createdAt: '2026-06-10',
  },
  {
    id: '3',
    medicineId: '3',
    medicineCode: 'TH-OTI-15ML',
    medicineName: 'Otifar Ear Drops 15ml',
    lotNumber: 'L231201-OTI',
    expiryDate: '2026-11-30', // Near expiry
    quantity: 12,
    status: 'AVAILABLE',
    createdAt: '2025-12-05',
  },
  {
    id: '4',
    medicineId: '4',
    medicineCode: 'TH-MED-16MG',
    medicineName: 'Medrol 16mg',
    lotNumber: 'L240901-MED',
    expiryDate: '2027-09-15',
    quantity: 500,
    status: 'AVAILABLE',
    createdAt: '2026-09-05',
  },
  {
    id: '5',
    medicineId: '5',
    medicineCode: 'TH-TEL-180',
    medicineName: 'Telfast HD 180mg',
    lotNumber: 'L241010-TEL',
    expiryDate: '2027-10-20',
    quantity: 280,
    status: 'AVAILABLE',
    createdAt: '2026-10-15',
  },
];

// 15. medicine_suppliers
const INITIAL_SUPPLIERS: MedicineSupplier[] = [
  {
    id: '1',
    supplierCode: 'NCC-VIMED',
    supplierName: 'Công ty Cổ phần Dược phẩm Trung ương Vimedimex',
    phone: '02438254298',
    email: 'contact@vimedimex.com.vn',
    address: 'Số 138 Giảng Võ, Ba Đình, Hà Nội',
    taxCode: '0100108398',
    status: 'ACTIVE',
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    supplierCode: 'NCC-DUOCTW1',
    supplierName: 'Công ty Cổ phần Dược phẩm CPC1 Hà Nội',
    phone: '02437892182',
    email: 'kinhdoanh@cpc1hn.com.vn',
    address: 'Cụm công nghiệp Hà Bình Phương, Thường Tín, Hà Nội',
    taxCode: '0103734023',
    status: 'ACTIVE',
    createdAt: '2026-01-01',
  },
];

// 16. inventory_movements
const INITIAL_INVENTORY_MOVEMENTS: InventoryMovement[] = [
  {
    id: '1',
    medicineLotId: '1',
    lotNumber: 'L240812-AUG',
    medicineName: 'Augmentin 1g',
    movementType: 'IN',
    quantityChange: 400,
    performedByStaffId: '3',
    performedByStaffName: 'Hoàng Thu Trang',
    notes: 'Nhập thuốc theo chứng từ phiếu giấy số HĐ-88219 Vimedimex',
    createdAt: '2026-08-15 09:30:00',
  },
  {
    id: '2',
    medicineLotId: '1',
    lotNumber: 'L240812-AUG',
    medicineName: 'Augmentin 1g',
    movementType: 'OUT',
    quantityChange: -50,
    performedByStaffId: '3',
    performedByStaffName: 'Hoàng Thu Trang',
    notes: 'Phát theo đơn thuốc cho bệnh nhân đợt khám sáng',
    createdAt: '2026-11-06 10:15:00',
  },
];

// 17. prescriptions & 18. prescription_items
const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: '1',
    prescriptionCode: 'RX202611070001',
    examinationId: '1',
    doctorStaffId: '2',
    doctorName: 'BS.CKI Lê Hoàng Nam',
    status: 'SIGNED',
    instructions: 'Uống thuốc đúng liều, sau bữa ăn no; rửa mũi hằng ngày bằng nước muối ấm',
    signedAt: '2026-11-07 08:35:00',
    createdAt: '2026-11-07 08:30:00',
    updatedAt: '2026-11-07 08:35:00',
    patientId: '1',
    patientName: 'Nguyễn Văn An',
    items: [
      {
        id: '1',
        prescriptionId: '1',
        medicineId: '1',
        medicineName: 'Augmentin 1g',
        unit: 'Viên',
        dosage: '1 viên / lần',
        frequency: '2 lần / ngày (Sáng 1 - Tối 1 sau ăn)',
        durationDays: 7,
        quantity: 14,
        instructions: 'Uống sau bữa ăn no 15 phút, không bẻ vụn viên',
        createdAt: '2026-11-07 08:32:00',
      },
      {
        id: '2',
        prescriptionId: '1',
        medicineId: '2',
        medicineName: 'Avamys Nasal Spray 120 sprays',
        unit: 'Chai',
        dosage: '2 nhát xịt mỗi bên mũi',
        frequency: '1 lần / ngày vào buổi sáng',
        durationDays: 30,
        quantity: 1,
        instructions: 'Xịt sau khi đã xì sạch mũi và rửa mũi bằng nước muối',
        createdAt: '2026-11-07 08:33:00',
      },
    ],
  },
];

// 19. dispensations & 20. dispensation_items
const INITIAL_DISPENSATIONS: Dispensation[] = [
  {
    id: '1',
    dispensationCode: 'DP202611070001',
    prescriptionId: '1',
    prescriptionCode: 'RX202611070001',
    patientName: 'Nguyễn Văn An',
    dispensedByStaffId: '3',
    dispensedByStaffName: 'Hoàng Thu Trang',
    status: 'PENDING',
    dispensedAt: null,
    notes: 'Chờ đối soát hạn dùng lô và bàn giao hướng dẫn sử dụng',
    createdAt: '2026-11-07 08:36:00',
    items: [
      {
        id: '1',
        dispensationId: '1',
        prescriptionItemId: '1',
        medicineLotId: '1',
        lotNumber: 'L240812-AUG',
        medicineName: 'Augmentin 1g',
        unit: 'Viên',
        quantity: 14,
        unitPrice: 18500,
        totalPrice: 259000,
      },
      {
        id: '2',
        dispensationId: '1',
        prescriptionItemId: '2',
        medicineLotId: '2',
        lotNumber: 'L240605-AVA',
        medicineName: 'Avamys Nasal Spray 120 sprays',
        unit: 'Chai',
        quantity: 1,
        unitPrice: 245000,
        totalPrice: 245000,
      },
    ],
  },
];

// 21. clinical_services
const INITIAL_CLINICAL_SERVICES: ClinicalService[] = [
  { id: '1', serviceCode: 'DV-KHAM-CK', serviceName: 'Khám chuyên khoa Tai Mũi Họng', description: 'Thăm khám lâm sàng vùng tai, mũi xoang, họng thanh quản', price: 150000, status: 'ACTIVE', createdAt: '2026-01-01', updatedAt: '2026-11-01' },
  { id: '2', serviceCode: 'DV-NS-NBI', serviceName: 'Nội soi Tai Mũi Họng ống mềm ánh sáng dải tần hẹp NBI', description: 'Nội soi tầm soát tổn thương vi mạch ung thư sớm vòm họng', price: 350000, status: 'ACTIVE', createdAt: '2026-01-01', updatedAt: '2026-11-01' },
  { id: '3', serviceCode: 'DV-RUA-XOANG', serviceName: 'Hút rửa mũi xoang Proetz áp lực âm', description: 'Làm sạch mủ ứ đọng khe giữa mũi xoang', price: 120000, status: 'ACTIVE', createdAt: '2026-01-01', updatedAt: '2026-11-01' },
  { id: '4', serviceCode: 'DV-DO-THINH', serviceName: 'Đo thính lực đồ đơn âm & Nhĩ lượng đồ', description: 'Đánh giá sức nghe và độ thông khí hòm nhĩ', price: 200000, status: 'ACTIVE', createdAt: '2026-01-01', updatedAt: '2026-11-01' },
];

// 22. visit_services
const INITIAL_VISIT_SERVICES: VisitService[] = [
  { id: '1', receptionId: '1', serviceId: '1', serviceCode: 'DV-KHAM-CK', serviceName: 'Khám chuyên khoa Tai Mũi Họng', quantity: 1, unitPrice: 150000, notes: null, createdAt: '2026-11-07 08:20:00' },
  { id: '2', receptionId: '1', serviceId: '2', serviceCode: 'DV-NS-NBI', serviceName: 'Nội soi Tai Mũi Họng ống mềm ánh sáng dải tần hẹp NBI', quantity: 1, unitPrice: 350000, notes: 'Nội soi chẩn đoán viêm xoang cấp', createdAt: '2026-11-07 08:25:00' },
];

// 23. invoices, 24. invoice_items, 25. payments
const INITIAL_INVOICES: Invoice[] = [
  {
    id: '1',
    invoiceCode: 'INV202611070001',
    receptionId: '1',
    patientId: '1',
    patientName: 'Nguyễn Văn An',
    phoneNumber: '0912345678',
    createdByStaffId: '3',
    createdByStaffName: 'Hoàng Thu Trang',
    subtotal: 1004000, // 500k dịch vụ + 504k thuốc
    discount: 50000, // Khuyến mại tri ân
    totalAmount: 954000, // Computed: subtotal - discount
    status: 'PAID',
    paidAt: '2026-11-07 08:45:00',
    notes: 'Bệnh nhân thanh toán chuyển khoản ngân hàng qua mã QR VietQR',
    createdAt: '2026-11-07 08:40:00',
    items: [
      { id: '1', invoiceId: '1', itemType: 'SERVICE', visitServiceId: '1', dispensationItemId: null, description: 'Khám chuyên khoa Tai Mũi Họng', quantity: 1, unitPrice: 150000, totalPrice: 150000 },
      { id: '2', invoiceId: '1', itemType: 'SERVICE', visitServiceId: '2', dispensationItemId: null, description: 'Nội soi Tai Mũi Họng ống mềm ánh sáng dải tần hẹp NBI', quantity: 1, unitPrice: 350000, totalPrice: 350000 },
      { id: '3', invoiceId: '1', itemType: 'MEDICINE', visitServiceId: null, dispensationItemId: '1', description: 'Augmentin 1g (14 Viên x 18,500đ)', quantity: 14, unitPrice: 18500, totalPrice: 259000 },
      { id: '4', invoiceId: '1', itemType: 'MEDICINE', visitServiceId: null, dispensationItemId: '2', description: 'Avamys Nasal Spray 120 sprays (1 Chai)', quantity: 1, unitPrice: 245000, totalPrice: 245000 },
    ],
    payments: [
      {
        id: '1',
        paymentCode: 'PAY202611070001',
        invoiceId: '1',
        amount: 954000,
        paymentMethod: 'BANK_TRANSFER',
        status: 'SUCCESS',
        receivedByStaffId: '3',
        receivedByStaffName: 'Hoàng Thu Trang',
        transactionCode: 'FT2611079821458',
        paidAt: '2026-11-07 08:45:00',
        createdAt: '2026-11-07 08:42:00',
        notes: 'Chuyển khoản thành công qua cổng thanh toán QR',
      },
    ],
    paidAmount: 954000,
    remainingAmount: 0,
  },
];

// ==========================================
// STORE CLASS VỚI LOGIC NGHIỆP VỤ ĐỐI CHIẾU SQL SERVER
// ==========================================

class ClinicStore {
  roles: RoleEntity[] = INITIAL_ROLES;
  staffUsers: StaffUser[] = INITIAL_STAFF_USERS;
  patients: Patient[] = INITIAL_PATIENTS;
  phoneLinks: PatientPhoneLink[] = INITIAL_PHONE_LINKS;
  appointments: Appointment[] = INITIAL_APPOINTMENTS;
  appointmentHistory: AppointmentStatusHistory[] = INITIAL_APT_HISTORY;
  receptions: Reception[] = INITIAL_RECEPTIONS;
  examinations: Examination[] = INITIAL_EXAMINATIONS;
  entFindings: EntFinding[] = INITIAL_ENT_FINDINGS;
  medicalRecords: MedicalRecord[] = INITIAL_MEDICAL_RECORDS;
  medicines: Medicine[] = INITIAL_MEDICINES;
  medicineLots: MedicineLot[] = INITIAL_MEDICINE_LOTS;
  suppliers: MedicineSupplier[] = INITIAL_SUPPLIERS;
  inventoryMovements: InventoryMovement[] = INITIAL_INVENTORY_MOVEMENTS;
  prescriptions: Prescription[] = INITIAL_PRESCRIPTIONS;
  dispensations: Dispensation[] = INITIAL_DISPENSATIONS;
  clinicalServices: ClinicalService[] = INITIAL_CLINICAL_SERVICES;
  visitServices: VisitService[] = INITIAL_VISIT_SERVICES;
  invoices: Invoice[] = INITIAL_INVOICES;

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- QUERY 28.1: DANH SÁCH CHỜ KHÁM THEO QUY TẮC ƯU TIÊN CHUẨN T-SQL ---
  // ORDER BY:
  // 1. APPOINTMENT (đặt trước) ưu tiên trước WALK_IN (đến trực tiếp)
  // 2. Nhóm APPOINTMENT sắp theo: appointment_date, appointment_time
  // 3. Nhóm WALK_IN sắp theo: received_at
  // 4. Bệnh nhân đang khám (IN_EXAM) không bị gián đoạn
  getWaitingQueue(): Reception[] {
    return this.receptions
      .filter((r) => r.status === 'WAITING' || r.status === 'IN_EXAM')
      .sort((a, b) => {
        // Đang khám luôn giữ vị trí xử lý
        if (a.status === 'IN_EXAM' && b.status !== 'IN_EXAM') return -1;
        if (b.status === 'IN_EXAM' && a.status !== 'IN_EXAM') return 1;

        // Ưu tiên: APPOINTMENT (0) trước WALK_IN (1)
        const rankA = a.receptionType === 'APPOINTMENT' ? 0 : 1;
        const rankB = b.receptionType === 'APPOINTMENT' ? 0 : 1;
        if (rankA !== rankB) return rankA - rankB;

        // Nhóm APPOINTMENT: so sánh theo ngày hẹn + giờ hẹn
        if (a.receptionType === 'APPOINTMENT' && b.receptionType === 'APPOINTMENT') {
          const aptA = this.appointments.find((apt) => apt.id === a.appointmentId);
          const aptB = this.appointments.find((apt) => apt.id === b.appointmentId);
          const timeA = `${aptA?.appointmentDate || ''} ${aptA?.appointmentTime || ''}`;
          const timeB = `${aptB?.appointmentDate || ''} ${aptB?.appointmentTime || ''}`;
          return timeA.localeCompare(timeB);
        }

        // Nhóm WALK_IN: so sánh theo thời gian tiếp nhận
        return a.receivedAt.localeCompare(b.receivedAt);
      });
  }

  // --- 07. APPOINTMENTS ---
  addAppointment(data: {
    fullName: string;
    phone: string;
    birthDate?: string;
    gender: Gender;
    appointmentDate: string;
    appointmentTime: string;
    symptoms?: string;
    notes?: string;
    source?: 'ONLINE' | 'PHONE' | 'AT_DESK';
  }): Appointment {
    const nextNum = this.appointments.length + 1;
    const dateCode = data.appointmentDate.replace(/-/g, '');
    const appointmentCode = `AP${dateCode}${String(nextNum).padStart(4, '0')}`;
    const id = String(nextNum);

    const newApt: Appointment = {
      id,
      appointmentCode,
      fullName: data.fullName,
      phone: data.phone,
      birthDate: data.birthDate || undefined,
      gender: data.gender || 'UNSPECIFIED',
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime.length === 5 ? `${data.appointmentTime}:00` : data.appointmentTime,
      symptoms: data.symptoms || undefined,
      notes: data.notes || undefined,
      source: data.source || 'ONLINE',
      status: 'PENDING',
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      timeSlot: data.appointmentTime.slice(0, 5),
      patientName: data.fullName,
      phoneNumber: data.phone,
    };

    this.appointments.unshift(newApt);
    this.notify();
    return newApt;
  }

  updateAppointmentStatus(
    appointmentId: string,
    newStatus: AppointmentStatus,
    reason?: string,
    staffId: string = '3'
  ) {
    const apt = this.appointments.find((a) => a.id === appointmentId);
    if (!apt) return;

    const oldStatus = apt.status;
    apt.status = newStatus;
    apt.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Ghi nhận vào 08. appointment_status_history
    const staff = this.staffUsers.find((s) => s.id === staffId);
    const historyEntry: AppointmentStatusHistory = {
      id: String(this.appointmentHistory.length + 1),
      appointmentId,
      oldStatus,
      newStatus,
      changedByStaffId: staffId,
      changedByStaffName: staff?.fullName || 'Hệ thống',
      reason: reason || `Chuyển trạng thái từ ${oldStatus} sang ${newStatus}`,
      changedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
    this.appointmentHistory.unshift(historyEntry);

    this.notify();
  }

  rescheduleAppointment(appointmentId: string, newDate: string, newTime: string) {
    const apt = this.appointments.find((a) => a.id === appointmentId);
    if (!apt) return;
    const oldDate = apt.appointmentDate;
    const oldTime = apt.appointmentTime;
    apt.appointmentDate = newDate;
    apt.appointmentTime = newTime;
    apt.timeSlot = newTime;
    apt.status = 'CONFIRMED';
    this.updateAppointmentStatus(
      appointmentId,
      'CONFIRMED',
      `Dời lịch khám từ ${oldDate} ${oldTime} sang ${newDate} ${newTime}`
    );
  }

  // --- 04. PATIENTS & 05. PATIENT_PHONE_LINKS ---
  addPatient(data: {
    fullName: string;
    birthDate?: string;
    gender: Gender;
    phone: string;
    address?: string;
    occupation?: string;
    insuranceNumber?: string;
    allergyNotes?: string;
    medicalHistoryNotes?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    relationship?: 'SELF' | 'PARENT_GUARDIAN' | 'CAREGIVER' | 'OTHER';
  }): Patient {
    const nextId = String(this.patients.length + 1);
    const patientCode = `BN-${1000 + Number(nextId)}`;

    const newPatient: Patient = {
      id: nextId,
      patientCode,
      fullName: data.fullName,
      birthDate: data.birthDate || undefined,
      gender: data.gender || 'UNSPECIFIED',
      phone: data.phone,
      address: data.address,
      occupation: data.occupation,
      insuranceNumber: data.insuranceNumber,
      allergyNotes: data.allergyNotes,
      medicalHistoryNotes: data.medicalHistoryNotes,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    this.patients.unshift(newPatient);

    // Tạo liên kết số điện thoại trong 05. patient_phone_links
    if (data.phone) {
      const cleanPhone = data.phone.replace(/\s+/g, '');
      const phoneE164 = cleanPhone.startsWith('+84')
        ? cleanPhone
        : cleanPhone.startsWith('0')
        ? `+84${cleanPhone.slice(1)}`
        : `+84${cleanPhone}`;

      this.phoneLinks.unshift({
        id: String(this.phoneLinks.length + 1),
        patientId: nextId,
        phoneE164,
        relationshipToPatient: data.relationship || 'SELF',
        isPrimary: true,
        verifiedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      });
    }

    this.notify();
    return newPatient;
  }

  updatePatient(id: string, data: Partial<Patient>) {
    this.patients = this.patients.map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ') } : p
    );
    this.notify();
  }

  addPatientPhoneLink(data: {
    patientId: string;
    phone: string;
    relationship: PhoneRelationship;
    isPrimary?: boolean;
  }): PatientPhoneLink {
    const id = String(this.phoneLinks.length + 1);
    const clean = data.phone.replace(/\s+/g, '');
    const e164 = clean.startsWith('+84')
      ? clean
      : clean.startsWith('0')
      ? `+84${clean.slice(1)}`
      : `+84${clean}`;

    const newLink: PatientPhoneLink = {
      id,
      patientId: data.patientId,
      phoneE164: e164,
      relationshipToPatient: data.relationship,
      isPrimary: !!data.isPrimary,
      verifiedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    this.phoneLinks.push(newLink);
    this.notify();
    return newLink;
  }

  // Tra cứu theo SĐT: Trả về danh sách bệnh nhân liên kết qua patient_phone_links
  getPatientsByPhone(phone: string): { phoneLink: PatientPhoneLink; patient: Patient }[] {
    const clean = phone.replace(/\s+/g, '');
    const e164 = clean.startsWith('+84')
      ? clean
      : clean.startsWith('0')
      ? `+84${clean.slice(1)}`
      : `+84${clean}`;

    const matchingLinks = this.phoneLinks.filter(
      (link) => link.phoneE164 === e164 || link.phoneE164.endsWith(clean.slice(-9))
    );

    const result: { phoneLink: PatientPhoneLink; patient: Patient }[] = [];
    matchingLinks.forEach((link) => {
      const patient = this.patients.find((p) => p.id === link.patientId);
      if (patient) {
        result.push({ phoneLink: link, patient });
      }
    });

    return result;
  }

  getDemoOtpForPhone(_phone?: string): string {
    return '123456';
  }

  // Tra cứu chi tiết toàn bộ lịch sử khám chữa bệnh của một bệnh nhân
  getPatientHistory(patientId: string) {
    const patient = this.patients.find((p) => p.id === patientId);
    const receptions = this.receptions.filter((r) => r.patientId === patientId);

    const visits = receptions.map((reception) => {
      const examination = this.examinations.find((e) => e.receptionId === reception.id);
      const findings = examination
        ? this.entFindings.filter((f) => f.examinationId === examination.id)
        : [];
      const medicalRecord = examination
        ? this.medicalRecords.find((m) => m.examinationId === examination.id)
        : undefined;
      const prescription = examination
        ? this.prescriptions.find((p) => p.examinationId === examination.id)
        : undefined;
      const services = this.visitServices.filter((s) => s.receptionId === reception.id);
      const invoice = this.invoices.find((i) => i.receptionId === reception.id);

      return {
        reception,
        examination,
        findings,
        medicalRecord,
        prescription,
        services,
        invoice,
      };
    });

    return { patient, visits };
  }

  // Hỗ trợ tra cứu theo SĐT cho giao diện Bệnh nhân (OTP)
  getMedicalRecordsByPhone(phone: string) {
    const phoneLinks = this.getPatientsByPhone(phone);
    const patient = phoneLinks.length > 0 ? phoneLinks[0].patient : this.patients.find(p => p.phone === phone);
    
    if (!patient) {
      return { phoneLinks, patient: null, records: [] };
    }

    const patientHistory = this.getPatientHistory(patient.id);
    const records = patientHistory.visits
      .map(v => v.medicalRecord)
      .filter((m): m is MedicalRecord => m !== undefined);

    return { phoneLinks, patient, records };
  }

  // --- 09. RECEPTIONS (Tiếp nhận & Vào hàng đợi) ---
  addReception(data: {
    patientId: string;
    appointmentId?: string | null;
    receptionType: 'APPOINTMENT' | 'WALK_IN';
    notes?: string;
    receivedByStaffId?: string;
  }): Reception {
    const nextNum = this.receptions.length + 1;
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const receptionCode = `RC${dateCode}${String(nextNum).padStart(4, '0')}`;
    const id = String(nextNum);

    const patient = this.patients.find((p) => p.id === data.patientId);
    const staff = this.staffUsers.find((s) => s.id === (data.receivedByStaffId || '3'));

    const newReception: Reception = {
      id,
      receptionCode,
      patientId: data.patientId,
      patientName: patient?.fullName || 'Bệnh nhân',
      appointmentId: data.appointmentId || null,
      receivedByStaffId: data.receivedByStaffId || '3',
      receivedByStaffName: staff?.fullName || 'Hoàng Thu Trang',
      receptionType: data.receptionType,
      status: 'WAITING',
      receivedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      notes: data.notes || undefined,
      patient,
    };

    this.receptions.unshift(newReception);

    // Nếu tiếp nhận từ lịch hẹn thì cập nhật trạng thái appointment sang CHECKED_IN
    if (data.appointmentId) {
      this.updateAppointmentStatus(data.appointmentId, 'CHECKED_IN', 'Đã tiếp nhận vào phòng khám');
    }

    this.notify();
    return newReception;
  }

  updateReceptionStatus(receptionId: string, status: ReceptionStatus) {
    this.receptions = this.receptions.map((r) => (r.id === receptionId ? { ...r, status } : r));
    this.notify();
  }

  // --- 10. EXAMINATIONS & 11. ENT_FINDINGS ---
  startExamination(receptionId: string, doctorStaffId: string = '2', chiefComplaint?: string): Examination {
    const existing = this.examinations.find((e) => e.receptionId === receptionId);
    if (existing) return existing;

    const nextNum = this.examinations.length + 1;
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const examinationCode = `EX${dateCode}${String(nextNum).padStart(4, '0')}`;
    const id = String(nextNum);

    const doctor = this.staffUsers.find((s) => s.id === doctorStaffId);

    const newExam: Examination = {
      id,
      examinationCode,
      receptionId,
      doctorStaffId,
      doctorName: doctor?.fullName || 'BS.CKI Lê Hoàng Nam',
      chiefComplaint: chiefComplaint || null,
      status: 'IN_PROGRESS',
      startedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      completedAt: null,
      findings: [],
    };

    this.examinations.unshift(newExam);
    this.updateReceptionStatus(receptionId, 'IN_EXAM');

    this.notify();
    return newExam;
  }

  addEntFinding(data: {
    examinationId: string;
    region: EntRegion;
    side: EntSide;
    description: string;
  }): EntFinding {
    const id = String(this.entFindings.length + 1);
    const newFinding: EntFinding = {
      id,
      examinationId: data.examinationId,
      region: data.region,
      side: data.side,
      description: data.description,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    this.entFindings.push(newFinding);
    this.notify();
    return newFinding;
  }

  completeExamination(examinationId: string) {
    this.examinations = this.examinations.map((e) =>
      e.id === examinationId
        ? {
            ...e,
            status: 'COMPLETED' as const,
            completedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
          }
        : e
    );
    this.notify();
  }

  // --- 12. MEDICAL_RECORDS ---
  saveMedicalRecord(data: {
    examinationId: string;
    diagnosis?: string;
    conclusion?: string;
    treatmentPlan?: string;
    doctorAdvice?: string;
    followUpDate?: string;
    status: MedicalRecordStatus;
  }): MedicalRecord {
    const exam = this.examinations.find((e) => e.id === data.examinationId);
    const reception = exam ? this.receptions.find((r) => r.id === exam.receptionId) : undefined;
    const patient = reception ? this.patients.find((p) => p.id === reception.patientId) : undefined;

    const existingIndex = this.medicalRecords.findIndex((m) => m.examinationId === data.examinationId);

    if (existingIndex >= 0) {
      const existing = this.medicalRecords[existingIndex];
      const updated: MedicalRecord = {
        ...existing,
        ...data,
        finalizedAt:
          data.status === 'FINALIZED'
            ? existing.finalizedAt || new Date().toISOString().slice(0, 19).replace('T', ' ')
            : null,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      this.medicalRecords[existingIndex] = updated;
      this.notify();
      return updated;
    }

    const nextNum = this.medicalRecords.length + 1;
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const medicalRecordCode = `MR${dateCode}${String(nextNum).padStart(4, '0')}`;
    const id = String(nextNum);

    const newRecord: MedicalRecord = {
      id,
      medicalRecordCode,
      examinationId: data.examinationId,
      diagnosis: data.diagnosis || null,
      conclusion: data.conclusion || null,
      treatmentPlan: data.treatmentPlan || null,
      doctorAdvice: data.doctorAdvice || null,
      followUpDate: data.followUpDate || null,
      status: data.status,
      finalizedAt: data.status === 'FINALIZED' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      patientId: patient?.id,
      patientName: patient?.fullName,
      doctorName: exam?.doctorName,
    };

    this.medicalRecords.unshift(newRecord);
    this.notify();
    return newRecord;
  }

  // --- 13. MEDICINES, 14. LOTS & 16. MOVEMENTS ---
  addMedicine(data: Partial<Medicine> & { medicineName: string; unit: string; salePrice: number }): Medicine {
    const nextNum = this.medicines.length + 1;
    const id = String(nextNum);
    const medicineCode = data.medicineCode || `TH-${String(nextNum).padStart(3, '0')}`;
    const newMed: Medicine = {
      id,
      medicineCode,
      medicineName: data.medicineName,
      name: data.name || data.medicineName,
      activeIngredient: data.activeIngredient || null,
      strength: data.strength || null,
      dosageForm: data.dosageForm || null,
      unit: data.unit,
      salePrice: data.salePrice,
      status: data.status || 'ACTIVE',
      notes: data.notes || null,
      totalStock: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    this.medicines.push(newMed);
    this.notify();
    return newMed;
  }

  // Cập nhật danh mục thuốc: không sửa lịch sử kê đơn hoặc xuất kho đã phát sinh.
  updateMedicine(id: string, changes: Pick<Medicine, 'medicineName' | 'activeIngredient' | 'strength' | 'dosageForm' | 'unit' | 'salePrice' | 'notes'>): boolean {
    const current = this.medicines.find((m) => m.id === id);
    if (!current) return false;

    this.medicines = this.medicines.map((m) => m.id === id ? {
      ...m,
      ...changes,
      name: changes.medicineName,
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    } : m);
    // Tên trên danh sách lô là dữ liệu join phục vụ hiển thị.
    this.medicineLots = this.medicineLots.map((l) => l.medicineId === id ? {
      ...l,
      medicineName: changes.medicineName,
    } : l);
    this.notify();
    return true;
  }

  // Xóa mềm bằng trạng thái INACTIVE để giữ toàn bộ khóa ngoại và lịch sử thuốc.
  setMedicineStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): boolean {
    if (!this.medicines.some((m) => m.id === id)) return false;
    this.medicines = this.medicines.map((m) => m.id === id ? {
      ...m,
      status,
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    } : m);
    this.notify();
    return true;
  }

  addSupplier(data: {
    supplierName: string;
    phone?: string;
    email?: string;
    address?: string;
    taxCode?: string;
  }): MedicineSupplier {
    const nextNum = this.suppliers.length + 1;
    const supplierCode = `NCC-${String(nextNum).padStart(3, '0')}`;
    const id = String(nextNum);

    const newSup: MedicineSupplier = {
      id,
      supplierCode,
      supplierName: data.supplierName,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      taxCode: data.taxCode || null,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    this.suppliers.push(newSup);
    this.notify();
    return newSup;
  }

  updateSupplier(id: string, changes: Pick<MedicineSupplier, 'supplierName' | 'phone' | 'email' | 'address' | 'taxCode'>): boolean {
    if (!this.suppliers.some((s) => s.id === id)) return false;
    this.suppliers = this.suppliers.map((s) => s.id === id ? { ...s, ...changes } : s);
    this.notify();
    return true;
  }

  setSupplierStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): boolean {
    if (!this.suppliers.some((s) => s.id === id)) return false;
    this.suppliers = this.suppliers.map((s) => s.id === id ? { ...s, status } : s);
    this.notify();
    return true;
  }

  addMedicineLot(data: {
    medicineId: string;
    lotNumber: string;
    expiryDate: string;
    quantity: number;
    status?: 'AVAILABLE' | 'BLOCKED' | 'QUARANTINED';
  }): MedicineLot {
    const nextNum = this.medicineLots.length + 1;
    const med = this.medicines.find((m) => m.id === data.medicineId);

    const newLot: MedicineLot = {
      id: String(nextNum),
      medicineId: data.medicineId,
      medicineCode: med?.medicineCode,
      medicineName: med?.medicineName,
      lotNumber: data.lotNumber,
      expiryDate: data.expiryDate,
      quantity: 0,
      status: data.status || 'AVAILABLE',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    this.medicineLots.push(newLot);

    // Tồn đầu kỳ được ghi một lần qua sổ biến động, tránh cộng hai lần.
    if (data.quantity > 0) {
      this.recordInventoryMovement({
        medicineLotId: newLot.id,
        movementType: 'IN',
        quantityChange: data.quantity,
        performedByStaffId: '3',
        notes: `Nhập thuốc ban đầu cho lô ${data.lotNumber}`,
      });
    } else {
      this.recalculateMedicineTotalStock(data.medicineId);
    }

    this.notify();
    return newLot;
  }

  updateMedicineLot(id: string, changes: Pick<MedicineLot, 'lotNumber' | 'expiryDate'>): boolean {
    const lot = this.medicineLots.find((l) => l.id === id);
    if (!lot) return false;
    if (this.medicineLots.some((l) => l.id !== id && l.medicineId === lot.medicineId && l.lotNumber === changes.lotNumber && l.expiryDate === changes.expiryDate)) {
      throw new Error('Số lô và hạn sử dụng này đã tồn tại cho thuốc đã chọn.');
    }
    this.medicineLots = this.medicineLots.map((l) => l.id === id ? { ...l, ...changes } : l);
    this.notify();
    return true;
  }

  setMedicineLotStatus(id: string, status: MedicineLotStatus): boolean {
    const lot = this.medicineLots.find((l) => l.id === id);
    if (!lot) return false;
    this.medicineLots = this.medicineLots.map((l) => l.id === id ? { ...l, status } : l);
    this.recalculateMedicineTotalStock(lot.medicineId);
    this.notify();
    return true;
  }

  recordInventoryMovement(data: {
    medicineLotId: string;
    movementType: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantityChange: number;
    performedByStaffId: string;
    notes?: string;
  }): InventoryMovement {
    const lot = this.medicineLots.find((l) => l.id === data.medicineLotId);
    if (!lot) throw new Error('Lô thuốc không tồn tại');
    if (!Number.isFinite(data.quantityChange) || data.quantityChange === 0 ||
        (data.movementType === 'IN' && data.quantityChange < 0) ||
        (data.movementType === 'OUT' && data.quantityChange > 0)) {
      throw new Error('Số lượng nhập/xuất không hợp lệ.');
    }
    if (lot.quantity + data.quantityChange < 0) {
      throw new Error('Số lượng xuất vượt quá tồn kho hiện tại.');
    }

    const nextNum = this.inventoryMovements.length + 1;
    const staff = this.staffUsers.find((s) => s.id === data.performedByStaffId);

    const newMovement: InventoryMovement = {
      id: String(nextNum),
      medicineLotId: data.medicineLotId,
      lotNumber: lot.lotNumber,
      medicineName: lot.medicineName,
      movementType: data.movementType,
      quantityChange: data.quantityChange,
      performedByStaffId: data.performedByStaffId,
      performedByStaffName: staff?.fullName || 'Nhân viên kho',
      notes: data.notes || null,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    // Điều chỉnh số lượng lô
    lot.quantity += data.quantityChange;
    this.recalculateMedicineTotalStock(lot.medicineId);

    this.inventoryMovements.unshift(newMovement);
    this.notify();
    return newMovement;
  }

  private recalculateMedicineTotalStock(medicineId: string) {
    const total = this.medicineLots
      .filter((l) => l.medicineId === medicineId && l.status === 'AVAILABLE')
      .reduce((sum, l) => sum + l.quantity, 0);

    this.medicines = this.medicines.map((m) =>
      m.id === medicineId ? { ...m, totalStock: total, stockQuantity: total } : m
    );
  }

  // --- 17. PRESCRIPTIONS & 18. PRESCRIPTION_ITEMS ---
  savePrescription(data: {
    examinationId: string;
    doctorStaffId?: string;
    status: PrescriptionStatus;
    instructions?: string;
    items: Omit<PrescriptionItem, 'id' | 'prescriptionId' | 'createdAt'>[];
  }): Prescription {
    const exam = this.examinations.find((e) => e.id === data.examinationId);
    const reception = exam ? this.receptions.find((r) => r.id === exam.receptionId) : undefined;
    const patient = reception ? this.patients.find((p) => p.id === reception.patientId) : undefined;

    const nextNum = this.prescriptions.length + 1;
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const prescriptionCode = `RX${dateCode}${String(nextNum).padStart(4, '0')}`;
    const id = String(nextNum);

    const prescriptionItems: PrescriptionItem[] = data.items.map((it, idx) => ({
      ...it,
      id: `${id}_${idx + 1}`,
      prescriptionId: id,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }));

    const newRx: Prescription = {
      id,
      prescriptionCode,
      examinationId: data.examinationId,
      doctorStaffId: data.doctorStaffId || '2',
      doctorName: exam?.doctorName || 'BS.CKI Lê Hoàng Nam',
      status: data.status,
      instructions: data.instructions || null,
      signedAt: data.status === 'SIGNED' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      items: prescriptionItems,
      patientId: patient?.id,
      patientName: patient?.fullName,
      receptionId: reception?.id,
    };

    this.prescriptions.unshift(newRx);

    // Khi bác sĩ ký đơn (SIGNED), tự động lập bản ghi phát thuốc PENDING cho Lễ tân
    if (data.status === 'SIGNED') {
      this.createDispensationForPrescription(newRx);
    }

    this.notify();
    return newRx;
  }

  createPrescription(data: Parameters<ClinicStore['savePrescription']>[0]): Prescription {
    return this.savePrescription(data);
  }

  // --- 19. DISPENSATIONS & 20. DISPENSATION_ITEMS ---
  private createDispensationForPrescription(prescription: Prescription): Dispensation {
    const nextNum = this.dispensations.length + 1;
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const dispensationCode = `DP${dateCode}${String(nextNum).padStart(4, '0')}`;
    const id = String(nextNum);

    // Chuẩn bị các dòng phát thuốc với lô gợi ý FEFO (hạn gần nhất còn tồn)
    const items: DispensationItem[] = prescription.items.map((pi, idx) => {
      const availableLot = this.medicineLots
        .filter((l) => l.medicineId === pi.medicineId && l.status === 'AVAILABLE' && l.quantity > 0)
        .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate))[0];

      const med = this.medicines.find((m) => m.id === pi.medicineId);

      return {
        id: `${id}_${idx + 1}`,
        dispensationId: id,
        prescriptionItemId: pi.id,
        medicineLotId: availableLot?.id || '1',
        lotNumber: availableLot?.lotNumber || 'Chưa gán',
        medicineName: pi.medicineName || med?.medicineName,
        unit: pi.unit || med?.unit,
        quantity: pi.quantity,
        unitPrice: med?.salePrice || 0,
        totalPrice: pi.quantity * (med?.salePrice || 0),
      };
    });

    const newDisp: Dispensation = {
      id,
      dispensationCode,
      prescriptionId: prescription.id,
      prescriptionCode: prescription.prescriptionCode,
      patientName: prescription.patientName,
      dispensedByStaffId: '3',
      dispensedByStaffName: 'Hoàng Thu Trang',
      status: 'PENDING',
      dispensedAt: null,
      notes: null,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      items,
    };

    this.dispensations.unshift(newDisp);
    return newDisp;
  }

  dispensePrescription(dispensationId: string, dispensedByStaffId: string = '3') {
    const disp = this.dispensations.find((d) => d.id === dispensationId);
    if (!disp || disp.status === 'COMPLETED') return;

    const staff = this.staffUsers.find((s) => s.id === dispensedByStaffId);

    disp.status = 'COMPLETED';
    disp.dispensedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    disp.dispensedByStaffId = dispensedByStaffId;
    disp.dispensedByStaffName = staff?.fullName || 'Hoàng Thu Trang';

    // Trừ tồn kho và ghi nhận lịch sử biến động kho OUT
    disp.items.forEach((item) => {
      this.recordInventoryMovement({
        medicineLotId: item.medicineLotId,
        movementType: 'OUT',
        quantityChange: -item.quantity,
        performedByStaffId: dispensedByStaffId,
        notes: `Xuất phát thuốc theo phiếu ${disp.dispensationCode}`,
      });
    });

    this.notify();
  }

  // --- 22. VISIT_SERVICES ---
  addVisitService(data: {
    receptionId: string;
    clinicalServiceId?: string;
    serviceId?: string;
    serviceCode?: string;
    serviceName?: string;
    unitPrice: number;
    quantity?: number;
    notes?: string;
  }): VisitService {
    const id = String(this.visitServices.length + 1);
    const newVs: VisitService = {
      id,
      receptionId: data.receptionId,
      serviceId: data.serviceId || data.clinicalServiceId || '1',
      clinicalServiceId: data.clinicalServiceId || data.serviceId || '1',
      serviceCode: data.serviceCode,
      serviceName: data.serviceName,
      quantity: data.quantity || 1,
      unitPrice: data.unitPrice,
      notes: data.notes || null,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
    this.visitServices.push(newVs);
    this.notify();
    return newVs;
  }

  // --- 23. INVOICES, 24. INVOICE_ITEMS & 25. PAYMENTS ---
  createInvoice(receptionId: string, createdByStaffId: string = '3', discount: number = 0): Invoice {
    const reception = this.receptions.find((r) => r.id === receptionId);
    const patient = reception ? this.patients.find((p) => p.id === reception.patientId) : undefined;
    const staff = this.staffUsers.find((s) => s.id === createdByStaffId);

    const nextNum = this.invoices.length + 1;
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const invoiceCode = `INV${dateCode}${String(nextNum).padStart(4, '0')}`;
    const id = String(nextNum);

    // Lấy các dịch vụ trong visit_services
    const visitSvcs = this.visitServices.filter((vs) => vs.receptionId === receptionId);
    const items: InvoiceItem[] = visitSvcs.map((vs, idx) => ({
      id: `${id}_svc_${idx + 1}`,
      invoiceId: id,
      itemType: 'SERVICE',
      visitServiceId: vs.id,
      dispensationItemId: null,
      description: vs.serviceName || 'Dịch vụ khám',
      quantity: vs.quantity,
      unitPrice: vs.unitPrice,
      totalPrice: vs.quantity * vs.unitPrice,
    }));

    // Lấy thuốc đã phát trong dispensation_items nếu có
    const exam = this.examinations.find((e) => e.receptionId === receptionId);
    const rx = exam ? this.prescriptions.find((p) => p.examinationId === exam.id) : undefined;
    const disp = rx ? this.dispensations.find((d) => d.prescriptionId === rx.id) : undefined;

    if (disp) {
      disp.items.forEach((di, idx) => {
        items.push({
          id: `${id}_med_${idx + 1}`,
          invoiceId: id,
          itemType: 'MEDICINE',
          visitServiceId: null,
          dispensationItemId: di.id,
          description: `${di.medicineName} (${di.lotNumber})`,
          quantity: di.quantity,
          unitPrice: di.unitPrice,
          totalPrice: di.quantity * di.unitPrice,
        });
      });
    }

    const subtotal = items.reduce((sum, it) => sum + it.totalPrice, 0);
    const totalAmount = Math.max(0, subtotal - discount);

    const newInvoice: Invoice = {
      id,
      invoiceCode,
      receptionId,
      patientId: patient?.id,
      patientName: patient?.fullName || 'Bệnh nhân',
      phoneNumber: patient?.phone,
      createdByStaffId,
      createdByStaffName: staff?.fullName || 'Hoàng Thu Trang',
      subtotal,
      discount,
      totalAmount,
      status: 'UNPAID',
      paidAt: null,
      notes: null,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      items,
      payments: [],
      paidAmount: 0,
      remainingAmount: totalAmount,
    };

    this.invoices.unshift(newInvoice);
    this.notify();
    return newInvoice;
  }

  recordPayment(data: {
    invoiceId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    transactionCode?: string;
    receivedByStaffId?: string;
    notes?: string;
  }): Payment {
    const inv = this.invoices.find((i) => i.id === data.invoiceId);
    if (!inv) throw new Error('Hóa đơn không tồn tại');

    const nextNum = (inv.payments?.length || 0) + 1;
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const paymentCode = `PAY${dateCode}${String(nextNum).padStart(4, '0')}`;
    const id = `${inv.id}_pay_${nextNum}`;

    const staffId = data.receivedByStaffId || '3';
    const staff = this.staffUsers.find((s) => s.id === staffId);

    const newPayment: Payment = {
      id,
      paymentCode,
      invoiceId: data.invoiceId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      status: 'SUCCESS',
      receivedByStaffId: staffId,
      receivedByStaffName: staff?.fullName || 'Hoàng Thu Trang',
      transactionCode: data.transactionCode || null,
      paidAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      notes: data.notes || null,
    };

    inv.payments.push(newPayment);

    // Tính tổng số tiền đã thanh toán (chỉ các giao dịch SUCCESS)
    const totalPaid = inv.payments
      .filter((p) => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0);

    inv.paidAmount = totalPaid;
    inv.remainingAmount = Math.max(0, inv.totalAmount - totalPaid);

    if (totalPaid >= inv.totalAmount) {
      inv.status = 'PAID';
      inv.paidAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      this.updateReceptionStatus(inv.receptionId, 'COMPLETED');
    } else if (totalPaid > 0) {
      inv.status = 'PARTIAL';
    }

    this.notify();
    return newPayment;
  }

  // --- 02. STAFF_USERS (Admin) ---
  addStaffUser(data: {
    username: string;
    fullName: string;
    email?: string;
    phone?: string;
    roleId: string;
    role: RoleEntity['code'];
    licenseNumber?: string;
  }): StaffUser {
    const nextNum = this.staffUsers.length + 1;
    const id = String(nextNum);
    const staffCode = `NV-${data.role.slice(0, 3)}-${String(nextNum).padStart(3, '0')}`;

    const newUser: StaffUser = {
      id,
      staffCode,
      username: data.username,
      fullName: data.fullName,
      email: data.email || null,
      phone: data.phone || null,
      roleId: data.roleId,
      role: data.role,
      licenseNumber: data.licenseNumber || null,
      status: 'ACTIVE',
      lastLoginAt: null,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    this.staffUsers.unshift(newUser);
    this.notify();
    return newUser;
  }

  updateStaffStatus(id: string, status: StaffUserStatus) {
    this.staffUsers = this.staffUsers.map((u) => (u.id === id ? { ...u, status } : u));
    this.notify();
  }
}

export const clinicStore = new ClinicStore();

// React hook tiện dụng để re-render tự động khi store thay đổi
export function useClinicStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return clinicStore.subscribe(() => {
      setTick((t) => t + 1);
    });
  }, []);

  return clinicStore;
}
