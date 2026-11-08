# TÀI LIỆU ÁNH XẠ TOÀN DIỆN FRONTEND - CƠ SỞ DỮ LIỆU MICROSOFT SQL SERVER
## HỆ THỐNG QUẢN LÝ PHÒNG KHÁM TAI MŨI HỌNG (CLINIC_MANAGEMENT)

> **Cơ sở dữ liệu:** Microsoft SQL Server  
> **Database Name:** `clinic_managerment`  
> **Tài liệu tham chiếu chuẩn:** `clinic_managerment_25_bang_dac_ta_backend.md`  
> **Phiên bản chuẩn hóa Frontend:** React 19 + TypeScript + Vite + Tailwind CSS  
> **Quy ước phân loại trường dữ liệu (UI Field Classification):**
> - `INPUT`: Trường người dùng nhập trực tiếp bằng bàn phím (textbox, textarea, number input, date picker).
> - `SELECT`: Trường người dùng chọn từ danh sách dropdown / radio / select box.
> - `READONLY`: Trường hiển thị dữ liệu chỉ đọc, không được phép sửa đổi trên giao diện này.
> - `GENERATED`: Trường do hệ thống tự sinh mã theo quy tắc chuyên khoa (prefix + date + sequence).
> - `COMPUTED`: Trường tính toán (PERSISTED COMPUTED COLUMN trong CSDL), UI chỉ tính toán xem trước và khóa nhập.
> - `HIDDEN`: Trường lưu ngầm phục vụ quan hệ khóa ngoại (Foreign Key) hoặc payload API, không hiển thị trực tiếp.

---

## MỤC LỤC
1. [Nguyên Tắc Kiến Trúc & Quy Chuẩn Nghiệp Vụ](#1-nguyên-tắc-kiến-trúc--quy-chuẩn-nghiệp-vụ)
2. [Bảng Ma Trận Ánh Xạ Chi Tiết 25 Bảng CSDL SQL Server](#2-bảng-ma-trận-ánh-xạ-chi-tiết-25-bảng-csdl-sql-server)
3. [Chi Tiết Ánh Xạ Theo Từng Màn Hình Nghiệp Vụ](#3-chi-tiết-ánh-xạ-theo-từng-màn-hình-nghiệp-vụ)
   - [3.1. Phân Hệ Người Bệnh (Patient Portal)](#31-phân-hệ-người-bệnh-patient-portal)
   - [3.2. Phân Hệ Lễ Tân & Thu Ngân (Receptionist & Pharmacy Desk)](#32-phân-hệ-lễ-tân--thu-ngân-receptionist--pharmacy-desk)
   - [3.3. Phân Hệ Bác Sĩ Chuyên Khoa (Doctor ENT Clinic)](#33-phân-hệ-bác-sĩ-chuyên-khoa-doctor-ent-clinic)
   - [3.4. Phân Hệ Quản Trị Hệ Thống (Admin Control Panel)](#34-phân-hệ-quản-trị-hệ-thống-admin-control-panel)
4. [Quy Tắc Xếp Hàng Ưu Tiên Khám Bệnh (Query 28.1)](#4-quy-tắc-xếp-hàng-ưu-tiên-khám-bệnh-query-281)
5. [Cơ Chế Khóa Bảo Mật Dữ Liệu Chuyên Môn](#5-cơ-chế-khóa-bảo-mật-dữ-liệu-chuyên-môn)

---

## 1. NGUYÊN TẮC KIẾN TRÚC & QUY CHUẨN NGHIỆP VỤ

1. **Không phân phòng khám:** Hệ thống phòng khám Tai Mũi Họng một cơ sở chuyên khoa vận hành một hàng chờ khám ưu tiên thống nhất (`/receptionist/queue` và `/doctor/queue`), không tồn tại bảng `rooms` hay `room_assignments`.
2. **Không tạo tài khoản bệnh nhân:** Bệnh nhân không có username/password; xác thực danh tính bảo mật qua số điện thoại và mã OTP 6 chữ số (`otp_challenges`).
3. **Một số điện thoại - Nhiều hồ sơ bệnh nhân:** Bảng `patient_phone_links` cho phép cha mẹ dùng một SĐT để đặt lịch và tra cứu kết quả khám cho nhiều con cái hoặc người thân.
4. **Không tạo phiếu nhập thuốc điện tử:** Tồn kho thuốc được theo dõi qua các lô thuốc (`medicine_lots`) và ghi vết biến động kho (`inventory_movements`) với loại `IN`, `OUT`, `ADJUSTMENT`.
5. **Cột Computed tự động tính:**
   - `invoices.total_amount` = `AS (subtotal - discount) PERSISTED`.
   - `invoice_items.total_price` = `AS (quantity * unit_price) PERSISTED`.
   - UI chỉ hiển thị kết quả tính toán xem trước (preview), không gửi trường tính toán này để cập nhật đè.

---

## 2. BẢNG MA TRẬN ÁNH XẠ CHI TIẾT 25 BẢNG CSDL SQL SERVER

| STT | Bảng CSDL (SQL Server) | Model TypeScript | Màn hình Frontend sử dụng | Khóa chính / Khóa ngoại | Chức năng nghiệp vụ |
|:---:|:---|:---|:---|:---|:---|
| 01 | `roles` | `RoleEntity` | UserManagement, PermissionsAudit | PK: `id` | Lưu trữ 3 vai trò: `ADMIN`, `DOCTOR`, `RECEPTIONIST` |
| 02 | `staff_users` | `StaffUser` | UserManagement, LoginPage, AdminDashboard | PK: `id`, FK: `role_id` | Tài khoản nhân viên nội bộ, trạng thái `ACTIVE`/`LOCKED`/`DISABLED` |
| 03 | `staff_refresh_tokens` | `StaffRefreshToken` | AuthContext (JWT) | PK: `id`, FK: `staff_user_id` | Quản lý phiên đăng nhập Refresh Token cho nhân viên |
| 04 | `patients` | `Patient` | PatientRecords, PatientReception, History | PK: `id`, Code: `patient_code` | Hồ sơ hành chính bệnh nhân, BHYT, dị ứng |
| 05 | `patient_phone_links` | `PatientPhoneLink` | PatientRecords, MedicalHistory | PK: `id`, FK: `patient_id` | Liên kết SĐT E.164 với bệnh nhân (SELF, PARENT...) |
| 06 | `otp_challenges` | `OtpChallenge` | MedicalHistory | PK: `id` | Lưu vết xác thực OTP 6 số để tra cứu hồ sơ |
| 07 | `appointments` | `Appointment` | AppointmentBooking, AppointmentManagement | PK: `id`, Code: `appointment_code` | Lịch hẹn khám bệnh trực tuyến hoặc tại quầy |
| 08 | `appointment_status_history`| `AppointmentStatusHistory` | AppointmentManagement | PK: `id`, FK: `appointment_id` | Lưu vết chuyển trạng thái lịch hẹn và lý do |
| 09 | `receptions` | `Reception` | PatientReception, ReceptionQueue, DoctorQueue | PK: `id`, Code: `reception_code` | Tiếp nhận bệnh nhân vào hàng chờ ưu tiên |
| 10 | `examinations` | `Examination` | EntExamination, DoctorQueue, History | PK: `id`, Code: `examination_code` | Phiên khám lâm sàng Tai Mũi Họng |
| 11 | `ent_findings` | `EntFinding` | EntExamination, MedicalHistory | PK: `id`, FK: `examination_id` | Tổn thương Tai, Mũi, Họng, Đầu cổ theo bên tổn thương |
| 12 | `medical_records` | `MedicalRecord` | MedicalRecordDetailPage, History | PK: `id`, Code: `medical_record_code` | Chẩn đoán, kết luận, phác đồ (`DRAFT`/`FINALIZED`) |
| 13 | `medicines` | `Medicine` | PharmacyInventory, PrescriptionForm | PK: `id`, Code: `medicine_code` | Danh mục thuốc biệt dược, giá bán, hoạt chất |
| 14 | `medicine_lots` | `MedicineLot` | PharmacyInventory, PrescriptionDispensing | PK: `id`, FK: `medicine_id` | Lô thuốc, hạn sử dụng, tồn kho thực tế |
| 15 | `medicine_suppliers` | `MedicineSupplier` | PharmacyInventory | PK: `id`, Code: `supplier_code` | Nhà cung cấp dược phẩm, mã số thuế |
| 16 | `inventory_movements` | `InventoryMovement` | PharmacyInventory | PK: `id`, FK: `medicine_lot_id` | Lịch sử xuất/nhập/điều chỉnh tồn kho |
| 17 | `prescriptions` | `Prescription` | PrescriptionForm, Dispensing, History | PK: `id`, Code: `prescription_code` | Đơn thuốc điện tử (`DRAFT`/`SIGNED`) |
| 18 | `prescription_items` | `PrescriptionItem` | PrescriptionForm, Dispensing, History | PK: `id`, FK: `prescription_id` | Chi tiết thuốc, liều lượng, số ngày dùng |
| 19 | `dispensations` | `Dispensation` | PrescriptionDispensing | PK: `id`, Code: `dispensation_code` | Phiếu cấp phát thuốc (`PENDING`/`COMPLETED`) |
| 20 | `dispensation_items` | `DispensationItem` | PrescriptionDispensing, Billing | PK: `id`, FK: `dispensation_id` | Chi tiết cấp thuốc theo lô FEFO đã chỉ định |
| 21 | `clinical_services` | `ClinicalService` | PatientReception, Billing | PK: `id`, Code: `service_code` | Bảng giá dịch vụ khám, nội soi, thủ thuật TMH |
| 22 | `visit_services` | `VisitService` | PatientReception, Billing | PK: `id`, FK: `reception_id` | Dịch vụ đã chỉ định cho lượt khám cụ thể |
| 23 | `invoices` | `Invoice` | BillingAndPaymentPage | PK: `id`, Code: `invoice_code` | Hóa đơn viện phí (`UNPAID`/`PARTIAL`/`PAID`) |
| 24 | `invoice_items` | `InvoiceItem` | BillingAndPaymentPage | PK: `id`, FK: `invoice_id` | Dòng chi phí dịch vụ hoặc thuốc phát |
| 25 | `payments` | `Payment` | BillingAndPaymentPage, AdminDashboard | PK: `id`, Code: `payment_code` | Giao dịch thu tiền mặt hoặc VietQR |

---

## 3. CHI TIẾT ÁNH XẠ THEO TỪNG MÀN HÌNH NGHIỆP VỤ

### 3.1. PHÂN HỆ NGƯỜI BỆNH (PATIENT PORTAL)

#### Màn hình: Đặt lịch khám bệnh (`AppointmentBookingPage.tsx`)
- **Route:** `/appointments/new`
- **Bảng CSDL tác động chính:** `appointments` (Table 07)

| UI Field | Tên cột SQL Server | Kiểu CSDL | Ràng buộc | Phân loại | Quy tắc Validate / Hành vi UI |
|:---|:---|:---|:---|:---:|:---|
| Họ và tên người khám | `full_name` | `NVARCHAR(100)` | NOT NULL | `INPUT` | Bắt buộc, tối đa 100 ký tự |
| Số điện thoại | `phone` | `VARCHAR(15)` | NOT NULL | `INPUT` | Định dạng SĐT Việt Nam (10 chữ số) |
| Ngày sinh | `birth_date` | `DATE` | NULL | `INPUT` | Tùy chọn, `YYYY-MM-DD`, không được vượt quá ngày hiện tại |
| Giới tính | `gender` | `VARCHAR(20)` | NOT NULL | `SELECT` | `MALE`, `FEMALE`, `OTHER`, `UNSPECIFIED` (mặc định: `MALE`) |
| Ngày hẹn khám | `appointment_date` | `DATE` | NOT NULL | `INPUT` | Bắt buộc, từ ngày mai trở đi (min = tomorrow) |
| Khung giờ hẹn | `appointment_time` | `TIME` | NOT NULL | `SELECT` | 12 khung giờ cố định từ 08:00 - 17:00 |
| Triệu chứng ban đầu | `symptoms` | `NVARCHAR(MAX)` | NULL | `INPUT` | Checkbox chọn triệu chứng TMH mẫu + mô tả thêm |
| Ghi chú bổ sung | `notes` | `NVARCHAR(500)` | NULL | `INPUT` | Tối đa 500 ký tự |
| Nguồn đặt lịch | `source` | `VARCHAR(20)` | NOT NULL | `HIDDEN` | Tự động gán `'ONLINE'` |
| Trạng thái lịch hẹn | `status` | `VARCHAR(20)` | NOT NULL | `HIDDEN` | Tự động gán `'PENDING'` (Chờ Lễ tân duyệt) |
| Mã lịch hẹn | `appointment_code` | `VARCHAR(20)` | UNIQUE | `GENERATED`| Tự sinh mã `AP{YYYYMMDD}{SEQ}` hiển thị trên màn hình thành công |

---

#### Màn hình: Tra cứu lịch sử khám qua OTP (`MedicalHistoryPage.tsx`)
- **Route:** `/medical-history`, `/my/medical-records`
- **Bảng CSDL tác động:** `patient_phone_links` (05), `otp_challenges` (06), `patients` (04), `receptions` (09), `examinations` (10), `ent_findings` (11), `medical_records` (12), `prescriptions` (17), `prescription_items` (18).

| Bước quy trình | Bảng CSDL | Cột CSDL | Phân loại | Hành vi và quy tắc UI |
|:---|:---|:---|:---:|:---|
| **B1: Nhập SĐT** | `otp_challenges` | `phone_e164` | `INPUT` | Chuẩn hóa SĐT về E.164 (+84...), kiểm tra tính hợp lệ |
| **B2: Gửi OTP** | `otp_challenges` | `otp_code_hash`, `expires_at` | `GENERATED` | Tạo mã OTP 6 số, đếm ngược 60 giây, lưu vết challenge |
| **B3: Xác thực OTP** | `otp_challenges` | `status` | `INPUT` | Người dùng nhập 6 chữ số, so khớp mã xác thực |
| **B4: Chọn bệnh nhân** | `patient_phone_links` | `patient_id`, `relationship_to_patient` | `SELECT` | Nếu 1 SĐT liên kết nhiều hồ sơ, hiển thị thẻ để người dùng chọn người cần xem |
| **B5: Thông tin BN** | `patients` | `full_name`, `birth_date`, `insurance_number`, `allergy_notes` | `READONLY` | Hiển thị thông tin hành chính, BHYT và ghi chú dị ứng |
| **B6: Lần khám** | `receptions` | `reception_code`, `received_at` | `READONLY` | Danh sách các lần khám theo ngày |
| **B7: Tổn thương TMH** | `ent_findings` | `region`, `side`, `description` | `READONLY` | Hiển thị chi tiết tổn thương Tai / Mũi / Họng / Đầu cổ |
| **B8: Chẩn đoán & Lời dặn**| `medical_records` | `diagnosis`, `conclusion`, `treatment_plan`, `doctor_advice`, `follow_up_date` | `READONLY` | Toàn bộ kết luận của Bác sĩ chuyên khoa |
| **B9: Đơn thuốc điện tử** | `prescriptions` + `items` | `prescription_code`, `medicine_name`, `dosage`, `frequency`, `duration_days`, `quantity` | `READONLY` | Bảng kê danh mục thuốc và hướng dẫn uống |

---

### 3.2. PHÂN HỆ LỄ TÂN & THU NGÂN (RECEPTIONIST & PHARMACY DESK)

#### Màn hình: Quản lý lịch hẹn (`AppointmentManagementPage.tsx`)
- **Route:** `/receptionist/appointments`
- **Bảng CSDL:** `appointments` (07), `appointment_status_history` (08)

| UI Component | Tên cột SQL Server | Kiểu CSDL | Phân loại | Quy tắc nghiệp vụ |
|:---|:---|:---|:---:|:---|
| Tabs lọc trạng thái | `appointments.status` | `VARCHAR(20)` | `SELECT` | `ALL`, `PENDING`, `CONFIRMED`, `CHECKED_IN`, `NO_SHOW`, `CANCELLED` |
| Lọc theo kênh nguồn | `appointments.source` | `VARCHAR(20)` | `SELECT` | `ONLINE`, `PHONE`, `AT_DESK` |
| Bảng danh sách | `appointment_code`, `patient_name`, `phone`, `appointment_date`, `time_slot` | Các kiểu | `READONLY` | Hiển thị chi tiết thông tin lịch hẹn |
| Nút "Duyệt lịch" | `status` -> `CONFIRMED` | `VARCHAR(20)` | `READONLY` | Chuyển PENDING sang CONFIRMED, ghi log history |
| Nút "Tiếp nhận" | `status` -> `CHECKED_IN` | `VARCHAR(20)` | `READONLY` | Điều hướng sang form tiếp nhận (`/receptionist/reception?fromApt=...`) |
| Nút "Không đến" | `status` -> `NO_SHOW` | `VARCHAR(20)` | `READONLY` | Đánh dấu người bệnh không đến khám |
| Modal "Dời lịch" | `appointment_date`, `appointment_time` | `DATE`, `TIME` | `INPUT` | Cho phép chọn ngày hẹn và giờ hẹn mới |
| Modal "Hủy lịch" | `appointment_status_history.reason` | `NVARCHAR(500)`| `SELECT/INPUT`| Bắt buộc chọn hoặc nhập lý do hủy lịch |
| Modal "Lịch sử trạng thái" | `appointment_status_history` | `from_status`, `to_status`, `changed_by_staff_id`, `changed_at` | `READONLY` | Audit trail theo dõi sự thay đổi trạng thái |

---

#### Màn hình: Tiếp nhận bệnh nhân (`PatientReceptionPage.tsx`)
- **Route:** `/receptionist/reception`
- **Bảng CSDL:** `receptions` (09), `patients` (04), `appointments` (07), `visit_services` (22), `clinical_services` (21)

| UI Field / Component | Tên cột SQL Server | Kiểu CSDL | Phân loại | Quy tắc nghiệp vụ |
|:---|:---|:---|:---:|:---|
| Hình thức tiếp nhận | `receptions.reception_type` | `VARCHAR(20)` | `SELECT` | `APPOINTMENT` (Có hẹn trước) hoặc `WALK_IN` (Đến khám trực tiếp) |
| Liên kết lịch hẹn | `receptions.appointment_id` | `BIGINT` | `HIDDEN` | Tự động gắn nếu tiếp nhận từ lịch hẹn, `NULL` nếu vãng lai |
| Tìm kiếm bệnh nhân có sẵn | `patients.id`, `patient_code` | `BIGINT` | `SELECT` | Tìm theo tên, số điện thoại hoặc mã bệnh nhân |
| Đăng ký mới: Họ và tên | `patients.full_name` | `NVARCHAR(100)` | `INPUT` | Bắt buộc khi tạo hồ sơ mới |
| Đăng ký mới: SĐT chính | `patients.phone` | `VARCHAR(15)` | `INPUT` | Bắt buộc |
| Đăng ký mới: Ngày sinh | `patients.birth_date` | `DATE` | `INPUT` | Tùy chọn |
| Đăng ký mới: Giới tính | `patients.gender` | `VARCHAR(20)` | `SELECT` | `MALE`, `FEMALE`, `OTHER`, `UNSPECIFIED` |
| Đăng ký mới: Địa chỉ | `patients.address` | `NVARCHAR(255)` | `INPUT` | Địa chỉ cư trú |
| Đăng ký mới: BHYT | `patients.insurance_number` | `VARCHAR(20)` | `INPUT` | Mã thẻ BHYT |
| Đăng ký mới: Dị ứng | `patients.allergy_notes` | `NVARCHAR(500)` | `INPUT` | Tiền sử dị ứng thuốc do bệnh nhân khai báo |
| Lý do khám ban đầu | `receptions.notes` | `NVARCHAR(500)` | `INPUT` | Lý do đến khám đưa vào hàng đợi |
| Chỉ định dịch vụ ban đầu | `visit_services.service_id` | `BIGINT` | `SELECT` | Chọn từ bảng giá `clinical_services` (Khám TMH, Nội soi...) |
| Trạng thái tiếp nhận | `receptions.status` | `VARCHAR(20)` | `HIDDEN` | Tự động gán `'WAITING'` |
| Thời điểm tiếp nhận | `receptions.received_at` | `DATETIME2` | `GENERATED` | Lấy thời điểm hiện tại của hệ thống |

---

#### Màn hình: Hàng chờ khám bệnh ưu tiên (`ReceptionQueuePage.tsx`)
- **Route:** `/receptionist/queue`
- **Bảng CSDL:** `receptions` (09), Query 28.1

| Cột hiển thị | Nguồn dữ liệu | Phân loại | Ý nghĩa nghiệp vụ |
|:---|:---|:---:|:---|
| **STT** | Thứ tự xếp hạng tự động | `GENERATED` | Vị trí thứ tự ưu tiên (Ca `IN_EXAM` mang dấu sao ★) |
| **Mã tiếp nhận** | `receptions.reception_code` | `READONLY` | Định danh lượt tiếp nhận |
| **Bệnh nhân & Thông tin** | `patients.full_name`, `gender`, `birth_date` | `READONLY` | Thông tin người bệnh |
| **Phân loại** | `receptions.reception_type` | `READONLY` | Badge: "Có lịch hẹn (APPOINTMENT)" hoặc "Khám trực tiếp (WALK_IN)" |
| **Giờ tiếp nhận** | `receptions.received_at` | `READONLY` | Thời điểm bệnh nhân check-in tại quầy |
| **Ghi chú & Lý do** | `receptions.notes`, `patients.allergy_notes` | `READONLY` | Triệu chứng tóm tắt và cảnh báo dị ứng |
| **Trạng thái** | `receptions.status` | `READONLY` | `WAITING`, `IN_EXAM`, `COMPLETED`, `CANCELLED` |
| **Thao tác** | Action Button | `READONLY` | Hủy lượt tiếp nhận hoặc điều hướng xem hồ sơ bệnh nhân |

---

#### Màn hình: Quản lý kho thuốc & Biến động kho (`PharmacyInventoryPage.tsx`)
- **Route:** `/receptionist/pharmacy`
- **Bảng CSDL:** `medicines` (13), `medicine_lots` (14), `medicine_suppliers` (15), `inventory_movements` (16)

| Tab chức năng | Bảng CSDL | Trường dữ liệu | Phân loại | Quy tắc nghiệp vụ |
|:---|:---|:---|:---:|:---|
| **Tab 1: Danh mục thuốc** | `medicines` | `medicine_code` (GEN), `medicine_name` (INPUT), `active_ingredient` (INPUT), `strength` (INPUT), `dosage_form` (INPUT), `unit` (INPUT), `sale_price` (INPUT), `status` (SELECT), `notes` (INPUT) | Đa dạng | Quản lý danh mục biệt dược niêm yết của phòng khám |
| **Tab 2: Lô thuốc FEFO** | `medicine_lots` | `medicine_id` (SELECT), `lot_number` (INPUT), `expiry_date` (INPUT), `quantity` (INPUT/COMPUTED), `status` (AVAILABLE, BLOCKED, QUARANTINED) | Đa dạng | Theo dõi hạn sử dụng từng lô; cảnh báo khi hạn < 60 ngày |
| **Tab 3: Nhà cung cấp** | `medicine_suppliers`| `supplier_code` (GEN), `supplier_name` (INPUT), `phone` (INPUT), `email` (INPUT), `tax_code` (INPUT), `address` (INPUT), `status` (SELECT) | Đa dạng | Quản lý công ty cung ứng dược phẩm |
| **Tab 4: Biến động kho** | `inventory_movements`| `medicine_lot_id` (SELECT), `movement_type` (SELECT: `IN`, `OUT`, `ADJUSTMENT`), `quantity_change` (INPUT: số âm/dương), `notes` (INPUT: bắt buộc) | Đa dạng | **Không sửa trực tiếp tồn kho**: Mọi thay đổi đều ghi nhận qua biến động có lý do |

---

#### Màn hình: Cấp phát thuốc theo đơn (`PrescriptionDispensingPage.tsx`)
- **Route:** `/receptionist/dispensing`
- **Bảng CSDL:** `dispensations` (19), `dispensation_items` (20), `prescriptions` (17), `inventory_movements` (16)

| Trường / Thao tác | Bảng CSDL | Phân loại | Quy tắc nghiệp vụ bắt buộc |
|:---|:---|:---:|:---|
| Điều kiện lọc đơn | `prescriptions.status` | `READONLY` | **Chỉ cho phép phát thuốc đối với đơn có trạng thái `SIGNED`** |
| Phiếu xuất phát thuốc | `dispensations.dispensation_code`| `GENERATED` | Tự động sinh mã `DP{YYYYMMDD}{SEQ}` khi Bác sĩ ký đơn |
| Gán lô thuốc FEFO | `dispensation_items.medicine_lot_id`| `SELECT` | Gợi ý lô thuốc còn hạn dùng gần nhất và còn tồn kho (`status = AVAILABLE`) |
| Thành tiền từng khoản | `dispensation_items.total_price` | `COMPUTED` | Cột tính toán trong CSDL: `quantity * unit_price`, UI chỉ xem trước |
| Nút "Xác nhận phát thuốc"| `dispensations.status` -> `COMPLETED` | `READONLY` | Khi bấm xác nhận: cập nhật trạng thái phiếu, tự động trừ tồn kho và ghi log `inventory_movements (OUT)` |
| Khóa dữ liệu | `dispensations` | `READONLY` | Sau khi hoàn tất (`COMPLETED`), toàn bộ màn hình trở thành chỉ đọc |

---

#### Màn hình: Hóa đơn & Thu ngân viện phí (`BillingAndPaymentPage.tsx`)
- **Route:** `/receptionist/billing`
- **Bảng CSDL:** `invoices` (23), `invoice_items` (24), `payments` (25), `visit_services` (22), `dispensation_items` (20)

| Trường dữ liệu | Bảng CSDL | Kiểu dữ liệu | Phân loại | Quy chuẩn tính toán & Nghiệp vụ |
|:---|:---|:---|:---:|:---|
| Lượt khám kết toán | `invoices.reception_id` | `BIGINT` | `SELECT` | Chọn lượt tiếp nhận để tổng hợp viện phí |
| Tổng tiền dịch vụ & thuốc| `invoices.subtotal` | `DECIMAL(12,2)` | `COMPUTED` | Tổng tiền các dòng trong `invoice_items` |
| Miễn giảm / Chiết khấu | `invoices.discount` | `DECIMAL(12,2)` | `INPUT` | Lễ tân nhập số tiền chiết khấu (mặc định 0) |
| **Tổng tiền phải thu** | `invoices.total_amount` | `DECIMAL(12,2)` | `COMPUTED` | **PERSISTED COMPUTED: `AS (subtotal - discount)`. UI CHỈ READONLY!** |
| Dòng chi phí chi tiết | `invoice_items` | `item_type`, `description`, `quantity`, `unit_price`, `total_price` | `READONLY` | Lấy từ `visit_services` (SERVICE) và `dispensation_items` (MEDICINE) |
| Số tiền thanh toán | `payments.amount` | `DECIMAL(12,2)` | `INPUT` | Số tiền thực nộp trong lần giao dịch này |
| Hình thức thanh toán | `payments.payment_method`| `VARCHAR(20)` | `SELECT` | `CASH` (Tiền mặt) hoặc `BANK_TRANSFER` (Chuyển khoản / VietQR) |
| Mã giao dịch ngân hàng | `payments.transaction_code`| `VARCHAR(100)` | `INPUT` | Mã đối soát ngân hàng khi thanh toán VietQR |
| Trạng thái hóa đơn | `invoices.status` | `VARCHAR(20)` | `GENERATED` | `PAID` (đã thu đủ), `PARTIAL` (thu một phần), `UNPAID` (chưa thu) |

---

### 3.3. PHÂN HỆ BÁC SĨ CHUYÊN KHOA (DOCTOR ENT CLINIC)

#### Màn hình: Khám chuyên khoa Tai Mũi Họng (`EntExaminationPage.tsx`)
- **Route:** `/doctor/examination`
- **Bảng CSDL:** `examinations` (10), `ent_findings` (11), `receptions` (09)

| UI Component | Bảng CSDL | Trường CSDL | Phân loại | Giá trị chuẩn hóa SQL Server |
|:---|:---|:---|:---:|:---|
| Mã ca khám | `examinations` | `examination_code` | `GENERATED` | Mã `EX{YYYYMMDD}{SEQ}` tự sinh |
| Lý do đến khám | `examinations` | `chief_complaint` | `INPUT` | Triệu chứng lâm sàng do bệnh nhân khai báo |
| Phân vùng giải phẫu | `ent_findings` | `region` | `SELECT` | `EAR` (Tai), `NOSE` (Mũi), `THROAT` (Họng), `HEAD_NECK` (Đầu cổ) |
| Vị trí bên tổn thương | `ent_findings` | `side` | `SELECT` | `LEFT` (Bên trái), `RIGHT` (Bên phải), `BOTH` (Hai bên), `NA` (Không áp dụng) |
| Mô tả tổn thương | `ent_findings` | `description` | `INPUT` | Chi tiết tổn thương thực thể (màng nhĩ, cuốn mũi, niêm mạc...) |
| Trạng thái ca khám | `examinations` | `status` | `HIDDEN` | `IN_PROGRESS` (khi đang khám) -> `COMPLETED` (khi hoàn tất) |

---

#### Màn hình: Hồ sơ bệnh án điện tử (`MedicalRecordDetailPage.tsx`)
- **Route:** `/doctor/medical-records`
- **Bảng CSDL:** `medical_records` (12)

| Trường dữ liệu | Tên cột SQL Server | Kiểu CSDL | Phân loại | Quy tắc bảo mật nghiệp vụ |
|:---|:---|:---|:---:|:---|
| Chẩn đoán xác định | `diagnosis` | `NVARCHAR(500)` | `INPUT` | Bắt buộc nhập chẩn đoán lâm sàng |
| Kết luận chuyên khoa | `conclusion` | `NVARCHAR(1000)` | `INPUT` | Nhận định diễn biến bệnh |
| Phác đồ điều trị | `treatment_plan` | `NVARCHAR(1000)` | `INPUT` | Phương án kháng sinh, kháng viêm, khí dung... |
| Lời dặn của Bác sĩ | `doctor_advice` | `NVARCHAR(1000)` | `INPUT` | Chế độ ăn uống, sinh hoạt, kiêng cữ |
| Ngày hẹn tái khám | `follow_up_date` | `DATE` | `INPUT` | Lịch hẹn tái khám chuyên khoa |
| **Trạng thái bệnh án** | `status` | `VARCHAR(20)` | `SELECT` | `DRAFT` (Bản nháp) hoặc `FINALIZED` (Đã chốt) |
| **Khóa hồ sơ (Locking)** | `finalized_at` | `DATETIME2` | `READONLY` | **Khi chuyển sang `FINALIZED`: Toàn bộ form chuyển sang `READONLY` vĩnh viễn** |

---

#### Màn hình: Kê đơn thuốc điện tử (`PrescriptionFormPage.tsx`)
- **Route:** `/doctor/prescriptions`
- **Bảng CSDL:** `prescriptions` (17), `prescription_items` (18)

| Trường dữ liệu | Bảng CSDL | Tên cột | Phân loại | Quy tắc nghiệp vụ |
|:---|:---|:---|:---:|:---|
| Chọn thuốc | `prescription_items` | `medicine_id` | `SELECT` | Lấy từ danh mục `medicines` đang hoạt động (`status = 'ACTIVE'`) |
| Liều dùng một lần | `prescription_items` | `dosage` | `INPUT` | Ví dụ: "1 viên/lần", "2 nhát xịt/lần" |
| Tần suất dùng | `prescription_items` | `frequency` | `INPUT` | Ví dụ: "2 lần/ngày (Sáng 1 - Tối 1)" |
| Số ngày điều trị | `prescription_items` | `duration_days` | `INPUT` | Số nguyên > 0 (ví dụ: 5, 7, 10 ngày) |
| Tổng số lượng cấp | `prescription_items` | `quantity` | `INPUT` | Số nguyên > 0 tương ứng với đơn vị tính |
| Hướng dẫn chi tiết | `prescription_items` | `instructions` | `INPUT` | Ví dụ: "Uống sau bữa ăn no 15 phút với nhiều nước" |
| Lời dặn chung đơn thuốc| `prescriptions` | `instructions` | `INPUT` | Lưu ý chung của đơn thuốc |
| **Trạng thái đơn thuốc**| `prescriptions` | `status` | `SELECT` | `DRAFT` (Nháp) hoặc `SIGNED` (Đã ký số) |
| **Ký số đơn thuốc** | `prescriptions` | `signed_at` | `GENERATED` | **Khi ký `SIGNED`: Tự động tạo bản ghi phát thuốc `dispensations (PENDING)` và khóa chỉnh sửa đơn** |

---

### 3.4. PHÂN HỆ QUẢN TRỊ HỆ THỐNG (ADMIN CONTROL PANEL)

#### Màn hình: Quản lý tài khoản nhân viên (`UserManagementPage.tsx`)
- **Route:** `/admin/users`
- **Bảng CSDL:** `staff_users` (02), `roles` (01)

| Trường dữ liệu | Tên cột SQL Server | Kiểu CSDL | Phân loại | Quy tắc bảo mật |
|:---|:---|:---|:---:|:---|
| Mã nhân viên | `staff_code` | `VARCHAR(20)` | `GENERATED` | Mã `NV-{ROLE}-{SEQ}` tự sinh |
| Tên đăng nhập | `username` | `VARCHAR(50)` | `INPUT` | Duy nhất (UNIQUE), viết liền không dấu |
| Mật khẩu khởi tạo | `password_hash` | `VARCHAR(255)` | `INPUT` | **Chỉ nhập khi tạo mới hoặc reset password. Không lưu/hiển thị dạng plain-text** |
| Họ và tên nhân viên | `full_name` | `NVARCHAR(100)` | `INPUT` | Bắt buộc |
| Email nội bộ | `email` | `VARCHAR(100)` | `INPUT` | Định dạng email hợp lệ |
| Số điện thoại | `phone` | `VARCHAR(15)` | `INPUT` | 10 chữ số |
| Vai trò phân quyền | `role_id` | `BIGINT` | `SELECT` | `ADMIN`, `DOCTOR`, `RECEPTIONIST` |
| Chứng chỉ hành nghề | `license_number` | `VARCHAR(50)` | `INPUT` | Áp dụng bắt buộc đối với Bác sĩ (`DOCTOR`) |
| **Trạng thái tài khoản** | `status` | `VARCHAR(20)` | `SELECT` | `ACTIVE` (Hoạt động), `LOCKED` (Tạm khóa), `DISABLED` (Vô hiệu hóa) |
| Đăng nhập gần nhất | `last_login_at` | `DATETIME2` | `READONLY` | Lưu vết thời điểm đăng nhập thành công gần nhất |

---

#### Màn hình: Bảng thống kê quản trị (`AdminDashboardPage.tsx`)
- **Route:** `/admin`
- **Nguyên tắc cốt lõi:** **KHÔNG CÓ BẢNG THỐNG KÊ RIÊNG (No statistics table).** Số liệu được tổng hợp trực tiếp từ các bảng giao dịch qua các hàm gom nhóm (Aggregate Functions: `COUNT`, `SUM`).

| Chỉ số hiển thị trên Dashboard | Nguồn bảng CSDL SQL Server | Phép tính tổng hợp |
|:---|:---|:---|
| **Tổng doanh thu thực thu** | `invoices` & `payments` | `SUM(payments.amount)` WHERE `status = 'SUCCESS'` |
| **Viện phí còn nợ (Pending)** | `invoices` | `SUM(invoices.total_amount - invoices.paid_amount)` WHERE `status != 'PAID'` |
| **Cơ cấu Doanh thu theo phương thức** | `payments` | Gom nhóm theo `payment_method` (`CASH` vs `BANK_TRANSFER`) |
| **Tổng lượt tiếp nhận khám** | `receptions` | `COUNT(receptions.id)` theo khoảng thời gian |
| **Tỷ lệ Có hẹn vs Vãng lai** | `receptions` | `COUNT(*)` GROUP BY `reception_type` (`APPOINTMENT` vs `WALK_IN`) |
| **Số lượng hồ sơ bệnh nhân** | `patients` | `COUNT(patients.id)` |
| **Số lượng liên kết SĐT OTP** | `patient_phone_links` | `COUNT(patient_phone_links.id)` |
| **Số ca khám hoàn tất** | `examinations` | `COUNT(examinations.id)` WHERE `status = 'COMPLETED'` |
| **Số đơn thuốc đã ký** | `prescriptions` | `COUNT(prescriptions.id)` WHERE `status = 'SIGNED'` |
| **Lô thuốc cảnh báo tồn kho** | `medicine_lots` | `COUNT(medicine_lots.id)` WHERE `quantity <= 30` OR `expiry_date <= CURRENT_DATE + 60` |
| **Bộ lọc thời gian** | Tham số truy vấn | Lọc theo Ngày (`DAY`), Tháng (`MONTH`), Năm (`YEAR`) |

---

## 4. QUY TẮC XẾP HÀNG ƯU TIÊN KHÁM BỆNH (QUERY 28.1)

Thuật toán xếp hàng ưu tiên hiển thị đồng nhất tại cả màn hình Lễ tân (`/receptionist/queue`) và Bác sĩ (`/doctor/queue`) tuân theo câu lệnh SQL sau:

```sql
SELECT 
    r.id AS reception_id,
    r.reception_code,
    r.patient_id,
    p.full_name AS patient_name,
    p.phone,
    p.gender,
    p.birth_date,
    r.reception_type,
    r.status AS reception_status,
    r.received_at,
    a.appointment_date,
    a.appointment_time,
    r.notes
FROM receptions r
INNER JOIN patients p ON r.patient_id = p.id
LEFT JOIN appointments a ON r.appointment_id = a.id
WHERE r.status IN ('WAITING', 'IN_EXAM')
ORDER BY 
    -- 1. Ca đang khám ghim đầu danh sách
    CASE WHEN r.status = 'IN_EXAM' THEN 0 ELSE 1 END ASC,
    -- 2. Có hẹn trước (APPOINTMENT) ưu tiên trước vãng lai (WALK_IN)
    CASE WHEN r.reception_type = 'APPOINTMENT' THEN 0 ELSE 1 END ASC,
    -- 3. Trong nhóm có hẹn: Xếp theo ngày hẹn và giờ hẹn tăng dần
    a.appointment_date ASC,
    a.appointment_time ASC,
    -- 4. Trong nhóm vãng lai: Xếp theo thời điểm tiếp nhận tăng dần
    r.received_at ASC;
```

---

## 5. CƠ CHẾ KHÓA BẢO MẬT DỮ LIỆU CHUYÊN MÔN

1. **Khóa bệnh án (`medical_records`):**
   - Khi `status = 'DRAFT'`: Bác sĩ được phép chỉnh sửa `diagnosis`, `conclusion`, `treatment_plan`, `doctor_advice`, `follow_up_date`.
   - Khi Bác sĩ bấm "Ký số & Chốt bệnh án": Cập nhật `status = 'FINALIZED'`, ghi nhận `finalized_at = CURRENT_TIMESTAMP`.
   - **Giao diện lập tức vô hiệu hóa (disabled) toàn bộ input và textarea, chuyển sang chế độ READONLY vĩnh viễn.**
2. **Khóa đơn thuốc (`prescriptions`):**
   - Khi `status = 'DRAFT'`: Bác sĩ được phép thêm, sửa, xóa các khoản thuốc trong `prescription_items`.
   - Khi Bác sĩ bấm "Ký số đơn thuốc": Cập nhật `status = 'SIGNED'`, ghi nhận `signed_at = CURRENT_TIMESTAMP`.
   - Hệ thống tự động tạo bản ghi phát thuốc `dispensations` ở trạng thái `'PENDING'` với danh sách lô thuốc gợi ý theo hạn dùng (`FEFO`). Đơn thuốc chuyển sang chế độ READONLY.
3. **Khóa phát thuốc (`dispensations`):**
   - Chỉ cho phép Dược tá phát thuốc cho đơn thuốc `SIGNED`.
   - Sau khi Dược tá bấm "Xác nhận phát thuốc": Cập nhật `status = 'COMPLETED'`, ghi vết biến động `inventory_movements (OUT)`, trừ tồn kho `medicine_lots.quantity`. Phiếu phát chuyển sang chế độ READONLY kèm nút "In phiếu".
4. **Bảo mật Quản trị viên cuối cùng:**
   - Hệ thống ngăn chặn việc khóa (`LOCKED`) hoặc vô hiệu hóa (`DISABLED`) tài khoản Quản trị viên (`ADMIN`) đang hoạt động duy nhất của phòng khám.

