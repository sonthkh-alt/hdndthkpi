# Hệ thống đánh giá OKR/KPI — Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa

Công cụ đánh giá, xếp loại cán bộ, công chức hằng tháng theo phương pháp **OKR/KPI**, tích hợp **Khung năng lực số**. Xây dựng theo Quy định đánh giá, xếp loại hằng tháng (thang điểm 30 + 70, công thức KPI quy đổi × 70%, xếp loại A/B/C/D) và Quyết định Khung năng lực số.

> ⚠️ **Bản DEMO chạy trên cloud công cộng — chỉ dùng dữ liệu giả (tên hư cấu), không nhập thông tin cán bộ thật.**

---

## Tính năng

- **Tổng quan:** Dashboard chỉ số, mục tiêu OKR cấp Văn phòng, phân bố xếp loại, cảnh báo trần 20%, bảng tổng hợp (Mẫu 1A).
- **Đánh giá:** Chấm điểm 2 cột (tự đánh giá / cấp có thẩm quyền), nhiệm vụ KPI liên kết OKR, trạng thái màu theo tiến độ, check-in tuần.
- **Năng lực số:** Tự đánh giá 8 nhóm năng lực theo 4 mức.
- **Xuất báo cáo:** Excel (Mẫu 1A), Word (phiếu đánh giá), in PDF — chạy ngay trên trình duyệt.
- **Lưu trữ lâu dài:** Tự đồng bộ lên Supabase (Postgres) khi đã cấu hình.

## Công nghệ

React + Vite + TailwindCSS · Supabase (Postgres) · SheetJS · docx · html2pdf · Hosting Vercel.

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
