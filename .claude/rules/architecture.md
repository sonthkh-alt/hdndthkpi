---
paths:
  - "src/**"
  - "api/**"
  - "supabase/**"
---

# Kiến trúc & nơi sửa

> **BA PHIÊN BẢN giao diện**, chọn ngay ở Login (mặc định "Cổ điển"), dùng CHUNG model + dữ liệu Supabase:
> - **Cổ điển** (`src/App.jsx`) — tông đỏ, header + tabs. Cũng là file **EXPORT model dùng chung** cho 2 bản kia.
> - **Mới** (`src/AppModern.jsx`) — tông tối "nebula" (tím–chàm–xanh), sidebar SaaS.
> - **PRO** (`src/AppPro.jsx` + `src/lib/pro.js`) — tông TRẮNG ĐEN; Nhóm II tính **đúng NĐ335 + Sổ tay**.
>
> Điều phối: `src/Root.jsx` (`useState('classic')`, KHÔNG lưu localStorage → mỗi lần tải mặc định cổ điển). `src/main.jsx` render `<ErrorBoundary><Root/></ErrorBoundary>`. `AppModern.jsx`/`AppPro.jsx` có prop test `initialNav` để render-test từng mục.

## Danh sách file
- **`src/App.jsx`** — phiên bản CỔ ĐIỂN + nơi định nghĩa & EXPORT model dùng chung. Tabs: Tổng quan · Đánh giá · Năng lực số · Theo dõi CV · Hướng dẫn · Liên hệ.
- **`src/Login.jsx`** — đăng nhập (email+mật khẩu, liên kết, tài khoản khách) + **bộ chọn 3 phiên bản** (`version`/`onPickVersion`).
- **`src/SetPassword.jsx`** — tạo mật khẩu lần đầu (kèm Họ tên + Chức vụ) và đổi mật khẩu.
- **`src/lib/auth.js`** — Supabase Auth: `signInWithPassword`, `signInWithOtp`, `setPassword`, `getSession`, `onAuthChange`, `signOut`, hằng `GUEST`.
- **`src/lib/supabase.js`** — `loadState`/`saveState` lưu theo kỳ (tháng/năm) + khóa lạc quan; `listPeriods`, `loadAllPeriods`.
- **`src/lib/exporters.js`** — Excel Mẫu 1A, Word phiếu, PDF bảng theo dõi (mở cửa sổ in). Lazy-load các thư viện nặng.
- **`src/lib/pro.js`** — bộ tính điểm bản PRO theo **NĐ335 + Sổ tay**: `computePro`, `getProCatalog`, `WORK_CATALOG_PRO` (danh mục công việc THEO PHÒNG/VỊ TRÍ + nhóm N1–N5 + hệ số), `isLeaderPerson` (lãnh đạo theo CHỨC VỤ), `HD_CRITERIA` (3 tiêu chí hợp đồng), `newProTask`. Import `{CRITERIA, clamp}` từ App.jsx.
- **`src/lib/nd335.js`** — `ND335_CATALOG` (danh mục công việc, có hệ số) + `CRITERIA_335`. ⚠️ Phần catalog cũ từng bị **lỗi mã hóa**; danh mục MỚI nên định nghĩa trong `App.jsx` (UTF-8 chuẩn) rồi gộp.
- **`api/kiemdem.js`** — Vercel Serverless Function: proxy đọc Google Sheet công khai (CSV) → JSON (tránh CORS). Chỉ chạy trên Vercel.
- **`supabase/schema.sql`** — bảng `app_state` (lưu theo kỳ) + ghi chú RLS.

> ⚠️ Tài liệu nguồn trong repo `335-cp.signed.pdf`, `So-tay-danh-gia-cong-chuc.pdf` là **PDF scan, không trích được text**. NĐ335 + Sổ tay đầy đủ đã được người dùng cung cấp dạng văn bản trong phiên làm việc (đối chiếu để dựng bản PRO).
