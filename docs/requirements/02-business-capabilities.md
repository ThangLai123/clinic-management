# BẢN ĐẶC TẢ NĂNG LỰC NGHIỆP VỤ PHÒNG KHÁM TAI MŨI HỌNG
## DỰ ÁN: HỆ THỐNG QUẢN LÝ PHÒNG KHÁM TƯ NHÂN TAI MŨI HỌNG (CLINIC MANAGEMENT)
### MÃ TÀI LIỆU: `DOC-REQ-02` | TASK: `T1-FINAL-REVIEW` | PHIÊN BẢN: `1.1.0` | TRẠNG THÁI: `CHUẨN HÓA BẢN CUỐI`

---

## MỤC LỤC
1. [Phương pháp tiếp cận & Khung tham chiếu chuẩn](#1-phương-pháp-tiếp-cận--khung-tham-chiếu-chuẩn)
2. [Hành trình bệnh nhân toàn diện (End-to-End Patient Journey)](#2-hành-trình-bệnh-nhân-toàn-diện-end-to-end-patient-journey)
3. [Bản đồ các phân hệ năng lực nghiệp vụ (Business Capability Map)](#3-bản-đồ-các-phân-hệ-năng-lực-nghiệp-vụ-business-capability-map)
4. [Đặc tả phân biệt các khái niệm nghiệp vụ cốt lõi](#4-đặc-tả-phân-biệt-các-khái-niệm-nghiệp-vụ-cốt-lõi)
5. [Phân tích luồng chuẩn (Happy Path) & Luồng ngoại lệ (Edge Cases)](#5-phân-tích-luồng-chuẩn-happy-path--luồng-ngoại-lệ-edge-cases)
6. [Đề xuất bổ sung các năng lực nghiệp vụ còn thiếu](#6-đề-xuất-bổ-sung-các-năng-lực-nghiệp-vụ-còn-thiếu)
7. [Phân loại năng lực: MVP, Mở rộng & Yêu cầu pháp lý thẩm định](#7-phân-loại-năng-lực-mvp-mở-rộng--yêu-cầu-pháp-lý-thẩm-định)
8. [Ghi nhận quyết định thiết kế & Điểm chờ xác nhận](#8-ghi-nhận-quyết-định-thiết-kế--điểm-chờ-xác-nhận)

---

## 1. PHƯƠNG PHÁP TIẾP CẬN & KHUNG THAM CHIẾU CHUẨN

### 1.1. Định hướng tiếp cận hướng miền nghiệp vụ y tế (Domain-Driven Healthcare Approach)
Hệ thống quản lý phòng khám chuyên khoa Tai Mũi Họng (TMH) không được xây dựng bằng cách chuyển đổi máy móc các bảng cơ sở dữ liệu có sẵn thành các thao tác CRUD (Create - Read - Update - Delete). Cách tiếp cận kỹ thuật thuần túy đó bỏ qua tính liên tục của dữ liệu lâm sàng, các tình huống khẩn cấp, biến động của dòng bệnh nhân và các ràng buộc pháp lý y tế.

Hệ thống được tái định hướng theo chuỗi giá trị vận hành:
```
Thực tế vận hành phòng khám TMH
  ──> Hành trình bệnh nhân (Patient Journey)
    ──> Bản đồ năng lực nghiệp vụ (Business Capabilities)
      ──> Quy tắc nghiệp vụ & Quy trình lâm sàng (Business & Clinical Rules)
        ──> Ma trận phân quyền kiểm soát truy cập (RBAC & Data Boundaries)
          ──> Kiến trúc dữ liệu y tế (Data Architecture & Schema Design)
```

### 1.2. Khung tham chiếu chuẩn & Tình trạng kiểm chứng nguồn thông tin

Nhằm bảo đảm tính khách quan khoa học, tài liệu phân định rõ ba tầng thông tin tham chiếu:

| Nhóm tham chiếu | Nguồn thông tin | Tình trạng kiểm chứng | Mức độ áp dụng vào dự án |
| :--- | :--- | :---: | :--- |
| **Tiêu chuẩn y tế quốc tế** | **HL7 FHIR Release 5.0** (`https://hl7.org/fhir/`) | **Đã kiểm chứng** *(Truy cập trực tiếp tài liệu chuẩn)* | Tham chiếu mô hình tài nguyên y tế: `Patient`, `Appointment`, `Encounter`, `Condition`, `Observation`, `Procedure`, `MedicationRequest`, `MedicationDispense`, `Invoice`. |
| **Hệ thống EMR mã nguồn mở** | **OpenEMR Features** (`open-emr.org`) & **Bahmni EMR** (`bahmni.org`) | **Đã kiểm chứng** *(Đối soát danh mục tính năng thực tế)* | Tham chiếu luồng phòng khám ngoại trú: Phân luồng tiếp đón (Triage), Hàng đợi phòng khám, Sinh hiệu, Đơn thuốc điện tử và Quản lý kho dược. |
| **Khung pháp lý y tế Việt Nam** | - Thông tư 13/2025/TT-BYT (Hồ sơ bệnh án điện tử)<br>- Thông tư 26/2025/TT-BYT (Kê đơn thuốc ngoại trú)<br>- Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15<br>- Nghị định 102/2025/NĐ-CP (Dữ liệu y tế) | **Nguồn pháp lý đang được cập nhật/thẩm định** *(Cần bộ phận pháp chế rà soát văn bản ban hành chính thức)* | Đóng vai trò là các nguyên tắc hướng dẫn (Guiding Principles) về tính bảo mật, đóng băng bệnh án, chống rò rỉ dữ liệu cá nhân. **Tài liệu KHÔNG tuyên bố hệ thống đã đạt chứng nhận tuân thủ pháp luật khi chưa qua kiểm định độc lập.** |
| **Quyết định thiết kế dự án** | Mô hình phòng khám tư nhân TMH vừa và nhỏ tại Việt Nam | **Lựa chọn thiết kế nội bộ** | Tinh gọn 3 tác nhân (Lễ tân, Bác sĩ, Bệnh nhân), không triển khai vai trò Admin/Dược sĩ riêng trong MVP nhằm tối ưu nguồn lực. |

---

## 2. HÀNH TRÌNH BỆNH NHÂN TOÀN DIỆN (END-TO-END PATIENT JOURNEY)

Hành trình của một bệnh nhân tại phòng khám Tai Mũi Họng trải qua 7 giai đoạn liền mạch:

```
[GĐ 1: ĐẶT HẸN / TÌM HIỂU]
       │ (Đặt lịch online hoặc đến trực tiếp)
       ▼
[GĐ 2: TIẾP ĐÓN & CHECK-IN] ──(Hủy/Bỏ về)──> [KẾT THÚC TIẾP NHẬN]
       │ (Hợp lệ: Cấp số, phân phòng)
       ▼
[GĐ 3: KHÁM LÂM SÀNG & SINH HIỆU]
       │
       ├────> [GĐ 3.1: CHỈ ĐỊNH & THỰC HIỆN THỦ THUẬT TMH]
       │               (Nội soi TMH, Hút dịch xoang, Làm sạch tai...)
       ▼
[GĐ 4: CHẨN ĐOÁN & KẾT THÚC KHÁM]
       │
       ├────> [GĐ 4.1: KÊ ĐƠN THUỐC ĐIỆN TỬ (THEO LÔ)] (Tùy chọn: có thể không kê thuốc)
       ├────> [GĐ 4.2: CHỈ ĐỊNH TÁI KHÁM] (Tùy chọn)
       ▼
[GĐ 5: LẬP HÓA ĐƠN & THANH TOÁN]
       │ (Tổng hợp: Khám + Thủ thuật + Thuốc)
       ▼
[GĐ 6: CẤP PHÁT THUỐC AN TOÀN & TƯ VẤN]
       │ (Đối chiếu đơn, kiểm tra số lô/hạn dùng, xuất kho dược, bàn giao)
       ▼
[GĐ 7: THEO DÕI SAU KHÁM & TÁI KHÁM]
         (Patient Portal an toàn, Nhắc lịch hẹn tự động)
```

### Chi tiết từng giai đoạn:
1. **Giai đoạn 1: Tiếp cận & Đăng ký hẹn (Discovery & Booking):**
   - Bệnh nhân truy cập Landing Page tìm hiểu bảng giá dịch vụ, đội ngũ bác sĩ chuyên khoa TMH.
   - Bệnh nhân đăng ký lịch hẹn online theo khung giờ hoặc lựa chọn đến trực tiếp phòng khám (Walk-in).
2. **Giai đoạn 2: Tiếp đón & Phân luồng (Reception & Triage / Queue):**
   - Lễ tân xác minh thông tin nhân khẩu, tiền sử dị ứng thuốc ban đầu.
   - Tạo lượt tiếp nhận (`Admission/Check-in`), cấp số thứ tự vào hàng đợi và điều phối vào phòng khám TMH phù hợp.
   - *Xử lý rẽ nhánh:* Bệnh nhân chờ lâu tự bỏ về hoặc chuyển viện khẩn cấp -> Lễ tân hủy tiếp nhận, không sinh lượt khám rỗng.
3. **Giai đoạn 3: Khám lâm sàng & Thủ thuật chuyên khoa (Clinical Examination & Procedures):**
   - Điều dưỡng/Bác sĩ đo sinh hiệu ban đầu (Mạch, Huyết áp, Thân nhiệt, SpO2, Cân nặng - đặc biệt cần thiết cho bệnh nhi và người cao tuổi).
   - Bác sĩ thăm khám cơ quan: Tai (màng nhĩ, ống tai), Mũi (vách ngăn, cuốn mũi, xoang), Họng - Thanh quản (amidan, vòm họng, dây thanh). Bác sĩ chỉ truy cập hồ sơ trong phạm vi công việc được phân công.
   - Chỉ định thực hiện dịch vụ/thủ thuật: Nội soi Tai Mũi Họng, xông khí dung, hút dịch xoang Proetz, lấy dị vật, làm sạch ráy tai.
   - Lưu trữ 2 - 4 hình ảnh nội soi điển hình vào thư mục bảo mật của hệ thống để làm bằng chứng chẩn đoán và in phiếu kết quả.
4. **Giai đoạn 4: Chẩn đoán & Kế hoạch điều trị (Diagnosis & Care Plan):**
   - Bác sĩ kết luận chẩn đoán xác định (gắn mã ICD-10), tư vấn giải thích bệnh lý.
   - Kê đơn thuốc điện tử có đối chiếu số lô và hạn dùng (nếu có chỉ định điều trị nội khoa). Nếu ca bệnh chỉ cần can thiệp thủ thuật hoặc tư vấn chăm sóc, bác sĩ hoàn tất khám mà **không kê đơn thuốc**.
   - Chỉ định tái khám (nếu cần theo dõi sau đợt điều trị).
   - Bác sĩ ký duyệt hoàn tất lượt khám -> Đóng băng dữ liệu chuyên môn.
5. **Giai đoạn 5: Viện phí & Thanh toán (Billing & Payment):**
   - Lễ tân lập hóa đơn chi tiết đa mục gồm: Tiền công khám + Tiền thủ thuật/dịch vụ TMH + Tiền thuốc (nếu có).
   - Bệnh nhân thanh toán viện phí bằng tiền mặt hoặc quét mã QR chuyển khoản (hỗ trợ thanh toán toàn phần hoặc từng đợt).
6. **Giai đoạn 6: Xuất dược an toàn & Bàn giao thuốc (Dispensing & Counseling):**
   - Sau khi hóa đơn được thanh toán đủ, lễ tân kiểm tra đơn thuốc, đối chiếu số lô và hạn dùng theo nguyên tắc FEFO (hạn gần xuất trước), đóng gói và bàn giao kèm hướng dẫn sử dụng.
   - *Xử lý ngoại lệ:* Kho tạm thời thiếu thuốc -> Phát số lượng hiện có theo từng lô, ghi nhận nợ thuốc phát bù hoặc điều chỉnh trừ tiền hóa đơn.
7. **Giai đoạn 7: Chăm sóc sau khám & Tái khám (Post-care & Portal):**
   - Bệnh nhân về nhà có thể đăng nhập Patient Portal (sau xác thực OTP và đối chiếu thông tin định danh chính chủ) để xem lại hướng dẫn dùng thuốc, hình ảnh nội soi (qua API bảo mật) và đơn thuốc.
   - Hệ thống tự động gửi tin nhắn nhắc nhở khi đến ngày tái khám.

---

## 3. BẢN ĐỒ CÁC PHÂN HỆ NĂNG LỰC NGHIỆP VỤ (BUSINESS CAPABILITY MAP)

Hệ thống được cấu thành từ **09 phân hệ năng lực nghiệp vụ độc lập**, không bị gò bó bởi số lượng bảng CSDL ban đầu:

```
+-------------------------------------------------------------------------------------------------------+
|                       BẢN ĐỒ NĂNG LỰC NGHIỆP VỤ HỆ THỐNG PHÒNG KHÁM TAI MŨI HỌNG                      |
+-------------------------------------------------------------------------------------------------------+
| [CAP-01] TIẾP ĐÓN & QUẢN TRỊ BỆNH NHÂN   │ [CAP-02] ĐIỀU PHỐI HÀNG ĐỢI & PHÒNG KHÁM                   |
| • Quản lý nhân khẩu & Mã bệnh nhân       │ • Hàng đợi số thứ tự thời gian thực                        |
| • Tiếp nhận Online & Trực tiếp (Walk-in) │ • Điều phối tải giữa các phòng khám TMH                    |
| • Quản lý hủy tiếp nhận / Bỏ về          │ • Màn hình gọi loa / hiển thị số thứ tự                    |
+------------------------------------------+------------------------------------------------------------+
| [CAP-03] QUẢN TRỊ LỊCH HẸN & ĐẶT KHÁM    │ [CAP-04] LÂM SÀNG TAI MŨI HỌNG (ENCOUNTER & RECORD)        |
| • Đặt hẹn trực tuyến qua Web Portal      │ • Ghi nhận bệnh sử, triệu chứng cơ năng                    |
| • Xác nhận, đổi giờ, hủy hẹn             │ • Theo dõi Sinh hiệu (Mạch, HA, Nhiệt độ, Cân nặng, SpO2)  |
| • Quản lý bệnh nhân vắng mặt (No-show)   │ • Khám chuyên khoa Tai - Mũi - Họng                        |
| • Tự động nhắc lịch hẹn qua SMS/Zalo     │ • Chẩn đoán xác định / phân biệt (Mã ICD-10)               |
|                                          │ • Giới hạn phạm vi truy cập hồ sơ của bác sĩ (Need-to-Know)|
|                                          │ • Đóng băng bệnh án điện tử sau khi ký duyệt               |
+------------------------------------------+------------------------------------------------------------+
| [CAP-05] DỊCH VỤ, THỦ THUẬT & NỘI SOI    │ [CAP-06] DƯỢC & ĐƠN THUỐC ĐIỆN TỬ                          |
| • Danh mục dịch vụ, thủ thuật TMH        │ • Kê đơn điện tử theo hoạt chất & biệt dược                |
| • Quản lý chỉ định & thực hiện thủ thuật │ • Quản lý số lô, hạn sử dụng & tồn kho theo lô (FEFO)      |
| • Quản lý hình ảnh nội soi TMH bảo mật   │ • Cấp phát thuốc an toàn & xử lý phát thiếu kho            |
|   (Lưu private, chặn URL công khai)      │ • Khám không kê thuốc (Non-prescriptive encounter)        |
| • Báo cáo kết quả thủ thuật chuyên khoa  │ • Phân tích tồn kho nâng cao (Chuyển Giai đoạn 2)          |
+------------------------------------------+------------------------------------------------------------+
| [CAP-07] TÀI CHÍNH & VIỆN PHÍ            │ [CAP-08] CỔNG THÔNG TIN BỆNH NHÂN (PORTAL)                 |
| • Lập hóa đơn chi tiết đa mục (Itemized) │ • Landing Page giới thiệu dịch vụ & bảng giá               |
| • Thu ngân đa phương thức (Tiền mặt, QR) │ • Đăng nhập an toàn đa tầng (OTP + Xác minh danh tính)     |
| • Hỗ trợ thanh toán từng phần/nhiều đợt  │ • Tách bạch hồ sơ dùng chung số điện thoại                 |
| • In biên lai, phiếu thu hợp lệ          │ • Tra cứu bệnh án, đơn thuốc & ảnh nội soi qua API an toàn |
+------------------------------------------+------------------------------------------------------------+
| [CAP-09] QUẢN TRỊ AN TOÀN & LỊCH SỬ VẾT (AUDIT TRAIL & SYSTEM CONTROL)                                |
| • Kiểm soát truy cập dựa trên vai trò (RBAC) & Đối tượng dữ liệu (Object-level security)              |
| • Ghi vết lịch sử chỉnh sửa và truy cập dữ liệu y tế cá nhân (Audit Logging)                          |
| • Phân quyền quản lý danh mục và cấu hình ca trực bác sĩ                                              |
+-------------------------------------------------------------------------------------------------------+
```

---

## 4. ĐẶC TẢ PHÂN BIỆT CÁC KHÁI NIỆM NGHIỆP VỤ CỐT LÕI

Để loại bỏ hoàn toàn sự nhầm lẫn giữa các bước hành chính và chuyên môn, hệ thống chuẩn hóa định nghĩa các khái niệm theo chuẩn quốc tế HL7 FHIR:

| Khái niệm nghiệp vụ | Thuật ngữ chuẩn FHIR | Bản chất nghiệp vụ | Thời điểm phát sinh | Vòng đời & Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **Lịch hẹn (Appointment)** | `Appointment` | Thỏa thuận trước về thời gian bệnh nhân dự kiến đến phòng khám. | Trước khi bệnh nhân đến khám. | `PROPOSED` (Đăng ký) -> `PENDING` (Chờ duyệt) -> `BOOKED/CONFIRMED` (Đã duyệt) -> `ARRIVED` (Đã đến) / `CANCELLED` (Đã hủy) / `NOSHOW` (Không đến). |
| **Tiếp nhận (Admission / Check-in)** | `Encounter (Triage status)` | Hành động hành chính xác nhận bệnh nhân đã có mặt tại quầy lễ tân để chuẩn bị vào khám. | Khi bệnh nhân trình diện tại quầy lễ tân. | `WAITING` (Chờ khám trong hàng đợi) -> `IN_CONSULTATION` (Đã vào phòng) -> `CANCELLED` (Hủy do bệnh nhân bỏ về). |
| **Lượt khám (Encounter)** | `Encounter` | Tương tác chuyên môn trực tiếp giữa Bác sĩ và Bệnh nhân tại một phòng khám trong một khoảng thời gian. | Khi bác sĩ nhấn "Bắt đầu khám". | `PLANNED` -> `IN_PROGRESS` (Đang khám) -> `ON_HOLD` (Tạm dừng làm thủ thuật) -> `COMPLETED` (Hoàn tất) -> `CANCELLED` (Hủy khám). |
| **Hồ sơ bệnh án (Clinical Record)** | `Composition / Condition` | Tài liệu y khoa ghi nhận diễn tiến bệnh sử, sinh hiệu, tổn thương thực thể, chẩn đoán và hướng điều trị. | Được lập và cập nhật trong Lượt khám. | `DRAFT/IN_PROGRESS` (Đang soạn thảo) -> `FINAL/COMPLETED` (Ký duyệt, đóng băng không thể sửa đổi) -> `AMENDED` (Ghi chú đính kèm nếu có sửa chữa). |
| **Đơn thuốc (Prescription)** | `MedicationRequest` | Chỉ định y khoa của bác sĩ về các loại thuốc, liều lượng, số lượng và cách dùng cho bệnh nhân. | Sau khi có chẩn đoán xác định. Có thể không phát sinh (0 đơn thuốc). | `DRAFT` (Đang chọn thuốc) -> `ACTIVE/SIGNED` (Bác sĩ ký phát hành) -> `DISPENSED` (Đã phát thuốc) -> `CANCELLED` (Hủy đơn). |
| **Cấp phát thuốc (Dispensing)** | `MedicationDispense` | Hoạt động xuất thuốc từ kho dược, kiểm tra số lô, hạn dùng và bàn giao kèm tư vấn cho người bệnh. | Sau khi đơn thuốc được ký và hóa đơn viện phí được thanh toán. | `PREPARATION` (Soạn thuốc) -> `COMPLETED` (Đã bàn giao) -> `PARTIAL` (Phát thiếu một phần) -> `DECLINED` (Bệnh nhân từ chối lấy thuốc). |
| **Hóa đơn viện phí (Invoice)** | `Invoice / Claim` | Bảng kê chi tiết các khoản chi phí phát sinh trong lượt khám (công khám, thủ thuật, thuốc). | Sau khi bác sĩ hoàn tất khám và kê đơn. | `DRAFT` -> `ISSUED/UNPAID` (Chờ thanh toán) -> `PARTIALLY_PAID` (Trả một phần) -> `PAID` (Đã thanh toán đủ) -> `CANCELLED` (Hủy hóa đơn). |
| **Thanh toán (Payment)** | `PaymentReconciliation` | Giao dịch tài chính ghi nhận số tiền người bệnh thực nộp vào phòng khám. | Khi người bệnh nộp tiền tại quầy thu ngân. | `PENDING` -> `SUCCESSFUL` (Thành công) -> `FAILED` (Thất bại) -> `REFUNDED` (Hoàn tiền). Một hóa đơn có thể có nhiều bản ghi thanh toán. |

---

## 5. PHÂN TÍCH LUỒNG CHUẨN (HAPPY PATH) & LUỒNG NGOẠI LỆ (EDGE CASES)

### 5.1. Luồng hoạt động tiêu chuẩn (Happy Path)
1. Bệnh nhân đặt hẹn trực tuyến -> Lễ tân duyệt lịch hẹn.
2. Bệnh nhân đến đúng giờ -> Lễ tân check-in, cấp số thứ tự vào Phòng TMH 1.
3. Bác sĩ gọi bệnh nhân -> Đo sinh hiệu, khám tai, mũi, họng.
4. Bác sĩ chỉ định nội soi TMH -> Thực hiện nội soi, chụp ảnh tổn thương đưa vào vùng lưu trữ bảo mật -> Đính kèm bệnh án.
5. Bác sĩ kết luận chẩn đoán: "Viêm xoang hàm cấp (J01.0)", kê đơn 3 loại thuốc (Kháng sinh, Giảm viêm, Nước xịt mũi) có kiểm tra số lô/hạn dùng, hẹn tái khám sau 5 ngày.
6. Bác sĩ ký hoàn tất lượt khám -> Dữ liệu chuyên môn đóng băng.
7. Lễ tân xuất hóa đơn gộp (Khám + Nội soi + Thuốc).
8. Bệnh nhân quét mã QR thanh toán -> Lễ tân in phiếu thu.
9. Lễ tân đối chiếu đơn thuốc, kiểm tra hạn dùng theo nguyên tắc FEFO, xuất kho theo lô, hướng dẫn sử dụng và bàn giao cho bệnh nhân.

### 5.2. Các luồng ngoại lệ và Phương án xử lý nghiệp vụ chuẩn

| Mã ngoại lệ | Tình huống ngoại lệ | Rủi ro nếu thiết kế máy móc | Giải pháp thiết kế & Quy tắc xử lý nghiệp vụ |
| :--- | :--- | :--- | :--- |
| **EX-01** | **Khám trực tiếp không đặt lịch (Walk-in)** | Lỗi hệ thống nếu bắt buộc phải có `appointment_id` mới tạo được `admission`. | Cho phép tạo trực tiếp bản ghi `admissions` loại "WALK-IN" mà không cần liên kết `appointments`. Trường `appointment_id` được phép nhận giá trị `NULL`. |
| **EX-02** | **Bệnh nhân đặt hẹn nhưng không đến (No-show)** | Lịch hẹn bị treo vĩnh viễn ở trạng thái chờ; gây ảo giác về số lượng bệnh nhân trong ngày. | Sau khung giờ hẹn 45 phút mà bệnh nhân không trình diện, hệ thống tự động hoặc cho phép lễ tân chuyển trạng thái lịch hẹn sang `NOSHOW`. Không tạo bản ghi `admissions`. |
| **EX-03** | **Tiếp nhận xong nhưng bỏ về / Chuyển viện cấp cứu** | Tự động sinh `examinations` gây sai lệch báo cáo y tế và doanh thu khám bệnh. | Lễ tân chuyển trạng thái `admissions` sang `CANCELLED` (ghi rõ lý do: Chờ lâu bỏ về / Chuyển viện). **Không bao giờ tạo bản ghi `examinations` rỗng.** |
| **EX-04** | **Lượt khám KHÔNG kê đơn thuốc** | Báo lỗi Foreign Key hoặc lỗi tính toán viện phí nếu bắt buộc mọi khám bệnh phải có đơn thuốc. | Quan hệ giữa `examinations` và `prescriptions` là `1 --- 0..1`. Nếu không kê đơn, hóa đơn chỉ tính tiền khám và tiền thủ thuật. Hệ thống vẫn cho phép đóng lượt khám bình thường. |
| **EX-05** | **Kho thuốc tạm thời không đủ số lượng kê đơn** | Lễ tân không thể xuất kho hoặc làm sai lệch số tồn kho thực tế. | Hỗ trợ phát thuốc từng phần (`PARTIAL_DISPENSE`). Lễ tân ghi nhận số lượng thực xuất theo từng lô tại `dispensation_items`; số lượng còn thiếu được đánh dấu để phát bổ sung lần sau hoặc trừ bớt tiền tương ứng trên hóa đơn. |
| **EX-06** | **Thanh toán viện phí nhiều lần / nhiều phương thức** | Hóa đơn chỉ gắn 1 phương thức thanh toán khiến thu ngân không thể ghi nhận vừa trả tiền mặt vừa chuyển khoản. | Tách độc lập `invoices (1) --- (1..*) payments`. Một hóa đơn có thể có nhiều giao dịch thanh toán con với các phương thức khác nhau cho đến khi tổng thanh toán bằng tổng hóa đơn. |
| **EX-07** | **Bệnh nhân từ chối mua thuốc tại phòng khám** | Ép bệnh nhân mua thuốc phòng khám mới cho hoàn tất thủ tục. | Bệnh nhân có quyền chỉ thanh toán tiền khám/thủ thuật và cầm đơn thuốc điện tử ra ngoài mua. Lễ tân hủy dòng thuốc trên hóa đơn phòng khám, đơn thuốc vẫn được lưu trữ phục vụ theo dõi y khoa. |
| **EX-08** | **Chỉnh sửa bệnh án sau khi đã hoàn tất** | Bác sĩ sửa đổi làm thay đổi bản chất pháp lý của hồ sơ y khoa trong quá khứ. | Tuyệt đối không cho phép ghi đè (`OVERWRITE`) trực tiếp lên trường dữ liệu bệnh án đã `COMPLETED`. Mọi bổ sung phải tạo bản ghi phụ lục (`amendments/addendum`) lưu vết ai bổ sung, thời gian và lý do bổ sung. |

---

## 6. ĐỀ XUẤT BỔ SUNG CÁC NĂNG LỰC NGHIỆP VỤ CÒN THIẾU

So với mô hình 16 bảng CSDL ban đầu, một phòng khám chuyên khoa Tai Mũi Họng cần được bổ sung 06 nhóm năng lực nghiệp vụ trọng yếu:

### 6.1. Quản lý Sinh hiệu bệnh nhân (Vital Signs)
- **Ý nghĩa y khoa:** Đo các chỉ số sinh tồn cơ bản: Mạch (bpm), Huyết áp (mmHg), Nhiệt độ (°C), Tần số thở, SpO2 (%), Cân nặng (kg), Chiều cao (cm).
- **Tính đặc thù chuyên khoa TMH:** Cực kỳ quan trọng đối với bệnh nhi (để tính liều thuốc theo cân nặng chính xác đến từng mg) và người cao tuổi có bệnh nền tim mạch trước khi thực hiện các thủ thuật gây kích thích vùng hầu họng hoặc khí dung thuốc giãn phế quản.
- **Vị trí tích hợp:** Thuộc phân hệ Khám lâm sàng (`CAP-04`), thực hiện ngay đầu buổi khám.

### 6.2. Quản lý Danh mục Dịch vụ & Thủ thuật Tai Mũi Họng (Procedures & Services)
- **Ý nghĩa vận hành:** Các dịch vụ và thủ thuật chuyên khoa chiếm tỷ trọng hoạt động và giá trị chuyên môn then chốt của phòng khám Tai Mũi Họng:
  - Nội soi Tai - Mũi - Họng chẩn đoán.
  - Hút dịch mũi xoang, thông vòi nhĩ, rửa xoang qua lỗ thông Proetz.
  - Xông khí dung mũi họng / họng thanh quản.
  - Lấy dị vật tai, lấy dị vật mũi, gắp dị vật họng đơn giản.
  - Làm sạch ráy tai dưới kính soi/nội soi, rạch chích nhọt ống tai.
- **Vị trí tích hợp:** Thuộc phân hệ Thủ thuật (`CAP-05`), gắn liền với lượt khám và tham gia cấu thành dòng mục trên Hóa đơn viện phí.

### 6.3. Quản lý An toàn Hình ảnh Nội soi Tai Mũi Họng (Endoscopy Image Management)
- **Ý nghĩa chuyên môn:** Tiêu chuẩn vàng của chẩn đoán Tai Mũi Họng hiện đại là hình ảnh nội soi. Bác sĩ cần chụp lại từ 2 đến 4 hình ảnh tiêu biểu (hình ảnh màng nhĩ thủng, niêm mạc xoang phù nề, amidan mưng mủ, hạt xơ dây thanh) để đính kèm vào bệnh án và in phiếu kết quả.
- **Yêu cầu an toàn & Bảo mật:**
  - Tệp hình ảnh được lưu trữ trong thư mục riêng biệt được bảo vệ của máy chủ Backend (Private Storage, ví dụ `/storage/secure/endoscopy/`).
  - Hình ảnh được liên kết chặt chẽ với lượt khám (`examination_id`) và mã bệnh nhân (`patient_id`).
  - Quyền truy cập phải thông qua API có xác thực và phân quyền (ví dụ `GET /api/examinations/:examId/endoscopy-images/:imageId`). **Tuyệt đối không sử dụng URL công khai không bảo vệ (Unprotected public static URLs).**

### 6.4. Quản lý Kho dược phẩm theo Lô sản xuất & Hạn sử dụng (Batch & Expiry Date Management)
- **Ý nghĩa an toàn người bệnh:** Thuốc kháng sinh, kháng viêm và dung dịch nhỏ tai/mũi bắt buộc phải quản lý số lô và hạn dùng để phục vụ cấp phát an toàn và truy xuất nguồn gốc khi có yêu cầu thu hồi thuốc.
- **Nguyên tắc FEFO (First Expired, First Out):** Khi xuất phát thuốc, hệ thống phải ưu tiên trừ kho những lô có hạn dùng gần nhất; cảnh báo khi thuốc sắp hết hạn hoặc đã hết hạn (tuyệt đối chặn kê đơn).
- **Phân kỳ chức năng:**
  - **MVP:** Dự kiến quản lý số lô (`batch_number`), hạn sử dụng (`expiry_date`) và tồn kho theo lô phục vụ cấp phát an toàn cơ bản.
  - **Mở rộng (Phase 2):** Phân tích tồn kho nâng cao (phân tích ABC/VED, dự báo nhu cầu dự trữ dược phẩm).

### 6.5. Chi tiết hóa đơn viện phí đa mục (Itemized Invoicing)
- **Ý nghĩa minh bạch tài chính:** Hóa đơn viện phí không thể là một con số tổng duy nhất gắn vào lượt khám, mà phải có cấu trúc danh mục chi tiết:
  - Dòng 1: Tiền công khám chuyên khoa TMH.
  - Dòng 2..N: Tiền từng thủ thuật thực hiện (Nội soi, Khí dung, Hút xoang...).
  - Dòng N+1..M: Tiền từng loại thuốc theo đơn (Số lượng × Đơn giá).
- **Vị trí tích hợp:** Bổ sung thực thể Chi tiết hóa đơn (`invoice_items`) liên kết với `invoices`.

### 6.6. Nhật ký kiểm tra vết (Audit Trail & Change History)
- **Ý nghĩa pháp lý & An toàn thông tin:** Lưu lại mọi hành động nhạy cảm trong hệ thống:
  - Ai đã xem bệnh án của bệnh nhân nào, vào thời điểm nào, từ IP nào?
  - Ai đã thay đổi trạng thái hóa đơn hoặc xác nhận thanh toán?
  - Lịch sử thay đổi thông tin hành chính bệnh nhân.
- **Vị trí tích hợp:** Phân hệ An toàn hệ thống (`CAP-09`).

---

## 7. PHÂN LOẠI NĂNG LỰC: MVP, MỞ RỘNG & YÊU CẦU PHÁP LÝ THẨM ĐỊNH

| Nhóm năng lực | Bắt buộc cho MVP (Giai đoạn 1) | Mở rộng (Giai đoạn 2 - Patient Portal) | Yêu cầu pháp lý & Tiêu chuẩn cần thẩm định |
| :--- | :--- | :--- | :--- |
| **Tiếp đón & Quản lý bệnh nhân** | - Quản lý nhân khẩu bệnh nhân cơ bản.<br>- Tiếp nhận Walk-in và Online.<br>- Quản lý hàng đợi và phân phòng khám. | - Check-in tự phục vụ qua Kiosk hoặc quét mã QR trên điện thoại.<br>- Tích hợp nhận diện CCCD gắn chip. | - Tuân thủ quy định bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP (chờ thẩm định Luật 91/2025/QH15). |
| **Quản lý lịch hẹn** | - Đặt hẹn online qua Web Landing Page.<br>- Xem, xác nhận và hủy lịch hẹn tại quầy lễ tân. | - Tự động đồng bộ lịch vào Google Calendar/Zalo Calendar của bệnh nhân.<br>- Tự động gửi SMS nhắc hẹn đa kênh. | - Bảo đảm sự đồng ý của bệnh nhân khi nhận thông báo qua phương tiện điện tử. |
| **Lâm sàng Tai Mũi Họng** | - Ghi nhận bệnh sử, triệu chứng TMH.<br>- Nhập sinh hiệu cơ bản (Mạch, HA, Thân nhiệt, Cân nặng).<br>- Chẩn đoán gắn mã ICD-10 TMH.<br>- Đóng băng bệnh án khi hoàn tất.<br>- Giới hạn truy cập bệnh án theo phân công. | - Mẫu bệnh án TMH nâng cao theo phân nhóm bệnh (Viêm tai giữa, Viêm mũi xoang, Viêm thanh quản).<br>- Lịch sử so sánh diễn tiến bệnh đa thời kỳ. | - Tham chiếu Thông tư 13/2025/TT-BYT về mẫu hồ sơ bệnh án điện tử ngoại trú. |
| **Dịch vụ, Thủ thuật & Nội soi** | - Danh mục dịch vụ, thủ thuật TMH chuẩn.<br>- Chỉ định thủ thuật và in phiếu chỉ định.<br>- Đính kèm kết quả và 2-4 ảnh nội soi TMH lưu trữ an toàn (chặn URL công khai). | - Tích hợp chụp trực tiếp từ nguồn video máy nội soi (Capture Card Direct Interface).<br>- Thư viện mẫu mô tả nội soi tự động. | - Tiêu chuẩn lưu trữ hình ảnh y khoa DICOM/JPEG chuẩn theo quy định lưu trữ dữ liệu y tế. |
| **Dược & Đơn thuốc** | - Kê đơn thuốc điện tử từ danh mục chuẩn.<br>- Hỗ trợ lượt khám không có đơn thuốc.<br>- Quản lý số lô, hạn sử dụng và xuất kho thuốc an toàn theo lô (FEFO). | - Cảnh báo tương tác thuốc và liều dùng tối đa theo độ tuổi/cân nặng.<br>- Báo cáo phân tích tồn kho nâng cao, dự báo nhu cầu dự trữ dược phẩm. | - Tham chiếu Thông tư 26/2025/TT-BYT về chuẩn kê đơn thuốc điện tử ngoại trú; chuẩn bị cổng liên thông Đơn thuốc Quốc gia. |
| **Viện phí & Thu ngân** | - Hóa đơn chi tiết đa mục (Khám + Thủ thuật + Thuốc).<br>- Thu ngân tiền mặt và Chuyển khoản QR.<br>- Thanh toán một lần sau khi khám. | - Thanh toán online trực tiếp qua cổng thanh toán VNPay/MoMo trên Portal.<br>- Tích hợp hóa đơn điện tử khởi tạo từ máy tính tiền. | - Tuân thủ quy định về hóa đơn chứng từ tài chính và thuế y tế tư nhân. |
| **Cổng Bệnh nhân (Portal)** | - Landing Page giới thiệu phòng khám.<br>- Form đặt lịch khám nhanh chóng. | - Xác thực bảo mật đa tầng (OTP SĐT + Xác minh định danh chính chủ).<br>- Tách bạch hồ sơ gia đình dùng chung SĐT.<br>- Tra cứu toàn bộ bệnh án, đơn thuốc, ảnh nội soi qua API an toàn. | - Đảm bảo nguyên tắc bảo mật dữ liệu y tế cá nhân (Nghị định 102/2025/NĐ-CP); chống lỗ hổng BOLA/IDOR. |

---

## 8. GHI NHẬN QUYẾT ĐỊNH THIẾT KẾ & ĐIỂM CHỜ XÁC NHẬN

### 8.1. Các quyết định thiết kế đã được thống nhất (Design Decisions)
1. **Quyết định 1 (Mô hình 3 tác nhân tinh gọn):** Giữ nguyên ba tác nhân: **Lễ tân**, **Bác sĩ**, **Bệnh nhân**. Không xây dựng giao diện riêng cho Quản trị viên (Admin) hoặc Dược sĩ (Pharmacist) trong phạm vi MVP. Mọi thao tác quản lý danh mục và cấu hình được phân quyền nhúng vào tài khoản Bác sĩ trưởng / Quản lý lễ tân.
2. **Quyết định 2 (Lễ tân phụ trách cấp phát thuốc an toàn MVP):** Phù hợp với mô hình thực tế của phòng khám tư nhân quy mô vừa và nhỏ; Lễ tân xuất thuốc theo đúng đơn bác sĩ đã ký, kiểm tra số lô và hạn dùng (FEFO) sau khi hóa đơn đã được thanh toán đủ.
3. **Quyết định 3 (Đóng băng bệnh án & Giới hạn truy cập):** Sau khi bác sĩ ký `COMPLETED`, bệnh án và đơn thuốc chuyển sang chế độ bất biến (Immutable). Bác sĩ chỉ được truy cập hồ sơ trong phạm vi công việc và phân công chuyên môn hợp lệ.
4. **Quyết định 4 (Hóa đơn gộp thanh toán sau khám):** Bệnh nhân chỉ thanh toán một lần duy nhất sau khi đã hoàn tất khám, thủ thuật và kê đơn thuốc để tối ưu hóa trải nghiệm người bệnh.
5. **Quyết định 5 (Quản lý hình ảnh nội soi bảo mật):** Tệp ảnh nội soi lưu trên thư mục bảo mật máy chủ, quyền xem qua API kiểm soát, tuyệt đối không dùng URL công khai.
6. **Quyết định 6 (Quản lý lô và hạn sử dụng trong MVP):** Đưa việc quản lý số lô, hạn dùng và tồn kho theo lô vào MVP phục vụ an toàn cấp phát; các phân tích tồn kho nâng cao chuyển sang giai đoạn sau.

### 8.2. Danh mục các điểm nghiệp vụ chờ xác nhận (Pending Decisions)

| STT | Điểm nghiệp vụ cần xác nhận | Phương án đề xuất | Tác động kỹ thuật đến Task T5 |
| :---: | :--- | :--- | :--- |
| **01** | **Phương thức lưu trữ hình ảnh nội soi TMH:** Lưu tệp ảnh an toàn trên máy chủ phòng khám (Private Local Storage) hay dùng Cloud Storage (S3 / MinIO)? | **Đề xuất: Lưu private local storage trong MVP**, truy xuất qua API route có xác thực. Tuyệt đối không dùng public URL. | Bảng `endoscopy_images` chứa `file_path`, `caption`, `organ_type`, `examination_id`. |
| **02** | **Xử lý khoản chi phí khi kho thiếu thuốc:** Bệnh nhân đã thanh toán đủ tiền thuốc nhưng kho chỉ có một phần? | **Đề xuất:** Lễ tân xuất phiếu hẹn lấy phần còn lại, hoặc tạo phiếu chi hoàn tiền (`refund`) cho dòng thuốc bị thiếu và hủy dòng đó trên đơn. | Schema `payments` cần hỗ trợ loại giao dịch `REFUND`. |
| **03** | **Cơ chế xác thực bệnh nhân tại quầy khi trùng SĐT:** Nhiều người thân cùng số điện thoại? | **Đề xuất:** Tìm kiếm theo SĐT hiển thị danh sách các bệnh nhân trực thuộc (kèm Họ tên và Năm sinh) để lễ tân chọn đúng người. | Ràng buộc `phone_number` trong bảng `patients` **không được đặt UNIQUE**. |
| **04** | **Phân chia tiền khám và tiền thủ thuật:** Có trường hợp bệnh nhân chỉ đến làm thủ thuật (rửa mũi xoang theo hẹn) mà không tính tiền khám lại? | **Đề xuất:** Cho phép cấu hình miễn phí công khám trong lượt khám chỉ thực hiện thủ thuật định kỳ. | Bảng `invoice_items` cho phép linh hoạt các dòng mục chi phí. |

---

## 9. KẾT LUẬN TÀI LIỆU

Tài liệu [02-business-capabilities.md](file:///d:/clinic-management/docs/requirements/02-business-capabilities.md) đã hoàn thành việc tái định hướng toàn diện hệ thống quản lý phòng khám Tai Mũi Họng dựa trên năng lực nghiệp vụ y tế thực tế, chuẩn hóa hành trình bệnh nhân, bổ sung 6 năng lực chuyên khoa cốt lõi còn thiếu và làm rõ ranh giới giữa MVP với các yêu cầu pháp lý dài hạn. Tài liệu này là cơ sở trực tiếp để triển khai Phân tích khoảng cách (Gap Analysis) và chuẩn hóa CSDL ở Task T5.
