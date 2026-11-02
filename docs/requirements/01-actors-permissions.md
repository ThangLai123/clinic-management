# TÀI LIỆU ĐẶC TẢ YÊU CẦU NGHIỆP VỤ & PHÂN QUYỀN TÁC NHÂN
## DỰ ÁN: HỆ THỐNG QUẢN LÝ PHÒNG KHÁM TƯ NHÂN TAI MŨI HỌNG (CLINIC MANAGEMENT)
### MÃ TÀI LIỆU: `DOC-REQ-01` | TASK: `T1-FINAL-REVIEW` | PHIÊN BẢN: `1.3.0` | TRẠNG THÁI: `CHUẨN HÓA BẢN CUỐI`

---

## MỤC LỤC
1. [Tổng quan hệ thống, Định hướng tiếp cận & Quy ước](#1-tổng-quan-hệ-thống-định-hướng-tiếp-cận--quy-ước)
2. [Mô tả ba tác nhân chính (Actors & Interfaces)](#2-mô-tả-ba-tác-nhân-chính-actors--interfaces)
3. [Danh sách 23 chức năng chi tiết theo tác nhân](#3-danh-sách-23-chức-năng-chi-tiết-theo-tác-nhân)
4. [Ma trận phân quyền chi tiết (RBAC Matrix) & Bảo mật y tế](#4-ma-trận-phân-quyền-chi-tiết-rbac-matrix--bảo-mật-y-tế)
5. [Ánh xạ tác nhân & Chức năng với 16 thực thể ER cốt lõi](#5-ánh-xạ-tác-nhân--chức-năng-với-16-thực-thể-er-cốt-lõi)
6. [Quy tắc nghiệp vụ bắt buộc (Business Rules)](#6-quy-tắc-nghiệp-vụ-bắt-buộc-business-rules)
7. [Phân định phạm vi: MVP, Mở rộng & Yêu cầu pháp lý thẩm định](#7-phân-định-phạm-vi-mvp-mở-rộng--yêu-cầu-pháp-lý-thẩm-định)
8. [Phân loại thông tin: Đã xác nhận, Đề xuất & Chờ xác nhận](#8-phân-loại-thông-tin-đã-xác-nhận-đề-xuất--chờ-xác-nhận)
9. [Kết luận & Nghiệm thu Task T1](#9-kết-luận--nghiệm-thu-task-t1)

---

## 1. TỔNG QUAN HỆ THỐNG, ĐỊNH HƯỚNG TIẾP CẬN & QUY ƯỚC

### 1.1. Bối cảnh và mục tiêu
Hệ thống **Clinic Management** là giải pháp phần mềm chuyên biệt phục vụ công tác quản lý vận hành khám chữa bệnh ngoại trú tại phòng khám tư nhân chuyên khoa **Tai Mũi Họng**. Hệ thống hướng đến việc số hóa toàn diện quy trình tiếp đón, khám bệnh chuyên khoa, ghi nhận sinh hiệu, nội soi chẩn đoán, thủ thuật chuyên khoa, kê đơn điện tử, quản lý thuốc an toàn theo lô - hạn dùng, phát thuốc và thanh toán; giảm thiểu thời gian chờ đợi của bệnh nhân, loại bỏ sai sót ghi chép thủ công, đồng thời lưu trữ bệnh án điện tử an toàn, tuân thủ các quy định bảo mật y tế.

### 1.2. Định hướng tiếp cận nghiệp vụ mới (Domain-Driven Healthcare Approach)
Hệ thống **tuyệt đối không được xây dựng bằng cách chuyển đổi trực tiếp các bảng ERD ban đầu thành chức năng CRUD**. Thay vào đó, kiến trúc hệ thống tuân thủ nghiêm ngặt chuỗi giá trị vận hành thực tế:
```
Thực tế vận hành phòng khám TMH
  ──> Hành trình bệnh nhân (Patient Journey)
    ──> Năng lực nghiệp vụ (Business Capabilities)
      ──> Quy tắc nghiệp vụ (Business Rules)
        ──> Phân quyền kiểm soát truy cập (Access Control / RBAC)
          ──> Kiến trúc dữ liệu y tế (Data Architecture)
```
*Lưu ý nguyên tắc:* Sơ đồ 16 bảng ERD ban đầu chỉ đóng vai trò là tài liệu tham khảo khởi điểm, không phải là giới hạn hay rào cản thiết kế của dự án. Mọi sự phát triển đều lấy an toàn người bệnh và hiệu quả vận hành phòng khám làm trọng tâm.

### 1.3. Định vị công nghệ chính thức của dự án
Hệ thống được thiết kế và triển khai bám sát định hướng kỹ thuật chuẩn mực đã cam kết:
- **Frontend:** React JavaScript (`.jsx`), Vite, Tailwind CSS, React Router.
- **Backend:** Node.js, Express.js, Kiến trúc RESTful API chuẩn mực.
- **Database:** PostgreSQL (hệ cơ sở dữ liệu quan hệ), sử dụng driver kết nối `pg` và cơ chế SQL Migrations có kiểm soát phiên bản.
- **Thiết kế UI/UX:** Tích hợp Skill `claude-design` cho các giai đoạn thiết kế giao diện kế tiếp.
- **Quản lý mã nguồn:** Git & GitHub (phân chia nhánh và kiểm soát Issue chặt chẽ).
- *Cam kết kiến trúc:* Giữ vững công nghệ cốt lõi đã cam kết, tuyệt đối không tự ý đưa vào các công nghệ ngoài phạm vi (như TypeScript, Next.js, NestJS, MongoDB,...).

### 1.4. Quy ước phân loại trạng thái thông tin trong tài liệu
Nhằm bảo đảm tính tường minh giữa yêu cầu đã chốt và các thiết kế kỹ thuật đang xây dựng, mọi nội dung trong tài liệu được gắn nhãn định danh:
- `[Đã xác nhận]`: Yêu cầu nghiệp vụ cốt lõi đã được phê duyệt chính thức từ Issue #1 và bài toán quản lý phòng khám TMH.
- `[Đề xuất]`: Giải pháp kỹ thuật, cấu trúc phân quyền hoặc quy trình do nhóm kiến trúc đề xuất nhằm tối ưu hóa vận hành, chờ chuẩn hóa tại Task T5.
- `[Chờ xác nhận]`: Các điểm nghiệp vụ mở cần tham vấn thêm từ Chủ nhiệm đề tài / Quản lý phòng khám trước khi đóng băng thiết kế CSDL.

---

## 2. MÔ TẢ BA TÁC NHÂN CHÍNH (ACTORS & INTERFACES)

Hệ thống phục vụ đúng ba giao diện/tác nhân với vai trò, trách nhiệm và phạm vi hoạt động tách biệt rõ ràng, cam kết **không tự tạo thêm giao diện Admin độc lập trong MVP**:

```
+-----------------------------------------------------------------------------------+
|                                  HỆ THỐNG PHÒNG KHÁM                              |
+--------------------------+-------------------------------+------------------------+
|    A. GIAO DIỆN LỄ TÂN   |      B. GIAO DIỆN BÁC SĨ      |  C. GIAO DIỆN BỆNH NHÂN|
| (Administrative & Care)  |  (Clinical & Medical Care)    | (Client / End-User)    |
|                          |                               |                        |
| • Quản lý bệnh nhân      | • Khám lâm sàng TMH chuyên sâu| • Tra cứu thông tin    |
| • Quản lý lịch hẹn       | • Ghi nhận sinh hiệu, bệnh sử | • Đặt lịch khám online |
| • Check-in & Hàng đợi    | • Chẩn đoán (mã ICD-10)       | • Xem hồ sơ cá nhân    |
| • Điều phối phòng khám   | • Chỉ định thủ thuật & dịch vụ|   (sau xác thực đa tầng|
| • Thu ngân viện phí      | • Quản lý kết quả/ảnh nội soi |   danh tính & SĐT)     |
| • Cấp phát thuốc an toàn | • Kê đơn điện tử & Tái khám   |                        |
|   theo lô (mô hình dự    | • Quản lý thuốc theo lô/hạn   |                        |
|   kiến cho MVP)          |   dùng theo phân quyền        |                        |
+--------------------------+-------------------------------+------------------------+
```

### 2.1. Giao diện Lễ tân (Receptionist Interface) `[Đã xác nhận]`
- **Định danh nghiệp vụ:** Cán bộ hành chính, nhân viên tiếp đón, điều phối và thu ngân của phòng khám.
- **Trách nhiệm cốt lõi:**
  - **Quản lý bệnh nhân:** Tiếp đón, tìm kiếm, tạo mới và cập nhật thông tin nhân khẩu học của bệnh nhân.
  - **Quản lý lịch hẹn:** Tiếp nhận, xác nhận, đổi lịch hoặc hủy hẹn khám.
  - **Check-in & Tiếp nhận:** Xử lý tiếp đón cho cả bệnh nhân đặt hẹn trước và bệnh nhân đến trực tiếp (Walk-in).
  - **Điều phối phòng & Quản lý hàng đợi:** Phân bổ bệnh nhân vào phòng khám TMH phù hợp theo tải thực tế, điều hành danh sách chờ (Queue).
  - **Thu ngân & Hóa đơn:** Tổng hợp viện phí chi tiết (tiền khám + tiền thủ thuật/nội soi + tiền thuốc), lập hóa đơn và ghi nhận thanh toán tiền mặt/chuyển khoản QR.
  - **Quản lý hành chính hồ sơ:** Tra cứu lịch sử các lần đến khám phục vụ giải đáp thắc mắc hoặc in ấn giấy tờ hành chính.
- **Quy trình phát thuốc `[Đề xuất - Mô hình dự kiến cho MVP]`:**
  - Lễ tân phụ trách quy trình xuất dược theo đơn bác sĩ đã hoàn tất: kiểm tra đối chiếu đơn, trừ tồn kho thuốc theo số lô/hạn sử dụng (FEFO) và bàn giao cho bệnh nhân kèm hướng dẫn sử dụng hành chính.
  - *Ràng buộc điều kiện:* Áp dụng mô hình tinh gọn nhân sự cho phòng khám tư nhân vừa và nhỏ; nhân sự đảm nhiệm phải có chứng chỉ/đào tạo chuyên môn phù hợp và tuân thủ quy trình giao nhận thuốc ngoại trú.
  - *Phạm vi:* Không tạo giao diện Dược sĩ riêng trong MVP.

### 2.2. Giao diện Bác sĩ (Doctor Interface) `[Đã xác nhận]`
- **Định danh nghiệp vụ:** Bác sĩ chuyên khoa Tai Mũi Họng chịu trách nhiệm pháp lý và chuyên môn y tế cao nhất trong lượt khám.
- **Trách nhiệm cốt lõi:**
  - **Quản lý hàng đợi khám:** Theo dõi danh sách bệnh nhân đang chờ tại phòng khám mình phụ trách; kích hoạt gọi khám.
  - **Khám lâm sàng TMH & Sinh hiệu:** Ghi nhận bệnh sử, tiền sử dị ứng, theo dõi các chỉ số sinh tồn (mạch, huyết áp, thân nhiệt, cân nặng) và thăm khám chuyên sâu cơ quan Tai, Mũi, Họng.
  - **Chỉ định dịch vụ & Thủ thuật TMH:** Chỉ định và thực hiện các thủ thuật chuyên khoa (nội soi TMH, xông khí dung, hút xoang Proetz, làm sạch tai, lấy dị vật).
  - **Quản lý kết quả & Hình ảnh nội soi:** Đính kèm 2-4 hình ảnh nội soi điển hình vào hồ sơ để làm bằng chứng chẩn đoán và in phiếu kết quả cho bệnh nhân. Hình ảnh được lưu trữ an toàn trong vùng dữ liệu bảo mật của hệ thống.
  - **Chẩn đoán & Hồ sơ bệnh án:** Kết luận chẩn đoán xác định gắn mã ICD-10 chuẩn, ghi nhận hướng điều trị và đóng băng bệnh án sau khi hoàn tất.
  - **Kê đơn thuốc điện tử:** Tra cứu tồn kho dược theo lô và hạn dùng; kê đơn thuốc chi tiết liều dùng, số lượng, cách dùng. Hỗ trợ trường hợp khám chỉ làm thủ thuật mà không kê đơn thuốc.
  - **Chỉ định tái khám:** Hẹn ngày tái khám cụ thể phục vụ theo dõi diễn tiến sau đợt điều trị.
  - **Phạm vi truy cập hồ sơ chuyên môn:** Bác sĩ chỉ được truy cập hồ sơ bệnh án theo đúng phạm vi công việc và phân công chuyên môn (bệnh nhân đang được phân công tại phòng khám, ca trực, hoặc trường hợp có chỉ định hội chẩn hợp lệ; không được tự ý tra cứu tùy tiện bệnh án ngoài phạm vi).
  - **Quản lý kho dược theo phân quyền:** Quản lý danh mục thuốc, đối soát nhà cung cấp, kiểm soát số lô, hạn dùng và theo dõi định mức tồn kho chuyên môn. Các phân tích tồn kho nâng cao chuyển sang giai đoạn sau.

### 2.3. Giao diện Bệnh nhân (Patient Interface) `[Đã xác nhận]`
- **Định danh nghiệp vụ:** Khách hàng sử dụng dịch vụ y tế của phòng khám.
- **Trách nhiệm & Hành vi:**
  - **Phạm vi MVP `[Đã xác nhận]`:**
    - Truy cập Landing Page giao diện hiện đại, tối ưu SEO để xem thông tin phòng khám, bảng giá dịch vụ, danh sách bác sĩ chuyên khoa TMH, giờ làm việc.
    - Đặt lịch khám online tiện lợi: chọn ngày, chọn khung giờ, chọn bác sĩ (nếu cần), nhập thông tin và mô tả triệu chứng.
    - Nhận thông tin xác nhận lịch hẹn kèm mã đặt hẹn trực tiếp trên màn hình và thông báo điện tử.
  - **Phạm vi mở rộng (Patient Portal) `[Đề xuất]`:**
    - Cơ chế xác thực an toàn đa tầng: Xác thực quyền kiểm soát số điện thoại qua OTP kết hợp xác minh thông tin danh tính cá nhân (Họ tên, Năm sinh, 4 số cuối CCCD).
    - OTP số điện thoại chỉ chứng minh quyền kiểm soát thiết bị, **tuyệt đối không mặc nhiên cấp quyền xem tất cả hồ sơ có cùng số điện thoại đó** (bảo đảm an toàn cho trường hợp gia đình dùng chung SĐT).
    - Liên kết tài khoản portal với đúng hồ sơ bệnh nhân chính chủ.
    - Tra cứu lịch sử các lượt khám của chính mình: xem bệnh án tóm tắt, hình ảnh nội soi TMH đính kèm (qua API kiểm soát quyền, không dùng URL công khai) và đơn thuốc điện tử.
    - Nhận thông báo tự động nhắc nhở khi đến ngày hẹn tái khám.

---

## 3. DANH SÁCH 23 CHỨC NĂNG CHI TIẾT THEO TÁC NHÂN

Toàn bộ hệ thống bao gồm **23 chức năng nghiệp vụ chuẩn** được phân chia chính xác cho 3 tác nhân:

### 3.1. Phân hệ chức năng dành cho Lễ tân (08 chức năng)

| Mã chức năng | Tên chức năng | Phân loại | Mô tả chi tiết nghiệp vụ | Đầu vào (Input) | Kết quả đầu ra (Output) |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **REC-01** | Quản lý thông tin bệnh nhân | `[Đã xác nhận]` | Thêm mới hồ sơ bệnh nhân; tìm kiếm theo SĐT, họ tên, CCCD; cập nhật thông tin nhân khẩu học. Không cho phép xóa vĩnh viễn hồ sơ bệnh nhân đã có lượt khám. | Họ tên, SĐT, ngày sinh, giới tính, địa chỉ, tiền sử dị ứng | Mã bệnh nhân (Patient ID), hồ sơ hành chính được lưu trữ |
| **REC-02** | Quản lý lịch hẹn khám | `[Đã xác nhận]` | Xem danh sách lịch hẹn trong ngày/tuần; tiếp nhận yêu cầu đặt hẹn online; xác nhận lịch hẹn; đổi giờ hẹn hoặc hủy lịch theo yêu cầu bệnh nhân. Xử lý trường hợp vắng mặt (No-show). | Mã lịch hẹn, ngày giờ hẹn, trạng thái (Chờ duyệt, Đã xác nhận, Đã hủy) | Lịch hẹn chuyển trạng thái; thông báo tới bệnh nhân |
| **REC-03** | Tiếp nhận bệnh nhân (Check-in) | `[Đã xác nhận]` | Tiếp nhận cả 2 luồng: Bệnh nhân đã đặt hẹn trước và bệnh nhân vãng lai (walk-in). Kiểm tra thông tin, tạo lượt tiếp nhận (Admission/Check-in). | SĐT/Mã hẹn (nếu có), xác nhận thông tin thực tế tại quầy | Phiếu tiếp nhận, Mã lượt tiếp nhận (Admission ID), số thứ tự khám (Queue Number) |
| **REC-04** | Phân phòng khám & Quản lý hàng đợi | `[Đã xác nhận]` | Điều phối lượt tiếp nhận vào phòng khám cụ thể (Phòng TMH 1, Phòng TMH 2...) dựa theo tải của phòng và bác sĩ trực. Xem hàng đợi theo thời gian thực. Hủy tiếp nhận nếu bệnh nhân bỏ về. | Mã tiếp nhận, Mã phòng khám, Bác sĩ chỉ định | Bản ghi danh sách chờ tại phòng khám được cập nhật |
| **REC-05** | Tra cứu hồ sơ hành chính | `[Đã xác nhận]` | Tra cứu thông tin các lần đến khám, ngày khám, bác sĩ khám, trạng thái thanh toán nhằm phục vụ giải đáp thắc mắc hoặc in lại giấy tờ hành chính. | Mã bệnh nhân, SĐT, khoảng thời gian | Lịch sử các lần tiếp nhận và trạng thái tổng quát |
| **REC-06** | Lập hóa đơn viện phí chi tiết | `[Đã xác nhận]` | Hệ thống tự động tổng hợp chi phí từ tiền công khám, tiền thủ thuật TMH (nếu có) và tiền thuốc theo đơn bác sĩ đã kê (nếu có). Lễ tân kiểm tra danh mục dòng mục và chốt hóa đơn. | Mã lượt khám, danh mục dịch vụ & đơn thuốc tương ứng | Hóa đơn viện phí chi tiết (Itemized Invoice) kèm tổng số tiền phải nộp |
| **REC-07** | Ghi nhận thanh toán | `[Đã xác nhận]` | Ghi nhận hình thức thanh toán (Tiền mặt, Chuyển khoản ngân hàng qua mã QR); in hóa đơn/phiếu thu cho bệnh nhân. Hỗ trợ thanh toán toàn phần hoặc từng đợt. | Mã hóa đơn, Phương thức thanh toán, Số tiền thực thu | Bản ghi thanh toán (Payment ID), hóa đơn chuyển trạng thái tương ứng |
| **REC-08** | Cấp phát thuốc an toàn theo đơn | `[Đề xuất]` | Sau khi hóa đơn được thanh toán đủ, lễ tân đối chiếu đơn thuốc, kiểm tra đúng loại thuốc, số lượng, số lô và hạn dùng (FEFO), xuất kho và bàn giao thuốc cho người bệnh. Hỗ trợ ghi nhận phát từng phần nếu thiếu kho. | Mã đơn thuốc, Mã hóa đơn đã thanh toán | Bản ghi phát thuốc (Dispensation ID), trừ số lượng tồn kho thuốc theo lô |

### 3.2. Phân hệ chức năng dành cho Bác sĩ (08 chức năng)

| Mã chức năng | Tên chức năng | Phân loại | Mô tả chi tiết nghiệp vụ | Đầu vào (Input) | Kết quả đầu ra (Output) |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **DOC-01** | Xem danh sách chờ khám | `[Đã xác nhận]` | Xem danh sách bệnh nhân đang chờ tại phòng khám mình phụ trách theo thứ tự ưu tiên (số thứ tự, thời gian tiếp nhận, trạng thái: Chờ khám, Đang khám, Đã khám). | Phòng khám hiện tại, ca trực | Giao diện hàng đợi trực quan hiển thị bệnh nhân tiếp theo |
| **DOC-02** | Bắt đầu & Thực hiện khám TMH | `[Đã xác nhận]` | Chọn gọi bệnh nhân vào khám. Chuyển trạng thái lượt khám sang "Đang khám". Nhập chỉ số sinh hiệu (mạch, huyết áp, nhiệt độ, cân nặng); ghi nhận các triệu chứng lâm sàng vùng Tai, Mũi, Họng. | Mã lượt khám, thông tin triệu chứng, lý do khám, sinh hiệu | Cập nhật trạng thái lượt khám; tạo khung bệnh án |
| **DOC-03** | Lập bệnh án, Thủ thuật & Ảnh nội soi | `[Đã xác nhận]` | Ghi nhận bệnh sử, chẩn đoán xác định (mã ICD-10); chỉ định và ghi nhận kết quả thủ thuật TMH (khí dung, hút xoang, làm sạch tai); đính kèm 2-4 ảnh nội soi điển hình vào vùng lưu trữ bảo mật; lập phác đồ điều trị. | Dữ liệu khám lâm sàng, hình ảnh nội soi, kết quả thủ thuật, chẩn đoán | Hồ sơ bệnh án (Medical Record ID) chính thức kèm ảnh nội soi an toàn |
| **DOC-04** | Kê đơn thuốc điện tử | `[Đã xác nhận]` | Tra cứu danh mục thuốc trong kho (biết rõ số lượng tồn theo lô/hạn dùng); chọn thuốc, dạng dùng, hàm lượng, số lượng, liều dùng/lần, số lần/ngày, thời điểm uống và lời dặn đặc biệt. Cho phép hoàn tất khám không có đơn thuốc. | Mã thuốc, số lượng, liều dùng, hướng dẫn dùng | Đơn thuốc điện tử (Prescription ID) gồm các Chi tiết đơn thuốc |
| **DOC-05** | Chỉ định tái khám | `[Đã xác nhận]` | Đánh dấu yêu cầu tái khám, chọn số ngày sau hoặc ngày hẹn cụ thể, ghi chú mục đích tái khám (ví dụ: "Nội soi kiểm tra lại sau đợt kháng sinh 5 ngày"). | Số ngày / Ngày tái khám, ghi chú y khoa | Thông tin tái khám gắn liền với bệnh án và lịch hẹn tự động |
| **DOC-06** | Hoàn tất lượt khám | `[Đã xác nhận]` | Kiểm tra tổng thể bệnh án, đơn thuốc, chỉ định; ký duyệt/xác nhận hoàn thành lượt khám. Khóa chỉnh sửa nội dung chuyên môn (đóng băng dữ liệu) và chuyển tiếp sang bước thanh toán/phát thuốc. | Xác nhận hoàn thành lượt khám | Trạng thái lượt khám chuyển sang "COMPLETED", đơn thuốc chuyển sang trạng thái sẵn sàng xuất kho |
| **DOC-07** | Xem lịch sử khám bệnh nhân | `[Đã xác nhận]` | Truy cập xem lại các lần khám trước đây của bệnh nhân theo đúng phạm vi phân công công việc và quyền được cấp (phục vụ ca khám hiện tại hoặc có yêu cầu chuyên môn hợp lệ). | Mã bệnh nhân (trong phạm vi phân công) | Cây lịch sử khám, ảnh nội soi và đơn thuốc quá khứ hợp lệ |
| **DOC-08** | Quản lý thuốc theo lô & danh mục | `[Đã xác nhận]` | Quản lý danh mục thuốc, đối soát nhà cung cấp, kiểm soát số lô, hạn sử dụng và tồn kho theo lô cơ bản phục vụ cấp phát thuốc an toàn. Các phân tích tồn kho nâng cao đưa sang giai đoạn sau. | Thông tin thuốc, nhà cung cấp, số lô, hạn dùng, số lượng | Danh mục thuốc chuẩn hóa, quản lý tồn kho theo lô an toàn |

### 3.3. Phân hệ chức năng dành cho Bệnh nhân / Người dùng (07 chức năng)

| Mã chức năng | Tên chức năng | Phân loại | Mô tả chi tiết nghiệp vụ | Đầu vào | Kết quả đầu ra |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **PAT-01** | Xem Landing Page & Dịch vụ | `[Đã xác nhận - MVP]` | Xem thông tin giới thiệu phòng khám chuyên khoa Tai Mũi Họng, bảng giá các dịch vụ/thủ thuật, danh sách bác sĩ chuyên khoa, giờ mở cửa và địa chỉ. | Không yêu cầu | Giao diện thông tin phòng khám thân thiện, tối ưu SEO |
| **PAT-02** | Đặt lịch khám online | `[Đã xác nhận - MVP]` | Chọn ngày khám, khung giờ mong muốn, bác sĩ (tùy chọn), nhập họ tên, SĐT, năm sinh và mô tả ngắn triệu chứng TMH gặp phải. | Họ tên, SĐT, ngày giờ hẹn, triệu chứng | Mã đặt hẹn (Appointment Code), trạng thái "PENDING" |
| **PAT-03** | Nhận thông tin xác nhận hẹn | `[Đã xác nhận - MVP]` | Nhận phản hồi đặt lịch thành công kèm mã hẹn và hướng dẫn quy trình khi đến phòng khám trên giao diện hoặc qua tin nhắn/email. | Mã đặt hẹn | Màn hình/Thông báo xác nhận lịch hẹn đầy đủ |
| **PAT-04** | Xác thực danh tính đa tầng | `[Đề xuất - Mở rộng]` | Xác thực quyền kiểm soát SĐT bằng OTP (SMS/Zalo ZNS) kết hợp xác minh thông tin danh tính (họ tên, năm sinh, CCCD) để liên kết tài khoản portal với đúng hồ sơ bệnh nhân chính chủ. OTP không tự động cấp quyền xem tất cả hồ sơ trùng SĐT. | Số điện thoại, Mã OTP, thông tin định danh | Phiên đăng nhập (Session Token) kèm danh sách hồ sơ được ủy quyền chính chủ |
| **PAT-05** | Xem lịch sử các lượt khám | `[Đề xuất - Mở rộng]` | Xem danh sách các đợt khám của chính bản thân theo dòng thời gian (ngày khám, bác sĩ khám, kết luận chẩn đoán tổng quát). | Đã đăng nhập & được ủy quyền | Danh sách các lượt khám cá nhân chính chủ |
| **PAT-06** | Tra cứu bệnh án & Đơn thuốc | `[Đề xuất - Mở rộng]` | Xem chi tiết bệnh án, hình ảnh nội soi (truy xuất qua API bảo mật, không dùng URL công khai) và đơn thuốc của từng lần khám để tiện theo dõi hướng dẫn uống thuốc tại nhà. | Mã lượt khám chính chủ | Chi tiết đơn thuốc điện tử, ảnh nội soi và hướng dẫn điều trị |
| **PAT-07** | Nhận nhắc nhở lịch tái khám | `[Đề xuất - Mở rộng]` | Nhận thông báo tự động (qua SMS/Zalo/Portal) khi đến hạn tái khám do bác sĩ đã chỉ định trước đó. | Lịch hẹn tái khám từ hệ thống | Tin nhắn/Thông báo nhắc hẹn kịp thời |

---

## 4. MA TRẬN PHÂN QUYỀN CHI TIẾT (RBAC MATRIX) & BẢO MẬT Y TẾ

### 4.1. Bảng ma trận CRUD và Quyền thực hiện nghiệp vụ trên 16 thực thể ER cốt lõi

**Quy ước ký hiệu quyền:**
- **C (Create):** Tạo mới bản ghi.
- **R (Read):** Xem/tra cứu bản ghi.
- **U (Update):** Cập nhật/chỉnh sửa bản ghi.
- **D (Delete):** Xóa bản ghi (hoặc gắn cờ xóa mềm - Soft Delete).
- **X (Execute):** Kích hoạt/thực thi quy trình nghiệp vụ (Check-in, Khám, Kê đơn, Hoàn tất, Phát thuốc, Thu tiền).
- **- (None):** Tuyệt đối không có quyền truy cập hoặc thực thi.

| STT | Thực thể ER | Lễ tân (Receptionist) | Bác sĩ (Doctor) | Bệnh nhân (MVP) | Bệnh nhân (Portal Mở rộng) | Giới hạn quyền truy cập & Ràng buộc an toàn chi tiết |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **01** | `patients` (Bệnh nhân) | **C, R, U** | **R, U\*** | **C\*** | **R\*** | Lễ tân tạo mới/sửa thông tin hành chính; không được xóa vĩnh viễn bệnh nhân đã có lịch sử tiếp nhận. Bác sĩ chỉ xem và cập nhật tiền sử bệnh/dị ứng (`U*`) cho bệnh nhân trong ca khám. Bệnh nhân tạo hồ sơ khi đặt hẹn (`C*`); Portal chỉ xem hồ sơ chính chủ đã liên kết xác minh (`R*`). |
| **02** | `appointments` (Lịch hẹn) | **C, R, U, D** | **R\*** | **C, R\*** | **C, R, U\*** | Lễ tân toàn quyền điều phối/xác nhận/hủy hẹn. Bác sĩ chỉ xem lịch hẹn tại phòng khám được phân công (`R*`). Bệnh nhân tạo hẹn mới; Portal cho phép xem và hủy lịch hẹn tương lai của chính mình (`U*`). |
| **03** | `receptionists` (Lễ tân) | **R\*** | **-** | **-** | **-** | Thực thể lưu thông tin nhân sự lễ tân. Lễ tân chỉ được xem thông tin hồ sơ của chính mình (`R*`); không có quyền tự sửa quyền hạn hoặc thêm tài khoản lễ tân mới (thẩm quyền quản trị). Bác sĩ và Bệnh nhân không có quyền truy cập. |
| **04** | `admissions` (Lượt tiếp nhận) | **C, R, U, X** | **R\*** | **-** | **-** | Nghiệp vụ tiếp đón tại quầy độc quyền của Lễ tân (tạo lượt, xếp phòng, hủy tiếp nhận nếu bệnh nhân bỏ về). Bác sĩ chỉ đọc danh sách hàng đợi tiếp nhận tại phòng khám của mình (`R*`). |
| **05** | `clinic_rooms` (Phòng khám) | **R** | **R** | **R\*** | **R\*** | Lễ tân xem danh sách phòng và trạng thái hàng đợi để phân bổ. Bác sĩ xem phòng mình đang trực. Bệnh nhân chỉ xem tên phòng/khoa công khai trên Landing Page. Không tác nhân nào có quyền tự tạo/xóa phòng khám ở tầng giao diện vận hành. |
| **06** | `doctors` (Bác sĩ) | **R** | **R, U\*** | **R\*** | **R\*** | Lễ tân đọc danh sách bác sĩ trực để phân phòng. Bác sĩ xem danh sách đồng nghiệp và cập nhật thông tin cá nhân/chữ ký chuyên môn của mình (`U*`). Bệnh nhân chỉ đọc thông tin giới thiệu bác sĩ công khai. |
| **07** | `examinations` (Khám bệnh) | **R\*** *(chỉ hành chính)* | **C, R, U, X** | **-** | **R\*** *(chỉ kết quả)* | **Lễ tân TUYỆT ĐỐI KHÔNG có quyền tạo, sửa, xóa lượt khám; chỉ xem trạng thái hành chính** (`WAITING`, `IN_PROGRESS`, `COMPLETED`). Bác sĩ phụ trách toàn quyền khám, chỉ thao tác trên lượt khám thuộc phạm vi phân công của mình. Portal chỉ xem lượt khám đã hoàn tất của chính mình. |
| **08** | `medical_records` (Bệnh án) | **R\*** *(chỉ tóm tắt HC)*| **C, R, U, X** | **-** | **R\*** *(bệnh án chính chủ)*| **Lễ tân TUYỆT ĐỐI KHÔNG có quyền can thiệp nội dung bệnh án.** Bác sĩ lập, cập nhật chẩn đoán/triệu chứng/sinh hiệu khi đang khám; sau khi ký `COMPLETED` thì bị khóa đóng băng (Immutable). Bác sĩ chỉ truy cập trong phạm vi phân công công việc. Portal chỉ xem bệnh án của chính mình sau khi xác thực danh tính. |
| **09** | `prescriptions` (Đơn thuốc) | **R\*** *(xem để tính tiền & phát)*| **C, R, U, X** | **-** | **R\*** *(đơn chính chủ)* | **Lễ tân TUYỆT ĐỐI KHÔNG có quyền kê đơn hoặc chỉnh sửa loại/liều thuốc.** Bác sĩ tạo và ký đơn. Khi hoàn tất khám, đơn thuốc chuyển sang trạng thái chờ phát và bị khóa chỉnh sửa. Portal chỉ xem đơn thuốc gắn với lượt khám của mình. |
| **10** | `prescription_items` (Chi tiết đơn) | **R\*** *(xem để xuất dược)* | **C, R, U, D\*** | **-** | **R\*** | Bác sĩ thêm, sửa, xóa từng dòng thuốc khi đơn đang soạn thảo (`DRAFT`). Khi đơn đã hoàn tất, danh mục thuốc bị đóng băng. Lễ tân chỉ đọc để tính tiền và phát thuốc. Bệnh nhân Portal chỉ đọc hướng dẫn uống thuốc. |
| **11** | `medicines` (Danh mục thuốc) | **R\*** *(xem tồn kho & giá)* | **C, R, U** | **-** | **-** | Lễ tân chỉ đọc tên thuốc, đơn giá và số lượng tồn để tư vấn hành chính và đối chiếu khi phát. Bác sĩ quản lý danh mục, cập nhật liều dùng chuẩn, hoạt chất và chỉ định chuyên môn. Bệnh nhân không truy cập danh mục nội bộ. *(Lưu ý: Thiết kế MVP dự kiến quản lý số lô, hạn sử dụng và tồn kho theo lô cơ bản phục vụ cấp phát an toàn).* |
| **12** | `suppliers` (Nhà cung cấp) | **R\*** | **C, R, U** | **-** | **-** | Bác sĩ/Bộ phận phụ trách chuyên môn quản lý đối tác dược phẩm. Lễ tân chỉ đọc thông tin hành chính khi cần tra cứu nguồn gốc. Bệnh nhân không có quyền truy cập. |
| **13** | `dispensations` (Phiếu phát thuốc)| **C, R, X** | **R\*** | **-** | **R\*** *(xem trạng thái)* | Lễ tân tạo phiếu xuất thuốc, xác nhận bàn giao thuốc và trừ tồn kho theo lô sau khi đã kiểm tra thanh toán. Bác sĩ theo dõi tiến độ cấp phát của bệnh nhân. Portal xem trạng thái đã nhận thuốc. |
| **14** | `dispensation_items` (Chi tiết phát)| **C, R, U\*, X** | **R\*** | **-** | **R\*** | Lễ tân ghi nhận số lượng thực xuất của từng dòng thuốc theo lô (hỗ trợ trường hợp phát đủ hoặc phát một phần nếu thiếu kho). Bác sĩ xem đối chiếu số lượng thực giao. Bệnh nhân Portal xem chi tiết số lượng thuốc đã nhận. |
| **15** | `invoices` (Hóa đơn viện phí) | **C, R, U, X** | **R\*** | **-** | **R\*** *(hóa đơn chính chủ)*| Nghiệp vụ thu ngân độc quyền của Lễ tân: tổng hợp chi phí khám + thuốc + thủ thuật, chốt hóa đơn, áp dụng miễn giảm (nếu có). Bác sĩ chỉ xem trạng thái thanh toán. Portal chỉ xem hóa đơn của chính mình. |
| **16** | `payments` (Giao dịch thanh toán) | **C, R, X** | **-** | **-** | **R\*** *(biên lai chính chủ)*| Lễ tân ghi nhận các lần thanh toán (tiền mặt / QR chuyển khoản), cập nhật trạng thái hóa đơn. Hỗ trợ thanh toán nhiều lần. Bác sĩ không tham gia nghiệp vụ thu tiền. Portal chỉ đọc biên nhận điện tử. |

---

### 4.2. Ranh giới quyền hạn và Nguyên tắc bất biến (System Invariants)

1. **Phân định rạch ròi giữa Quyền hành chính và Quyền chuyên môn y khoa `[Đã xác nhận]`:**
   - **Lễ tân:** Nắm toàn quyền xử lý quy trình hành chính (tiếp nhận, cấp số, điều phối phòng, lập hóa đơn, thu tiền, phát thuốc theo đơn).
   - **Bác sĩ:** Nắm toàn quyền về nghiệp vụ lâm sàng (chẩn đoán bệnh, lập bệnh án, sinh hiệu, chỉ định thủ thuật, kê đơn thuốc, hẹn tái khám).
   - **Ranh giới bất khả xâm phạm:** Lễ tân **tuyệt đối không thể** thêm, sửa hoặc xóa bất kỳ thông tin nào trong Bệnh án (`medical_records`), Đơn thuốc (`prescriptions`), hoặc Kết quả thủ thuật. Mọi sai sót chuyên môn (nếu phát hiện khi đối chiếu phát thuốc) bắt buộc phải chuyển trả về Bác sĩ để Bác sĩ thực hiện điều chỉnh chính thức.

2. **Giới hạn phạm vi truy cập hồ sơ chuyên môn của Bác sĩ (Principle of Least Privilege) `[Đã xác nhận]`:**
   - Bác sĩ chỉ được phép truy cập và xem hồ sơ bệnh án của những bệnh nhân thuộc **phạm vi công việc và phân công chuyên môn cụ thể**:
     - Bệnh nhân đang chờ khám hoặc đang trong lượt khám tại phòng khám mà bác sĩ được phân công trực.
     - Lịch sử khám của bệnh nhân mà bác sĩ đã từng điều trị hoặc đang trong tiến trình tái khám theo dõi.
     - Trường hợp có yêu cầu hội chẩn chuyên môn hợp lệ được phân công trong hệ thống.
   - Bác sĩ **tuyệt đối không được quyền tra cứu tùy tiện** hồ sơ bệnh án của các bệnh nhân khác không thuộc phạm vi công việc của mình.

3. **Nguyên tắc phân biệt quyền xem Hành chính vs Chuyên môn `[Đã xác nhận]`:**
   - **Lễ tân xem thông tin hành chính:** Mã bệnh nhân, họ tên, ngày khám, tên bác sĩ khám, phòng khám, trạng thái lượt khám (`Chờ khám / Đang khám / Đã khám`), trạng thái hóa đơn (`Chưa thanh toán / Đã thanh toán`).
   - **Lễ tân KHÔNG ĐƯỢC xem thông tin chuyên môn nhạy cảm:** Bệnh sử chi tiết, triệu chứng chuyên sâu, mô tả giải phẫu bệnh, ghi chú riêng của bác sĩ.
   - **Bác sĩ xem toàn diện:** Được truy cập đầy đủ thông tin chuyên môn và tiền sử bệnh lý của bệnh nhân trong phạm vi lượt khám được phân công phục vụ chẩn đoán.

4. **Nguyên tắc đóng băng dữ liệu y tế (Medical Record Immutability) `[Đã xác nhận]`:**
   - Khi bác sĩ nhấn "Hoàn tất khám" (`COMPLETED`), bản ghi bệnh án và đơn thuốc chuyển sang trạng thái khóa (Locked/Immutable).
   - Không ai (kể cả bác sĩ) có thể tùy tiện chỉnh sửa hoặc xóa bỏ bệnh án để bảo đảm tính pháp lý và tính toàn vẹn của hồ sơ y khoa ngoại trú. Mọi sửa đổi bổ sung sau khi hoàn tất phải thực hiện thông qua ghi chú phụ lục có lưu lịch sử vết (Audit Log).

---

### 4.3. Kiến trúc bảo mật đa tầng cho Patient Portal, Quản lý File Nội soi & Backend Access Control `[Đề xuất]`

Để khắc phục rủi ro rò rỉ dữ liệu y tế cá nhân, hệ thống thiết lập cơ chế kiểm soát bảo mật đa tầng nghiêm ngặt:

```
[Bệnh nhân yêu cầu truy cập]
         │
         ▼
+─────────────────────────────────────────────────────────────────────────────────+
| TẦNG 1: XÁC THỰC QUYỀN KIỂM SOÁT SỐ ĐIỆN THOẠI (Phone Control Verification)      |
| • Nhập SĐT -> Hệ thống gửi OTP ngẫu nhiên (6 chữ số, TTL = 5 phút) qua SMS/ZNS. |
| • Kiểm tra rate-limit (tối đa 3 lần/10 phút) chống tấn công Brute-force/Spam.   |
| • OTP chỉ chứng minh quyền kiểm soát SĐT, KHÔNG TỰ ĐỘNG CẤP QUYỀN XEM HỒ SƠ.   |
+─────────────────────────────────────────────────────────────────────────────────+
         │ (OTP hợp lệ)
         ▼
+─────────────────────────────────────────────────────────────────────────────────+
| TẦNG 2: XÁC MINH DANH TÍNH BỆNH NHÂN (Identity Verification)                    |
| • Bắt buộc đối chiếu thông tin định danh: Họ tên, Ngày sinh, Giới tính, hoặc    |
|   4 số cuối CCCD khớp với hồ sơ lưu tại phòng khám để chứng minh chủ thể.       |
+─────────────────────────────────────────────────────────────────────────────────+
         │ (Thông tin khớp hồ sơ)
         ▼
+─────────────────────────────────────────────────────────────────────────────────+
| TẦNG 3: LIÊN KẾT TÀI KHOẢN VỚI HỒ SƠ CHÍNH CHỦ (Account-to-Patient Linking)     |
| • Giải quyết bài toán 1 SĐT dùng chung cho gia đình (Bố mẹ đăng ký cho con nhỏ).|
| • Hệ thống liệt kê danh sách các hồ sơ bệnh nhân gắn với SĐT kèm quan hệ ủy quyền|
| • Bệnh nhân chọn đúng hồ sơ muốn xem và hoàn tất liên kết tài khoản (Binding).   |
+─────────────────────────────────────────────────────────────────────────────────+
         │ (Liên kết được xác lập)
         ▼
+─────────────────────────────────────────────────────────────────────────────────+
| TẦNG 4: KIỂM SOÁT TRUY CẬP TỪNG LƯỢT KHÁM (Visit-Level Authorization Check)     |
| • Backend Middleware chặn mọi request API truy vấn `medical_records`,           |
|   `prescriptions`, `invoices`, và tệp hình ảnh nội soi.                         |
| • Kiểm tra điều kiện: `examination.patient_id == current_authenticated_patient_id`|
| • Bệnh nhân tuyệt đối KHÔNG ĐƯỢC xem hồ sơ của người khác (Chống BOLA/IDOR).    |
+─────────────────────────────────────────────────────────────────────────────────+
```

**Nguyên tắc kiểm soát quyền truy cập dữ liệu và Quản lý file nội soi an toàn tại Backend:**
1. **Kiểm tra quyền tại tầng Controller/Middleware (BOLA/IDOR Defense):** Mọi endpoint API như `GET /api/examinations/:id`, `GET /api/medical-records/:id` bắt buộc phải trích xuất `user_id` và `role` từ JWT/Session Token, truy vấn DB để xác minh quyền sở hữu bản ghi trước khi trả dữ liệu. Không tin tưởng bất kỳ tham số `patient_id` nào gửi lên từ phía Client.
2. **Kiểm soát truy cập Hình ảnh Nội soi an toàn (Secure Endoscopy File Access):**
   - Tệp hình ảnh nội soi được lưu trữ trong thư mục riêng biệt được bảo vệ trên máy chủ Backend (Private Storage, ví dụ `/storage/secure/endoscopy/`), **tuyệt đối không đặt trong thư mục public static web root**.
   - Mỗi hình ảnh được liên kết chặt chẽ với `examination_id`.
   - Quyền xem ảnh phải đi qua endpoint API có xác thực và phân quyền (ví dụ `GET /api/examinations/:examId/endoscopy-images/:imageId`), chỉ trả dữ liệu tệp khi người gọi là Bác sĩ phụ trách hoặc Bệnh nhân chính chủ của lượt khám đó. **Tuyệt đối cấm sử dụng URL công khai không bảo vệ (Unprotected public URLs).**
3. **Che giấu dữ liệu nhạy cảm (Data Masking):** Khi hiển thị danh sách hồ sơ liên kết với số điện thoại, hệ thống tự động ẩn giấu một phần thông tin (ví dụ: `Nguyễn V** A* - 19**`).
4. **Ghi vết nhật ký truy cập (Audit Logging):** Mọi hành vi đăng nhập, truy vấn bệnh án, xem đơn thuốc, tải ảnh nội soi đều được ghi lại trong bảng log hệ thống (`access_logs`) gồm thời gian, IP truy cập và mã hồ sơ được xem.

---

## 5. ÁNH XẠ TÁC NHÂN & CHỨC NĂNG VỚI 16 THỰC THỂ ER CỐT LÕI

### 5.1. Danh mục 16 thực thể ER cốt lõi của hệ thống `[Đã xác nhận]`
Hệ thống vận hành trên 16 thực thể liên kết chuẩn mực:
1. `patients` (Bệnh nhân)
2. `appointments` (Lịch hẹn khám)
3. `receptionists` (Lễ tân - thông tin nhân sự hành chính)
4. `admissions` (Tiếp nhận / Lượt check-in tại quầy)
5. `clinic_rooms` (Phòng khám Tai Mũi Họng)
6. `doctors` (Bác sĩ - thông tin nhân sự chuyên môn)
7. `examinations` (Khám bệnh / Lượt khám chuyên môn)
8. `medical_records` (Hồ sơ bệnh án)
9. `prescriptions` (Đơn thuốc)
10. `prescription_items` (Chi tiết đơn thuốc)
11. `medicines` (Thuốc)
12. `suppliers` (Nhà cung cấp dược phẩm)
13. `dispensations` (Phiếu phát thuốc)
14. `dispensation_items` (Chi tiết phát thuốc)
15. `invoices` (Hóa đơn viện phí)
16. `payments` (Thanh toán viện phí)

---

### 5.2. Bảng ánh xạ Tác nhân - Chức năng - Thực thể ER

| Tác nhân | Mã chức năng | Thực thể ER chính tác động | Thực thể ER liên quan / Tham chiếu | Thao tác dữ liệu (Data Operation) | Phân loại |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Bệnh nhân** | PAT-01 (Xem info) | `clinic_rooms`, `doctors` | - | `SELECT` thông tin công khai phòng khám và bác sĩ | `[Đã xác nhận]` |
| **Bệnh nhân** | PAT-02 (Đặt hẹn) | `appointments` | `patients` | `INSERT appointments` trạng thái `PENDING` | `[Đã xác nhận]` |
| **Bệnh nhân** | PAT-03 (Nhận xác nhận)| `appointments` | - | `SELECT appointments` theo mã đặt hẹn vừa tạo | `[Đã xác nhận]` |
| **Lễ tân** | REC-01 (QL Bệnh nhân) | `patients` | - | `INSERT`, `SELECT`, `UPDATE` thông tin nhân khẩu | `[Đã xác nhận]` |
| **Lễ tân** | REC-02 (QL Lịch hẹn) | `appointments` | `patients`, `doctors` | `SELECT`, `UPDATE` trạng thái lịch hẹn (`CONFIRMED`, `CANCELLED`)| `[Đã xác nhận]` |
| **Lễ tân** | REC-03 (Tiếp nhận) | `admissions` | `patients`, `appointments`, `receptionists` | `INSERT admissions` gắn `receptionist_id`, `patient_id` | `[Đã xác nhận]` |
| **Lễ tân** | REC-04 (Phân phòng) | `admissions` | `clinic_rooms`, `doctors` | `UPDATE admissions` gán `room_id`, `doctor_id` và số thứ tự | `[Đã xác nhận]` |
| **Lễ tân** | REC-05 (Tra cứu HC) | `admissions`, `patients` | `clinic_rooms`, `doctors` | `SELECT` lịch sử tiếp nhận và thông tin hành chính tổng quát | `[Đã xác nhận]` |
| **Bác sĩ** | DOC-01 (Xem hàng đợi)| `admissions` | `patients`, `clinic_rooms` | `SELECT admissions` trạng thái `WAITING` tại phòng phụ trách | `[Đã xác nhận]` |
| **Bác sĩ** | DOC-02 (Bắt đầu khám)| `examinations` | `admissions`, `doctors`, `clinic_rooms` | `INSERT examinations` liên kết `admission_id`, trạng thái `IN_PROGRESS`| `[Đã xác nhận]` |
| **Bác sĩ** | DOC-03 (Lập bệnh án) | `medical_records` | `examinations`, `patients`, `doctors` | `INSERT / UPDATE` chẩn đoán, triệu chứng, hướng điều trị TMH | `[Đã xác nhận]` |
| **Bác sĩ** | DOC-04 (Kê đơn thuốc)| `prescriptions`, `prescription_items` | `examinations`, `medicines` | `INSERT prescriptions`, lặp `INSERT prescription_items` | `[Đã xác nhận]` |
| **Bác sĩ** | DOC-05 (Chỉ định tái khám)| `examinations`, `appointments` | `patients`, `doctors` | `UPDATE examinations` lưu ngày hẹn; tạo `appointments` dự kiến | `[Đã xác nhận]` |
| **Bác sĩ** | DOC-06 (Hoàn tất khám)| `examinations` | `medical_records`, `prescriptions` | `UPDATE examinations` sang `COMPLETED`, khóa sửa đổi chuyên môn | `[Đã xác nhận]` |
| **Bác sĩ** | DOC-07 (Xem lịch sử) | `medical_records`, `prescriptions` | `examinations`, `patients` | `SELECT` toàn bộ bệnh án và đơn thuốc quá khứ trong phạm vi cho phép | `[Đã xác nhận]` |
| **Bác sĩ** | DOC-08 (Kho thuốc) | `medicines`, `suppliers` | - | `SELECT`, `INSERT`, `UPDATE` danh mục thuốc, số lô, hạn dùng, số lượng nhập | `[Đã xác nhận]` |
| **Lễ tân** | REC-06 (Lập hóa đơn) | `invoices` | `examinations`, `prescriptions`, `receptionists` | `INSERT invoices` tính tổng viện phí (khám + thuốc + thủ thuật) | `[Đã xác nhận]` |
| **Lễ tân** | REC-07 (Thu tiền) | `payments` | `invoices` | `INSERT payments`, `UPDATE invoices` trạng thái thanh toán | `[Đã xác nhận]` |
| **Lễ tân** | REC-08 (Phát thuốc) | `dispensations`, `dispensation_items` | `prescriptions`, `medicines`, `invoices` | `INSERT dispensations`, `dispensation_items`, trừ tồn kho `medicines` theo lô | `[Đề xuất]` |
| **Bệnh nhân** | PAT-04 (Xác thực danh tính)| `patients` | - | Xác thực OTP & đối chiếu danh tính, tạo phiên làm việc | `[Đề xuất]` |
| **Bệnh nhân** | PAT-05..06 (Tra cứu hồ sơ)| `medical_records`, `prescriptions` | `examinations`, `invoices` | `SELECT` dữ liệu cá nhân theo `patient_id` đã được xác minh | `[Đề xuất]` |
| **Bệnh nhân** | PAT-07 (Nhắc tái khám)| `appointments` | `patients`, `doctors` | `SELECT appointments` loại "TÁI KHÁM" sắp đến hạn | `[Đề xuất]` |

---

### 5.3. Mô hình quan hệ thực thể nghiệp vụ (Entity Relationship Flow) `[Đề xuất cho T5]`

```
[Bệnh nhân: patients] 1 ─── * [Lịch hẹn: appointments]
         │ 1
         │
         +─── * [Tiếp nhận: admissions] (Online booking hoặc Walk-in)
                     │ 1
                     │
                     +─── 0..1 [Khám bệnh: examinations]
                                 │  (Lưu ý: 0 khi tiếp nhận bị hủy hoặc bệnh nhân bỏ về)
                                 │
                                 +─── 1 [Bệnh án: medical_records]
                                 │       (Bắt buộc: Bệnh án nháp IN_PROGRESS -> Đóng băng COMPLETED)
                                 │
                                 +─── 0..1 [Đơn thuốc: prescriptions]
                                 │       │ (Tùy chọn: Có lượt khám KHÔNG kê thuốc)
                                 │       │ 1
                                 │       +─── 1..* [Chi tiết đơn: prescription_items]
                                 │       │
                                 │       +─── 0..* [Phát thuốc: dispensations]
                                 │                    │ (0..1 nếu phát đủ 1 lần; 0..* nếu phát nhiều đợt)
                                 │                    │ 1
                                 │                    +─── 1..* [Chi tiết phát: dispensation_items]
                                 │
                                 +─── 1 [Hóa đơn: invoices]
                                             │ (Khám xong lập HĐ: UNPAID -> PARTIALLY_PAID -> PAID)
                                             │ 1
                                             +─── 1..* [Thanh toán: payments]
                                                 (Thanh toán 1 lần hoặc nhiều đợt)
```

*(Chi tiết về các thực thể mở rộng lâm sàng TMH như `services`, `examination_services`, `endoscopy_images`, `invoice_items` và `vital_signs` đã được phân tích chi tiết trong tài liệu [02-business-capabilities.md](file:///d:/clinic-management/docs/requirements/02-business-capabilities.md) và [03-gap-analysis.md](file:///d:/clinic-management/docs/requirements/03-gap-analysis.md) để chuyển giao sang Task T5).*

---

## 6. QUY TẮC NGHIỆP VỤ BẮT BUỘC (BUSINESS RULES)

### 6.1. Quy tắc tiếp nhận & Quản lý hàng đợi
- **Quy tắc 1.1 (Khám không đặt lịch trước - Walk-in) `[Đã xác nhận]`:** Bệnh nhân đến trực tiếp phòng khám mà chưa đặt hẹn trước vẫn được tiếp đón bình thường. Lễ tân tra cứu SĐT, nếu là bệnh nhân mới thì tạo mới hồ sơ `patients`, sau đó tạo bản ghi `admissions` loại "TRỰC TIẾP" và cấp số thứ tự vào phòng khám. Đây là luồng nghiệp vụ chuẩn của phòng khám ngoại trú, không được coi là lỗi.
- **Quy tắc 1.2 (Bệnh nhân có lịch hẹn online) `[Đã xác nhận]`:** Khi bệnh nhân đến quầy báo mã lịch hẹn hoặc SĐT, lễ tân tra cứu lịch hẹn `appointments`, xác nhận thông tin thực tế và chuyển trạng thái lịch hẹn sang "ĐÃ ĐẾN", đồng thời kích hoạt tạo bản ghi `admissions` tương ứng.
- **Quy tắc 1.3 (Phòng khám & Hàng đợi độc lập) `[Đã xác nhận]`:** Một bệnh nhân tại một thời điểm chỉ có thể ở trạng thái chờ khám tại một phòng khám duy nhất để tránh xung đột lượt khám.
- **Quy tắc 1.4 (Hủy tiếp nhận) `[Đề xuất]`:** Lễ tân có quyền chuyển trạng thái tiếp nhận sang "HỦY" (`CANCELLED`) nếu bệnh nhân thông báo không thể chờ khám hoặc trường hợp khẩn cấp chuyển viện; bản ghi hủy vẫn được lưu vết hành chính và không tạo lượt khám giả.

### 6.2. Quy trình chuyên môn Tai Mũi Họng của Bác sĩ
- **Quy tắc 2.1 (Lượt khám không bắt buộc có đơn thuốc) `[Đã xác nhận]`:** Khám Tai Mũi Họng có nhiều trường hợp người bệnh chỉ đến để làm thủ thuật (vệ sinh tai, hút ráy tai, lấy dị vật, xông họng), tư vấn chăm sóc giọng nói, hoặc kết quả kiểm tra bình thường. Hệ thống **cho phép hoàn tất lượt khám mà không có đơn thuốc**.
- **Quy tắc 2.2 (Chỉ định tái khám) `[Đã xác nhận]`:** Bác sĩ có thể chỉ định ngày tái khám. Khi hoàn tất lượt khám, nếu có chỉ định tái khám, hệ thống tự động sinh một bản ghi lịch hẹn dự kiến (`appointments`) với loại "TÁI KHÁM" để hỗ trợ lễ tân và bệnh nhân theo dõi.
- **Quy tắc 2.3 (Tính bất biến của chẩn đoán y khoa) `[Đã xác nhận]`:** Lễ tân tuyệt đối không có quyền can thiệp vào trường chẩn đoán (`diagnosis`), triệu chứng (`symptoms`), chỉ định điều trị (`treatment_plan`) trong `medical_records` và danh mục thuốc trong `prescriptions`.
- **Quy tắc 2.4 (Khóa chỉnh sửa hồ sơ sau hoàn tất) `[Đã xác nhận]`:** Sau khi bác sĩ bấm hoàn tất (`COMPLETED`), toàn bộ nội dung bệnh án và đơn thuốc bị khóa chỉnh sửa trực tiếp. Mọi bổ sung sau đó phải tạo bản ghi phụ lục/ghi chú có ghi nhận thời gian và người sửa.

### 6.3. Quy trình thu ngân và phát thuốc
- **Quy tắc 3.1 (Tính toàn vẹn hóa đơn) `[Đã xác nhận]`:** Hóa đơn viện phí (`invoices`) bao gồm:
  - Phí khám bệnh (cố định theo bảng giá phòng khám).
  - Phí thủ thuật Tai Mũi Họng (nếu có thực hiện trong lượt khám).
  - Tiền thuốc = Tổng ∑ (Số lượng × Đơn giá) của các mục trong `prescription_items` (nếu có đơn thuốc).
- **Quy tắc 3.2 (Thứ tự phát thuốc & Điều kiện thanh toán) `[Đề xuất]`:** Lễ tân chỉ được xác nhận phát thuốc (`dispensations`) khi hóa đơn tương ứng đã được thanh toán đủ (`invoices.status = 'PAID'`) hoặc được bảo lãnh thanh toán trong trường hợp đặc biệt.
- **Quy tắc 3.3 (Xử lý trường hợp chưa phát đủ thuốc & Kiểm soát lô) `[Đề xuất]`:** Nếu kho thuốc tạm thời không đủ số lượng kê đơn, lễ tân được phép ghi nhận số lượng thực xuất theo từng lô tại `dispensation_items` và ghi chú số lượng còn nợ; bệnh nhân có thể nhận phần còn lại sau hoặc trừ tiền tương ứng trên hóa đơn.
- **Quy tắc 3.4 (Trừ kho tự động theo số lô thực tế phát) `[Đã xác nhận]`:** Khi lễ tân xác nhận phát thuốc thành công, hệ thống tự động kích hoạt cập nhật trừ số lượng tồn kho theo số lô cụ thể (`batch_quantity`) và cập nhật số tồn tổng (`stock_quantity`) theo nguyên tắc hạn dùng (FEFO).

### 6.4. An toàn dữ liệu và Bảo vệ thông tin y tế cá nhân
- **Quy tắc 4.1 (Không rò rỉ dữ liệu chéo) `[Đã xác nhận]`:** Bệnh nhân tuyệt đối không được phép xem thông tin cá nhân, hồ sơ bệnh án hoặc đơn thuốc của bệnh nhân khác.
- **Quy tắc 4.2 (Xác thực chủ thể nghiêm ngặt) `[Đã xác nhận]`:** Khi người dùng muốn xem lịch sử bệnh án trên cổng Portal, hệ thống **tuyệt đối không được** chỉ dựa vào việc biết số điện thoại đơn thuần, mà bắt buộc phải qua quy trình xác thực OTP và xác minh danh tính người bệnh.
- **Quy tắc 4.3 (Phòng ngừa dùng chung số điện thoại) `[Đề xuất]`:** Trường hợp một số điện thoại đăng ký cho nhiều người trong gia đình (cha mẹ đăng ký cho các con), việc nhập đúng OTP chỉ chứng minh quyền kiểm soát thiết bị liên lạc; người dùng bắt buộc phải chọn đúng hồ sơ bệnh nhân và xác nhận thông tin định danh (năm sinh/CCCD) mới được xem chi tiết bệnh án của hồ sơ đó.

---

## 7. PHÂN ĐỊNH PHẠM VI: MVP, MỞ RỘNG & YÊU CẦU PHÁP LÝ THẨM ĐỊNH

```
+-----------------------------------------------------------------------------------------+
|                                    LỘ TRÌNH TRIỂN KHAI                                  |
+----------------------------------------------------+------------------------------------+
|                GIAI ĐOẠN 1: MVP                    |       GIAI ĐOẠN 2: MỞ RỘNG         |
|             (Vận hành cốt lõi phòng khám)          |     (Patient Portal & Nâng cao)    |
+----------------------------------------------------+------------------------------------+
| • Lễ tân: Quản lý bệnh nhân, tiếp nhận, hàng đợi,  | • Cổng thông tin bệnh nhân         |
|   phân phòng, thu ngân chi tiết, phát thuốc theo   |   (Patient Portal) hoàn chỉnh.     |
|   đơn có kiểm soát số lô và hạn dùng cơ bản.       | • Xác thực đa tầng (OTP + ID check)|
|   (Mô hình 3 tác nhân: Lễ tân, Bác sĩ, Bệnh nhân)  | • Tra cứu bệnh án, đơn thuốc và    |
| • Bác sĩ: Hàng đợi khám, khám TMH, sinh hiệu,      |   hình ảnh nội soi qua API an toàn.|
|   thủ thuật, ảnh nội soi bảo mật, lập bệnh án,     | • Nhắc lịch tái khám tự động SMS.  |
|   kê đơn, chỉ định tái khám, xem lịch sử theo quyền| • Phân tích tồn kho dược nâng cao  |
|   phân công, quản lý danh mục và kho thuốc theo lô.|   (Dự báo nhu cầu, ABC/VED).       |
| • Bệnh nhân: Landing Page phòng khám, xem dịch vụ, | • Tách vai trò Dược sĩ nếu cần.    |
|   đặt lịch khám online, nhận thông tin xác nhận.   | • Chuẩn bị kết nối liên thông.     |
| • Không tạo giao diện Dược sĩ hoặc Admin riêng.    |                                    |
+----------------------------------------------------+------------------------------------+
```

### 7.1. Phạm vi MVP (Minimum Viable Product - Giai đoạn 1) `[Đã xác nhận]`
1. **Giao diện Lễ tân:**
   - Tiếp nhận bệnh nhân: Đặt hẹn trước và Trực tiếp (Walk-in).
   - Quản lý danh sách bệnh nhân và phân luồng vào phòng khám TMH.
   - Quản lý danh sách chờ theo số thứ tự trực quan.
   - Lập hóa đơn viện phí chi tiết và ghi nhận thanh toán tiền mặt/chuyển khoản QR.
   - Thực hiện quy trình phát thuốc theo đơn bác sĩ đã lập, trừ tồn kho thuốc theo số lô và hạn dùng (FEFO) cơ bản.
2. **Giao diện Bác sĩ:**
   - Xem danh sách bệnh nhân đang chờ khám tại phòng mình.
   - Khám chuyên khoa Tai Mũi Họng, ghi nhận sinh hiệu, triệu chứng và chẩn đoán bệnh án.
   - Chỉ định và ghi nhận thủ thuật TMH, đính kèm kết quả và 2-4 ảnh nội soi TMH vào vùng lưu trữ bảo mật.
   - Kê đơn thuốc điện tử chọn từ danh mục thuốc sẵn có (nắm rõ số lượng theo lô và hạn dùng).
   - Hỗ trợ lượt khám không có đơn thuốc.
   - Hẹn ngày tái khám.
   - Xem lịch sử các lần khám trước của bệnh nhân trong phạm vi phân công công việc hợp lệ.
   - Quản lý danh mục thuốc và kho thuốc theo lô cơ bản phục vụ cấp phát an toàn.
3. **Giao diện Bệnh nhân (Công khai):**
   - Landing Page giao diện hiện đại giới thiệu phòng khám chuyên khoa TMH.
   - Tra cứu danh mục dịch vụ khám, bảng giá tham khảo, đội ngũ bác sĩ.
   - Form đặt lịch khám online tiện lợi.
   - Màn hình thông báo kết quả đặt lịch kèm mã hẹn.
4. **Cam kết kiến trúc MVP:**
   - Giữ nguyên mô hình 3 tác nhân; không tạo thêm giao diện Dược sĩ hay Admin riêng trong MVP.

### 7.2. Phạm vi Mở rộng (Extended Scope - Giai đoạn 2) `[Đề xuất]`
1. **Patient Portal (Cổng thông tin bệnh nhân tự phục vụ):**
   - Đăng nhập an toàn với cơ chế xác thực đa tầng (OTP SMS/Zalo ZNS + xác minh danh tính).
   - Dashboard cá nhân hóa cho từng bệnh nhân / người bảo trợ.
   - Xem chi tiết hồ sơ bệnh án qua các thời kỳ, hình ảnh nội soi Tai Mũi Họng truy xuất qua API bảo mật.
   - Tra cứu đơn thuốc điện tử và hướng dẫn điều trị chi tiết.
   - Nhắc nhở lịch tái khám tự động qua SMS/Zalo.
2. **Quản trị kho dược nâng cao & Báo cáo:**
   - Phân tích tồn kho nâng cao (phân tích ABC/VED, cảnh báo dự báo nhu cầu đặt hàng thông minh).
   - Xem xét bổ sung vai trò Dược sĩ độc lập (`Pharmacist`) nếu quy mô phòng khám phát triển thành chuỗi hoặc mở rộng nhà thuốc đạt chuẩn GPP.
   - Báo cáo thống kê tài chính, doanh thu thuốc và dịch vụ chuyên sâu.

### 7.3. Nhóm yêu cầu pháp lý y tế cần thẩm định độc lập
- **Chữ ký số bác sĩ:** Tham chiếu Thông tư 13/2025/TT-BYT; trong MVP sử dụng xác nhận tài khoản điện tử nội bộ (`signed_by_doctor_id`), sẵn sàng tích hợp Chữ ký số USB Token / SmartCA khi có kiểm chứng pháp chế.
- **Chuẩn liên thông đơn thuốc quốc gia:** Tham chiếu Thông tư 26/2025/TT-BYT về kê đơn thuốc ngoại trú; cấu trúc dữ liệu đơn thuốc điện tử được thiết kế tương thích với trường dữ liệu của Cổng đơn thuốc Quốc gia.
- **Bảo vệ dữ liệu y tế nhạy cảm:** Tuân thủ các nguyên tắc cốt lõi về sự đồng ý của chủ thể dữ liệu (Data Subject Consent), quyền được rút lại sự đồng ý và lưu vết kiểm toán (Audit Trail) theo định hướng Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 102/2025/NĐ-CP.

---

## 8. PHÂN LOẠI THÔNG TIN: ĐÃ XÁC NHẬN, ĐỀ XUẤT & CHỜ XÁC NHẬN

| STT | Nội dung nghiệp vụ | Hiện trạng phân loại | Mô tả chi tiết & Căn cứ kỹ thuật | Bước xử lý tiếp theo |
| :---: | :--- | :---: | :--- | :--- |
| **01** | Mô hình 3 tác nhân chính (Lễ tân, Bác sĩ, Bệnh nhân) | `[Đã xác nhận]` | Căn cứ trực tiếp theo Issue #1. Giữ nguyên toàn bộ 3 tác nhân xuyên suốt MVP. | Áp dụng cho toàn bộ dự án |
| **02** | Ranh giới Lễ tân không sửa bệnh án / đơn thuốc | `[Đã xác nhận]` | Bất biến nghiệp vụ y khoa. Lễ tân chỉ xử lý hành chính và thu ngân/phát thuốc. | Cài đặt Middleware chặn sửa tại Backend |
| **03** | Khám trực tiếp (Walk-in) & Khám không kê đơn | `[Đã xác nhận]` | Nghiệp vụ thực tế phòng khám TMH. Cho phép hoàn tất khám mà không có đơn thuốc. | Thiết kế form khám & luồng check-in |
| **04** | Tiếp nhận nhưng chưa khám hoặc hủy tiếp nhận | `[Đề xuất]` | Quan hệ `admissions 1 ─── 0..1 examinations`. Lượt tiếp nhận bị hủy không sinh lượt khám. | Xác nhận chính thức tại Task T5 (ERD) |
| **05** | Thanh toán nhiều lần & Hóa đơn nhiều trạng thái | `[Đề xuất]` | Quan hệ `invoices 1 ─── 1..* payments`. Hỗ trợ trả tiền mặt + QR hoặc thanh toán nhiều đợt. | Chuẩn hóa schema bảng `payments` ở Task T5 |
| **06** | Lễ tân phụ trách phát thuốc trong MVP | `[Đề xuất]` | Mô hình dự kiến cho MVP nhằm tinh gọn nhân sự phòng khám tư nhân. | Chuẩn hóa quy trình giao nhận ở Task T4 |
| **07** | Bổ sung phân hệ Thủ thuật TMH & Hình ảnh nội soi bảo mật | `[Đề xuất]` | Nhu cầu cấp thiết của phòng khám TMH; ảnh nội soi lưu trữ riêng biệt, kiểm soát quyền truy cập qua API. | Chuẩn hóa bảng `services`, `endoscopy_images` ở Task T5 |
| **08** | Bổ sung Sinh hiệu lâm sàng (Vital Signs) | `[Đề xuất]` | An toàn kê đơn cho bệnh nhi (tính liều mg/kg) và người cao tuổi có bệnh nền. | Đề xuất gộp vào `examinations` ở Task T5 |
| **09** | Bảo mật Patient Portal qua 4 tầng kiểm soát | `[Đề xuất]` | Ngăn ngừa rò rỉ dữ liệu khi nhiều người dùng chung 1 SĐT; chống lỗ hổng BOLA/IDOR. | Hiện thực hóa tại module Auth ở Backend |
| **10** | Quản lý Lô & Hạn sử dụng thuốc (FEFO) trong MVP | `[Đề xuất]` | MVP quản lý số lô, hạn dùng và tồn kho theo lô phục vụ cấp phát an toàn; phân tích tồn kho nâng cao chuyển sang Giai đoạn 2. | Thiết kế bảng `medicine_batches` ở Task T5 |

---

## 9. KẾT LUẬN & NGHIỆM THU TASK T1

1. **Tính hoàn thiện của tài liệu:**
   - Tài liệu đặc tả [01-actors-permissions.md](file:///d:/clinic-management/docs/requirements/01-actors-permissions.md) đã bao quát đầy đủ **3 tác nhân**, **23 chức năng chuẩn**, và **ma trận RBAC chi tiết trên đủ 16 thực thể ER cốt lõi**.
   - Tài liệu được liên kết hữu cơ với [02-business-capabilities.md](file:///d:/clinic-management/docs/requirements/02-business-capabilities.md) (Bản đồ năng lực nghiệp vụ) và [03-gap-analysis.md](file:///d:/clinic-management/docs/requirements/03-gap-analysis.md) (Phân tích khoảng cách).
2. **Tính chính xác về ranh giới quyền hạn:**
   - Tách biệt tuyệt đối quyền hành chính (Lễ tân) và quyền chuyên môn y tế (Bác sĩ). Không tồn tại bất kỳ mâu thuẫn quyền hạn nào.
   - Bác sĩ chỉ truy cập hồ sơ bệnh án theo phạm vi công việc và quyền được cấp (Need-to-Know).
   - Cơ chế bảo mật đa tầng bảo vệ thông tin bệnh án người bệnh, giải quyết thấu đáo bài toán số điện thoại dùng chung trong gia đình.
   - Tệp hình ảnh nội soi được lưu trữ an toàn, kiểm soát truy cập qua API, không dùng URL công khai.
3. **Phân định rõ ràng các tầng thông tin:**
   - Mọi quy tắc và quan hệ đã được gắn nhãn minh bạch giữa `[Đã xác nhận]`, `[Đề xuất]` và `[Chờ xác nhận]`. Không tự ý thay đổi sơ đồ ER gốc trong phạm vi Task T1 mà bảo lưu các điểm đề xuất để chuẩn hóa tại Task T5.
4. **Sẵn sàng nghiệm thu:**
   - Toàn bộ nội dung Task T1 đã được rà soát, kiểm tra thực tế trên hệ thống tệp và đáp ứng các tiêu chuẩn kỹ thuật chuyên nghiệp.
