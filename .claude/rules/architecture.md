---
paths:
  - "src/**"
  - "api/**"
  - "supabase/**"
---

# Kiến trúc & nơi sửa

## Điều hướng: TRANG CHỦ (Portal) → các PHÂN HỆ
> `src/main.jsx` → `<ErrorBoundary><Root/></ErrorBoundary>`. **`src/Root.jsx`** là bộ định tuyến theo **hash**:
> `#/` (Trang chủ) · `#/okr` (App, bộ tiêu chí `sonha`) · `#/kiemdiem` (App, `kiemdiem`) · **`#/tieuchi`** (module `TieuChiHDND`) ·
> `#/canbo` (App, tab `hr`) · **`#/hotro`** (module `HuongDan`) · `#/thunghiem?v=classic|improved|sg` (App, các bản thử nghiệm).
> Thêm `?login=1` vào route của App để mở thẳng màn Đăng nhập (prop `initialLogin`).
> - **`src/Portal.jsx`** — trang chủ dạng cổng: thẻ phân hệ có biểu tượng, liên hệ, bộ đếm truy cập. Ẩn thẻ theo `versionCfg`. (Khối "Cơ sở pháp lý" đã chuyển sang module Hướng dẫn.)
> - **`src/HuongDan.jsx`** — Hướng dẫn & hỗ trợ cấp HỆ THỐNG (8 mục: phân hệ · bắt đầu nhanh theo vai trò · tài khoản & phân quyền · cách tính điểm · quy trình, mốc thời gian · **cơ sở pháp lý** (`LEGAL_BASIS`) · hỏi đáp · liên hệ + góp ý), có nút In/lưu PDF. Tab "Hỗ trợ" trong App vẫn giữ hướng dẫn CHI TIẾT công thức của từng phân hệ và có liên kết sang đây.
> - **`src/lib/modules.js`** — danh mục phân hệ dùng chung (`MODULES`: route/icon/tone/target/tags) + `LEGAL_BASIS`. Thêm phân hệ mới thì khai ở đây.
> - **`src/App.jsx`** nhận thêm `onHome` (nút 🏠 về Trang chủ ở header) và `initialTab` (tab mở sẵn khi vào từ Trang chủ).
> - App và module Tiêu chí đều **lazy-load** → trang đầu chỉ tải Portal (~33 kB).

## Module ĐÁNH GIÁ TIÊU CHÍ HĐND (tỉnh · xã, phường) — `#/tieuchi`
- **`src/lib/khungTieuChi.js`** — LOGIC THUẦN (Node chạy được): `KHUNG.tinh` (Phụ lục I) & `KHUNG.xa` (Phụ lục II) số hóa tới từng **điểm thành phần**; kiểu chấm `choice` (bấm chọn mức, `zeroItem` = mất điểm toàn tiêu chí) · `minus` (trừ theo số lần) · `minusPlus` (trừ + cộng điểm chất lượng) · `ratio` (tỷ lệ % × điểm) · `count` (mỗi đơn vị đạt được N điểm). `computeTC(kind, ans)` → điểm 7 nhóm + thưởng VIII + trừ IX → tổng (0–110) + **xếp loại 5 mức (Điều 6)** + lý do/chế tài; `applyQuotaXuatSac` (**trần 25%** Xuất sắc cấp xã); `DK_DMST`/`dkDmstOf` (điều kiện đổi mới sáng tạo đã lượng hóa: nhóm V ≥ 60% + ≥ 02 mô hình với cấp tỉnh / ≥ 01 mô hình với cấp xã cho mức Xuất sắc; ≥ 40% + ≥ 01 mô hình cho mức Tốt); `DIEU6` (Điều 6 đánh số lại liền mạch); **`FIX_NOTES`** + `fixNote` trên từng điểm thành phần = 6 chỗ chưa nhất quán của dự thảo đã được CHUẨN HÓA (III.3 tách 1,5+1,5+3; nhóm VIII cấp xã phân bổ lại 4+2+2+2 = 10; trần điểm trừ IX.7 = 10 và IX.6 = 6 theo cách chấm điểm), hiển thị công khai trong app để đưa vào bản trình ký.
- **`src/lib/tieuChiStore.js`** — `app_state` id=**`tc_data`** `{units[], evals{unitId::năm}, cfg}` + cache localStorage. Đơn vị đăng nhập bằng **mã đơn vị + mã truy cập**; mã truy cập chỉ lưu **băm SHA-256** (`hashPin`); `unitLogin`/`makeUnit`/`parseUnitLines`/`randomPin`; đơn vị ghi phiếu qua RPC **`tc_unit_save`** (⚠ **BƯỚC 5** trong `supabase/schema.sql`), chưa chạy SQL thì chỉ lưu cục bộ.
- **`src/TieuChiHDND.jsx`** — cổng vào 3 cửa (Đơn vị · Thường trực/Tổ công tác · **Khách xem demo**) · phiếu tự đánh giá (`Phieu`) · bảng kết quả & điều khiển (`AdminBoard`: thống kê, bình xét trần 25%, **phê duyệt từng đơn vị/hàng loạt**, quản lý đơn vị & tài khoản, cấu hình) · xem khung tiêu chí (`KhungView`). Xuất `exportTieuChiPhieu` (Word) / `exportTieuChiTongHop` (Excel) trong `exporters.js`.
- **Phê duyệt**: `rec.approved = {by, at, grade}` do Quản trị đóng dấu; **sửa điểm chấm tự động gỡ phê duyệt** (giống cơ chế `approved` của App.jsx). Khách (`guest`) chỉ XEM: `readOnly` bật, ẩn thẻ quản lý đơn vị/cấu hình và mọi nút phê duyệt.
- **`src/lib/tieuChiSeed.js`** — `seedTieuChi()` sinh dữ liệu MÔ PHỎNG (10 xã/phường + 4 đơn vị cấp tỉnh, 5 hồ sơ A–E, bộ sinh số có hạt giống nên ổn định); mọi đơn vị mẫu dùng mã truy cập `DEMO_PIN = 'DEMO2026'`, gắn cờ `demo` để hiện banner cảnh báo. Module tự nạp khi `tc_data` chưa có đơn vị nào (chỉ lưu trên trình duyệt tới khi Quản trị bấm lưu).
- Tài liệu nguồn: **`docs/Khung_tieu_chi.docx`**.

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

## Module QUẢN LÝ CÁN BỘ (tab `hr` — chỉ Quản trị, mọi phiên bản, lazy-load)
- **`src/lib/hr.js`** — MODEL + LOGIC THUẦN (không import React/Supabase → chạy/kiểm thử được bằng Node): hồ sơ **Mẫu 2C/TCTW-98** (`newStaff`, 37 mục + bảng `training`/`history`/`family`), `HR_CATEGORY` (dbqh · hdnd · cc · hd), `HR_NGACH` (+`hesoOf`), `nextRaise` (nâng bậc theo chu kỳ 36/24 tháng — TT 08/2013; bậc cuối → vượt khung 5% rồi +1%/năm), `retireAgeMonths`/`retireDate` (**NĐ 135/2020**, nghỉ cuối tháng đủ tuổi), `nextBirthday`, `dutyNextDue`, `headcount`, `buildAlerts` (7 loại: raise/retire/birthday/contract/appoint/duty/headcount; mức `overdue|urgent|soon`), `DEFAULT_LEAD` (ngưỡng báo trước).
- **`src/lib/hrStore.js`** — đọc/ghi `app_state` id=**`hr_data`** (TOÀN CỤC, không theo kỳ) + cache localStorage. `readHR`/`fetchHR`/`saveHR`/`EMPTY_HR`.
- **Đồng bộ dữ liệu (KHÔNG nạp mẫu)**: `syncStaffFromPeople(staff, people)` — danh sách người lấy từ `people` (tab Đánh giá); người mới → hồ sơ khung (`inferCategory`/`inferNgach`), người đã có → chỉ cập nhật chức vụ/đơn vị/email và giữ nguyên hồ sơ 2C đã khai, người rời danh sách → cờ `detached`. `profileCompleteness`/`CORE_FIELDS` → % hoàn thiện hồ sơ. *(`hrSeed.js` đã bị gỡ.)*
- **`src/CanBoManager.jsx`** — UI 4 khu vực: Nhắc việc · Danh sách cán bộ (mở hồ sơ 2C đầy đủ) · Nhiệm vụ có thời hạn · Biên chế. Props `defaultSub`/`defaultOpenId` để mở sẵn khu vực/hồ sơ.
- **`src/lib/export2C.js`** — `exportLyLich2C(staff, unit)` xuất Sơ yếu lý lịch 2C ra Word.
- ⚠️ **Bảo mật:** hồ sơ chứa dữ liệu cá nhân nhạy cảm. Policy `app_state_auth_all` cho MỌI tài khoản đăng nhập đọc mọi dòng → **cần chạy BƯỚC 4 trong `supabase/schema.sql`** để chỉ Quản trị đọc/ghi `hr_data`. Ẩn tab ở giao diện KHÔNG phải cơ chế bảo mật.

## TRỢ LÝ CHAT (Telegram / Zalo) — thư mục `api/`
> Hướng dẫn cài đặt cho người dùng: **`docs/BOT-CHAT.md`**. Chỉ chạy trên Vercel (hàm `api/` không chạy khi `npm run dev`).
- **`api/telegram.js`** — webhook Telegram. `GET` = xem tình trạng, `GET ?setup=<TELEGRAM_WEBHOOK_SECRET>` = tự đăng ký webhook. `POST` kiểm tra tiêu đề `x-telegram-bot-api-secret-token`, lọc **danh sách trắng** `TELEGRAM_ALLOWED_IDS`, cắt tin >4096 ký tự, LUÔN trả 200 (tránh Telegram gửi lại vòng lặp).
- **`api/_lib/brain.js`** — "bộ não" DÙNG CHUNG (Telegram hôm nay, Zalo OA sau này): lệnh nhanh `/help` `/solieu` `/quen` `/trangthai`, còn lại ghép `SYSTEM_PROMPT` + `KNOWLEDGE` + số liệu thật rồi gọi AI.
- **`api/_lib/facts.js`** — gom SỐ LIỆU THẬT. `fmtPeriod`/`fmtTieuChi`/`fmtNhanSu` là hàm THUẦN (tách khỏi phần đọc mạng để kiểm thử bằng Node). Tiêu chí HĐND **tính lại tại chỗ bằng chính `src/lib/khungTieuChi.js`** nên không lệch giao diện; nhân sự dùng `buildAlerts` của `src/lib/hr.js` và CHỈ trả cho Quản trị. `gatherFacts` chọn nạp phần nào theo từ khóa trong câu hỏi.
- **`api/_lib/knowledge.js`** — hiểu biết TĨNH về hệ thống (5 phân hệ, cách tính điểm từng phân hệ, phân quyền, mốc thời gian, cơ sở pháp lý) + `SYSTEM_PROMPT`. ⚠️ KHÔNG được ghi mật khẩu quản trị vào đây (có test chặn).
- **`api/_lib/ai.js`** — bộ nối đa nhà cung cấp: `ANTHROPIC_API_KEY` | `GEMINI_API_KEY` | `OPENAI_API_KEY` (tự nhận, ép bằng `AI_PROVIDER`/`AI_MODEL`).
- **`api/_lib/store.js`** — đọc/ghi `app_state` qua REST bằng `SUPABASE_SERVICE_ROLE_KEY` (bỏ qua RLS, KHÔNG có tiền tố `VITE_`); trí nhớ hội thoại ở dòng **`bot_memory`** (10 lượt, quên sau 2 ngày).
- **`App.jsx` ghi kèm `_summary`** vào mỗi lần lưu kỳ (`{ts, version, unit, people:[{name,position,department,type,self,mgr,grade,gradeLabel,approved}]}`, dựng từ `computed` qua `summaryRef`) — để máy chủ đọc được ĐIỂM ĐÃ TÍNH mà không phải dựng lại công thức của giao diện. Dữ liệu lưu trước thay đổi này chưa có khóa đó → bot nhắc mở app bấm "Lưu ngay".
- **`vercel.json`** — chỉ đặt `maxDuration: 60` cho `api/*.js` (một lượt hỏi AI có thể mất >10s).

## Danh sách file
- **`src/App.jsx`** — toàn bộ ứng dụng (model + UI). Tabs: Tổng quan · Đánh giá · Năng lực số · Theo dõi CV · Hướng dẫn · Liên hệ · Danh mục (chỉ Quản trị) · **Quản lý cán bộ (chỉ Quản trị)**.
- **`src/Login.jsx`** — đăng nhập (email+mật khẩu, liên kết, tài khoản khách). Tông cổ điển (đỏ/vàng), không còn bộ chọn phiên bản.
- **`src/SetPassword.jsx`** — tạo mật khẩu lần đầu (kèm Họ tên + Chức vụ) và đổi mật khẩu.
- **`src/lib/auth.js`** — Supabase Auth: `signInWithPassword`, `signInWithOtp`, `setPassword`, `getSession`, `onAuthChange`, `signOut`, hằng `GUEST`.
- **`src/lib/supabase.js`** — `loadState`/`saveState` lưu theo kỳ (tháng/năm) + khóa lạc quan; `listPeriods`, `loadAllPeriods`. ⚠️ **Cả 4 hàm nhận tham số `ns` (namespace) = KHO DỮ LIỆU RIÊNG CỦA TỪNG PHÂN HỆ**: id = `state_<ns>_<năm>_<tháng>`; `ns=''` giữ id cũ `state_<năm>_<tháng>` cho OKR/KPI (dữ liệu cũ + bot chat đọc). `App.jsx` truyền `dataNs = version === 'sonha' ? '' : version`. **Thêm phân hệ mới dùng `App.jsx` thì phải có `ns` riêng**, nếu không sẽ đè mất danh sách cán bộ của phân hệ khác.
- **`src/lib/exporters.js`** — Lazy-load các thư viện nặng. Gồm: `exportExcel1A` (Mẫu 1A); `exportWordPhieu(ev)` — **phiếu Word đầy đủ** (bảng Nhóm I từng tiêu chí Tự ĐG/Cấp duyệt, bảng Nhóm II từng nhiệm vụ, d/đ/e lãnh đạo, tổng hợp + xếp loại + Điều 8, nhận xét, trạng thái phê duyệt + 2 khối chữ ký); `exportTrackingPDF` (bảng theo dõi, cửa sổ in); `exportGuidePDF(unit, catalogGroups)` — **sổ tay hướng dẫn PDF** (cửa sổ in, A4 dọc: bìa + mục lục + 14 mục + Phụ lục A bảng 52 danh mục + Phụ lục B ví dụ xuyên suốt). `App.jsx` truyền `catalogForGuide()` (gộp 52 mục theo nhóm + nhãn Mẫu).
- **`src/lib/nd335.js`** — `ND335_CATALOG` (danh mục công việc, có hệ số) + `CRITERIA_335`. ⚠️ Phần catalog cũ từng bị **lỗi mã hóa**; danh mục MỚI nên định nghĩa trong `App.jsx` (UTF-8 chuẩn) rồi gộp.
- **`api/kiemdem.js`** — Vercel Serverless Function: proxy đọc Google Sheet công khai (CSV) → JSON (tránh CORS). Chỉ chạy trên Vercel.
- **`api/telegram.js` + `api/_lib/`** — **TRỢ LÝ CHAT** (xem mục dưới).
- **`supabase/schema.sql`** — bảng `app_state` (lưu theo kỳ) + ghi chú RLS.

> ⚠️ Tài liệu nguồn trong repo `335-cp.signed.pdf`, `So-tay-danh-gia-cong-chuc.pdf` là **PDF scan, không trích được text**. NĐ335 + Sổ tay đầy đủ đã được người dùng cung cấp dạng văn bản trong phiên làm việc (đối chiếu để dựng bản PRO).
