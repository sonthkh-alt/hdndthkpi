# CLAUDE.md — Bộ nhớ dự án (đọc tự động mỗi phiên)

Hệ thống **Đánh giá, xếp loại cán bộ, công chức theo OKR/KPI** — Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa (**bản demo nội bộ**).

> **Quy tắc vàng đa máy:** đầu phiên `git pull`, cuối phiên commit + `git push`. GitHub là nguồn duy nhất; KHÔNG đặt repo trong OneDrive.

## Quy tắc chi tiết — `.claude/rules/` (Claude Code tự nạp)
Nội dung được tách theo chủ đề, đặt trong thư mục `.claude/rules/`:

- **`project-overview.md`** — dự án là gì, công nghệ, URL, ghi chú bản demo.
- **`commands-and-deploy.md`** — lệnh `npm` build/dev/lint, triển khai qua Vercel.
- **`multi-machine-workflow.md`** — quy trình cơ quan ↔ nhà qua GitHub, tạo `.env`.
- **`architecture.md`** — kiến trúc (1 phiên bản giao diện), danh sách file & nơi sửa *(nạp khi đụng `src/`, `api/`, `supabase/`)*.
- **`data-model.md`** — 5 nhóm đối tượng (Mẫu 01–05), cấu trúc `person`, công thức điểm *(nạp khi đụng `src/`)*.
- **`conventions.md`** — tiếng Việt UTF-8, commit trailer, không commit secret.
- **`changelog.md`** — nhật ký các bước đã làm.

> Khi hoàn thành việc lớn: cập nhật `.claude/rules/changelog.md` rồi push. Thư mục `.claude/rules/` được commit (đã mở ngoại lệ trong `.gitignore`) nên đồng bộ giữa các máy; các file `.claude` khác (settings cục bộ) vẫn bị bỏ qua.
