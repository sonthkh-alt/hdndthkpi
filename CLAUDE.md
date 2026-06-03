# CLAUDE.md — Bộ nhớ dự án (đọc tự động mỗi phiên)

> File này được Claude Code **tự đọc** khi mở dự án. Nó nằm trong Git → đồng bộ qua GitHub →
> mở ở máy nào (cơ quan/ở nhà) cũng "hiểu ngay" bối cảnh và các bước đã làm.
> **Quy tắc vàng:** đầu phiên `git pull`, cuối phiên `git push`. GitHub là nguồn duy nhất.

## 1. Dự án là gì
Hệ thống **Đánh giá, xếp loại cán bộ, công chức hằng tháng theo OKR/KPI** — Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa.
- Repo: `https://github.com/sonthkh-alt/hdndthkpi` · Bản chạy: `https://hdndthkpi.vercel.app/`
- Stack: **React 18 + Vite + TailwindCSS**; **Supabase (Postgres + Auth)**; hosting **Vercel** (tự build khi push `main`).
- Xuất báo cáo client: `xlsx`, `docx`, `html2pdf.js`, `file-saver` (đều **lazy-load** trong `src/lib/exporters.js`).

## 2. Lệnh thường dùng
```bash
npm install        # cài phụ thuộc (lần đầu trên máy mới)
npm run dev        # chạy thử local (Vite). LƯU Ý: hàm api/ KHÔNG chạy ở local, chỉ chạy trên Vercel
npm run build      # build production — CHẠY TRƯỚC KHI COMMIT để chắc không lỗi
npm run lint       # ESLint (nếu đã cài)
```
Triển khai = **push lên `main`** → Vercel tự build & deploy (~1–2 phút).

## 3. Làm việc trên nhiều máy (cơ quan ↔ ở nhà) — DÙNG GITHUB LÀM CHUẨN
**Nguồn đồng bộ duy nhất là GitHub.** KHÔNG đặt thư mục dự án trong OneDrive/Dropbox (gây hỏng `.git`, kẹt `node_modules`, xung đột bản sao). Đặt repo ở ổ thường, ví dụ `C:\Projects\HDNDKPI`.

Máy mới (ở nhà) làm 1 lần:
1. Cài: **VS Code**, **Claude Code**, **Node.js 18+**, **Git**; đăng nhập GitHub.
2. `git clone https://github.com/sonthkh-alt/hdndthkpi` (vào thư mục NGOÀI OneDrive).
3. Tạo file `.env` ở thư mục gốc từ mẫu `.env.example`, điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` (lấy ở Supabase → Settings → API). **`.env` KHÔNG nằm trong Git** (bảo mật) nên phải tạo lại trên mỗi máy.
4. `npm install` → mở thư mục trong VS Code → Claude Code đọc `CLAUDE.md` này là hiểu ngay.

Mỗi phiên làm việc:
- **Bắt đầu:** `git pull` (lấy thay đổi từ máy kia).
- **Kết thúc:** commit + `git push`.
- Lịch sử commit (`git log --oneline`) = nhật ký "các bước đã làm" — luôn đồng bộ giữa các máy.

> Bộ nhớ hội thoại của Claude Code là **cục bộ từng máy**, KHÔNG tự đồng bộ. Vì vậy mọi bối cảnh
> quan trọng phải nằm ở: (a) mã nguồn, (b) commit, (c) chính `CLAUDE.md` này. Khi làm xong việc lớn,
> hãy nhờ Claude **cập nhật mục "Nhật ký" bên dưới** rồi push.

## 4. Kiến trúc & nơi sửa
- **`src/App.jsx`** — gần như TOÀN BỘ giao diện + logic (một file lớn). Các tab: Tổng quan · Đánh giá · Năng lực số · Theo dõi CV · Liên hệ & hướng dẫn.
- **`src/Login.jsx`** — trang đăng nhập (email+mật khẩu, chế độ liên kết, tài khoản khách).
- **`src/SetPassword.jsx`** — màn tạo mật khẩu lần đầu (kèm Họ tên + Chức vụ) và đổi mật khẩu.
- **`src/lib/auth.js`** — Supabase Auth: `signInWithPassword`, `signInWithOtp`, `setPassword`, `getSession`, `onAuthChange`, `signOut`, hằng `GUEST`.
- **`src/lib/supabase.js`** — `loadState`/`saveState` lưu theo kỳ (tháng/năm) + khóa lạc quan; `listPeriods`, `loadAllPeriods`.
- **`src/lib/exporters.js`** — Excel Mẫu 1A, Word phiếu, PDF bảng theo dõi (mở cửa sổ in).
- **`src/lib/nd335.js`** — `ND335_CATALOG` (danh mục công việc, có hệ số) + `CRITERIA_335`. ⚠️ Phần catalog cũ trong file này từng bị **lỗi mã hóa**; danh mục MỚI nên định nghĩa trong `App.jsx` (UTF-8 chuẩn) rồi gộp.
- **`api/kiemdem.js`** — Vercel Serverless Function: proxy đọc Google Sheet công khai (CSV) → JSON (tránh CORS). Chỉ chạy trên Vercel.
- **`supabase/schema.sql`** — bảng `app_state` (lưu theo kỳ) + ghi chú RLS.

### Mô hình dữ liệu (trong `App.jsx`)
- `CRITERIA` = 4 nhóm đối tượng (Mẫu 02 lãnh đạo, 03 công chức, 04 hợp đồng, **05 đại biểu HĐND chuyên trách**). Mỗi nhóm có `groups` (tiêu chí Nhóm I). Mẫu 05 dùng chung tiêu chí của nhóm lãnh đạo.
- Danh mục Nhóm II: `ND335_CATALOG` + `HDND_CATALOG` (định nghĩa trong App.jsx) → gộp `CATALOG`. `getND335Groups(type)` lọc theo nhóm; `agg335()` tra hệ số trên `CATALOG`.
- `person`: `{ id, name, position, department, email, role, type, selfScores, mgrScores, deduction, tasks335[], digital, selfNote, mgrNote, trackings[] }`.
  - `tasks335[]` (Nhóm II chấm điểm): `{ id, catalogId, objId, assigned, completed, qualityIssues, delays, note, srcTrkId? }`.
  - `trackings[]` (Theo dõi CV): các trường mô tả + trường KPI `{ catalogId, objId, completed, qualityIssues, delays }` + cờ `fromSheet?`.
- **Công thức điểm:** Tổng = Nhóm I (≤30) + Nhóm II (≤70) − Điểm trừ. Nhóm II = `agg335` → (a+b+c)/3 × 70%, trọng số = hệ số danh mục.
- **Phân quyền** (theo email khớp `person.email`): `canbo` / `truongphong` / `quantri` (+ bootstrap admin `sonthkh@gmail.com`); `khach` (tài khoản `user@thanhhoa.gov.vn`) = dùng thử, KHÔNG lưu.

## 5. Quy ước
- Toàn bộ chữ giao diện & commit: **tiếng Việt có dấu** (UTF-8). Cẩn thận lỗi mã hóa.
- Commit message kết thúc bằng dòng: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Trước khi commit: `npm run build` phải xanh.
- Không commit secret (`.env` đã bị ignore). Không commit `node_modules/`, `dist/`, `.claude/`, `scratch/` tạm.

## 6. Nhật ký các bước đã làm (cập nhật dần)
- Hợp nhất đánh giá NĐ335 vào tab Đánh giá (Nhóm II theo danh mục + hệ số).
- Đăng nhập **email + mật khẩu**: lần đầu nhận liên kết → nhập Họ tên/Chức vụ + tạo mật khẩu; có đổi mật khẩu.
- **Tài khoản khách** `user@thanhhoa.gov.vn` / `password`: hiện sẵn ở trang login; được thử chấm điểm Nhóm I/II nhưng **không lưu** (mất khi tải lại).
- Cán bộ tự chọn **Phòng/Bộ phận** và **Nhóm đối tượng** của chính mình.
- **Theo dõi CV**: nút **Thu thập vào đánh giá KPI** (tạo nhiệm vụ Nhóm II từ dòng theo dõi, idempotent qua `srcTrkId`); **Xuất bảng (PDF)** qua cửa sổ in; **Đồng bộ từ Google Sheet** (`/api/kiemdem`) nạp thành dòng theo dõi sửa được (idempotent qua `fromSheet`).
- Thêm **Mẫu 05** — Đại biểu HĐND tỉnh hoạt động chuyên trách (danh mục `HD.A/B/C.*`).
- Module **Liên hệ & hướng dẫn**: thông tin liên hệ (đ/c Hà Ngọc Sơn, 0904818886) + ô gửi ý kiến (mailto `sonthkh@gmail.com`); trang hướng dẫn cập nhật theo app.
