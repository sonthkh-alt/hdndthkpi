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
- **`src/lib/exporters.js`** — Lazy-load các thư viện nặng. Gồm: `exportExcel1A` (Mẫu 1A); `exportWordPhieu(ev)` — **phiếu Word đầy đủ** (bảng Nhóm I từng tiêu chí Tự ĐG/Cấp duyệt, bảng Nhóm II từng nhiệm vụ, d/đ/e lãnh đạo, tổng hợp + xếp loại + Điều 8, nhận xét, trạng thái phê duyệt + 2 khối chữ ký); `exportTrackingPDF` (bảng theo dõi, cửa sổ in); `exportGuidePDF(unit, catalogGroups)` — **sổ tay hướng dẫn PDF** (cửa sổ in, A4 dọc: bìa + mục lục + 14 mục + Phụ lục A bảng 52 danh mục + Phụ lục B ví dụ xuyên suốt). `App.jsx` truyền `catalogForGuide()` (gộp 52 mục theo nhóm + nhãn Mẫu).
- **`src/lib/nd335.js`** — `ND335_CATALOG` (danh mục công việc, có hệ số) + `CRITERIA_335`. ⚠️ Phần catalog cũ từng bị **lỗi mã hóa**; danh mục MỚI nên định nghĩa trong `App.jsx` (UTF-8 chuẩn) rồi gộp.
- **`api/kiemdem.js`** — Vercel Serverless Function: proxy đọc Google Sheet công khai (CSV) → JSON (tránh CORS). Chỉ chạy trên Vercel.
- **`supabase/schema.sql`** — bảng `app_state` (lưu theo kỳ) + ghi chú RLS.

> ⚠️ Tài liệu nguồn trong repo `335-cp.signed.pdf`, `So-tay-danh-gia-cong-chuc.pdf` là **PDF scan, không trích được text**. NĐ335 + Sổ tay đầy đủ đã được người dùng cung cấp dạng văn bản trong phiên làm việc (đối chiếu để dựng bản PRO).
