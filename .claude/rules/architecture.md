---
paths:
  - "src/**"
  - "api/**"
  - "supabase/**"
---

# Kiến trúc & nơi sửa

> **MỘT phiên bản giao diện duy nhất** (tông đỏ "Cổ điển"). *(Trước đây từng có 3 bản: Mới + PRO đã được gỡ bỏ — xem changelog. Mã hai bản đó còn trong lịch sử git nếu cần khôi phục.)*
> - **`src/App.jsx`** — toàn bộ ứng dụng: model (CRITERIA, scoring, catalog…) + UI. `src/main.jsx` render `<ErrorBoundary><App/></ErrorBoundary>` trực tiếp (không còn `Root.jsx`).

## Danh sách file
- **`src/App.jsx`** — toàn bộ ứng dụng (model + UI). Tabs: Tổng quan · Đánh giá · Năng lực số · Theo dõi CV · Hướng dẫn · Liên hệ · Danh mục (chỉ Quản trị).
- **`src/Login.jsx`** — đăng nhập (email+mật khẩu, liên kết, tài khoản khách). Tông cổ điển (đỏ/vàng), không còn bộ chọn phiên bản.
- **`src/SetPassword.jsx`** — tạo mật khẩu lần đầu (kèm Họ tên + Chức vụ) và đổi mật khẩu.
- **`src/lib/auth.js`** — Supabase Auth: `signInWithPassword`, `signInWithOtp`, `setPassword`, `getSession`, `onAuthChange`, `signOut`, hằng `GUEST`.
- **`src/lib/supabase.js`** — `loadState`/`saveState` lưu theo kỳ (tháng/năm) + khóa lạc quan; `listPeriods`, `loadAllPeriods`.
- **`src/lib/exporters.js`** — Excel Mẫu 1A, Word phiếu, PDF bảng theo dõi (mở cửa sổ in). Lazy-load các thư viện nặng.
- **`src/lib/nd335.js`** — `ND335_CATALOG` (danh mục công việc, có hệ số) + `CRITERIA_335`. ⚠️ Phần catalog cũ từng bị **lỗi mã hóa**; danh mục MỚI nên định nghĩa trong `App.jsx` (UTF-8 chuẩn) rồi gộp.
- **`api/kiemdem.js`** — Vercel Serverless Function: proxy đọc Google Sheet công khai (CSV) → JSON (tránh CORS). Chỉ chạy trên Vercel.
- **`supabase/schema.sql`** — bảng `app_state` (lưu theo kỳ) + ghi chú RLS.

> ⚠️ Tài liệu nguồn trong repo `335-cp.signed.pdf`, `So-tay-danh-gia-cong-chuc.pdf` là **PDF scan, không trích được text**. NĐ335 + Sổ tay đầy đủ đã được người dùng cung cấp dạng văn bản trong phiên làm việc (đối chiếu để dựng bản PRO).
