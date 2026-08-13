# Quy ước viết mã & commit

> **RÀ SOÁT CHỨC NĂNG LIÊN QUAN (bắt buộc, người dùng yêu cầu):** sửa xong một chỗ thì **chủ động kiểm tra và hoàn thiện MỌI chức năng liên quan trong cùng lần sửa**, không chờ người dùng phát hiện hỏng. Tự hỏi *"chỗ nào khác đang đọc/ghi thứ vừa đổi?"* rồi kiểm chứng THẬT (chạy thử, không đoán):
> - Đổi khóa/định dạng dữ liệu (`src/lib/supabase.js`, `hrStore.js`, `tieuChiStore.js`) → kiểm **`api/_lib/store.js` + `facts.js`** (bot chat dò mã bằng biểu thức chính quy riêng) và các hàm xuất báo cáo (`exporters.js`, `export2C.js`).
> - Đổi mô hình dữ liệu / luồng nghiệp vụ → cập nhật **`api/_lib/knowledge.js`** (hiểu biết tĩnh của bot) kẻo bot trả lời sai.
> - Đổi quyền đọc/ghi → xem lại RLS trong `supabase/schema.sql`, thử cả vai **KHÁCH** lẫn vai **QUẢN TRỊ**.
> - Bài học: 13/8/2026 tách kho dữ liệu theo phân hệ → bot mất hẳn phân hệ Kiểm điểm; gộp danh sách cán bộ → lộ lỗi trùng họ tên làm mất 1 đồng chí. Cả hai đều là hệ quả dây chuyền lẽ ra phải tự thấy.

> **TỰ ĐỘNG ĐỒNG BỘ GITHUB (ủy quyền lâu dài của người dùng):** sau khi hoàn thành MỖI thay đổi → `npm run build` xanh → `git add` đúng file liên quan → commit → **`git push origin main`** ngay, KHÔNG cần hỏi lại. Chỉ commit thay đổi của việc đang làm; không vơ tệp/thay đổi lạ đang chờ của người dùng.

- Toàn bộ chữ giao diện & commit: **tiếng Việt có dấu** (UTF-8). Cẩn thận lỗi mã hóa (xem cảnh báo ở `data-model.md` về `nd335.js`).
- Commit message kết thúc bằng dòng: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Trước khi commit: `npm run build` phải xanh.
- KHÔNG commit secret (`.env` đã ignore). KHÔNG commit `node_modules/`, `dist/`, `scratch/`, hay file `.claude` cục bộ (chỉ `.claude/rules/` được commit).
- Sửa **công thức/tiêu chí dùng chung** → chỉ sửa `src/App.jsx` (2 bản giao diện kia import lại từ đó).
