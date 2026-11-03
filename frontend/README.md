# Clinic Management Frontend

Giao diện React, Vite, Tailwind CSS và React Router cho Task T2.

## Chạy local

Dùng Node.js đáp ứng yêu cầu của Vite trong package-lock.json.

```sh
cd frontend
npm ci
npm run dev
```

Trên PowerShell chặn npm.ps1, dùng `npm.cmd` thay cho `npm`.

## Hai khu vực truy cập

| Đường dẫn | Giao diện | Trạng thái T2 |
| --- | --- | --- |
| / | Website bệnh nhân, PublicLayout | Công khai; nội dung dịch vụ dự kiến |
| /booking-notice | Thông báo đặt lịch | Đang phát triển; không tiếp nhận dữ liệu |
| /staff/login | Đăng nhập nhân viên | UI và validation client; chưa có Backend Auth |
| /receptionist | StaffLayout và menu Lễ tân | PREVIEW ONLY trong development |
| /doctor | StaffLayout và menu Bác sĩ | PREVIEW ONLY trong development |
| * | Không tìm thấy trang | Trang 404 chung |

Website bệnh nhân không có liên kết đến khu vực nhân viên. Nhân viên truy cập trực tiếp /staff/login.

Dashboard chỉ được import trong `import.meta.env.DEV`. Trong production, truy cập /doctor hoặc /receptionist sẽ thay thế history entry bằng /staff/login. Không có cờ query hoặc localStorage để bật preview ở production.

Đây là quy tắc cung cấp giao diện, không phải cơ chế bảo vệ dữ liệu. Không đưa dữ liệu thật vào frontend; Backend sau này phải xác thực và kiểm tra quyền cho mọi API nghiệp vụ.

## Đăng nhập hiện tại

- Tài khoản chấp nhận username hoặc email; cả tài khoản và mật khẩu đều bắt buộc, không chấp nhận toàn khoảng trắng.
- Có nhãn input, autocomplete, nút hiện/ẩn mật khẩu, focus vào trường lỗi đầu tiên và vùng thông báo trạng thái.
- Submit hợp lệ chỉ báo Backend chưa khả dụng, xóa mật khẩu khỏi biểu mẫu và ẩn lại mật khẩu.
- Không gọi API, không lưu thông tin đăng nhập, không tạo session/JWT, không đăng ký tự do và không cho chọn vai trò.
- T2 xử lý đồng bộ phía client nên không mô phỏng tải hoặc chờ phản hồi từ server.

## Kiểm tra

```sh
npm run lint
npm run build
npm run test:e2e
```

`pretest:e2e` tự build production trước khi chạy Playwright. Bộ kiểm thử khởi động riêng Vite development ở 5173 và Vite preview ở 4173; hai cổng này cần trống. Bộ test luôn tự quản lý server của mình.

Bốn project chạy trên Chromium: development/production × desktop/mobile. Trên Windows, Playwright dùng Chrome đã cài. Trên nền tảng khác, chạy `npx playwright install chromium` nếu chưa có browser. Mobile là môi trường mô phỏng viewport, touch và user agent, chưa phải thiết bị vật lý.

Kết quả JSON: `test-results/results.json`; HTML: `playwright-report/index.html`; ảnh kiểm tra bố cục trong `test-results/artifacts/`. Các tệp phát sinh này không được theo dõi trong Git. Đọc báo cáo HTML bằng `npx playwright show-report`.

## Thiết kế và bàn giao

Canvas desktop/mobile: `designs/t2-ui-refinement/project/`.

Từ repository root:

```sh
node .agents/skills/claude-design/scripts/artifact.mjs open frontend/designs/t2-ui-refinement
node .agents/skills/claude-design/scripts/artifact.mjs check frontend/designs/t2-ui-refinement
```

Canvas dùng để chỉnh thiết kế; kiểm thử chức năng chạy trên ứng dụng React.

Báo cáo nghiệm thu: [Task T2 UI Refinement](docs/T2-UI-REFINEMENT.md).

## Hợp đồng Backend dự kiến, chưa triển khai

- POST /api/v1/auth/staff/login
- GET /api/v1/auth/me
- POST /api/v1/auth/logout

Backend sẽ kiểm tra thông tin đăng nhập, xác định role từ dữ liệu server và quản lý session. Frontend sẽ điều hướng receptionist đến /receptionist, doctor đến /doctor theo danh tính đã xác thực. Mọi API nghiệp vụ phải tự kiểm tra quyền; role do client gửi không phải căn cứ cấp quyền.

Khi triển khai SPA sau này, hosting cần trả index.html cho các đường dẫn React Router hợp lệ. T2 chưa triển khai hosting, Backend, database hay RBAC.
