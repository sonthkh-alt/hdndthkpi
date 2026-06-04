---
paths:
  - "src/**"
---

# Mô hình dữ liệu & công thức điểm (trong `App.jsx`)

## Nhóm đối tượng (`CRITERIA`, 5 nhóm)
Thứ tự hiển thị + số Mẫu theo `CRITERIA_ORDER = ['hdnd','dbqh','leader','staff','contract']`:
- **Mẫu 01** `hdnd` — Đại biểu HĐND tỉnh chuyên trách
- **Mẫu 02** `dbqh` — Đại biểu Quốc hội chuyên trách
- **Mẫu 03** `leader` — Cán bộ lãnh đạo, quản lý
- **Mẫu 04** `staff` — Công chức không giữ chức vụ lãnh đạo
- **Mẫu 05** `contract` — Lao động hợp đồng hỗ trợ, phục vụ

Mỗi nhóm có `groups` (Tiêu chí chung Nhóm I, ≤30). `hdnd`/`dbqh` dùng chung tiêu chí của `leader`. ⚠️ Số Mẫu 01–05 là cách đánh số của quy định Tỉnh ủy/HĐND (NĐ335 gốc chỉ có Mẫu 01 = phiếu theo dõi, Mẫu 02 = phiếu xếp loại).

## Cấu trúc dữ liệu
- `ORG_UNITS` (App.jsx) = danh mục **Phòng/Bộ phận → Chức vụ** (HĐND tỉnh, Đoàn ĐBQH, 4 Ban, Văn phòng, 4 phòng). Ô Phòng + Chức vụ ở màn Đánh giá là **dropdown** (`posOptions(dept)`).
- Danh mục Nhóm II (Cổ điển/Mới): `ND335_CATALOG` + `HDND_CATALOG` → gộp `CATALOG`; `getND335Groups(type)`; `agg335()` tra hệ số.
- `person`: `{ id, name, position, department, email, role, type, selfScores, mgrScores, deduction, tasks335[], proTasks[], leadScores{d,dd,e}, hdScores{cl,tt,hq}, digital, selfNote, mgrNote, trackings[] }`. Mỗi bản đọc field riêng → KHÔNG đụng nhau: Cổ điển/Mới dùng `tasks335[]`; **PRO dùng `proTasks[]`** (`{catalogId,objId,assigned,completed,qualityIssues,delays}`), `leadScores` (lãnh đạo 100/50), `hdScores` (hợp đồng).
- `trackings[]` (Theo dõi CV) thêm trường KPI `{catalogId,objId,completed,qualityIssues,delays}` + cờ `fromSheet`/`srcTrkId`.

## Công thức điểm
- **Chung:** Tổng = Nhóm I (≤30) + Nhóm II (≤70) − Điểm trừ; xếp loại A≥90 / B≥70 / C≥50 / D<50; trần HTXS ≤20% (đặc biệt 25%) số HTT. **Cán bộ mới mặc định 100/100** (Nhóm I tối đa; Nhóm II mặc định 100 khi chưa nhập).
- **Cổ điển/Mới** (`agg335`): (a+b+c)/3 × 70%, trọng số = hệ số danh mục; b,c chia cho SỐ HOÀN THÀNH. KHÔNG có 6 thành phần lãnh đạo.
- **PRO** (`computePro`, đúng NĐ335 Điều 14/16): đếm khách quan, hệ số quy đổi N1–N5 (đơn vị chuẩn 5đ); a/b/c đều chia cho **SỐ GIAO**, b −25%/lần lỗi, c −25%/lần chậm. Cán bộ (a+b+c)/3; **lãnh đạo (a+b+c+d+đ+e)/6** (d/đ/e mỗi mục 100%/50%, theo CHỨC VỤ qua `isLeaderPerson`). **Hợp đồng** (`contract`) theo **Sổ tay Chương III**: 3 tiêu chí Chất lượng/Tuân thủ/Hiệu quả → (cl+tt+hq)/3.
- **Hệ số/trọng số ẩn khi chấm** (cả 3 bản) — chỉ giải thích ở tab Hướng dẫn.

## Phân quyền
Theo email khớp `person.email`: `canbo` / `truongphong` / `quantri` (+ bootstrap admin `sonthkh@gmail.com`); `khach` (`user@thanhhoa.gov.vn`) = dùng thử, **KHÔNG lưu**.
