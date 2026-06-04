# Nhật ký các bước đã làm (cập nhật dần)

> Khi hoàn thành việc lớn, thêm 1 dòng vào đây rồi `git push` để máy khác nắm được.

- Hợp nhất đánh giá NĐ335 vào tab Đánh giá (Nhóm II theo danh mục + hệ số).
- Đăng nhập **email + mật khẩu**: lần đầu nhận liên kết → nhập Họ tên/Chức vụ + tạo mật khẩu; có đổi mật khẩu.
- **Tài khoản khách** `user@thanhhoa.gov.vn` / `password`: hiện sẵn ở trang login; được thử chấm điểm Nhóm I/II nhưng **không lưu** (mất khi tải lại).
- Cán bộ tự chọn **Phòng/Bộ phận** và **Nhóm đối tượng** của chính mình.
- **Theo dõi CV**: nút **Thu thập vào đánh giá KPI** (tạo nhiệm vụ Nhóm II từ dòng theo dõi, idempotent qua `srcTrkId`); **Xuất bảng (PDF)** qua cửa sổ in; **Đồng bộ từ Google Sheet** (`/api/kiemdem`) nạp thành dòng theo dõi sửa được (idempotent qua `fromSheet`).
- Module **Liên hệ & hướng dẫn**: thông tin liên hệ (đ/c Hà Ngọc Sơn, 0904818886) + ô gửi ý kiến (mailto `sonthkh@gmail.com`); trang hướng dẫn cập nhật theo app.
- **Thiết kế lại quốc huy + 3 phiên bản giao diện** chọn ở Login (mặc định Cổ điển): Cổ điển (đỏ), Mới (`AppModern.jsx`, tối nebula), PRO (`AppPro.jsx`+`lib/pro.js`, trắng-đen). `Root.jsx` điều phối, `main.jsx` render Root.
- **Danh mục Phòng/Chức vụ (`ORG_UNITS`)**: ô Phòng + Chức vụ ở màn Đánh giá chuyển thành **dropdown** (cả 3 bản). **Cán bộ mới mặc định 100/100** (đánh giá trừ dần).
- **Ẩn hệ số/trọng số khi chấm** (cả 3 bản) — chỉ giải thích ở tab Hướng dẫn.
- **Bản PRO tính ĐÚNG NĐ335 + Sổ tay**: đếm khách quan, hệ số quy đổi N1–N5, danh mục theo Phòng/Vị trí (`WORK_CATALOG_PRO`); lãnh đạo (a+b+c+d+đ+e)/6 theo chức vụ; hợp đồng theo Sổ tay Chương III (3 tiêu chí).
- **5 nhóm đối tượng, đánh số Mẫu 01–05** (`CRITERIA_ORDER`): 01 ĐB HĐND chuyên trách · 02 ĐB Quốc hội chuyên trách · 03 Lãnh đạo, quản lý · 04 Công chức · 05 Lao động hợp đồng.
- **Bản demo nội bộ**: nhãn "Bản demo thử nghiệm" + dòng miễn trừ trách nhiệm ở header/footer/login.
- **Tổng quan trực quan (Recharts)**: thêm `src/lib/DashboardCharts.jsx` (lazy-load) — donut cơ cấu xếp loại, bar xếp hạng điểm cán bộ, biểu đồ xu hướng theo kỳ (cột chồng A/B/C/D + đường điểm TB); thêm bảng **Tổng hợp theo Phòng/Bộ phận** (`src/lib/dash.js` `deptSummary`). Gắn cho CẢ 3 phiên bản (App/Modern/Pro), theme sáng/tối qua prop `dark`.
- **Biểu đồ theo tông từng phiên bản**: `DashboardCharts` đổi prop `dark`→`theme` (classic đỏ-vàng / modern tím-xanh / pro xanh Matrix nền tối); thêm gradient (donut bo góc, bar, cột so sánh), Xu hướng dùng Area gradient. Bản PRO đảo sang nền đen chữ trắng phong cách Matrix (AppPro + Login theme pro).
- **So sánh Chất lượng & KPI theo Phòng/Ban**: `deptSummary` bổ sung `quality`(Nhóm I /30), `kpi`(Nhóm II /70), `qualityPct/kpiPct`; thêm biểu đồ cột nhóm so sánh % đạt giữa các đơn vị + 2 cột Chất lượng/KPI trong bảng theo Phòng (cả 3 bản).
- **Tổ chức bộ nhớ dự án**: tách `CLAUDE.md` thành các file chủ đề trong `.claude/rules/` (theo Claude Code rule spec); mở ngoại lệ `.gitignore` để commit thư mục này.
