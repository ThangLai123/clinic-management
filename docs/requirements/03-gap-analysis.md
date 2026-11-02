# BÁO CÁO PHÂN TÍCH KHOẢNG CÁCH (GAP ANALYSIS)
## GIỮA ĐẶC TẢ / ERD BAN ĐẦU VÀ THỰC TẾ VẬN HÀNH PHÒNG KHÁM TAI MŨI HỌNG
### MÃ TÀI LIỆU: `DOC-REQ-03` | TASK: `T1-FINAL-REVIEW` | PHIÊN BẢN: `1.1.0` | TRẠNG THÁI: `CHUẨN HÓA BẢN CUỐI`

---

## MỤC LỤC
1. [Bối cảnh & Mục đích phân tích khoảng cách](#1-bối-cảnh--mục-đích-phân-tích-khoảng-cách)
2. [Bảng ma trận đối chiếu tổng thể (ERD ban đầu vs Thực tế lâm sàng TMH)](#2-bảng-ma-trận-đối-chiếu-tổng-thể-erd-ban-đầu-vs-thực-tế-lâm-sàng-tmh)
3. [Phân tích chi tiết 8 khoảng cách nghiệp vụ trọng yếu (Core Gaps)](#3-phân-tích-chi-tiết-8-khoảng-cách-nghiệp-vụ-trọng-yếu-core-gaps)
4. [Đánh giá rủi ro nếu giữ nguyên thiết kế 16 bảng ban đầu](#4-đánh-giá-rủi-ro-nếu-giữ-nguyên-thiết-kế-16-bảng-ban-đầu)
5. [Lộ trình kiến nghị nâng cấp mô hình CSDL cho Task T5](#5-lộ-trình-kiến-nghị-nâng-cấp-mô-hình-csdl-cho-task-t5)
6. [Ghi nhận quyết định thiết kế & Bảng câu hỏi chờ xác nhận](#6-ghi-nhận-quyết-định-thiết-kế--bảng-câu-hỏi-chờ-xác-nhận)
7. [Kết luận & Khuyến nghị kỹ thuật](#7-kết-luận--khuyến-nghị-kỹ-thuật)

---

## 1. BỐI CẢNH & MỤC ĐÍCH PHÂN TÍCH KHOẢNG CÁCH

### 1.1. Bối cảnh kỹ thuật
Trong giai đoạn đầu của dự án Clinic Management, hệ thống được khởi tạo với một sơ đồ thực thể liên kết (ERD) giả định gồm 16 bảng: `patients`, `appointments`, `receptionists`, `admissions`, `clinic_rooms`, `doctors`, `examinations`, `medical_records`, `prescriptions`, `prescription_items`, `medicines`, `suppliers`, `dispensations`, `dispensation_items`, `invoices`, `payments`.

Mô hình này là một bước khởi đầu tốt để định hình các thực thể cơ bản, tuy nhiên nó phản ánh góc nhìn kỹ thuật đơn giản hóa của bài toán quản lý chung, chưa đi sâu vào các đặc thù lâm sàng, an toàn cấp phát thuốc và nghiệp vụ tài chính của một **phòng khám tư nhân chuyên khoa Tai Mũi Họng** ngoại trú tại Việt Nam.

### 1.2. Mục đích tài liệu
Báo cáo Phân tích khoảng cách (Gap Analysis) này nhằm:
- Nhận diện toàn diện các điểm yếu, lỗ hổng nghiệp vụ và sự thiếu hụt thực thể dữ liệu giữa ERD ban đầu so với quy trình vận hành lâm sàng thực tế.
- Đánh giá các rủi ro vận hành, sai lệch tài chính và rủi ro pháp lý y tế nếu tiếp tục lập trình dựa trên sơ đồ cũ.
- Thiết lập cơ sở khoa học để đề xuất nâng cấp mô hình CSDL tại Task T5 mà không phá vỡ phạm vi MVP của dự án.

---

## 2. BẢNG MA TRẬN ĐỐI CHIẾU TỔNG THỂ

| Khía cạnh nghiệp vụ | Thiết kế 16 bảng ERD ban đầu | Thực tế vận hành phòng khám Tai Mũi Họng | Khoảng cách phát hiện (Gap) | Mức độ nghiêm trọng |
| :--- | :--- | :--- | :--- | :---: |
| **1. Dịch vụ & Thủ thuật TMH** | Không có thực thể lưu Dịch vụ/Thủ thuật; chỉ có `examinations` (khám). | Các thủ thuật chuyên khoa (Nội soi TMH, hút xoang, xông khí dung, lấy dị vật, làm sạch tai...) chiếm tỷ trọng cơ cấu hoạt động và giá trị chuyên môn then chốt của phòng khám Tai Mũi Họng. | **Thiếu hoàn toàn phân hệ Dịch vụ/Thủ thuật.** Không thể ghi nhận bác sĩ thực hiện thủ thuật gì, vật tư tiêu hao gì và thu tiền ra sao. | **Cực kỳ nghiêm trọng (Critical)** |
| **2. Hình ảnh Nội soi TMH** | Bảng `medical_records` chỉ lưu các trường văn bản (`text`). Không có nơi lưu trữ hình ảnh. | Tiêu chuẩn vàng của chẩn đoán TMH là Nội soi. Bắt buộc phải lưu 2-4 ảnh nội soi tổn thương vào vùng lưu trữ bảo mật của hồ sơ và in phiếu kết quả cho bệnh nhân. | **Không thể lưu trữ hoặc truy xuất hình ảnh nội soi an toàn.** Bệnh án TMH bị mất đi bằng chứng chẩn đoán quan trọng nhất. | **Cực kỳ nghiêm trọng (Critical)** |
| **3. Dấu hiệu sinh tồn (Sinh hiệu)** | Không có bảng lưu Sinh hiệu; chỉ có tiền sử bệnh trong `medical_records`. | Bắt buộc phải đo Mạch, Huyết áp, Thân nhiệt, Cân nặng (đặc biệt cho bệnh nhi để tính liều thuốc mg/kg và người cao tuổi có bệnh nền). | **Thiếu dữ liệu sinh hiệu lâm sàng.** Rủi ro sốc phản vệ, quá liều thuốc ở trẻ em hoặc tai biến khi làm thủ thuật kích thích hầu họng. | **Nghiêm trọng (High)** |
| **4. Quan hệ Tiếp nhận vs Khám** | Giả định cứng nhắc `admissions 1 ─── 1 examinations` (cứ tiếp nhận là phải có lượt khám). | Bệnh nhân tiếp nhận xong có thể chờ lâu bỏ về, hoặc chuyển viện cấp cứu khẩn cấp -> Không có lượt khám nào được diễn ra. | **Mô hình hóa sai quan hệ nghiệp vụ.** Ép hệ thống sinh dữ liệu rác (`examinations` rỗng) hoặc gây lỗi khi tiếp nhận bị hủy. | **Nghiêm trọng (High)** |
| **5. Cấu trúc Hóa đơn viện phí** | Hóa đơn `invoices` chỉ lưu trường `total_amount` tổng hợp gắn trực tiếp vào `examination_id`. | Hóa đơn phòng khám gồm nhiều dòng mục: Phí công khám + Phí từng thủ thuật TMH + Tiền từng loại thuốc (Số lượng × Đơn giá). | **Thiếu bảng Chi tiết hóa đơn (`invoice_items`).** Không thể giải trình chi phí minh bạch cho người bệnh, không thể kiểm toán kế toán. | **Cực kỳ nghiêm trọng (Critical)** |
| **6. Quản lý Kho Dược theo Lô** | Bảng `medicines` chỉ lưu một con số tổng `stock_quantity`. | Thuốc kháng sinh, kháng viêm, dung dịch nhỏ tai/mũi bắt buộc phải quản lý theo Lô sản xuất và Hạn sử dụng để cấp phát an toàn (FEFO) và truy xuất nguồn gốc. | **Không thể cảnh báo thuốc hết hạn hoặc thu hồi thuốc theo lô.** Rủi ro cấp phát thuốc hết hạn cho bệnh nhân, vi phạm an toàn dược. | **Nghiêm trọng (High)** |
| **7. Lịch sử chỉnh sửa & Kiểm toán** | Không có cơ chế lưu vết (Audit Log); chỉ có `created_at`, `updated_at` cơ bản. | Dữ liệu y tế và thanh toán bắt buộc phải bảo đảm tính toàn vẹn: ai đã sửa bệnh án, ai đã thu tiền, sửa vào lúc nào. | **Không có bằng chứng kiểm toán (Audit Trail).** Khi xảy ra tranh chấp y khoa hoặc thất thoát viện phí, không thể truy vết trách nhiệm. | **Trung bình (Medium)** |
| **8. Định danh số điện thoại** | Ngầm định số điện thoại là duy nhất (`UNIQUE`) cho mỗi bệnh nhân. | Thực tế tại Việt Nam: Cha mẹ dùng 1 số điện thoại để đăng ký khám cho 2-3 con nhỏ, hoặc con cái đặt khám cho cha mẹ già. | **Lỗi xung đột dữ liệu bệnh nhân.** Không thể tạo hồ sơ cho người thứ 2 trong gia đình nếu đặt ràng buộc UNIQUE trên SĐT. | **Nghiêm trọng (High)** |

---

## 3. PHÂN TÍCH CHI TIẾT 8 KHOẢNG CÁCH NGHIỆP VỤ TRỌNG YẾU (CORE GAPS)

### Gap 1: Thiếu thực thể Dịch vụ & Thủ thuật Tai Mũi Họng
- **Mô tả hiện trạng ERD cũ:** ERD ban đầu chỉ có bảng `examinations`. Nếu bệnh nhân chỉ đến làm thủ thuật (ví dụ hút mũi xoang hoặc lấy dị vật tai) hoặc khám xong được chỉ định nội soi, hệ thống không có cách nào ghi nhận.
- **Tác động nghiệp vụ:**
  - Không thể tính giá dịch vụ thủ thuật riêng biệt.
  - Không thể thống kê bác sĩ/điều dưỡng đã thực hiện bao nhiêu ca nội soi, bao nhiêu ca khí dung để theo dõi hiệu suất hoạt động chuyên môn.
- **Giải pháp kiến trúc cho T5:** Bổ sung thực thể Danh mục dịch vụ/thủ thuật `services` và bảng liên kết `examination_services` (ghi nhận dịch vụ được chỉ định trong lượt khám, đơn giá tại thời điểm chỉ định, số lượng và bác sĩ thực hiện).

### Gap 2: Thiếu lưu trữ An toàn Hình ảnh Nội soi Tai Mũi Họng
- **Mô tả hiện trạng ERD cũ:** Bảng `medical_records` chỉ gồm các trường text: `symptoms`, `diagnosis`, `treatment_plan`.
- **Tác động nghiệp vụ:**
  - Tai Mũi Họng là chuyên khoa thị giác. Bác sĩ không thể chẩn đoán chính xác viêm tai giữa ứ mủ hay polyp mũi xoang nếu không có hình ảnh nội soi.
  - Bệnh nhân không nhận được phiếu in hình ảnh nội soi màu - vốn là sản phẩm bàn giao tiêu chuẩn của mọi phòng khám TMH tư nhân hiện nay.
- **Giải pháp kiến trúc cho T5:**
  - Bổ sung thực thể `endoscopy_images` liên kết với `examinations`, lưu trữ: `file_path`, `capture_time`, `organ_type` (Tai / Mũi / Họng), `notes`.
  - **Yêu cầu bảo mật:** Tệp ảnh phải được lưu trong thư mục riêng biệt của Backend (Private Storage), truy xuất qua API có xác thực quyền (`GET /api/examinations/:examId/endoscopy-images/:imageId`). **Tuyệt đối không sử dụng URL công khai không bảo vệ (Unprotected public static URLs).**

### Gap 3: Thiếu dữ liệu Dấu hiệu sinh tồn (Vital Signs)
- **Mô tả hiện trạng ERD cũ:** Hoàn toàn bỏ trống các trường sinh hiệu cơ bản.
- **Tác động nghiệp vụ:**
  - Trẻ em viêm tai mũi họng thường kèm sốt; nếu không ghi nhận nhiệt độ và cân nặng, bác sĩ không thể tính liều kháng sinh/hạ sốt (mg/kg) chính xác.
  - Người lớn tuổi có tiền sử tăng huyết áp nếu không đo huyết áp trước khi xịt thuốc co mạch (Ephedrine/Naphazoline) có thể dẫn đến cơn tăng huyết áp kịch phát nguy hiểm.
- **Giải pháp kiến trúc cho T5:** Bổ sung thực thể hoặc cấu trúc lưu trữ `vital_signs` (Mạch, Huyết áp tâm thu/tâm trương, Thân nhiệt, Cân nặng, SpO2) liên kết trực tiếp với lượt khám `examinations`.

### Gap 4: Quan hệ Tiếp nhận vs Khám bị mô hình hóa sai
- **Mô tả hiện trạng ERD cũ:** Giả định quan hệ 1 - 1 giữa `admissions` và `examinations`.
- **Tác động nghiệp vụ:**
  - Trong thực tế lâm sàng, có các trường hợp bệnh nhân sau khi tiếp nhận lấy số đã tự ý bỏ về do thời gian chờ đợi hoặc phát sinh nhu cầu chuyển viện khẩn cấp.
  - Nếu hệ thống tự động sinh `examinations` ngay khi tiếp nhận, các lượt khám "ảo" này sẽ làm sai lệch tỷ lệ khám bệnh và báo cáo doanh thu.
- **Giải pháp kiến trúc cho T5:** Chuyển quan hệ thành `admissions (1) ─── (0..1) examinations`. Lượt khám chỉ được tạo khi bác sĩ chính thức nhấn "Gọi khám / Bắt đầu khám". Khi bệnh nhân bỏ về, `admissions` chuyển trạng thái `CANCELLED`.

### Gap 5: Hóa đơn viện phí thiếu cấu trúc Chi tiết hóa đơn (Itemized Billing)
- **Mô tả hiện trạng ERD cũ:** Bảng `invoices` chỉ có `total_amount` gắn với `examination_id`.
- **Tác động nghiệp vụ:**
  - Khi in hóa đơn hoặc biên lai cho bệnh nhân, phòng khám chỉ có thể in ra một con số tổng mà không liệt kê được tiền khám bao nhiêu, tiền nội soi bao nhiêu, tiền thuốc từng món bao nhiêu.
  - Bệnh nhân sẽ thắc mắc, khiếu nại vì tính thiếu minh bạch tài chính.
- **Giải pháp kiến trúc cho T5:** Bổ sung thực thể Chi tiết hóa đơn `invoice_items` liên kết với `invoices`, lưu từng dòng mục: `item_type` (EXAMINATION / SERVICE / MEDICINE), `item_id`, `item_name`, `quantity`, `unit_price`, `subtotal`.

### Gap 6: Thiếu quản lý Kho Dược theo Lô sản xuất và Hạn sử dụng (FEFO) trong MVP
- **Mô tả hiện trạng ERD cũ:** Bảng `medicines` chỉ có trường `stock_quantity`.
- **Tác động nghiệp vụ:**
  - Không thể phân biệt thuốc nhập từ đợt nào, lô nào sắp hết hạn để xuất trước (nguyên tắc FEFO).
  - Khi có thông báo thu hồi một lô thuốc cụ thể, phòng khám không thể truy vết được bệnh nhân nào đã được phát thuốc thuộc lô đó.
- **Giải pháp kiến trúc cho T5:**
  - **MVP:** Dự kiến quản lý số lô (`batch_number`), hạn sử dụng (`expiry_date`) và tồn kho theo lô (`quantity_remaining`) tại thực thể `medicine_batches` liên kết với `medicines` để phục vụ xuất thuốc an toàn.
  - **Mở rộng (Phase 2):** Các thuật toán phân tích tồn kho nâng cao (phân tích ABC/VED, dự báo nhu cầu đặt hàng thông minh) chuyển sang Giai đoạn 2.

### Gap 7: Thiếu Nhật ký kiểm toán y tế (Audit Trail)
- **Mô tả hiện trạng ERD cũ:** Không có bảng lưu vết hành động.
- **Tác động nghiệp vụ:**
  - Nếu một nhân viên lễ tân sửa thông tin thanh toán, hoặc một bác sĩ vào xem bệnh án của một bệnh nhân không thuộc phạm vi phân công của mình, hệ thống không lưu lại dấu vết.
  - Vi phạm trực tiếp các nguyên tắc an toàn dữ liệu y tế cá nhân và khó giải quyết khi có tranh chấp nội bộ.
- **Giải pháp kiến trúc cho T5:** Bổ sung thực thể Nhật ký kiểm toán `audit_logs` ghi nhận: `user_id`, `action`, `resource_name`, `resource_id`, `old_value`, `new_value`, `timestamp`, `ip_address`.

### Gap 8: Giả định sai về tính duy nhất của Số điện thoại bệnh nhân
- **Mô tả hiện trạng ERD cũ:** Đặt ràng buộc duy nhất (`UNIQUE`) cho cột `phone_number` của bảng `patients`.
- **Tác động nghiệp vụ:**
  - Trong thực tế gia đình Việt Nam, cha mẹ đưa 2 con nhỏ đi khám Tai Mũi Họng thì cả 2 hồ sơ bệnh nhi đều dùng chung số điện thoại của cha mẹ.
  - Nếu đặt `UNIQUE(phone_number)`, lễ tân không thể tạo được hồ sơ cho người con thứ hai.
- **Giải pháp kiến trúc cho T5:** Bỏ ràng buộc `UNIQUE` trên `phone_number`. Khóa định danh chính phải là `patient_id` (hoặc mã y tế tự sinh). Số điện thoại đóng vai trò là kênh liên lạc và trường tìm kiếm nhóm hồ sơ.

---

## 4. ĐÁNH GIÁ RỦI RO NẾU GIỮ NGUYÊN THIẾT KẾ 16 BẢNG BAN ĐẦU

| Khu vực rủi ro | Mức độ rủi ro | Hậu quả thực tế nếu triển khai code ngay |
| :--- | :---: | :--- |
| **Rủi ro Lâm sàng & An toàn người bệnh** | **Cực kỳ cao** | Bác sĩ không có hình ảnh nội soi để giải thích cho bệnh nhân; không có dữ liệu sinh hiệu (cân nặng/huyết áp) dễ dẫn đến kê sai liều thuốc cho trẻ nhỏ; cấp phát thuốc không kiểm soát lô/hạn dùng dễ dẫn đến cấp thuốc quá hạn. |
| **Rủi ro Tài chính & Vận hành phòng khám** | **Cực kỳ cao** | Không thể thu tiền thủ thuật nội soi, rửa mũi xoang (nguồn thu cốt lõi của phòng khám TMH); hóa đơn không rõ ràng gây khiếu kiện về tính minh bạch viện phí; không kiểm soát được tồn kho theo lô. |
| **Rủi ro Pháp lý & Tuân thủ quy định** | **Cao** | Không có bằng chứng kiểm toán (Audit Trail) khi xảy ra tranh chấp; không đáp ứng được các tiêu chuẩn tối thiểu về hồ sơ bệnh án ngoại trú và an toàn dược phẩm. |
| **Rủi ro Kiến trúc phần mềm (Refactoring Cost)** | **Cực kỳ cao** | Nếu vội vàng lập trình Frontend và Backend trên 16 bảng ban đầu, sau này bắt buộc phải đập bỏ làm lại toàn bộ API, Database Migration và UI vì các thiếu hụt cốt lõi nêu trên. |

---

## 5. LỘ TRÌNH KIẾN NGHỊ NÂNG CẤP MÔ HÌNH CSDL CHO TASK T5

Dựa trên phân tích khoảng cách, nhóm kiến trúc đề xuất lộ trình nâng cấp schema CSDL cho Task T5 như sau:

```
+-------------------------------------------------------------------------------------------------------+
|                                    LỘ TRÌNH TIẾN HÓA CSDL (DATABASE EVOLUTION)                         |
+-------------------------------------------------------------------------------------------------------+
| [GIAI ĐOẠN HIỆN TẠI - T1]                 │ [GIAI ĐOẠN THIẾT KẾ CSDL - T5]                            |
| 16 Thực thể ER tham khảo ban đầu          │ Mô hình CSDL chuẩn hóa nâng cấp (~22 thực thể)            |
| • Giữ nguyên làm tài liệu cơ sở           │ • Giữ nguyên 16 thực thể gốc                              |
| • Ghi nhận đầy đủ 8 Gaps nghiệp vụ        │ • BỔ SUNG 6 THỰC THỂ CỐT LÕI CHO TMH TRONG MVP:           |
| • Không tự ý sửa schema khi chưa duyệt    │   1. `services` (Danh mục dịch vụ, thủ thuật TMH)         |
|                                           │   2. `examination_services` (Thủ thuật chỉ định)          |
|                                           │   3. `endoscopy_images` (Hình ảnh nội soi bảo mật)        |
|                                           │   4. `invoice_items` (Chi tiết hóa đơn đa mục)            |
|                                           │   5. `vital_signs` (Chỉ số sinh tồn lâm sàng)             |
|                                           │   6. `medicine_batches` (Quản lý số lô & hạn dùng an toàn)|
|                                           │ • CHUẨN HÓA THỰC THỂ PHỤ TRỢ:                             |
|                                           │   7. `audit_logs` (Nhật ký vết hệ thống)                  |
+-------------------------------------------------------------------------------------------------------+
```

---

## 6. GHI NHẬN QUYẾT ĐỊNH THIẾT KẾ & BẢNG CÂU HỎI CHỜ XÁC NHẬN

### 6.1. Các quyết định thiết kế đã xác lập (Design Decisions)
1. **Quyết định GAP-01:** Khẳng định 16 bảng ERD ban đầu chỉ là tài liệu tham khảo khởi điểm, không phải là giới hạn chặn trên của hệ thống.
2. **Quyết định GAP-02:** Bảo lưu toàn bộ 16 thực thể ban đầu, không xóa bỏ bất kỳ thực thể nào trong Task T1.
3. **Quyết định GAP-03:** Đề xuất chính thức việc đưa các phân hệ Thủ thuật TMH, Hình ảnh nội soi bảo mật, Sinh hiệu, Chi tiết hóa đơn và Quản lý số lô/hạn dùng thiết yếu vào phạm vi thiết kế CSDL của Task T5.
4. **Quyết định GAP-04:** Bỏ tư duy thiết kế ràng buộc số điện thoại duy nhất (`UNIQUE phone_number`) trên bảng bệnh nhân.
5. **Quyết định GAP-05:** Bảo mật truy cập ảnh nội soi qua API Backend phân quyền, tuyệt đối không dùng URL công khai.

### 6.2. Bảng câu hỏi chờ xác nhận từ Chủ nhiệm đề tài / Quản lý phòng khám

| STT | Câu hỏi cần xác nhận | Phương án đề xuất của nhóm BA | Tác động đến Task T5 |
| :---: | :--- | :--- | :---: |
| **01** | **Phương thức lưu trữ hình ảnh nội soi TMH:** Lưu tệp ảnh an toàn trên máy chủ phòng khám (Private Storage) hay dùng Cloud Storage (S3 / MinIO)? | **Đề xuất: Lưu private storage cục bộ trong MVP**, phân quyền truy xuất qua API route có xác thực. Tuyệt đối không dùng public URL. | Bảng `endoscopy_images` chứa `file_path`, `caption`, `organ_type`, `examination_id`. |
| **02** | **Quản lý Lô thuốc và Hạn sử dụng trong MVP:** Mức độ chi tiết cần thiết? | **Đề xuất: Đưa vào MVP ở mức độ thiết yếu** gồm số lô, hạn sử dụng và tồn kho theo lô để đảm bảo an toàn cấp phát thuốc (FEFO) và truy xuất nguồn gốc. Các chức năng phân tích tồn kho nâng cao (dự báo nhu cầu, phân tích ABC/VED) chuyển sang Giai đoạn 2. | Thiết kế bảng `medicine_batches` liên kết với `medicines` |
| **03** | **Cấu trúc lưu trữ Sinh hiệu (Vital Signs):** Bảng riêng hay cột trong `examinations`? | **Đề xuất: Gộp các trường sinh hiệu cơ bản vào `examinations`** trong MVP để tối ưu số bảng CSDL mà vẫn đủ thông tin lâm sàng. | Thêm các cột: `pulse`, `blood_pressure`, `temperature`, `weight`, `spo2` |
| **04** | **Cơ chế tính giá thủ thuật:** Thu phí thủ thuật cộng dồn với phí khám hay đã bao gồm trong phí khám? | **Đề xuất: Cộng dồn minh bạch.** Tiền khám là cố định; mỗi thủ thuật phát sinh (Nội soi, Khí dung) được tính thêm dòng tương ứng trên hóa đơn. | Tạo bảng `services` và `invoice_items` |

---

## 7. KẾT LUẬN & KHUYẾN NGHỊ KỸ THUẬT

1. **Kết quả đạt được:** Báo cáo Gap Analysis [03-gap-analysis.md](file:///d:/clinic-management/docs/requirements/03-gap-analysis.md) đã vạch rõ 8 khoảng cách trọng yếu giữa lý thuyết thiết kế ban đầu và thực tiễn vận hành lâm sàng chuyên khoa Tai Mũi Họng.
2. **Khuyến nghị kiến trúc:** Nhóm phát triển **không nên** vội vàng viết mã nguồn CRUD dựa trên 16 bảng cũ. Cần sử dụng kết quả Gap Analysis này để làm đầu vào trực tiếp cho Task T5 (Chuẩn hóa sơ đồ ERD và CSDL PostgreSQL).
3. **Tuân thủ quy tắc dự án:** Báo cáo dừng lại ở mức phân tích kiến trúc nghiệp vụ, bảo toàn 100% các nguyên tắc: không can thiệp code, không tự ý sửa CSDL, không vượt quyền phạm vi Task T1.
