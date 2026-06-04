# Tổng quan dự án

Hệ thống **Đánh giá, xếp loại cán bộ, công chức hằng tháng theo OKR/KPI** — Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa.

> **Bản demo thử nghiệm, sử dụng nội bộ — không chịu trách nhiệm về tính pháp lý và dữ liệu.** (Nhãn hiển thị ở header app + trang đăng nhập + footer.)

- Repo: `https://github.com/sonthkh-alt/hdndthkpi`
- Bản chạy: `https://hdndthkpi.vercel.app/`
- Stack: **React 18 + Vite + TailwindCSS**; **Supabase (Postgres + Auth)**; hosting **Vercel** (tự build khi push `main`).
- Xuất báo cáo phía client: `xlsx`, `docx`, `html2pdf.js`, `file-saver` — đều **lazy-load** trong `src/lib/exporters.js`.
