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
- Danh mục Nhóm II: `ND335_CATALOG` + `HDND_CATALOG` → gộp `CATALOG`; cộng danh mục Quản trị tùy chỉnh `state.catalog = {custom[],hidden[],overrides{}}` qua registry (`setCatalogRegistry`/`findCatalogItem`); `getND335Groups(type)` lọc theo Nhóm đối tượng hiệu lực; `agg335()` tra hệ số qua `findCatalogItem`.
- `person`: `{ id, name, position, department, email, role, type, selfScores, mgrScores, deduction, disciplined, tasks335[], leadScores{d,dd,e}, digital, selfNote, mgrNote, trackings[] }`. `tasks335[]` = `{catalogId,objId,assigned,completed,qualityIssues,delays,note}`; `leadScores` = d/đ/e của lãnh đạo (100/50). *(Dữ liệu cũ có thể còn `proTasks`/`hdScores` từ bản PRO — đã gỡ, nay bỏ qua.)*
- `trackings[]` (Theo dõi CV) thêm trường KPI `{catalogId,objId,completed,qualityIssues,delays}` + cờ `fromSheet`/`srcTrkId`.

## Công thức điểm (`computePerson` + `agg335` + `evalGradeCode` trong App.jsx)
- **Chung:** Tổng = Nhóm I (≤30) + Nhóm II (≤70) − Điểm trừ. **Cán bộ mới mặc định 100/100** (Nhóm I tối đa; Nhóm II mặc định 100 khi chưa nhập).
- **Nhóm II** (`agg335`): (a+b+c)/3 × 70%, trọng số = hệ số danh mục. **Lãnh đạo, quản lý** (theo `isLeaderPerson`, Điều 7): **(a+b+c+d+đ+e)/6**, d/đ/e mỗi mục 100%/50% từ `leadScores`. Hệ số/trọng số **ẩn khi chấm** — chỉ giải thích ở tab Hướng dẫn.
- **Xếp loại theo Điều 8** (`taskStats` + `evalGradeCode`): xét THEO TỪNG nhiệm vụ (r=HT/Giao). Ngưỡng điểm A≥90/B≥70/C≥50/D<50 **kèm điều kiện**: A cần đạt đủ 100% số lượng mọi nhiệm vụ + ≥30% vượt mức; D khi >50% nhiệm vụ không hoàn thành (r<50%; lãnh đạo >30%) hoặc tích "bị kỷ luật". Trần HTXS ≤20% số HTT.

## Phân quyền
Theo email khớp `person.email`: `canbo` / `truongphong` / `quantri` (+ bootstrap admin `sonthkh@gmail.com`); `khach` (`user@thanhhoa.gov.vn`) = dùng thử, **KHÔNG lưu**.
