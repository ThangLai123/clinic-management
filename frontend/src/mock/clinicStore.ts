import { useState, useEffect } from 'react';
import type {
  Patient,
  Appointment,
  Reception,
  ClinicRoom,
  Medicine,
  Prescription,
  MedicalRecord,
  Invoice,
  StaffUser,
  AppointmentStatus,
  ReceptionStatus,
  PaymentMethod
} from '../types/clinic';

// DỮ LIỆU KHỞI TẠO DEMO (Hoàn toàn mô phỏng cho phòng khám Tai Mũi Họng)

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'BN-1001',
    fullName: 'Nguyễn Văn An',
    birthDate: '1988-05-14',
    gender: 'Nam',
    phoneNumber: '0912345678',
    address: 'Số 15 Phố Huế, Q. Hoàn Kiếm, Hà Nội',
    idCardNumber: '001088012345',
    insuranceNumber: 'DN4010123456789',
    emergencyContact: 'Vợ: Nguyễn Thị Mai - 0987654321',
    allergies: ['Dị ứng Penicillin', 'Dị ứng phấn hoa'],
    medicalHistory: 'Viêm mũi dị ứng mạn tính 5 năm, hen phế quản nhẹ',
    createdAt: '2026-11-01 08:30',
  },
  {
    id: 'BN-1002',
    fullName: 'Trần Thị Thu Hà',
    birthDate: '1995-10-22',
    gender: 'Nữ',
    phoneNumber: '0988776655',
    address: 'Số 42 Cầu Giấy, Q. Cầu Giấy, Hà Nội',
    idCardNumber: '001195024680',
    emergencyContact: 'Mẹ: Lê Thị Lan - 0977112233',
    allergies: ['Không ghi nhận'],
    medicalHistory: 'Từng nạo VA lúc nhỏ',
    createdAt: '2026-11-03 09:15',
  },
  {
    id: 'BN-1003',
    fullName: 'Lê Hoàng Long (Bé)',
    birthDate: '2020-03-10',
    gender: 'Nam',
    phoneNumber: '0903456789',
    address: 'Tòa Landmark 2, KĐT Ngoại Giao Đoàn, Hà Nội',
    emergencyContact: 'Bố: Lê Văn Tuấn - 0903456789',
    allergies: ['Dị ứng tôm cua'],
    medicalHistory: 'Viêm tai giữa cấp tái phát 2 lần',
    createdAt: '2026-11-05 14:00',
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'LH-20261107-001',
    patientName: 'Nguyễn Văn An',
    phoneNumber: '0912345678',
    birthDate: '1988-05-14',
    gender: 'Nam',
    appointmentDate: '2026-11-07',
    timeSlot: '08:30 - 09:00',
    reason: 'Nghẹt mũi kéo dài, đau căng tức vùng trán',
    symptoms: ['Nghẹt mũi', 'Chảy nước mũi', 'Đau vùng mũi xoang', 'Nhức đầu'],
    symptomDuration: 'Khoảng 1 tuần nay',
    notes: 'Có tiền sử viêm mũi dị ứng',
    status: 'DA_TIEP_NHAN',
    createdAt: '2026-11-06 19:20',
  },
  {
    id: 'LH-20261107-002',
    patientName: 'Trần Thị Thu Hà',
    phoneNumber: '0988776655',
    birthDate: '1995-10-22',
    gender: 'Nữ',
    appointmentDate: '2026-11-07',
    timeSlot: '09:00 - 09:30',
    reason: 'Đau rát họng, nuốt đau, sốt nhẹ 38 độ',
    symptoms: ['Đau họng', 'Khó nuốt', 'Ho', 'Khàn tiếng'],
    symptomDuration: '3 ngày',
    notes: 'Muốn khám và nội soi họng thanh quản',
    status: 'DA_XAC_NHAN',
    createdAt: '2026-11-06 20:15',
  },
  {
    id: 'LH-20261107-003',
    patientName: 'Phạm Minh Đức',
    phoneNumber: '0934123456',
    birthDate: '1976-12-05',
    gender: 'Nam',
    appointmentDate: '2026-11-07',
    timeSlot: '10:00 - 10:30',
    reason: 'Ù tai trái, giảm thính lực đột ngột sau bơi lội',
    symptoms: ['Ù tai', 'Nghe kém', 'Đau tai'],
    symptomDuration: '2 ngày nay',
    status: 'CHO_XAC_NHAN',
    createdAt: '2026-11-07 07:45',
  },
];

const INITIAL_ROOMS: ClinicRoom[] = [
  {
    id: 'PK-01',
    roomName: 'Phòng Khám TMH 1 (Tổng Quát)',
    doctorName: 'BS.CKI Lê Hoàng Nam',
    specialty: 'Tai Mũi Họng người lớn & Viêm xoang',
    status: 'DANG_KHAM',
    waitingCount: 2,
  },
  {
    id: 'PK-02',
    roomName: 'Phòng Khám TMH 2 (Nhi Khoa)',
    doctorName: 'ThS.BS Vũ Minh Trang',
    specialty: 'Khám Tai Mũi Họng trẻ em, VA & Amidan',
    status: 'SAN_SANG',
    waitingCount: 1,
  },
  {
    id: 'PK-03',
    roomName: 'Phòng Khám Nội Soi & Thăm Dò',
    doctorName: 'BS. Trần Hữu Đức',
    specialty: 'Nội soi mềm NBI & Đo thính lực đồ',
    status: 'SAN_SANG',
    waitingCount: 0,
  },
];

const INITIAL_RECEPTIONS: Reception[] = [
  {
    id: 'TN-20261107-01',
    patientId: 'BN-1001',
    patientName: 'Nguyễn Văn An',
    phoneNumber: '0912345678',
    appointmentId: 'LH-20261107-001',
    receptionType: 'DAT_LICH',
    receptionTime: '08:25',
    reason: 'Nghẹt mũi, đau nhức hốc mắt và trán',
    symptoms: ['Nghẹt mũi', 'Đau vùng mũi xoang'],
    priority: 'BINH_THUONG',
    assignedRoomId: 'PK-01',
    assignedDoctorName: 'BS.CKI Lê Hoàng Nam',
    status: 'DANG_KHAM',
    vitalSigns: {
      pulse: 78,
      bloodPressure: '120/80',
      temperature: 36.8,
      spO2: 98,
    },
  },
  {
    id: 'TN-20261107-02',
    patientId: 'BN-1003',
    patientName: 'Lê Hoàng Long (Bé)',
    phoneNumber: '0903456789',
    receptionType: 'TRUC_TIEP',
    receptionTime: '08:40',
    reason: 'Bé quấy khóc, lấy tay giật tai phải, sốt 38.5 độ',
    symptoms: ['Đau tai', 'Chảy dịch tai'],
    priority: 'UU_TIEN',
    assignedRoomId: 'PK-02',
    assignedDoctorName: 'ThS.BS Vũ Minh Trang',
    status: 'CHO_KHAM',
    vitalSigns: {
      pulse: 105,
      bloodPressure: '100/65',
      temperature: 38.5,
      spO2: 99,
    },
  },
];

const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'TH-001',
    name: 'Cefuroxime Axetil 500mg',
    brandName: 'Zinnat 500mg',
    activeIngredient: 'Cefuroxime 500mg',
    dosageForm: 'Viên nén bao phim',
    unit: 'Viên',
    batchNumber: 'L240901',
    expiryDate: '2027-08-30',
    stockQuantity: 450,
    minStockLevel: 50,
    importPrice: 18000,
    retailPrice: 22000,
    supplier: 'GlaxoSmithKline (GSK)',
    isActive: true,
  },
  {
    id: 'TH-002',
    name: 'Amoxicillin + Clavulanic 1g',
    brandName: 'Augmentin 1g',
    activeIngredient: 'Amoxicillin 875mg + Clavulanic 125mg',
    dosageForm: 'Viên nén bao phim',
    unit: 'Viên',
    batchNumber: 'L241015',
    expiryDate: '2026-12-31',
    stockQuantity: 28, // Tồn thấp demo
    minStockLevel: 50,
    importPrice: 21000,
    retailPrice: 26000,
    supplier: 'GSK Việt Nam',
    isActive: true,
  },
  {
    id: 'TH-003',
    name: 'Xylometazoline 0.05% Xịt Mũi',
    brandName: 'Otrivin 0.05%',
    activeIngredient: 'Xylometazoline hydrochloride 0.5mg/ml',
    dosageForm: 'Dung dịch xịt mũi',
    unit: 'Lọ',
    batchNumber: 'L240412',
    expiryDate: '2026-11-20', // Gần hết hạn demo
    stockQuantity: 45,
    minStockLevel: 20,
    importPrice: 42000,
    retailPrice: 52000,
    supplier: 'Novartis Consumer Health',
    isActive: true,
  },
  {
    id: 'TH-004',
    name: 'Ciprofloxacin 0.3% Nhỏ Tai',
    brandName: 'Ciprodex Otic',
    activeIngredient: 'Ciprofloxacin 0.3% + Dexamethasone 0.1%',
    dosageForm: 'Hỗn dịch nhỏ tai',
    unit: 'Lọ',
    batchNumber: 'L241102',
    expiryDate: '2027-05-15',
    stockQuantity: 120,
    minStockLevel: 30,
    importPrice: 85000,
    retailPrice: 105000,
    supplier: 'Alcon Laboratories',
    isActive: true,
  },
  {
    id: 'TH-005',
    name: 'Desloratadine 5mg',
    brandName: 'Aerius 5mg',
    activeIngredient: 'Desloratadine 5mg',
    dosageForm: 'Viên nén bao phim',
    unit: 'Viên',
    batchNumber: 'L240618',
    expiryDate: '2027-10-10',
    stockQuantity: 600,
    minStockLevel: 100,
    importPrice: 9000,
    retailPrice: 12000,
    supplier: 'Schering-Plough',
    isActive: true,
  },
  {
    id: 'TH-006',
    name: 'Nước Muối Biển Sâu Xịt Mũi',
    brandName: 'Sterimar Blocked Nose',
    activeIngredient: 'Dung dịch nước biển ưu trương vô trùng',
    dosageForm: 'Bình xịt vi hạt',
    unit: 'Chai',
    batchNumber: 'L240722',
    expiryDate: '2028-01-01',
    stockQuantity: 80,
    minStockLevel: 20,
    importPrice: 95000,
    retailPrice: 125000,
    supplier: 'Lab Fumouze',
    isActive: true,
  },
  {
    id: 'TH-007',
    name: 'Dung Dịch Súc Họng Povidone Iodine 1%',
    brandName: 'Betadine Gargle & Mouthwash 125ml',
    activeIngredient: 'Povidone-Iodine 1% w/v',
    dosageForm: 'Dung dịch súc miệng',
    unit: 'Chai',
    batchNumber: 'L240509',
    expiryDate: '2027-03-30',
    stockQuantity: 95,
    minStockLevel: 25,
    importPrice: 65000,
    retailPrice: 80000,
    supplier: 'Mundipharma',
    isActive: true,
  },
];

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'DT-20261107-001',
    patientId: 'BN-1002',
    patientName: 'Trần Thị Thu Hà',
    receptionId: 'TN-PREV-01',
    doctorName: 'BS.CKI Lê Hoàng Nam',
    diagnosis: 'Viêm amidan cấp mủ (J03.9)',
    items: [
      {
        medicineId: 'TH-001',
        medicineName: 'Cefuroxime Axetil 500mg (Zinnat)',
        unit: 'Viên',
        quantity: 10,
        route: 'Đường uống',
        dosage: '1 viên/lần',
        frequency: '2 lần/ngày (Sáng 1 - Tối 1)',
        days: 5,
        instructions: 'Uống ngay sau bữa ăn',
      },
      {
        medicineId: 'TH-007',
        medicineName: 'Dung Dịch Súc Họng Betadine 1%',
        unit: 'Chai',
        quantity: 1,
        route: 'Súc họng tại chỗ',
        dosage: '10ml/lần (không nuốt)',
        frequency: '3 - 4 lần/ngày',
        days: 7,
        instructions: 'Súc kỹ vùng họng trong 30 giây rồi nhổ ra',
      },
    ],
    advice: 'Uống nhiều nước ấm, kiêng đồ ăn cay lạnh, giữ ấm cổ họng.',
    followUpDate: '2026-11-14',
    status: 'CHO_PHAT',
    createdAt: '2026-11-07 08:50',
  },
];

const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'BA-20261101-01',
    receptionId: 'TN-PREV-00',
    patientId: 'BN-1001',
    patientName: 'Nguyễn Văn An',
    gender: 'Nam',
    birthDate: '1988-05-14',
    examDate: '2026-11-01',
    doctorName: 'BS.CKI Lê Hoàng Nam',
    chiefComplaint: 'Nghẹt mũi tái phát, hắt hơi nhiều về sáng',
    medicalHistory: 'Viêm mũi dị ứng nhiều năm, mẫn cảm với phấn hoa và thay đổi thời tiết',
    examinationSummary: 'Mũi: Niêm mạc nhợt màu, phù nề cuốn dưới 2 bên, khe giữa nhiều dịch trong. Họng: Niêm mạc sạch, không viêm. Tai: Màng nhĩ sáng bóng bình thường.',
    endoscopySummary: 'Nội soi mũi xoang: Cuốn dưới phì đại độ 2, dịch nhầy trong, vách ngăn hơi vẹo nhẹ sang trái.',
    diagnosis: 'Viêm mũi dị ứng mạn tính có phì đại cuốn mũi (J30.1)',
    icdCode: 'J30.1',
    treatmentPlan: 'Xịt mũi Steroid tại chỗ + Kháng Histamin H1 thế hệ 2 + Vệ sinh mũi bằng nước muối biển sâu.',
    prescriptionId: 'DT-20261101-001',
    followUpDate: '2026-11-15',
    status: 'HOAN_TAT',
    createdAt: '2026-11-01 10:30',
  },
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'HD-20261107-001',
    receptionId: 'TN-PREV-01',
    patientId: 'BN-1002',
    patientName: 'Trần Thị Thu Hà',
    phoneNumber: '0988776655',
    items: [
      {
        id: 'IV-01',
        category: 'KHAM_BENH',
        description: 'Khám chuyên khoa Tai Mũi Họng chuyên sâu',
        quantity: 1,
        unitPrice: 150000,
        totalPrice: 150000,
      },
      {
        id: 'IV-02',
        category: 'NOI_SOI',
        description: 'Nội soi Họng - Thanh quản ống mềm',
        quantity: 1,
        unitPrice: 250000,
        totalPrice: 250000,
      },
      {
        id: 'IV-03',
        category: 'THUOC',
        description: 'Cefuroxime Axetil 500mg (10 viên)',
        quantity: 10,
        unitPrice: 22000,
        totalPrice: 220000,
      },
      {
        id: 'IV-04',
        category: 'THUOC',
        description: 'Dung dịch Betadine súc họng 125ml',
        quantity: 1,
        unitPrice: 80000,
        totalPrice: 80000,
      },
    ],
    subtotal: 700000,
    discount: 50000,
    totalAmount: 650000,
    paidAmount: 650000,
    changeAmount: 0,
    paymentMethod: 'CHUYEN_KHOAN_QR',
    status: 'DA_THANH_TOAN',
    cashierName: 'Lễ tân Hoàng Thu Trang',
    createdAt: '2026-11-07 09:10',
  },
];

const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: 'NV-001',
    fullName: 'TS.BS Trần Quốc Hưng',
    username: 'admin',
    email: 'admin.hung@clinic.local',
    phoneNumber: '0901112233',
    role: 'ADMIN',
    specialty: 'Giám đốc chuyên môn / Quản trị hệ thống',
    isActive: true,
    createdAt: '2026-01-10',
  },
  {
    id: 'NV-002',
    fullName: 'BS.CKI Lê Hoàng Nam',
    username: 'doctor.nam',
    email: 'nam.lh@clinic.local',
    phoneNumber: '0912223344',
    role: 'DOCTOR',
    specialty: 'Tai Mũi Họng người lớn & Phẫu thuật xoang',
    isActive: true,
    createdAt: '2026-02-15',
  },
  {
    id: 'NV-003',
    fullName: 'ThS.BS Vũ Minh Trang',
    username: 'doctor.trang',
    email: 'trang.vm@clinic.local',
    phoneNumber: '0983334455',
    role: 'DOCTOR',
    specialty: 'Tai Mũi Họng nhi & Dị ứng lâm sàng',
    isActive: true,
    createdAt: '2026-03-01',
  },
  {
    id: 'NV-004',
    fullName: 'Hoàng Thu Trang',
    username: 'reception.trang',
    email: 'trang.ht@clinic.local',
    phoneNumber: '0974445566',
    role: 'RECEPTIONIST',
    specialty: 'Tiếp nhận, điều phối phòng khám & thu ngân',
    isActive: true,
    createdAt: '2026-04-12',
  },
  {
    id: 'NV-005',
    fullName: 'Nguyễn Thị Hải Yến',
    username: 'reception.yen',
    email: 'yen.nth@clinic.local',
    phoneNumber: '0965556677',
    role: 'RECEPTIONIST',
    specialty: 'Dược phòng khám & Quản lý kho thuốc',
    isActive: true,
    createdAt: '2026-05-20',
  },
];

// STATE STORAGE & EVENT EMITTER
class ClinicStore {
  patients: Patient[] = [...INITIAL_PATIENTS];
  appointments: Appointment[] = [...INITIAL_APPOINTMENTS];
  receptions: Reception[] = [...INITIAL_RECEPTIONS];
  rooms: ClinicRoom[] = [...INITIAL_ROOMS];
  medicines: Medicine[] = [...INITIAL_MEDICINES];
  prescriptions: Prescription[] = [...INITIAL_PRESCRIPTIONS];
  medicalRecords: MedicalRecord[] = [...INITIAL_MEDICAL_RECORDS];
  invoices: Invoice[] = [...INITIAL_INVOICES];
  staffUsers: StaffUser[] = [...INITIAL_STAFF_USERS];

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

  // --- UC-01: Đặt lịch hẹn ---
  addAppointment(data: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Appointment {
    const id = `LH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(this.appointments.length + 1).padStart(3, '0')}`;
    const newApt: Appointment = {
      ...data,
      id,
      status: 'CHO_XAC_NHAN',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    this.appointments.unshift(newApt);
    this.notify();
    return newApt;
  }

  updateAppointmentStatus(id: string, status: AppointmentStatus, cancelReason?: string) {
    this.appointments = this.appointments.map((a) =>
      a.id === id ? { ...a, status, cancelReason: cancelReason || a.cancelReason } : a
    );
    this.notify();
  }

  rescheduleAppointment(id: string, newDate: string, newTimeSlot: string) {
    this.appointments = this.appointments.map((a) =>
      a.id === id ? { ...a, appointmentDate: newDate, timeSlot: newTimeSlot, status: 'DA_XAC_NHAN' } : a
    );
    this.notify();
  }

  // --- UC-02: Tra cứu OTP mô phỏng ---
  getDemoOtpForPhone(_phone?: string): string {
    return '123456'; // Mã OTP demo cố định cho phép kiểm thử dễ dàng
  }

  getMedicalRecordsByPhone(phone: string): { patient: Patient | undefined; records: MedicalRecord[] } {
    const cleanPhone = phone.replace(/\s+/g, '');
    const patient = this.patients.find((p) => p.phoneNumber.replace(/\s+/g, '') === cleanPhone);
    if (!patient) return { patient: undefined, records: [] };
    const records = this.medicalRecords.filter((r) => r.patientId === patient.id);
    return { patient, records };
  }

  // --- UC-04: Tiếp nhận bệnh nhân ---
  addPatient(patientData: Omit<Patient, 'id' | 'createdAt'>): Patient {
    const id = `BN-${1000 + this.patients.length + 1}`;
    const newPatient: Patient = {
      ...patientData,
      id,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    this.patients.unshift(newPatient);
    this.notify();
    return newPatient;
  }

  updatePatient(id: string, data: Partial<Patient>) {
    this.patients = this.patients.map((p) => (p.id === id ? { ...p, ...data } : p));
    this.notify();
  }

  addReception(data: Omit<Reception, 'id' | 'receptionTime' | 'status'>): Reception {
    const id = `TN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(this.receptions.length + 1).padStart(2, '0')}`;
    const newReception: Reception = {
      ...data,
      id,
      receptionTime: new Date().toTimeString().slice(0, 5),
      status: 'CHO_PHAN_PHONG',
    };
    this.receptions.unshift(newReception);

    // Cập nhật trạng thái lịch hẹn liên kết nếu có
    if (data.appointmentId) {
      this.updateAppointmentStatus(data.appointmentId, 'DA_TIEP_NHAN');
    }

    this.notify();
    return newReception;
  }

  // --- UC-06: Phân phòng khám ---
  assignRoomToReception(receptionId: string, roomId: string) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) return;

    this.receptions = this.receptions.map((rec) => {
      if (rec.id === receptionId) {
        return {
          ...rec,
          assignedRoomId: roomId,
          assignedDoctorName: room.doctorName,
          status: 'CHO_KHAM',
        };
      }
      return rec;
    });

    this.updateRoomWaitingCount();
    this.notify();
  }

  updateRoomWaitingCount() {
    this.rooms = this.rooms.map((room) => {
      const count = this.receptions.filter(
        (r) => r.assignedRoomId === room.id && (r.status === 'CHO_KHAM' || r.status === 'DANG_KHAM')
      ).length;
      return { ...room, waitingCount: count };
    });
  }

  updateReceptionStatus(receptionId: string, status: ReceptionStatus) {
    this.receptions = this.receptions.map((r) => (r.id === receptionId ? { ...r, status } : r));
    this.updateRoomWaitingCount();
    this.notify();
  }

  // --- UC-03: Kho thuốc ---
  addMedicine(data: Omit<Medicine, 'id'>): Medicine {
    const id = `TH-${String(this.medicines.length + 1).padStart(3, '0')}`;
    const newMed: Medicine = { ...data, id };
    this.medicines.push(newMed);
    this.notify();
    return newMed;
  }

  importStock(medicineId: string, quantity: number, batchNumber: string, expiryDate: string, importPrice: number) {
    this.medicines = this.medicines.map((m) => {
      if (m.id === medicineId) {
        return {
          ...m,
          stockQuantity: m.stockQuantity + quantity,
          batchNumber,
          expiryDate,
          importPrice,
        };
      }
      return m;
    });
    this.notify();
  }

  // --- UC-10, UC-11: Khám & Lập bệnh án ---
  saveMedicalRecord(data: Omit<MedicalRecord, 'id' | 'createdAt'>): MedicalRecord {
    const id = `BA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(this.medicalRecords.length + 1).padStart(2, '0')}`;
    const newRecord: MedicalRecord = {
      ...data,
      id,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    this.medicalRecords.unshift(newRecord);

    // Chuyển reception sang chờ phát thuốc / chờ thanh toán
    this.updateReceptionStatus(data.receptionId, 'CHO_PHAT_THUOC');
    this.notify();
    return newRecord;
  }

  // --- UC-12: Kê đơn thuốc ---
  addPrescription(data: Omit<Prescription, 'id' | 'createdAt'>): Prescription {
    const id = `DT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(this.prescriptions.length + 1).padStart(3, '0')}`;
    const newRx: Prescription = {
      ...data,
      id,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    this.prescriptions.unshift(newRx);
    this.notify();
    return newRx;
  }

  // --- UC-08: Phát thuốc ---
  dispensePrescription(prescriptionId: string, dispensedBy: string) {
    this.prescriptions = this.prescriptions.map((rx) => {
      if (rx.id === prescriptionId) {
        return {
          ...rx,
          status: 'DA_PHAT' as const,
          dispensedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
          dispensedBy,
        };
      }
      return rx;
    });

    // Giảm trừ tồn kho tương ứng
    const rx = this.prescriptions.find((p) => p.id === prescriptionId);
    if (rx) {
      rx.items.forEach((item) => {
        this.medicines = this.medicines.map((m) =>
          m.id === item.medicineId ? { ...m, stockQuantity: Math.max(0, m.stockQuantity - item.quantity) } : m
        );
      });
      this.updateReceptionStatus(rx.receptionId, 'CHO_THANH_TOAN');
    }

    this.notify();
  }

  // --- UC-09: Lập hóa đơn & thanh toán ---
  addInvoice(data: Omit<Invoice, 'id' | 'createdAt'>): Invoice {
    const id = `HD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(this.invoices.length + 1).padStart(3, '0')}`;
    const newInv: Invoice = {
      ...data,
      id,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    this.invoices.unshift(newInv);
    this.notify();
    return newInv;
  }

  recordPayment(invoiceId: string, method: PaymentMethod, paidAmount: number) {
    this.invoices = this.invoices.map((inv) => {
      if (inv.id === invoiceId) {
        const change = Math.max(0, paidAmount - inv.totalAmount);
        return {
          ...inv,
          paidAmount,
          changeAmount: change,
          paymentMethod: method,
          status: 'DA_THANH_TOAN' as const,
        };
      }
      return inv;
    });

    const inv = this.invoices.find((i) => i.id === invoiceId);
    if (inv) {
      this.updateReceptionStatus(inv.receptionId, 'HOAN_TAT');
    }

    this.notify();
  }

  // --- UC-13: Quản lý tài khoản ---
  addStaffUser(data: Omit<StaffUser, 'id' | 'createdAt'>): StaffUser {
    const id = `NV-${String(this.staffUsers.length + 1).padStart(3, '0')}`;
    const newUser: StaffUser = {
      ...data,
      id,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.staffUsers.unshift(newUser);
    this.notify();
    return newUser;
  }

  updateStaffUser(id: string, data: Partial<StaffUser>) {
    this.staffUsers = this.staffUsers.map((u) => (u.id === id ? { ...u, ...data } : u));
    this.notify();
  }

  toggleStaffStatus(id: string) {
    this.staffUsers = this.staffUsers.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u));
    this.notify();
  }
}

export const clinicStore = new ClinicStore();

export function useClinicStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return clinicStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return clinicStore;
}
