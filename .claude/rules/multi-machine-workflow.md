# Làm việc đa máy (cơ quan ↔ ở nhà) — GitHub là nguồn duy nhất

**Nguồn đồng bộ duy nhất là GitHub.** KHÔNG đặt thư mục dự án trong OneDrive/Dropbox (gây hỏng `.git`, kẹt `node_modules`, xung đột bản sao). Đặt repo ở ổ thường, ví dụ `C:\Projects\HDNDKPI`.

## Máy mới (làm 1 lần)
1. Cài: **VS Code**, **Claude Code**, **Node.js 18+**, **Git**; đăng nhập GitHub.
2. `git clone https://github.com/sonthkh-alt/hdndthkpi` (vào thư mục NGOÀI OneDrive).
3. Tạo file `.env` ở thư mục gốc từ mẫu `.env.example`, điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` (Supabase → Settings → API). **`.env` KHÔNG nằm trong Git** (bảo mật) → phải tạo lại trên mỗi máy.
4. `npm install` → mở thư mục trong VS Code → Claude Code tự đọc `CLAUDE.md` + `.claude/rules/`.

## Mỗi phiên làm việc
- **Bắt đầu:** `git pull`.
- **Kết thúc:** commit + `git push`.
- `git log --oneline` = nhật ký "các bước đã làm", luôn đồng bộ giữa các máy.

> Bộ nhớ hội thoại của Claude Code là **cục bộ từng máy**, KHÔNG tự đồng bộ. Mọi bối cảnh quan trọng phải nằm ở: (a) mã nguồn, (b) commit, (c) `CLAUDE.md` + `.claude/rules/`.
> Thư mục `.claude/rules/` ĐƯỢC commit (đã mở ngoại lệ trong `.gitignore`) nên đồng bộ qua GitHub; các file `.claude` khác (settings cục bộ) vẫn bị bỏ qua.
