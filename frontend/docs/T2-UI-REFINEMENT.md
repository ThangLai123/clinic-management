# Báo cáo bàn giao Task T2 – UI Refinement

Ngày kiểm tra: 03/11/2026, múi giờ Asia/Saigon.

Phạm vi: frontend trong repository hiện có. Trạng thái: hoàn thành phần giao diện và kiểm thử T2, chờ người dùng nghiệm thu.

## A. Lý do tách Public Website và Staff Application

Người bệnh cần tìm thông tin dịch vụ, quy trình, liên hệ và trạng thái đặt lịch. Các liên kết dashboard, menu nghiệp vụ và nút đổi vai trò làm gián đoạn hành trình này, đồng thời tạo cảm giác hệ thống nội bộ đang có thể sử dụng mà chưa cần xác thực.

Nhân viên cần một điểm đăng nhập riêng và không gian làm việc theo vai trò được cấp. Ba tác nhân Bệnh nhân, Lễ tân, Bác sĩ thuộc hai khu vực truy cập; Lễ tân và Bác sĩ dùng chung cổng nhân viên. Việc tách giao diện không thay thế xác thực và phân quyền ở Backend.

## B. Cấu trúc giao diện mới

| Route | Layout/nội dung | Development | Production |
| --- | --- | --- | --- |
| `/` | PublicLayout → LandingPage | Website bệnh nhân | Website bệnh nhân |
| `/booking-notice` | PublicLayout → BookingNoticePage | Thông báo đang phát triển | Thông báo đang phát triển |
| `/login` | StaffLoginPage độc lập | Form UI, chưa xác thực | Form UI, chưa xác thực |
| `/staff/login` | Chỉ tương thích đường dẫn cũ | Navigate replace → `/login` | Navigate replace → `/login` |
| `/receptionist` | StaffLayout → ReceptionistDashboard | PREVIEW ONLY, dữ liệu mẫu | Navigate replace → `/login` |
| `/doctor` | StaffLayout → DoctorDashboard | PREVIEW ONLY, dữ liệu mẫu | Navigate replace → `/login` |
| `*` | NotFoundPage độc lập | Trang 404 | Trang 404 |

Navbar và Footer công khai chỉ phục vụ bệnh nhân. Staff Login và Staff Dashboard không dùng Navbar bệnh nhân. StaffLayout sở hữu Sidebar, TopHeader, banner preview và vùng nội dung chung; dashboard giữ menu và nội dung riêng theo vai trò.

Các dashboard được lazy import trong nhánh `import.meta.env.DEV`. Kiểm tra bundle production không tìm thấy nội dung dashboard mẫu. Query string và localStorage không có cơ chế bật preview trong production.

## C. Chi tiết tệp đã sửa hoặc tạo

Các đường dẫn dưới đây tương đối với `frontend/`. “Sửa” được so với bản sao nội dung đầu phiên; Git hiện chưa theo dõi frontend.

| Tệp | Thay đổi |
| --- | --- |
| `src/App.jsx` | Thêm RouteEffects trong BrowserRouter. |
| `src/routes/AppRoutes.jsx` | Tách public/staff/404; thêm login; giới hạn preview ở development, chuyển hướng production. |
| `src/components/Navbar.jsx` | Gỡ toàn bộ lối vào nhân viên; dùng chung danh sách liên kết bệnh nhân cho desktop/mobile; sửa liên kết về section từ trang đặt lịch. |
| `src/pages/public/LandingPage.jsx` | Gỡ card dashboard; bổ sung section giới thiệu; bỏ chứng chỉ, công nghệ, cam kết điều trị và thông tin liên hệ chưa xác nhận. |
| `src/components/Footer.jsx` | Chỉ giữ nội dung bệnh nhân; bỏ số giấy phép, địa chỉ, hotline và giờ làm việc minh họa từng được trình bày như thật. |
| `src/layouts/PublicLayout.jsx` | Bổ sung skip link và đích nội dung chính; giữ layout công khai độc lập. |
| `src/pages/public/BookingNoticePage.jsx` | Ghi rõ chưa có Backend, không nhận dữ liệu hoặc tạo lịch hẹn; bỏ hướng dẫn liên hệ qua số giả. |
| `src/pages/public/NotFoundPage.jsx` | Tăng tương phản CTA và vùng chạm; dùng route 404 chung. |
| `src/pages/staff/StaffLoginPage.jsx` | Tạo trang đăng nhập, validation client, hiện/ẩn mật khẩu, lỗi từng trường và vùng trạng thái. |
| `src/layouts/StaffLayout.jsx` | Tạo layout nội bộ dùng chung; quản lý Sidebar mobile và banner PREVIEW ONLY. |
| `src/components/Sidebar.jsx` | Menu đúng vai trò; link về staff login; Escape, giữ focus trong menu mobile và trả focus khi đóng; bỏ nút logo dẫn về website bệnh nhân. |
| `src/components/TopHeader.jsx` | Gỡ nút đổi vai trò; hiển thị chưa đăng nhập, vai trò đang xem, ca trực chưa có dữ liệu và Đăng xuất disabled. |
| `src/pages/receptionist/ReceptionistDashboard.jsx` | Dùng StaffLayout; chỉ giữ dữ liệu mẫu; thay skeleton tải vô hạn bằng dấu chưa có dữ liệu; bảng cuộn ngang. |
| `src/pages/doctor/DoctorDashboard.jsx` | Dùng StaffLayout; bỏ thông tin bác sĩ như đã đăng nhập; đổi thao tác thành xem mẫu; thay nội dung đơn thuốc/chẩn đoán bằng placeholder; bảng cuộn ngang. |
| `src/components/Icons.jsx` | Thêm EyeIcon và EyeOffIcon theo bộ SVG hiện có. |
| `src/components/RouteEffects.jsx` | Tạo xử lý tiêu đề trang, cuộn section khi chuyển route và reset cuộn giữa các trang. |
| `src/index.css` | Focus-visible chung, skip link, khoảng cuộn section dưới Navbar và trạng thái con trỏ nút. |
| `package.json` | Thêm Playwright dev dependency, test:e2e và lifecycle build trước E2E. |
| `package-lock.json` | Khóa các dependency phục vụ kiểm thử. |
| `playwright.config.js` | Tạo bốn project development/production × desktop/mobile; server riêng; báo cáo JSON/HTML, ảnh và trace khi lỗi. |
| `tests/e2e/t2.spec.js` | Tạo 9 kịch bản trên mỗi project, bao phủ TC01–TC10 và TC13; theo dõi console trong mọi kịch bản. |
| `.gitignore` | Bỏ qua kết quả Playwright phát sinh. |
| `README.md` | Thay README mẫu bằng hướng dẫn chạy, routing, giới hạn auth, kiểm thử và canvas. |
| `designs/t2-ui-refinement/project/canvas.json` | Tạo canvas T2 có artboard desktop và mobile. |
| `designs/t2-ui-refinement/project/Main.dc.html` | Thiết kế trang đăng nhập desktop theo định dạng Design Component. |
| `designs/t2-ui-refinement/project/Mobile.dc.html` | Thiết kế trang đăng nhập mobile 390 × 844. |
| `designs/t2-ui-refinement/.gitignore` | Do trình canvas tạo; bỏ qua tiến trình, log và history cục bộ của editor. |
| `docs/T2-UI-REFINEMENT.md` | Báo cáo bàn giao A–K này. |

Không sửa nội dung skill, Backend, SQL hoặc cấu hình database.

## D. Luồng truy cập

1. Người bệnh truy cập `/`, xem Giới thiệu, Dịch vụ, Quy trình, Liên hệ và chọn Đặt lịch khám. `/booking-notice` báo tính năng đang phát triển; không có biểu mẫu thu thông tin sức khỏe hoặc lịch hẹn giả.
2. Nhân viên truy cập trực tiếp `/login`; `/staff/login` chỉ redirect replace sang `/login`, bỏ query/hash và không có trang đăng nhập riêng. Website công khai không có link dẫn đến cổng này hoặc dashboard.
3. Trong T2, gửi form chỉ kiểm tra client và báo chưa kết nối Backend. Không có điều hướng vào dashboard.
4. Khi phát triển, người đánh giá có thể nhập trực tiếp `/receptionist` hoặc `/doctor` để xem mẫu. Đây không phải hai lựa chọn cấp quyền hoặc hai tài khoản đang đăng nhập.
5. Trong production, cả hai đường dẫn dashboard chuyển về staff login. Người dùng không thể dùng query role để thay đổi hành vi này.
6. Đường dẫn không tồn tại hiển thị NotFoundPage, có link trở về trang chủ.

## E. Form đăng nhập

| Thành phần | Hành vi |
| --- | --- |
| Tài khoản | Input text, label, required, autocomplete username; chấp nhận username hoặc email; không áp dụng regex chỉ chấp nhận email. |
| Mật khẩu | Input password, label, required, autocomplete current-password; giá trị chỉ ở bộ nhớ giao diện trong lúc nhập. |
| Validation | Từ chối rỗng và toàn khoảng trắng; hiển thị lỗi riêng, aria-invalid và aria-describedby; focus vào trường lỗi đầu tiên. |
| Hiện/ẩn | Nút type button, tên truy cập và aria-pressed cập nhật; disabled khi chưa có mật khẩu; không submit form. |
| Submit không hợp lệ | Giữ trên trang, hiện hướng dẫn sửa trường bắt buộc. |
| Submit hợp lệ | Báo Backend chưa kết nối; xóa và ẩn lại mật khẩu; không gọi API, lưu storage/cookie hay tạo phiên. |
| Trạng thái | idle, invalid, unavailable; vùng role=status/aria-live thông báo kết quả. |

Validation T2 chạy đồng bộ, nên không mô phỏng spinner hoặc trạng thái chờ server. Vùng trạng thái có thể được mở rộng cho xử lý bất đồng bộ khi Backend thực sự tồn tại.

Không có đăng ký nhân viên tự do, bộ chọn role, tài khoản demo, JWT giả hoặc cơ chế đăng nhập bằng localStorage. Query `role=doctor&redirect=/doctor` được kiểm tra và không cấp quyền hay điều hướng sau submit.

## F. API dự kiến và phần chưa triển khai

| API dự kiến | Mục đích ở Task Backend sau |
| --- | --- |
| `POST /api/v1/auth/staff/login` | Kiểm tra tài khoản và mật khẩu; thiết lập phiên xác thực. |
| `GET /api/v1/auth/me` | Trả về danh tính và vai trò đã xác thực từ server. |
| `POST /api/v1/auth/logout` | Hủy phiên đăng nhập. |

Frontend T2 không gọi các endpoint này. Chưa triển khai Backend Auth, RBAC, session, API nghiệp vụ, database, tạo tài khoản hoặc đặt lịch thật. Mã frontend runtime không có fetch, axios, thao tác localStorage/sessionStorage hoặc JWT để mô phỏng các chức năng đó.

## G. Kiến trúc phân quyền Backend dự kiến

Backend kiểm tra thông tin đăng nhập và lấy role từ dữ liệu server. Frontend đọc danh tính đã xác thực rồi điều hướng receptionist đến `/receptionist`, doctor đến `/doctor`; người dùng không tự chọn role để được cấp quyền.

Backend quản lý session an toàn, kiểm tra phiên và quyền trên từng API nghiệp vụ; từ chối truy cập không có phiên hoặc sai quyền. Đăng xuất phải hủy phiên phía server. Ẩn menu, lazy import và Navigate trong React chỉ điều khiển giao diện, không bảo vệ dữ liệu y tế hoặc thay thế RBAC. Không đưa dữ liệu thật vào preview.

## H. Ứng dụng Claude Design Skill

Đã đọc `.agents/skills/claude-design/SKILL.md` cùng `format.md`, `craft.md` và hướng dẫn chuyển tiếp từ canvas. Không thay đổi nội dung skill. Lệnh tìm design system không tìm thấy bộ nào, nên giữ bảng màu và SVG của ứng dụng hiện có.

Thiết kế dùng xanh dương, trắng và xanh ngọc nhạt, font hệ thống hỗ trợ tiếng Việt, bố cục thoáng và không dùng gradient. Trang đăng nhập có hai cột trên desktop, một cột trên mobile; các thao tác chính có vùng chạm từ 44px, trạng thái focus/hover/disabled/error và nhãn truy cập rõ ràng. Bảng nội bộ giữ chiều rộng tối thiểu rồi cuộn trong container trên màn hình nhỏ.

Canvas có hai artboard chỉnh sửa được; `artifact.mjs check` trả về `problems: 0`. Đây là kiểm tra cấu trúc canvas. Kiểm thử render, tương tác và ảnh bố cục được thực hiện riêng trên ứng dụng React bằng Chrome.

Canvas local: http://127.0.0.1:4720/design/IPSlhVCDpn5h3PqndcqIZ2pSHKim-926/

## I. Test case và kết quả thực tế

Lượt nghiệm thu UI ban đầu: **36 PASS, 0 FAIL, 0 SKIP**, chạy bằng Chrome thật qua Playwright, trên bốn project: development-desktop, development-mobile, production-desktop, production-mobile. Mỗi project có 9 kịch bản; nhiều TC được kiểm tra trong cùng một kịch bản. Lượt này hoàn tất trong khoảng 50,8 giây. Kết quả sau khi chuẩn hóa route cho Issue #3 được ghi riêng tại mục L.

| TC | Nội dung đã kiểm tra | Kết quả |
| --- | --- | --- |
| TC01 | Landing Page, Navbar và Footer không có liên kết /login, /staff/login, receptionist hoặc doctor; giữ các mục bệnh nhân. | PASS |
| TC02 | Mở menu mobile và kiểm tra nội dung cùng toàn bộ link nội bộ. | PASS |
| TC03 | Truy cập trực tiếp staff login; kiểm tra tiêu đề, mô tả, form, autocomplete và layout riêng. | PASS |
| TC04 | Rỗng, toàn khoảng trắng, lỗi mỗi trường, xóa lỗi khi sửa và focus trường lỗi đầu tiên. | PASS |
| TC05 | Hiện/ẩn mật khẩu, aria-pressed, disabled lúc rỗng, không submit ngoài ý muốn. | PASS |
| TC06 | Submit giá trị sinh ngẫu nhiên; không có fetch/XHR/request ghi; cookie, localStorage, sessionStorage không thay đổi; mật khẩu bị xóa; vẫn ở login. | PASS |
| TC07 | Không có bộ chọn role hoặc đăng ký; query role và redirect không cho vào dashboard sau submit. | PASS |
| TC08 | Menu hai vai trò khác nhau, không có link đổi dashboard; chưa đăng nhập; logout disabled; mở/đóng, Tab/Shift+Tab/Escape và trả focus ở mobile. | PASS |
| TC09 | Vite production preview: nhập trực tiếp cả hai route staff đều về login, không render Sidebar/dashboard. Kiểm tra thêm nội dung bundle không có dashboard mẫu. | PASS |
| TC10 | Sáu route tại 320, 390, 768, 1440px không tràn ngang toàn trang; bảng cuộn bên trong ở mobile. Đã xem ảnh landing, login và dashboard ở desktop/mobile. | PASS |
| TC11 | `npm.cmd run lint`, exit code 0. | PASS |
| TC12 | `npm.cmd run build`, exit code 0; lifecycle trước E2E build lại bản production mới nhất. | PASS |
| TC13 | Chrome: chuyển trang đặt lịch bằng React Router, link section từ trang khác, history back, route 404; theo dõi console và lỗi runtime trong mọi kịch bản. | PASS |
| TC14 | `git diff --check` không có lỗi; kiểm tra bổ sung no-index đối với các thay đổi frontend vì chúng chưa được Git theo dõi. | PASS |

Browser Console không có warning/error hoặc lỗi JavaScript trong các kịch bản. Terminal có cảnh báo cấu hình màu NO_COLOR/FORCE_COLOR của môi trường chạy; không phải lỗi console ứng dụng.

Mobile là mô phỏng viewport/touch/user agent trên Chrome; chưa thử trên điện thoại vật lý hoặc các engine Firefox/WebKit. Không đánh dấu đã kiểm tra Backend Auth hoặc RBAC vì hai phần này chưa tồn tại.

Bằng chứng phát sinh, đã bỏ qua trong Git:

- `test-results/results.json`: thống kê và kết quả từng kịch bản.
- `playwright-report/index.html`: báo cáo HTML.
- `test-results/artifacts/`: ảnh landing/login/dashboard của các project.

Chạy lại từ frontend: `npm.cmd run lint`, `npm.cmd run test:e2e`. Lệnh E2E tự build trước khi chạy và cần cổng 5173/4173 trống.

## J. Git status, git diff và phạm vi thay đổi

Trước khi thực hiện, repository đã có các mục chưa được Git theo dõi:

```text
?? .agents/
?? .gitignore
?? frontend/
?? skills-lock.json
```

Sau khi thực hiện, `git status --short` vẫn có bốn mục trên. Mọi thay đổi bàn giao nằm trong frontend; các mục ngoài frontend đã tồn tại từ đầu phiên.

`git diff` và `git diff --stat` không có nội dung vì frontend còn untracked. Vì vậy không dùng diff rỗng làm bằng chứng duy nhất: đã so sánh no-index với bản sao đầu phiên đối với mã nguồn, README, package.json và lockfile; kiểm tra các tệp mới tương ứng với tệp rỗng. Lệnh kiểm tra dùng `git -c core.autocrlf=false diff --no-index --check` để tránh cảnh báo chuyển LF/CRLF của máy Windows, không thay đổi cấu hình Git.

So sánh trước khi thêm báo cáo này: 27 tệp được sửa/tạo, 1.201 dòng thêm và 1.005 dòng xóa; không có lỗi whitespace ở phần thay đổi. Báo cáo này là tệp bàn giao thứ 28, được kiểm tra whitespace riêng sau khi tạo. Danh sách cụ thể nằm tại mục C.

Không stage, commit, push, tạo Pull Request, đánh dấu checkbox hoặc đóng Issue. Trình canvas chỉ giữ dữ liệu phiên cục bộ trong các mục được .gitignore của canvas bỏ qua; build và kết quả E2E cũng được bỏ qua.

## K. Kết luận nghiệm thu

Task T2 đáp ứng yêu cầu tách Public Website/Staff Application, form đăng nhập UI trung thực, layout nhân viên dùng chung, không đổi quyền bằng giao diện và không cung cấp dashboard hoạt động trong production khi chưa xác thực. TC01–TC14 đã được kiểm tra thực tế theo phạm vi mô tả trên.

Backend Auth, session, RBAC và dữ liệu nghiệp vụ thật thuộc các Task sau. Phần frontend đã sẵn sàng bàn giao để người dùng xem xét và nghiệm thu.

## L. Issue #3 – M1.2 / T2: Chuẩn hóa route đăng nhập

Ngày kiểm tra: 03/11/2026, múi giờ Asia/Saigon. Route chính `/login` render duy nhất component `StaffLoginPage` hiện có. Route cũ `/staff/login` chỉ dùng `<Navigate to="/login" replace />`, bỏ query/hash; nút Back quay lại trang trước khi mở đường dẫn cũ.

Giữ nguyên đường dẫn `/receptionist`, `/doctor` và các dashboard: development vẫn xem preview, production vẫn chuyển hướng bằng `replace`, với đích mới `/login`. Không sửa `StaffLoginPage`, CSS hoặc canvas Claude Design; không triển khai Backend Auth hay phiên đăng nhập giả. Hợp đồng Backend dự kiến `/api/v1/auth/staff/login` không thuộc thay đổi URL giao diện này.

Sáu tệp được sửa trong lần chuẩn hóa route (đường dẫn tương đối với `frontend/`):

| Tệp | Nguyên nhân và thay đổi |
| --- | --- |
| `src/routes/AppRoutes.jsx` | Đăng ký `/login`, giữ URL cũ làm redirect, đổi đích chuyển hướng production của StaffPreview. |
| `src/components/Sidebar.jsx` | Liên kết về trang đăng nhập dẫn thẳng đến `/login`. |
| `src/components/RouteEffects.jsx` | Ánh xạ tiêu đề đăng nhập cho URL mới. |
| `tests/e2e/t2.spec.js` | Đổi URL và kỳ vọng của test hiện có; bổ sung kiểm tra tải lại, tiêu đề, một form duy nhất, href Sidebar và redirect replace của URL cũ. Bộ lọc liên kết nội bộ bao gồm `/login`. |
| `README.md` | Cập nhật bảng route, hướng dẫn truy cập và hành vi tương thích URL cũ. |
| `docs/T2-UI-REFINEMENT.md` | Đồng bộ mô tả route và ghi kết quả kiểm tra lần này. |

| Lệnh | Kết quả |
| --- | --- |
| `npm.cmd run lint` | PASS, exit code 0. |
| `npm.cmd run build` qua lifecycle `pretest:e2e` | PASS, exit code 0; 35 modules, tạo bản production mới trước test. |
| `npm.cmd run test:e2e` | PASS, exit code 0; 40 PASS, 0 FAIL, 0 SKIP, 0 FLAKY; không có lỗi tổng thể. |
| `git diff --check` | PASS, exit code 0; không có lỗi whitespace. |

Mỗi kịch bản dưới đây chạy trên cả bốn project development/production × desktop/mobile, dùng Chrome thực; mỗi project đạt 10/10:

| Kịch bản | Nội dung xác nhận | Kết quả |
| --- | --- | --- |
| TC01/TC02 | Website bệnh nhân không có link đăng nhập hoặc dashboard nhân viên, kể cả menu mobile. | 4/4 PASS |
| TC03 | Mở trực tiếp và tải lại `/login`; đúng tiêu đề, layout độc lập, một form và autocomplete. | 4/4 PASS |
| TC15 | `/staff/login`, kể cả query role/redirect và hash, đều về đúng `/login`; một form; Back bỏ qua URL cũ. | 4/4 PASS |
| TC04 | Validation rỗng/khoảng trắng, lỗi từng trường và focus vẫn hoạt động trên `/login`. | 4/4 PASS |
| TC05 | Hiện/ẩn mật khẩu không submit form. | 4/4 PASS |
| TC06/TC07 | Submit tại `/login?role=doctor&redirect=/doctor` không gửi request, lưu cookie/storage, tạo phiên hoặc điều hướng theo role. | 4/4 PASS |
| TC08/TC09 – receptionist | Development giữ preview và Sidebar dẫn thẳng `/login`; production chuyển `/receptionist` về `/login`, không render dashboard. | 4/4 PASS |
| TC08/TC09 – doctor | Development giữ preview và Sidebar dẫn thẳng `/login`; production chuyển `/doctor` về `/login`, không render dashboard. | 4/4 PASS |
| TC10 | Sáu route `/`, `/booking-notice`, `/login`, `/receptionist`, `/doctor`, 404 tại 320/390/768/1440px không tràn ngang toàn trang. | 4/4 PASS |
| TC13 | React Router, trang đặt lịch, anchor khác trang, history và 404 vẫn hoạt động. | 4/4 PASS |

Mọi kịch bản đều theo dõi console warning/error và lỗi JavaScript: không có lỗi. Kiểm tra riêng bundle production không chứa nội dung dashboard preview; Git xác nhận component login, hai dashboard, CSS và canvas không thay đổi. Các tham chiếu URL giao diện cũ chỉ còn ở redirect, test tương thích và tài liệu mô tả URL cũ.

Playwright hoàn tất trong khoảng 185,7 giây, gồm bước dọn server. Sau khi 40 test đã PASS, bước tự dừng Vite trên Windows bị kẹt; đã dừng đúng hai tiến trình Vite do lượt test tạo, sau đó Playwright xuất báo cáo và thoát với code 0. Không sửa cấu hình test để xử lý vấn đề môi trường này. Bằng chứng: `test-results/results.json` và `playwright-report/index.html` (được Git bỏ qua).

Không stage, commit, push hoặc đóng Issue. Các mục untracked `.agents/` và `skills-lock.json` đã tồn tại trước thay đổi và được giữ nguyên.
