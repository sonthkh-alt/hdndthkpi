# Quy ước viết mã & commit

- Toàn bộ chữ giao diện & commit: **tiếng Việt có dấu** (UTF-8). Cẩn thận lỗi mã hóa (xem cảnh báo ở `data-model.md` về `nd335.js`).
- Commit message kết thúc bằng dòng: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Trước khi commit: `npm run build` phải xanh.
- KHÔNG commit secret (`.env` đã ignore). KHÔNG commit `node_modules/`, `dist/`, `scratch/`, hay file `.claude` cục bộ (chỉ `.claude/rules/` được commit).
- Sửa **công thức/tiêu chí dùng chung** → chỉ sửa `src/App.jsx` (2 bản giao diện kia import lại từ đó).
