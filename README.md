# Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa — hệ thống phần mềm nghiệp vụ

Nền tảng dùng chung nhiều phân hệ, vào từ **Trang chủ** dạng cổng (`https://hdndthkpi.vercel.app`):

| # | Phân hệ | Đường dẫn |
|---|---------|-----------|
| 1 | **Biểu quyết Online** — 82 đại biểu HĐND tỉnh, 3 lựa chọn, bảng điện tử, điều kiện thông qua theo Luật 72/2025/QH15 | `#/bieuquyet` |
| 2 | Đánh giá OKR/KPI cán bộ, công chức (hằng tháng, NĐ 335/2025) | `#/okr` |
| 3 | Kiểm điểm, xếp loại đảng viên (hằng quý, HD 03-HD/TU) | `#/kiemdiem` |
| 4 | Đánh giá tiêu chí HĐND tỉnh, xã, phường (Khung 2026-2031) | `#/tieuchi` |
| 5 | Trợ lý AI nghiệp vụ dân cử (soạn thảo NĐ 30, thẩm tra, soát lỗi, kỳ họp, kiến nghị cử tri, hỏi đáp — hạn mức khách 1 lượt/ngày, đăng nhập 5 lượt/ngày) | `#/troly` |
| 6 | Giám sát số Thanh Hóa (hệ thống riêng, GitHub Pages) | `#/giamsat` |
| 7 | Một dữ liệu – Không báo cáo lại (hệ thống riêng, Render) | `#/onedata` |
| 8 | Quản lý lịch công tác tuần (hệ thống riêng, Vercel) | `#/lichcongtac` |
| 9 | Quản lý cán bộ — hồ sơ 2C, nhắc việc nhân sự (chỉ Quản trị) | `#/canbo` |
| 10 | Hướng dẫn & hỗ trợ sử dụng | `#/hotro` |

Kèm bot chat Telegram / Zalo OA (`api/telegram.js`, `api/zalo.js`) đọc số liệu thật và trả lời có dẫn nguồn.

> ⚠️ **Bản DEMO chạy trên cloud công cộng — dữ liệu hiển thị là dữ liệu mô phỏng, không nhập thông tin mật.**

## Công nghệ

React 18 + Vite + TailwindCSS · lucide-react · Recharts · Supabase (Postgres + Auth, RLS) · SheetJS · docx · html2pdf · pdf-parse · Vercel (hosting + serverless `api/`). Chi tiết kiến trúc: `.claude/rules/architecture.md`; biến môi trường: `.env.example`.

---

## 🚀 Triển khai online (không cần máy tính cá nhân)

### ✅ Bước 1 — Tạo cơ sở dữ liệu Supabase
- [ ] Vào https://supabase.com → đăng nhập GitHub → **New Project** (region: Singapore).
- [ ] Mở **SQL Editor → New query** → dán nội dung `supabase/schema.sql` → **Run**.
- [ ] Vào **Settings → API**, ghi lại `Project URL` và `anon public key`.

### ✅ Bước 2 — Đưa mã nguồn lên GitHub
- [ ] Mở repo `https://github.com/sonthkh-alt/hdndthkpi` (để **Private**).
- [ ] Dùng **Add file → Create new file**, tạo lần lượt các file (gõ `src/App.jsx` để tự tạo thư mục).
- [ ] **Commit** sau mỗi file.

### ✅ Bước 3 — Deploy Vercel
- [ ] Vào https://vercel.com → đăng nhập GitHub → **Add New → Project** → chọn `hdndthkpi`.
- [ ] Framework Preset: **Vite**.
- [ ] **Environment Variables** thêm:
  - `VITE_SUPABASE_URL` = Project URL
  - `VITE_SUPABASE_ANON_KEY` = anon public key
- [ ] Bấm **Deploy** → nhận URL `https://hdndthkpi.vercel.app`.

> Mỗi lần commit lên nhánh `main`, Vercel **tự build lại** bản demo. Khi nhãn góc trên hiện **"Đã kết nối cloud"** là dữ liệu đang lưu lên Supabase.

---

## 📁 Danh sách file cần tạo trên GitHub

```
hdndthkpi/
├── README.md              ← file này
├── package.json
├── vite.config.js
├── index.html
├── postcss.config.js
├── tailwind.config.js
├── .gitignore
├── .env.example
├── supabase/schema.sql
└── src/
    ├── main.jsx
    ├── index.css
    ├── lib/supabase.js
    ├── lib/exporters.js
    └── App.jsx
```

> Toàn bộ nội dung từng file nằm trong tài liệu **"Bộ mã nguồn dự án hdndthkpi"**.

---

## 🔒 Lưu ý bảo mật (đọc kỹ)

1. **Repo để Private**, chỉ commit mã nguồn — không commit dữ liệu thật.
2. **Chỉ nhập dữ liệu giả** trong môi trường demo trên internet.
3. `anon key` của Supabase là khóa phía client; khi vận hành thật cần bật **RLS (Row Level Security)** và đăng nhập người dùng.
4. Khi dùng thật với dữ liệu thật → chuyển sang **máy chủ nội bộ cơ quan** (xem tài liệu kiến trúc on-premise).

---

## 📊 Phương pháp tính điểm

| Thành phần | Tối đa | Cách tính |
|---|---|---|
| Nhóm I — Tiêu chí chung | 30 | Cộng điểm các tiêu chí (cột cấp duyệt) |
| Nhóm II — Kết quả nhiệm vụ | 70 | (KPI quy đổi / 100) × 70 |
| Điểm trừ | — | Theo mức độ vi phạm |
| **Tổng** | **100** | Nhóm I + Nhóm II − Điểm trừ |

**Xếp loại:** A ≥ 90 · B 70–<90 · C 50–<70 · D < 50.
**KPI quy đổi:** công chức/LĐHĐ `(a+b+c)/3`; lãnh đạo `(a+b+c+d+đ+e)/6` — với a/b/c là tỷ lệ % Số lượng/Chất lượng/Tiến độ.

---

*Công cụ hỗ trợ quản trị nội bộ. Không thay thế kết luận của cấp có thẩm quyền.*
