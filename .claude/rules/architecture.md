---
paths:
  - "src/**"
  - "api/**"
  - "supabase/**"
---

# Kiến trúc & nơi sửa

> **NĂM phiên bản BỘ TIÊU CHÍ** chọn ở Đăng nhập / header (`VERSIONS`/`VERSION_THEME`): **Cổ điển** (đỏ, QĐ 1053, câu chữ pháp lý), **Cải tiến** (teal, câu hỏi AIM/ISE/WoG dễ hiểu), **Singapore (cơ quan dân cử)** (tím, thiết kế riêng cho HĐND/ĐBQH), **SonHa** (xanh lá, gọn 3 module + danh mục VP theo NĐ 335/2025), **Kiểm điểm** (đỏ đô, đánh giá hằng QUÝ cán bộ diện BTV Tỉnh ủy quản lý theo HD 03-HD/TU). *(Trước đây từng có 3 bản GIAO DIỆN Cổ điển/Mới/PRO — đã gỡ; nay là các bản TIÊU CHÍ dùng chung 1 giao diện. Mã bản cũ còn trong lịch sử git.)*
> - **Bản 'kiemdiem'** (`isKD`): module riêng **`src/KiemDiemAppraisal.jsx`** (như Singapore), KHÔNG dùng khung 30/70 cũ. Thang 100 = **Nhóm A (30đ, chấm nhị phân)** + **Nhóm B (70đ, 6 trục, Điểm = KPI%×tối đa, KPI=(A+B+C+D)/4)**. `computeKD`/`defaultKD`/`kdGradeInfo`/`KiemDiemAppraisal`/`KiemDiemDashboard`. Dữ liệu `person.kd`. Chu kỳ theo **QUÝ** (header dropdown Quý I–IV → month 3/6/9/12). Xuất Word: `exportKiemDiemCaNhan` (Phụ lục 3A) + `exportKiemDiemTongHop` (Phụ lục 4). Tài liệu nguồn: **`docs/DU/`**. Tab gọn 3 module như SonHa.
> - **Bản 'sonha'** (`isSonHa`): tabs chỉ **dash/eval/guide** (ẩn Năng lực số/Theo dõi CV/Danh mục/Quản trị + redirect); Nhóm I dùng `CRITERIA_CLASSIC`, Nhóm II dùng **`SONHA_CATALOG`** (48 mục QĐ Danh mục VP: 34 CMNV + 8 LĐQL + 6 HTPV, `types[]` + `maxScore`=điểm quy đổi) qua **`ACTIVE_BASE`/`setBaseCatalog(version)`** (findCatalogItem/getND335Groups/catalogForGuide đọc `ACTIVE_BASE`). Tab Đánh giá có `SonHaConnectors` — 2 mục CHỜ CẤU HÌNH: liên kết hệ thống "Quản lý văn bản" + Import file đánh giá. Tài liệu nguồn của người dùng: thư mục **`docs/`**.
> - **`src/main.jsx`** render `<ErrorBoundary><Root/></ErrorBoundary>`. **`src/Root.jsx`** giữ state `version` ('classic'|'improved'|'sg'|'sonha') trong `localStorage` (`hdndkpi_version`) và truyền `version`/`onPickVersion` xuống `App`.
> - **`src/App.jsx`** — toàn bộ ứng dụng: model + UI. Ba bộ tiêu chí `CRITERIA_CLASSIC` + `CRITERIA_IMPROVED` + `CRITERIA_SG` (CÙNG id/`max`/thang điểm, chỉ khác câu chữ; `CRITERIA_SG` dùng `dancuGroups` cho Mẫu 01/02); biến `CRITERIA` "active" đổi qua `setCriteriaVersion(version)` (gọi đầu render, giống `setCatalogRegistry`). `version` nằm trong deps `computed`.
> - **Nhóm II (bản Cải tiến)**: nhiệm vụ `tasks335[]` có thêm `kr` (Kết quả cần đạt); UI gom theo Mục tiêu (`renderGroupedTasks`/`renderTask335Row`). **OKR chỉ để định hướng — KHÔNG tính vào điểm** (xem changelog: nghiên cứu Google/Doerr/Goodhart).
> - **Bản Singapore ('sg') = mô hình Singapore THẬT, 2 TẦNG** — KHÔNG dùng 30/70 + Điều 8. Toàn bộ ở **`src/SingaporeAppraisal.jsx`**:
>   - *Tầng B — cá nhân*: `computeSG` (Work Review + AIM + ISE → Grade A–E), `defaultSG` (seed), `SingaporeAppraisal` (phiếu, tab Đánh giá), `SingaporeDashboard` (xếp hạng, tab Tổng quan). Dữ liệu `person.sg`. CEP tách riêng. Xuất Word `exportSGAppraisal`.
>   - *Tầng A — thiết chế* (mô phỏng Town Council Management Report SG): `SingaporeInstitution` + `SG_INST_KPI_DEFAULT`/`instBand`/`INST_BAND` — 5 KPI cơ quan, **dải màu Xanh/Vàng/Đỏ riêng**. State `instKpi` (App) lưu theo kỳ. **Đại biểu dân cử KHÔNG chấm điểm cá nhân.**
>   - App dùng `scoreOf = isSG?computeSG:computePerson`. `CRITERIA_SG` (Nhóm I dân cử) chỉ còn dùng nhãn Mẫu.
> - **Nhóm II khớp NĐ 335/2025/NĐ-CP** (01/01/2026): (a+b+c)/3, −25%/lần, 70đ. `renderTask335Row` có tooltip định nghĩa (MiniNum `hint`/`note`), `DEDUCT_LABEL` (nhãn mức 0→100%…), ô `exemptNote` (miễn trừ khách quan). GIỮ công thức, chỉ rõ câu chữ.
> - **OKR (mọi bản)**: `objectives[].krs[]` (Key Results) hiển thị ở tab Tổng quan; helper `krPct`/`objKrGrade`/`addKr`… KR chỉ theo dõi tiến độ cơ quan, không vào điểm cá nhân.

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
