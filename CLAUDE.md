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

> **BA PHIÊN BẢN giao diện**, chọn ngay ở Login (mặc định "Cổ điển"), dùng CHUNG model + dữ liệu Supabase:
> - **Cổ điển** (`src/App.jsx`) — tông đỏ, header + tabs. Đây cũng là file **EXPORT model dùng chung** cho 2 bản kia.
> - **Mới** (`src/AppModern.jsx`) — tông tối "nebula" (tím–chàm–xanh), sidebar SaaS.
> - **PRO** (`src/AppPro.jsx` + `src/lib/pro.js`) — tông TRẮNG ĐEN; Nhóm II tính **đúng NĐ335 + Sổ tay** (xem 4.x).
> Điều phối: `src/Root.jsx` (`useState('classic')`, KHÔNG lưu localStorage → mỗi lần tải mặc định cổ điển). `src/main.jsx` render `<ErrorBoundary><Root/></ErrorBoundary>`. Sửa CÔNG THỨC/tiêu chí dùng chung → chỉ sửa `App.jsx` (cả 3 bản theo). `AppModern.jsx`/`AppPro.jsx` có prop test `initialNav` để render-test từng mục.

- **`src/App.jsx`** — phiên bản CỔ ĐIỂN + nơi định nghĩa & EXPORT model dùng chung. Các tab: Tổng quan · Đánh giá · Năng lực số · Theo dõi CV · Hướng dẫn · Liên hệ.
- **`src/Login.jsx`** — trang đăng nhập (email+mật khẩu, liên kết, tài khoản khách) + **bộ chọn 3 phiên bản** (nhận `version`/`onPickVersion`).
- **`src/SetPassword.jsx`** — màn tạo mật khẩu lần đầu (kèm Họ tên + Chức vụ) và đổi mật khẩu.
- **`src/lib/auth.js`** — Supabase Auth: `signInWithPassword`, `signInWithOtp`, `setPassword`, `getSession`, `onAuthChange`, `signOut`, hằng `GUEST`.
- **`src/lib/supabase.js`** — `loadState`/`saveState` lưu theo kỳ (tháng/năm) + khóa lạc quan; `listPeriods`, `loadAllPeriods`.
- **`src/lib/exporters.js`** — Excel Mẫu 1A, Word phiếu, PDF bảng theo dõi (mở cửa sổ in).
- **`src/lib/pro.js`** — bộ tính điểm bản PRO theo **NĐ335 + Sổ tay**: `computePro`, `getProCatalog`, `WORK_CATALOG_PRO` (danh mục công việc THEO PHÒNG/VỊ TRÍ + nhóm N1–N5 + hệ số), `isLeaderPerson` (lãnh đạo theo CHỨC VỤ), `HD_CRITERIA` (3 tiêu chí hợp đồng), `newProTask`. Import `{CRITERIA, clamp}` từ App.jsx.
- **`src/lib/nd335.js`** — `ND335_CATALOG` (danh mục công việc, có hệ số) + `CRITERIA_335`. ⚠️ Phần catalog cũ trong file này từng bị **lỗi mã hóa**; danh mục MỚI nên định nghĩa trong `App.jsx` (UTF-8 chuẩn) rồi gộp.
- **`api/kiemdem.js`** — Vercel Serverless Function: proxy đọc Google Sheet công khai (CSV) → JSON (tránh CORS). Chỉ chạy trên Vercel.
- **`supabase/schema.sql`** — bảng `app_state` (lưu theo kỳ) + ghi chú RLS.

### Mô hình dữ liệu (trong `App.jsx`)
- `CRITERIA` = **5 nhóm đối tượng**; thứ tự hiển thị + số Mẫu theo `CRITERIA_ORDER = ['hdnd','dbqh','leader','staff','contract']`:
  - **Mẫu 01** `hdnd` — Đại biểu HĐND tỉnh chuyên trách
  - **Mẫu 02** `dbqh` — Đại biểu Quốc hội chuyên trách
  - **Mẫu 03** `leader` — Cán bộ lãnh đạo, quản lý
  - **Mẫu 04** `staff` — Công chức không giữ chức vụ lãnh đạo
  - **Mẫu 05** `contract` — Lao động hợp đồng hỗ trợ, phục vụ
  - Mỗi nhóm có `groups` (Tiêu chí chung Nhóm I, ≤30). `hdnd`/`dbqh` dùng chung tiêu chí của `leader`. ⚠️ Số Mẫu 01–05 là cách đánh số của quy định Tỉnh ủy/HĐND (NĐ335 gốc chỉ có Mẫu 01 = phiếu theo dõi, Mẫu 02 = phiếu xếp loại).
- `ORG_UNITS` (App.jsx) = danh mục **Phòng/Bộ phận → Chức vụ** (HĐND tỉnh, Đoàn ĐBQH, 4 Ban, Văn phòng, 4 phòng). Ô Phòng + Chức vụ ở màn Đánh giá là **dropdown** (`posOptions(dept)`).
- Danh mục Nhóm II (Cổ điển/Mới): `ND335_CATALOG` + `HDND_CATALOG` → gộp `CATALOG`; `getND335Groups(type)`; `agg335()` tra hệ số.
- `person`: `{ id, name, position, department, email, role, type, selfScores, mgrScores, deduction, tasks335[], proTasks[], leadScores{d,dd,e}, hdScores{cl,tt,hq}, digital, selfNote, mgrNote, trackings[] }`. Mỗi bản đọc field riêng → KHÔNG đụng nhau: Cổ điển/Mới dùng `tasks335[]`; **PRO dùng `proTasks[]`** (`{catalogId,objId,assigned,completed,qualityIssues,delays}`), `leadScores` (lãnh đạo 100/50), `hdScores` (hợp đồng).
- **Công thức điểm (chung):** Tổng = Nhóm I (≤30) + Nhóm II (≤70) − Điểm trừ; xếp loại A≥90/B≥70/C≥50/D<50, trần HTXS ≤20% (đặc biệt 25%) số HTT. **Cán bộ mới mặc định 100/100** (Nhóm I tối đa; Nhóm II mặc định 100 khi chưa nhập).
  - **Cổ điển/Mới** (`agg335`): (a+b+c)/3 × 70%, trọng số = hệ số danh mục; b,c chia cho SỐ HOÀN THÀNH. KHÔNG có 6 thành phần lãnh đạo.
  - **PRO** (`computePro`, đúng NĐ335 Điều 14/16): đếm khách quan, hệ số quy đổi N1–N5 (đơn vị chuẩn 5đ); a/b/c đều chia cho **SỐ GIAO**, b −25%/lần lỗi, c −25%/lần chậm. Cán bộ (a+b+c)/3; **lãnh đạo (a+b+c+d+đ+e)/6** (d/đ/e mỗi mục 100%/50%, theo CHỨC VỤ qua `isLeaderPerson`). **Hợp đồng** (`contract`) theo **Sổ tay Chương III**: 3 tiêu chí Chất lượng/Tuân thủ/Hiệu quả → (cl+tt+hq)/3. **Hệ số/trọng số ẩn khi chấm** (cả 3 bản) — chỉ giải thích ở tab Hướng dẫn.
- **Phân quyền** (theo email khớp `person.email`): `canbo` / `truongphong` / `quantri` (+ bootstrap admin `sonthkh@gmail.com`); `khach` (`user@thanhhoa.gov.vn`) = dùng thử, KHÔNG lưu.

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
- **Thiết kế lại quốc huy + 3 phiên bản giao diện** chọn ở Login (mặc định Cổ điển): Cổ điển (đỏ), Mới (`AppModern.jsx`, tối nebula), PRO (`AppPro.jsx`+`lib/pro.js`, trắng-đen). `Root.jsx` điều phối, `main.jsx` render Root.
- **Danh mục Phòng/Chức vụ (`ORG_UNITS`)**: ô Phòng + Chức vụ ở màn Đánh giá chuyển thành **dropdown** (cả 3 bản). **Cán bộ mới mặc định 100/100** (đánh giá trừ dần).
- **Ẩn hệ số/trọng số khi chấm** (cả 3 bản) — chỉ giải thích ở tab Hướng dẫn.
- **Bản PRO tính ĐÚNG NĐ335 + Sổ tay** (bỏ "KPI gia quyền" của New1.pdf): đếm khách quan, hệ số quy đổi N1–N5, danh mục theo Phòng/Vị trí (`WORK_CATALOG_PRO`); lãnh đạo (a+b+c+d+đ+e)/6 theo chức vụ; hợp đồng theo Sổ tay Chương III (3 tiêu chí).
- **5 nhóm đối tượng, đánh số Mẫu 01–05**: 01 Đại biểu HĐND chuyên trách · 02 Đại biểu Quốc hội chuyên trách (mới) · 03 Lãnh đạo, quản lý · 04 Công chức · 05 Lao động hợp đồng (`CRITERIA_ORDER` quy định thứ tự). Bỏ "viên chức" khỏi Mẫu 04.
- ⚠️ Tài liệu nguồn (PDF) trong repo: `335-cp.signed.pdf`, `So-tay-danh-gia-cong-chuc.pdf` là **PDF scan, không trích được text**. NĐ335 + Sổ tay đầy đủ đã được người dùng cung cấp dạng văn bản trong phiên làm việc (đối chiếu để dựng bản PRO).
