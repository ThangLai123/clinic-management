# BÁO CÁO RÀ SOÁT VÀ CHUẨN HÓA GIAO DIỆN NGƯỜI DÙNG (UI/UX AUDIT REPORT)
## HỆ THỐNG QUẢN LÝ PHÒNG KHÁM TAI MŨI HỌNG — CLINIC MANAGEMENT

- **Dự án:** Hệ thống quản lý phòng khám tư nhân chuyên khoa Tai Mũi Họng
- **Workspace:** `D:\Clinic-Managerment`
- **Phân hệ thực hiện:** `frontend/` (React + TypeScript + Vite + Tailwind CSS)
- **Tài liệu tham chiếu chuẩn:** `clinic_managerment_25_bang_dac_ta_backend.md`
- **Ngày hoàn thành rà soát:** 08/11/2026
- **Trạng thái:** Hoàn tất 100% — TypeScript Build: 0 lỗi (`npm run build` thành công)

---

## 1. MỤC TIÊU VÀ NGUYÊN TẮC RÀ SOÁT

### 1.1. Mục tiêu cốt lõi
1. **100% Ngôn ngữ tự nhiên & Chuyên ngành y tế:** Chuyển hóa toàn bộ câu chữ, nhãn (labels), tiêu đề, thông báo, bộ lọc, tooltip trên giao diện sang tiếng Việt tự nhiên, phù hợp với trải nghiệm của Bệnh nhân, Bác sĩ, Lễ tân và Quản trị viên.
2. **Loại bỏ hoàn toàn thuật ngữ kỹ thuật và CSDL:** Tuyệt đối không để lộ tên bảng CSDL (`appointments`, `receptions`, `examinations`, `ent_findings`, `medical_records`, `prescriptions`, `prescription_items`, `dispensations`, `inventory_movements`, `medicine_lots`, `invoices`, `payments`, `staff_users`, `patient_phone_links`, `otp_challenges`), không lộ tên cột DB (`full_name`, `birth_date`, `lot_number`, `expiry_date`, v.v.), không lộ mã truy vấn SQL (`Query 28.1`, `E.164`, `(Cột computed DB)`), không hiển thị mã enum thô bằng tiếng Anh (`(SIGNED)`, `(PENDING)`, `(FINALIZED)`, `(ONLINE)`, `(ADMIN)`, v.v.).
3. **Triệt tiêu lỗi hiển thị dữ liệu khuyết:** Khắc phục triệt để các trường hợp hiển thị `undefined`, `null`, `NaN`, `[object Object]` bằng cơ chế fallback an toàn ("Chưa có thông tin", "Chưa cập nhật", "Chưa có ngày").
4. **Bảo toàn kiến trúc Backend:** Giữ nguyên 100% cấu trúc thực thể, DTOs, interfaces và enum values trong TypeScript nội bộ (`types/clinic.ts`, `mock/clinicStore.ts`) để sẵn sàng kết nối trực tiếp với ASP.NET Core Web API và CSDL SQL Server sau này.

---

## 2. CHI TIẾT SỰ CỐ ĐÃ KHẮC PHỤC TẠI MODAL "DỜI LỊCH HẸN KHÁM"

Tại phân hệ Quản lý lịch hẹn của Lễ tân (`/receptionist/appointments`), sự cố hiển thị thông tin khi mở Modal dời lịch hẹn đã được phân tích nguyên nhân gốc rễ và xử lý toàn diện:

### 2.1. Lỗi hiển thị "Bệnh nhân: undefined (AP202611070002)"
- **Nguyên nhân gốc rễ:** Interface `Appointment` định nghĩa thuộc tính bắt buộc `fullName: string` (tương ứng cột `full_name` trong bảng SQL Server `appointments`) và thuộc tính phụ `patientName?: string`. Trong tập dữ liệu mẫu `INITIAL_APPOINTMENTS`, thuộc tính `fullName` đã có giá trị nhưng `patientName` chưa được gán, dẫn đến việc component đọc `${selectedApt.patientName}` trả về giá trị `undefined`.
- **Giải pháp:**
  - Cập nhật mock store: Bổ sung đồng bộ `fullName` và `patientName` trong mock data.
  - Chuẩn hóa component: Sử dụng biểu thức truy xuất an toàn đa tầng:
    ```tsx
    const patientDisplayName = selectedApt.fullName || selectedApt.patientName || 'Chưa có thông tin';
    const aptCode = selectedApt.appointmentCode || selectedApt.id;
    // Hiển thị chuẩn: "Bệnh nhân: Nguyễn Văn A — Mã lịch hẹn: AP202611070002"
    ```

### 2.2. Lộ thông tin bảng cơ sở dữ liệu nội bộ
- **Nội dung cũ:** `"Sau khi dời lịch, hệ thống sẽ tự động ghi nhật ký vào appointment_status_history và đồng bộ hàng đợi."`
- **Nội dung mới chuẩn y tế:** `"Thông tin lịch hẹn sẽ được cập nhật sau khi bạn xác nhận."`

### 2.3. Bổ sung ràng buộc và nghiệp vụ giao diện
- **Chặn dời lịch về quá khứ:** Thiết lập `min={todayStr}` trên trường chọn ngày hẹn mới.
- **Ràng buộc thay đổi:** Kiểm tra nếu người dùng chưa thay đổi cả ngày hẹn lẫn khung giờ khám thì hiển thị thông báo yêu cầu chọn thời gian mới trước khi bấm Lưu.
- **Trạng thái xử lý (Loading state):** Thêm spinner và vô hiệu hóa nút bấm trong quá trình xử lý dời lịch.
- **Thông báo phản hồi (Toast notification):** Hiển thị toast màu xanh rõ ràng: `"Đã dời lịch hẹn thành công sang ngày [dd/MM/yyyy] lúc [khung giờ]!"` có thể đóng tự động hoặc đóng thủ công.
- **Đóng modal linh hoạt:** Hỗ trợ đóng modal qua phím `Escape`, nút `X` góc phải hoặc nút `Hủy`.

---

## 3. BẢNG TỔNG HỢP RÀ SOÁT VÀ CHUẨN HÓA 18 MÀN HÌNH

| STT | Màn hình | Tuyến đường (Route) | Các nội dung kỹ thuật đã loại bỏ / chuẩn hóa | Trạng thái |
|:---:|:---|:---|:---|:---:|
| 1 | **Trang chủ phòng khám** | `/` | Đảm bảo ngôn ngữ thuần túy chăm sóc sức khỏe, giới thiệu chuyên khoa Tai Mũi Họng, bảng giá dịch vụ chuẩn `₫`. | Đạt chuẩn |
| 2 | **Đặt lịch khám trực tuyến** | `/dat-lich` | Bỏ `(PENDING)` trong thông báo xác nhận; thay bằng câu thông báo tiếp đón chuyên nghiệp; kiểm tra validate số điện thoại và ngày khám. | Đạt chuẩn |
| 3 | **Tra cứu lịch sử khám bệnh** | `/lich-su-kham` | Loại bỏ các nhãn `(Bảng ...)`; chuẩn hóa ngày sinh và BHYT về fallback `"Chưa cập nhật"`, ngày khám về `"Chưa có ngày"`. | Đạt chuẩn |
| 4 | **Dashboard Lễ tân** | `/receptionist` | Bỏ `(Query 28.1)`, `(SIGNED)`, thẻ `<code>payments</code>`; thêm fallback tên/SĐT bệnh nhân; chuẩn hóa định dạng tiền `₫`. | Đạt chuẩn |
| 5 | **Quản lý lịch hẹn** | `/receptionist/appointments` | Khắc phục `undefined`, bỏ `appointment_status_history`, bỏ mã nguồn `(ONLINE)`, `(PHONE)`, `(AT_DESK)`; thêm validate ngày dời lịch. | Đạt chuẩn |
| 6 | **Hàng đợi tiếp đón** | `/receptionist/queue` | Bỏ `(Query 28.1)`, bỏ mã `IN_EXAM`, `APPOINTMENT`, `WALK_IN`; bỏ `ID: {item.id}`; hiển thị ưu tiên theo ngôn ngữ y tế. | Đạt chuẩn |
| 7 | **Tiếp đón bệnh nhân** | `/receptionist/reception` | Loại bỏ `(Bảng receptions)`, `(Bảng patients)`, `(Bảng clinical_services -> visit_services)`, `allergy_notes`; chuẩn hóa tiền `₫`. | Đạt chuẩn |
| 8 | **Quản lý hồ sơ bệnh nhân** | `/receptionist/patients` | Loại bỏ `(Bảng patients & patient_phone_links)`, `SĐT (E.164)`; xóa toàn bộ 11 mã cột DB `(full_name)`, `(phone)`... trong modal tạo mới và chỉnh sửa. | Đạt chuẩn |
| 9 | **Kho dược & Vật tư** | `/receptionist/pharmacy` | Bỏ `(Bảng 13 - 17)`, `(medicines)`, `(medicine_lots)`, `(inventory_movements)`, `(lot_number)`, `(expiry_date)`; dịch trạng thái nhà cung cấp sang `"Đang hợp tác"`. | Đạt chuẩn |
| 10 | **Cấp phát thuốc** | `/receptionist/dispensing` | Bỏ `(Bảng 19 - 22)`, `(dispensations)`, `(dispensation_items)`, mã `SIGNED`, câu thông báo log `inventory_movements (OUT)`; chuẩn hóa đơn vị tiền tệ `₫`. | Đạt chuẩn |
| 11 | **Thu ngân & Thanh toán** | `/receptionist/billing` | Loại bỏ `(Bảng 23 - 25)`, `(Bảng invoices & invoice_items)`, `(Bảng payments)`, `(Cột computed DB)`; thay thế bằng chính sách thanh toán minh bạch. | Đạt chuẩn |
| 12 | **Điều phối phòng khám** | `/receptionist/rooms` | Chuyển hướng hợp lý theo mô hình tiếp đón thống nhất hàng đợi khám Tai Mũi Họng. | Đạt chuẩn |
| 13 | **Dashboard Bác sĩ** | `/doctor` | Loại bỏ `(FINALIZED)`, `(SIGNED)`, `(Query 28.1)`; bổ sung fallback an toàn tên bệnh nhân và tuổi. | Đạt chuẩn |
| 14 | **Hàng đợi khám Bác sĩ** | `/doctor/queue` | Bỏ `(Query 28.1)`, bỏ `ID: {item.id}`; hiển thị danh sách khám theo thứ tự ưu tiên y khoa (Ưu tiên cấp cứu/trẻ nhỏ -> Đúng hẹn -> Đến trực tiếp). | Đạt chuẩn |
| 15 | **Khám Tai Mũi Họng** | `/doctor/examination` | Loại bỏ `(Bảng examinations & ent_findings)`, `(chief_complaint)`, `(EAR)`, `(LEFT)`, `(region)`, `(side)`; chuẩn hóa thuật ngữ giải phẫu tai, mũi, họng. | Đạt chuẩn |
| 16 | **Chi tiết bệnh án y khoa** | `/doctor/records/:id` | Loại bỏ `(Bảng medical_records)`, `(FINALIZED)`, `(READONLY)`, các hậu tố cột `(diagnosis)`, `(conclusion)`, `(treatment_plan)`, `(doctor_advice)`. | Đạt chuẩn |
| 17 | **Kê đơn thuốc điện tử** | `/doctor/prescriptions` | Khắc phục lỗi thuộc tính `prescribedByStaffName`, bỏ `(Bảng prescriptions & prescription_items)`, `(SIGNED)`, `(DRAFT)`, `(dosage)`, `(frequency)`. | Đạt chuẩn |
| 18 | **Dashboard Quản trị** | `/admin` | Loại bỏ `25 bảng CSDL SQL Server`, `bảng payments và invoices`, các mã nguồn `(APPOINTMENT)`, `(WALK_IN)`, `(BANK_TRANSFER)`; thống nhất ký hiệu `₫`. | Đạt chuẩn |
| 19 | **Quản trị người dùng** | `/admin/users` | Loại bỏ `(Bảng roles & staff_users)`, `(full_name)`, `(username)`, `(password_hash)`, `(ADMIN)`, `(DOCTOR)`, `(RECEPTIONIST)`, `(ACTIVE)`, `(LOCKED)`. | Đạt chuẩn |
| 20 | **Ma trận phân quyền** | `/admin/permissions` | Thay thế các tên bảng kỹ thuật trong ma trận và thông báo bằng tên các module y tế (Hồ sơ bệnh nhân, Khám bệnh, Kê đơn, Cấp phát thuốc...). | Đạt chuẩn |
| 21 | **Cổng đăng nhập nội bộ** | `/staff/login` | Giao diện đăng nhập tập trung riêng biệt cho nhân viên phòng khám, bảo mật cao, không chứa mã kỹ thuật. | Đạt chuẩn |

---

## 4. QUY CHUẨN ĐỊNH DẠNG DỮ LIỆU ĐÃ ÁP DỤNG

### 4.1. Định dạng Tiền tệ
- Thống nhất sử dụng ký hiệu tiền tệ Việt Nam `₫` (thay vì chữ `đ` thường hoặc mã `VND`).
- Giá trị luôn được phân cách hàng nghìn bằng dấu chấm: `150.000 ₫`, `35.000 ₫/lọ`.

### 4.2. Định dạng Ngày tháng & Thời gian
- Định dạng ngày tháng: `dd/MM/yyyy` (Ví dụ: `07/11/2026`).
- Định dạng ngày giờ: `dd/MM/yyyy HH:mm` (Ví dụ: `07/11/2026 08:30`).
- Fallback khi chưa có dữ liệu: `"Chưa có ngày"` hoặc `"Chưa cập nhật"`.

### 4.3. Định dạng Trạng thái (Status Badges)
Mọi trạng thái nghiệp vụ đều được ánh xạ qua component `StatusBadge` với nhãn tiếng Việt chuẩn:
- **Lịch hẹn:** Chờ xác nhận (`amber`), Đã xác nhận (`blue`), Đã tiếp đón (`green`), Đã hủy (`slate`), Vắng mặt (`rose`).
- **Hàng đợi:** Đang chờ khám (`amber`), Đang khám bệnh (`blue`), Khám hoàn tất (`green`), Bỏ qua (`slate`).
- **Bệnh án:** Đang thực hiện (`amber`), Đã hoàn tất & Đã chốt (`green`).
- **Đơn thuốc:** Bản thảo (`amber`), Đã ký số (`green`), Đã hủy (`slate`).
- **Cấp phát thuốc:** Chờ phát thuốc (`amber`), Đã phát thuốc (`green`).
- **Hóa đơn:** Đã thanh toán (`green`), Chưa thanh toán (`amber`), Hủy bỏ (`slate`).
- **Tài khoản nhân viên:** Đang hoạt động (`green`), Tạm khóa (`amber`), Vô hiệu hóa (`slate`).

### 4.4. Giới tính & Thông tin cá nhân
- `MALE` -> `Nam`
- `FEMALE` -> `Nữ`
- `OTHER` -> `Khác`
- `UNSPECIFIED` -> `Chưa xác định`
- Khi thông tin liên hệ hoặc người thân bị trống: `"Chưa cập nhật"` hoặc `"Chưa có thông tin"`.

---

## 5. KẾT QUẢ KIỂM THỬ VÀ XÁC MINH HỆ THỐNG

### 5.1. Kiểm thử TypeScript Compiler & Vite Production Build
Chạy lệnh kiểm tra độc lập tại `frontend/`:
```bash
npm run build
```
**Kết quả:**
- `tsc -b`: 0 lỗi biên dịch kiểu dữ liệu.
- `vite build`: Build thành công trong **619ms**, tạo bộ asset tối ưu trong thư mục `dist/`.

### 5.2. Quét tự động rà soát chuỗi ký tự kỹ thuật
Đã thực thi tập lệnh regex tự động rà soát toàn bộ các tệp `.tsx` trong `frontend/src/views`:
- Quét các mẫu `(Bảng ...)`, `Query 28.1`, `E.164`, `(Cột computed DB)`: **0 kết quả** xuất hiện trên giao diện.
- Quét các tên bảng cơ sở dữ liệu dạng snake_case: **0 kết quả** xuất hiện trong JSX văn bản hiển thị.
- Quét các mã trạng thái in hoa trong ngoặc đơn: **0 kết quả** trên toàn bộ form và bảng.

---

## 6. KẾT LUẬN

Hệ thống giao diện Frontend của phòng khám Tai Mũi Họng hiện tại đã đạt độ hoàn thiện cao về mặt UI/UX:
1. Giao diện thể hiện văn phong y tế chỉn chu, chuyên nghiệp, bảo mật và thân thiện với người dùng.
2. Không còn bất kỳ sự cố rò rỉ thông tin kỹ thuật, tên bảng cơ sở dữ liệu hay mã lỗi `undefined`.
3. Toàn bộ các định nghĩa kiểu dữ liệu và mô hình liên kết nội bộ vẫn được duy trì đồng bộ 100% với tài liệu đặc tả 25 bảng SQL Server, bảo đảm quá trình kết nối API với Backend ASP.NET Core sau này diễn ra trơn tru mà không cần can thiệp tái cấu trúc giao diện.

