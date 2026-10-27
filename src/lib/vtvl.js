// ============================================================================
//  PHÂN HỆ "BỘ BIỂU VỊ TRÍ VIỆC LÀM" (#/vtvl) — MÔ HÌNH + CÔNG THỨC (LOGIC THUẦN)
//
//  Nguồn: docs/Bo_bieu_VTVL_30000_dong_ban_sua_de_nghi_UEB_v2_20261023.xlsx
//  (bản sửa đề nghị v2 của nhóm tư vấn UEB, 23/10/2026 — chưa phải bản Ban ban hành).
//
//  Tệp này KHÔNG import React/Supabase → chạy và kiểm thử được bằng Node.
//  Gồm 4 phần:
//   ① DANH SÁCH CHỌN (trang DM_THAM_SO) và tham số quỹ giờ PP2 = 1.904.
//   ② CẤU TRÚC 19 BIỂU: tên trang, dòng tiêu đề, từng cột (nhập / chọn / tự tính).
//   ③ CÔNG THỨC: `tinhToan(doc)` chuyển NGUYÊN VĂN công thức của các cột xám
//      (B1!F:R, B2_CT!H:P, B2_ThayDoi, C1!E:K, C3!C:N, D1!D:J, DU_BAO!G:I,
//      D2!C:M, DOI_CHIEU_NV, K_KiemTra, T_TienDo) — kể cả câu chữ cảnh báo, để
//      kết quả trên web khớp từng chữ với tệp Excel.
//   ④ KIỂM TRA: `kiemTraDuLieu(doc)` = những gì danh sách chọn "bật báo lỗi" của
//      Excel chặn (sai danh sách, sai kiểu số, mã liên kết chưa có, trùng mã…)
//      + cảnh báo nghiệp vụ lấy từ chính các cột cảnh báo của bộ biểu.
//
//  ⚠️ Quy ước so khớp mã giống Excel: MATCH/COUNTIF KHÔNG phân biệt hoa thường →
//     `kk()` đưa về chữ hoa và cắt khoảng trắng hai đầu.
//  ⚠️ `chuanHoaVTVL` là DANH SÁCH TRẮNG: chỉ giữ các cột NHẬP của từng biểu. Thêm
//     cột mới thì PHẢI khai trong BIEU, nếu không cột đó bị gọt ngay lúc lưu
//     (bài học "danh bạ lưu xong thì biến mất").
// ============================================================================

// ─── ① THAM SỐ & DANH SÁCH CHỌN ─────────────────────────────────────────────
export const QUY_GIO_PP2 = 1904; // (261 − 11 − 12) × 8 — DM_THAM_SO!B3
export const NAM_TU = 2027;
export const NAM_DEN = 2031;

export const DS = {
  TT_A1: ['Tiếp tục thực hiện', 'Mới tiếp nhận', 'Đã chuyển giao', 'Không còn thực hiện'],
  TT_B1: ['Có định mức', 'Kiểm đếm, ước lượng thực tế'],
  KIEM_CHUNG: ['Đã kiểm chứng', 'Chưa kiểm chứng'],
  TT_B2CT: ['Đã kiểm chứng', 'Chưa kiểm chứng', 'Ước lượng tham khảo'],
  LOAI_TD: ['Số hóa', 'Cải tiến quy trình', 'Thuê dịch vụ/đặt hàng', 'Tự chủ', 'Xã hội hóa', 'Công việc mới phát sinh'],
  CO_SO_B1: ['Trước thay đổi, có điều chỉnh', 'Đã đo sau thay đổi (không trừ)'],
  DOI_CHIEU: ['Chờ đối chiếu', 'Đã đối chiếu'],
  TT_C1: ['Tiếp tục sử dụng', 'Cần cập nhật', 'Đề nghị bổ sung', 'Đề nghị sửa đổi', 'Đề nghị bãi bỏ'],
  CHE_DO: ['Phổ biến (40 giờ/tuần)', 'Đặc thù'],
  PP: ['PP1', 'PP2', 'PP3', 'PP1+PP2', 'PP1+PP3', 'PP2+PP3', 'PP1+PP2+PP3'],
  TT_C3: ['Tính thử', 'Chưa đủ dữ liệu', 'Đã kiểm chứng', 'Không áp dụng'],
  TT_D2: ['Đang xây dựng', 'Đã hoàn thành ở đơn vị', 'Đã thẩm định', 'Đã được quyết định'],
  NAM: [2027, 2028, 2029, 2030, 2031],
  LOAI_NL: ['Cán bộ', 'Công chức', 'Viên chức', 'Hợp đồng lao động', 'Khác'],
  NHOM: ['I', 'II', 'III', 'IV', 'V', 'VI', 'Không phân nhóm'],
  TT_DM: ['Đang kiểm chứng', 'Đã xác nhận', 'Không áp dụng'],
  TIEP_THU: ['Chờ tiếp thu', 'Tiếp thu', 'Tiếp thu một phần', 'Không tiếp thu', 'Giải trình'],
  VUNG: ['Vùng Đô thị đặc biệt', 'Vùng Đô thị', 'Vùng Đồng bằng', 'Vùng Miền núi'],
  BIEU: ['1. A1_NhiemVu', '2. A2_CongViec', '3. B1_KhoiLuong', '4. B2_CT_TacDong', '5. B2_ThayDoi', '6. C1_VTVL',
    '7. C2_NangLuc', '8. C3_NhuCau', '9. D1_NhanLuc', '10. D2_PhuongAn', '11. DM_SAN_PHAM', '12. CHIA_VUNG_CAP_XA'],
  // Không có ô chọn trong Excel — chỉ là GỢI Ý khi gõ (không báo lỗi nếu khác).
  XAC_NHAN: ['Đã xác nhận', 'Chờ xác nhận'],
};

// ─── ② CẤU TRÚC CÁC BIỂU ────────────────────────────────────────────────────
// Kiểu cột: 'ma' (mã, so khớp không phân biệt hoa thường) · 'chu' · 'so' · 'nam'
// · 'ngay' · 'ds' (chọn trong DS[ds]) · 'tinh' (công thức — không nhập).
// Tùy chọn: khoa (cột khóa của dòng) · ref (mã phải có ở biểu khác) · min:0
// (không âm) · duong (> 0) · nguyen (số nguyên) · goiY (danh sách gợi ý) · tt
// (cột trạng thái/cảnh báo tự tính) · dai (ô chữ dài).
const c = (k, ten, kieu, o = {}) => ({ k, ten, kieu, ...o });

export const NHOM_BIEU = [
  { id: 'A', ten: 'A — Nhiệm vụ, công việc' },
  { id: 'B', ten: 'B — Khối lượng, tác động' },
  { id: 'C', ten: 'C — Vị trí việc làm, nhu cầu' },
  { id: 'D', ten: 'D — Nhân lực, phương án' },
  { id: 'DM', ten: 'Danh mục dùng chung' },
  { id: 'NG', ten: 'Nguồn kế thừa (CV 1972, 2209, 2342)' },
  { id: 'KH', ten: 'Nhật ký, góp ý' },
];

export const BIEU = [
  {
    id: 'A1', nhom: 'A', sheet: '1. A1_NhiemVu', ma: 'A1', ten: 'Nhiệm vụ', tieuDe: 'Biểu A1_ Nhiệm vụ', dongTieuDe: 2,
    duyNhat: ['A'], buoc: 1,
    cot: [
      c('A', 'Mã nhiệm vụ', 'ma', { khoa: true }), c('B', 'Tên nhiệm vụ', 'chu', { dai: true }), c('C', 'Cơ quan', 'chu'),
      c('D', 'Căn cứ', 'chu', { dai: true }), c('E', 'Kỳ', 'chu'), c('F', 'Trạng thái', 'ds', { ds: 'TT_A1' }), c('G', 'Nguồn', 'chu'),
    ],
  },
  {
    id: 'A2', nhom: 'A', sheet: '2. A2_CongViec', ma: 'A2', ten: 'Công việc', tieuDe: 'Biểu A2_ Công việc', dongTieuDe: 2,
    duyNhat: ['A'], buoc: 2,
    cot: [
      c('A', 'Mã công việc', 'ma', { khoa: true }), c('B', 'Mã nhiệm vụ', 'ma', { ref: 'A1' }), c('C', 'Mã VTVL', 'ma', { ref: 'C1' }),
      c('D', 'Tên công việc', 'chu', { dai: true }), c('E', 'Sản phẩm', 'chu'), c('F', 'Đơn vị tính', 'chu'), c('G', 'Chất lượng', 'chu'),
      c('H', 'Căn cứ (nguồn)', 'chu'),
    ],
  },
  {
    id: 'B1', nhom: 'B', sheet: '3. B1_KhoiLuong', ma: 'B1', ten: 'Khối lượng', tieuDe: 'Biểu B1_ Khối lượng', dongTieuDe: 2,
    buoc: 3,
    cot: [
      c('A', 'Mã công việc', 'ma', { khoa: true, ref: 'A2' }), c('B', 'Mã VTVL', 'tinh'),
      c('C', 'Số SP/năm', 'so', { min: 0 }), c('D', 'Trung bình phút/SP (đo thực tế)', 'so', { duong: true }),
      c('E', 'Giờ bổ sung (công việc liên quan)', 'so', { min: 0 }), c('F', 'Giờ SP (tính)', 'tinh'), c('G', 'Giờ tổng (tính)', 'tinh'),
      c('H', 'Nguồn SL', 'chu'), c('I', 'Nguồn thời gian', 'chu'), c('J', 'Trạng thái căn cứ thời gian', 'ds', { ds: 'TT_B1' }),
      c('K', 'Kỳ', 'chu'), c('L', 'Mã SP trong danh mục', 'ma', { ref: 'DM' }), c('M', 'Nhóm (tự tra)', 'tinh'),
      c('N', 'Phút/SP chuẩn (tự tra)', 'tinh'), c('O', 'Xác nhận chuẩn (tự tra)', 'tinh'), c('P', 'Phút/SP dùng để tính', 'tinh'),
      c('Q', 'Nguồn thời gian dùng tính', 'tinh'), c('R', 'Cảnh báo dữ liệu', 'tinh', { tt: true }), c('S', 'Giải trình khác chuẩn', 'chu', { dai: true }),
    ],
  },
  {
    id: 'B2CT', nhom: 'B', sheet: '4. B2_CT_TacDong', ma: 'B2_CT', ten: 'Tác động chi tiết', tieuDe: 'Biểu B2_CT_ Tác động', dongTieuDe: 2,
    buoc: 4,
    cot: [
      c('A', 'Mã công việc', 'ma', { khoa: true, ref: 'A2' }), c('B', 'Mã VTVL', 'tinh'), c('C', 'Loại tác động', 'ds', { ds: 'LOAI_TD' }),
      c('D', 'Công đoạn', 'chu'), c('E', 'SP áp dụng', 'so', { min: 0 }), c('F', 'Phút trước', 'so', { min: 0 }), c('G', 'Phút sau', 'so', { min: 0 }),
      c('H', 'Giờ giảm trực tiếp', 'tinh'), c('I', 'Giờ việc mới', 'so', { min: 0 }), c('J', 'Nguồn/bằng chứng', 'chu'), c('K', 'Kỳ', 'chu'),
      c('L', 'Cơ sở B1', 'ds', { ds: 'CO_SO_B1' }), c('M', 'Trạng thái', 'ds', { ds: 'TT_B2CT' }), c('N', 'Giờ giảm hợp lệ', 'tinh'),
      c('O', 'Giờ tăng hợp lệ', 'tinh'), c('P', 'Kiểm tra', 'tinh', { tt: true }), c('Q', 'Kinh phí trước', 'chu'), c('R', 'Kinh phí sau', 'chu'),
      c('S', 'Đối chiếu trùng/phạm vi (cán bộ xác nhận)', 'ds', { ds: 'DOI_CHIEU' }),
    ],
  },
  {
    id: 'B2', nhom: 'B', sheet: '5. B2_ThayDoi', ma: 'B2', ten: 'Thay đổi (tổng hợp)', tieuDe: 'Biểu B2_ Thay đổi', dongTieuDe: 2,
    tuTinh: true, buoc: 4,
    cot: [
      c('A', 'Mã công việc', 'tinh'), c('B', 'Mã VTVL', 'tinh'), c('C', 'Giờ giảm số hóa', 'tinh'), c('D', 'Giờ giảm thuê/TCh/XHH', 'tinh'),
      c('E', 'Giờ việc mới', 'tinh'), c('F', 'Giờ tác động ròng', 'tinh'), c('G', 'Trạng thái', 'tinh'), c('H', 'Số dòng chi tiết', 'tinh'),
      c('I', 'Cảnh báo', 'tinh', { tt: true }),
    ],
  },
  {
    id: 'C1', nhom: 'C', sheet: '6. C1_VTVL', ma: 'C1', ten: 'Vị trí việc làm', tieuDe: 'Biểu C1_ Vị trí việc làm', dongTieuDe: 2,
    duyNhat: ['A'], buoc: 5,
    cot: [
      c('A', 'Mã VTVL', 'ma', { khoa: true }), c('B', 'Tên VTVL', 'chu'), c('C', 'Loại nhân lực', 'ds', { ds: 'LOAI_NL' }),
      c('D', 'Quyết định', 'chu'), c('E', 'Giờ chuẩn PP2', 'tinh'), c('F', 'Căn cứ xác định quỹ giờ', 'chu', { dai: true }),
      c('G', 'Trạng thái', 'ds', { ds: 'TT_C1' }), c('H', 'Giờ riêng được xác nhận', 'so', { duong: true }),
      c('I', 'Xác nhận giờ riêng', 'ds', { ds: 'KIEM_CHUNG' }), c('J', 'Chế độ làm việc', 'ds', { ds: 'CHE_DO' }),
      c('K', 'Kiểm tra quỹ giờ PP2', 'tinh', { tt: true }),
    ],
  },
  {
    id: 'C2', nhom: 'C', sheet: '7. C2_NangLuc', ma: 'C2', ten: 'Năng lực', tieuDe: 'Biểu C2_ Mô tả năng lực', dongTieuDe: 2,
    buoc: 5,
    cot: [
      c('A', 'Mã VTVL', 'ma', { khoa: true, ref: 'C1' }), c('B', 'Trách nhiệm', 'chu', { dai: true }), c('C', 'Năng lực chung', 'chu', { dai: true }),
      c('D', 'Chuyên môn', 'chu', { dai: true }), c('E', 'Lãnh đạo', 'chu', { dai: true }), c('F', 'Căn cứ', 'chu'), c('G', 'Nguồn bản mô tả', 'chu'),
    ],
  },
  {
    id: 'C3', nhom: 'C', sheet: '8. C3_NhuCau', ma: 'C3', ten: 'Nhu cầu', tieuDe: 'Biểu C3_ Nhu cầu', dongTieuDe: 2,
    duyNhat: ['A'], buoc: 6,
    cot: [
      c('A', 'Mã VTVL', 'ma', { khoa: true, ref: 'C1' }), c('B', 'Phương pháp', 'ds', { ds: 'PP' }), c('C', 'Giờ B1', 'tinh'),
      c('D', 'Giờ tác động B2', 'tinh'), c('E', 'Giờ ròng', 'tinh'), c('F', 'Giờ PP2 (từ C1)', 'tinh'), c('G', 'Người quy đổi PP2', 'tinh'),
      c('H', 'Người PP1', 'so', { min: 0 }), c('I', 'Người PP3 (ước lượng, cần giải trình)', 'so', { min: 0 }),
      c('J', 'Người cần bố trí', 'so', { min: 0 }), c('K', 'Nguồn/giải trình', 'chu', { dai: true }), c('L', 'Trạng thái', 'ds', { ds: 'TT_C3' }),
      c('M', 'Cảnh báo', 'tinh', { tt: true }), c('N', 'Số dòng B1 chưa đạt', 'tinh'),
    ],
  },
  {
    id: 'D1', nhom: 'D', sheet: '9. D1_NhanLuc', ma: 'D1', ten: 'Nhân lực', tieuDe: 'Biểu D1_ Nhân lực', dongTieuDe: 2,
    duyNhat: ['A'], buoc: 7,
    cot: [
      c('A', 'Mã nguồn lực', 'ma', { khoa: true }), c('B', 'Mã VTVL', 'ma', { ref: 'C1' }), c('C', 'Loại nhân lực', 'ds', { ds: 'LOAI_NL' }),
      c('D', 'Giờ quy đổi/năm (tự lấy)', 'tinh'), c('E', 'Giờ dành cho VTVL', 'so', { min: 0 }), c('F', 'Giờ việc khác', 'so', { min: 0 }),
      c('G', 'Nơi tính BC', 'chu'), c('H', 'Nguồn', 'chu'), c('I', 'Trạng thái', 'ds', { ds: 'KIEM_CHUNG' }),
      c('J', 'Cảnh báo', 'tinh', { tt: true }), c('K', 'Giờ riêng theo chế độ', 'so', { duong: true }),
    ],
  },
  {
    id: 'DU', nhom: 'D', sheet: 'DU_BAO_5_NAM', ma: 'DU_BAO', ten: 'Dự báo 5 năm', dongTieuDe: 2,
    tieuDe: 'DỰ BÁO NHU CẦU NHÂN LỰC 2027–2031 – ĐẦU MỐI TỔNG HỢP XÁC NHẬN (KHÔNG PHẢI BIỂU CƠ SỞ KÊ KHAI)',
    duyNhat: ['A', 'B'], buoc: 7, dauMoi: true,
    moTa: 'Công cụ nội bộ của đầu mối tổng hợp: dự báo thay đổi nhu cầu từng năm 2027–2031 dựa vào C3; chỉ dòng ĐẠT được chuyển sang D2. Không phải biểu cơ sở kê khai.',
    cot: [
      c('A', 'Mã VTVL', 'ma', { khoa: true, ref: 'C1' }), c('B', 'Năm', 'nam'), c('C', 'Biến động so C3 (+/− người)', 'so'),
      c('D', 'Nội dung thay đổi / xác nhận không đổi', 'chu', { dai: true }), c('E', 'Căn cứ nguồn và thời điểm', 'chu'),
      c('F', 'Trạng thái xác nhận', 'ds', { ds: 'KIEM_CHUNG' }), c('G', 'Người C3 năm cơ sở', 'tinh'), c('H', 'Người cần bố trí trong năm', 'tinh'),
      c('I', 'Kiểm tra, đối chiếu', 'tinh', { tt: true }), c('J', 'Ghi chú đầu mối', 'chu'),
    ],
  },
  {
    id: 'D2', nhom: 'D', sheet: '10. D2_PhuongAn', ma: 'D2', ten: 'Phương án', tieuDe: 'Biểu D2_ Phương án', dongTieuDe: 2,
    duyNhat: ['A', 'B'], buoc: 7,
    cot: [
      c('A', 'Mã VTVL', 'ma', { khoa: true, ref: 'C1' }), c('B', 'Năm', 'nam'), c('C', 'Số người cần bố trí trong năm phương án', 'tinh'),
      c('D', 'Số người có thể bố trí (cùng đơn vị tính)', 'so', { min: 0 }), c('E', 'Biên chế được giao theo đúng cấp', 'so', { min: 0 }),
      c('F', 'Điều chuyển/bố trí lại', 'chu'), c('G', 'Đề nghị điều chỉnh', 'so'), c('H', 'Nguồn/giải trình', 'chu', { dai: true }),
      c('I', 'Trạng thái', 'ds', { ds: 'TT_D2' }), c('J', 'Cảnh báo', 'tinh', { tt: true }), c('K', 'PP2: người quy đổi (tham khảo)', 'tinh'),
      c('L', 'Người cần bố trí C3 năm cơ sở (tham khảo)', 'tinh'), c('M', 'Kiểm soát cơ sở đối chiếu', 'tinh'),
      c('N', 'Văn bản thẩm định/quyết định (số, ngày, cơ quan)', 'chu'),
    ],
  },
  {
    id: 'DM', nhom: 'DM', sheet: '11. DM_SAN_PHAM', ma: 'DM_SP', ten: 'Danh mục sản phẩm', tieuDe: 'Biểu_Danh mục sản phẩm', dongTieuDe: 2,
    duyNhat: ['A'], dauMoi: true,
    cot: [
      c('A', 'Mã sản phẩm chuẩn', 'ma', { khoa: true }), c('B', 'Tên/loại sản phẩm', 'chu'), c('C', 'Khối/ngành/lĩnh vực', 'chu'),
      c('D', 'Nhóm I–VI (nếu áp dụng)', 'ds', { ds: 'NHOM' }), c('E', 'Phút/SP chuẩn', 'so', { duong: true }),
      c('F', 'Văn bản/nguồn xác nhận', 'chu'), c('G', 'Trạng thái', 'ds', { ds: 'TT_DM' }), c('H', 'Cơ quan xác nhận', 'chu'),
      c('I', 'Ngày hiệu lực', 'ngay'), c('J', 'Phạm vi áp dụng/ghi chú', 'chu'),
    ],
  },
  {
    id: 'VUNG', nhom: 'DM', sheet: '12. CHIA_VUNG_CAP_XA', ma: 'VUNG', ten: 'Chia vùng cấp xã', tieuDe: 'Biểu_Chia vùng cấp xã', dongTieuDe: 3,
    duyNhat: ['B'],
    cot: [
      c('A', 'STT', 'so', { nguyen: true, duong: true }), c('B', 'Tên xã, phường, đặc khu', 'chu', { khoa: true }), c('C', 'Vùng', 'ds', { ds: 'VUNG' }),
    ],
  },
  {
    id: 'NGNV', nhom: 'NG', sheet: 'NGUON_NHIEM_VU', ma: 'NGUON_NV', ten: 'Nguồn nhiệm vụ', tieuDe: 'Biểu_Nguồn nhiệm vụ', dongTieuDe: 2,
    duyNhat: ['A'], dauMoi: true,
    moTa: 'Cơ quan đầu mối nhập dữ liệu nguồn đã có (CV 1972, 2209, 2342); là cơ sở đối chiếu trước khi chuyển sang A1.',
    cot: [
      c('A', 'Mã gốc', 'ma', { khoa: true }), c('B', 'Tên nhiệm vụ nguồn', 'chu', { dai: true }), c('C', 'Cơ quan', 'chu'),
      c('D', 'Căn cứ pháp lý', 'chu'), c('E', 'Cấp/phạm vi', 'chu'), c('F', 'Nguồn CV', 'chu'), c('G', 'Tệp nguồn', 'chu'),
      c('H', 'Trang tính + ô', 'chu'), c('I', 'Kỳ chốt', 'chu'), c('J', 'Trạng thái kiểm chứng', 'chu', { goiY: 'XAC_NHAN' }),
      c('K', 'Mã tham chiếu chuẩn', 'ma'), c('L', 'Ghi chú', 'chu'),
    ],
  },
  {
    id: 'DOI', nhom: 'NG', sheet: 'DOI_CHIEU_NV', ma: 'DOI_CHIEU', ten: 'Đối chiếu nhiệm vụ', tieuDe: 'Biểu_Đối chiếu nhiệm vụ', dongTieuDe: 2,
    tuTinh: true,
    moTa: 'Tự đối chiếu từng dòng của NGUON_NHIEM_VU: thiếu tên, cơ quan, căn cứ, kỳ, trùng mã hay chưa xác nhận. Chỉ xem, xử lý lỗi tại nguồn.',
    cot: [
      c('A', 'Mã nguồn', 'tinh'), c('B', 'Tên nhiệm vụ', 'tinh'), c('C', 'Đơn vị', 'tinh'), c('D', 'Căn cứ', 'tinh'), c('E', 'Kỳ nguồn', 'tinh'),
      c('F', 'Trạng thái nguồn', 'tinh'), c('G', 'Mã tham chiếu', 'tinh'), c('H', 'Cần xác nhận/bổ sung', 'tinh', { tt: true }),
    ],
  },
  {
    id: 'NGVT', nhom: 'NG', sheet: 'NGUON_VTVL', ma: 'NGUON_VTVL', ten: 'Nguồn VTVL', tieuDe: 'Biểu_Nguồn vị trí việc làm', dongTieuDe: 2,
    duyNhat: ['A'], dauMoi: true,
    moTa: 'Nhập danh mục VTVL đã ban hành; không tự coi vị trí đề xuất là được phê duyệt.',
    cot: [
      c('A', 'Mã VTVL nguồn', 'ma', { khoa: true }), c('B', 'Tên VTVL', 'chu'), c('C', 'Cơ quan', 'chu'),
      c('D', 'Loại nhân lực', 'chu', { goiY: 'LOAI_NL' }), c('E', 'Quyết định phê duyệt', 'chu'), c('F', 'Nguồn CV', 'chu'),
      c('G', 'Tệp/trang/ô', 'chu'), c('H', 'Kỳ', 'chu'), c('I', 'Trạng thái xác nhận', 'chu', { goiY: 'XAC_NHAN' }), c('J', 'Mã đối chiếu', 'ma'),
    ],
  },
  {
    id: 'NGNL', nhom: 'NG', sheet: 'NGUON_NHAN_LUC', ma: 'NGUON_NL', ten: 'Nguồn nhân lực', tieuDe: 'Biểu_Nguồn nhân lực', dongTieuDe: 2,
    dauMoi: true,
    moTa: 'Cơ quan đầu mối nhập/đối chiếu biên chế giao, số có mặt; không lấy biên chế hiện có tính trực tiếp nhu cầu.',
    cot: [
      c('A', 'Cơ quan', 'chu', { khoa: true }), c('B', 'Đơn vị/cấp giao', 'chu'), c('C', 'Loại nhân lực', 'chu', { goiY: 'LOAI_NL' }),
      c('D', 'Biên chế giao', 'so', { min: 0 }), c('E', 'Số có mặt', 'so', { min: 0 }), c('F', 'Quyết định giao', 'chu'), c('G', 'Nguồn CV', 'chu'),
      c('H', 'Tệp/trang/ô', 'chu'), c('I', 'Kỳ chốt', 'chu'), c('J', 'Trạng thái xác nhận', 'chu', { goiY: 'XAC_NHAN' }), c('K', 'Ghi chú phạm vi', 'chu'),
    ],
  },
  {
    id: 'Y', nhom: 'KH', sheet: 'Y_KIEN_DON_VI', ma: 'Y', ten: 'Ý kiến đơn vị', tieuDe: 'Biểu Y_Ý kiến của đơn vị', dongTieuDe: 2,
    cot: [
      c('A', 'STT', 'so', { nguyen: true, duong: true }), c('B', 'Cơ quan/đơn vị góp ý', 'chu'), c('C', 'Nhóm nội dung', 'chu'),
      c('D', 'Tên biểu', 'ds', { ds: 'BIEU' }), c('E', 'Cột/ô hoặc điều khoản', 'chu'), c('F', 'Nội dung dự thảo', 'chu', { dai: true }),
      c('G', 'Nội dung đề nghị sửa', 'chu', { dai: true }), c('H', 'Lý do, căn cứ', 'chu', { dai: true }), c('I', 'Mức độ ưu tiên', 'chu'),
      c('J', 'Đầu mối liên hệ', 'chu'), c('K', 'Trạng thái tiếp thu (cơ quan chủ trì)', 'ds', { ds: 'TIEP_THU' }),
    ],
  },
  {
    id: 'S', nhom: 'KH', sheet: '15. S_NhatKy', ma: 'S', ten: 'Nhật ký thay đổi', tieuDe: 'Biểu S_ Nhật ký', dongTieuDe: 2,
    cot: [
      c('A', 'Kỳ', 'chu'), c('B', 'Biểu', 'chu'), c('C', 'Mã', 'chu'), c('D', 'Trường', 'chu'), c('E', 'Giá trị cũ', 'chu'),
      c('F', 'Giá trị mới', 'chu'), c('G', 'Nguồn', 'chu'), c('H', 'Người xác nhận', 'chu'), c('I', 'Ngày', 'ngay'), c('J', 'Phiên bản', 'chu'),
    ],
  },
];

export const BIEU_THEO_ID = Object.fromEntries(BIEU.map((b) => [b.id, b]));
export const bieuNhap = () => BIEU.filter((b) => !b.tuTinh);
export const cotNhap = (b) => b.cot.filter((x) => x.kieu !== 'tinh');
export const cotKhoa = (b) => b.cot.find((x) => x.khoa) || null;
export const cotTrangThai = (b) => b.cot.find((x) => x.tt) || null;

/** Danh sách giá trị hợp lệ của một cột chọn (hoặc gợi ý). */
export const dsCua = (col) => DS[col.ds || col.goiY] || [];

/** Cột trạng thái coi là "đạt" của từng biểu (ngoài giá trị này = cảnh báo). */
export const TT_DAT = {
  B1: ['ĐẠT'], B2CT: ['ĐẠT'], B2: ['ĐẠT'], C1: ['ĐẠT'], C3: ['ĐẠT'], D1: ['Đạt'], DU: ['ĐẠT'],
  D2: ['ĐÃ THẨM ĐỊNH', 'ĐÃ QUYẾT ĐỊNH'], DOI: ['ĐỦ ĐIỀU KIỆN ĐỐI CHIẾU'],
};
/** Trạng thái là bước giữa của quy trình hoặc đã được loại khỏi phép tính có chủ đích → thông tin, không phải cảnh báo. */
export const TT_THONG_TIN = {
  B2CT: ['THAM KHẢO – KHÔNG TÍNH'], D2: ['ĐANG XÂY DỰNG', 'SẴN SÀNG THẨM ĐỊNH'], DOI: ['KHÔNG TỔNG HỢP – VÍ DỤ'],
};

// ─── tiện ích giá trị ───────────────────────────────────────────────────────
export const rong = (v) => v === '' || v === null || v === undefined;
export const laSo = (v) => typeof v === 'number' && Number.isFinite(v);
/** Khóa so khớp kiểu Excel: không phân biệt hoa thường, bỏ khoảng trắng hai đầu. */
export const kk = (v) => String(v ?? '').trim().toUpperCase();
const so0 = (v) => (laSo(v) ? v : 0);

let _dem = 0;
export const newId = () => `r${Date.now().toString(36)}${(++_dem).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function newDong(bieuId) {
  const b = BIEU_THEO_ID[bieuId];
  const r = { _id: newId() };
  for (const col of cotNhap(b)) r[col.k] = '';
  return r;
}

/** Dòng có ít nhất một ô nhập khác rỗng. */
export const dongCoDuLieu = (b, r) => cotNhap(b).some((col) => !rong(r[col.k]));

/**
 * Chuyển một giá trị người dùng gõ (hoặc đọc từ tệp) về đúng kiểu của cột.
 * Trả { v, doi? } — `doi` là câu giải thích khi đã tự chuẩn hóa (để báo cáo).
 * Không chuyển được thì GIỮ NGUYÊN chữ gốc để phần kiểm tra báo lỗi chỉ đúng ô.
 */
export function chuyenGiaTri(col, raw) {
  if (raw === null || raw === undefined) return { v: '' };
  if (typeof raw === 'boolean') raw = raw ? 'TRUE' : 'FALSE';
  if (typeof raw === 'string') {
    raw = raw.split(String.fromCharCode(160)).join(' ').trim();
    if (raw === '') return { v: '' };
  }
  const k = col.kieu;
  if (k === 'so' || k === 'nam') {
    if (laSo(raw)) return { v: raw };
    const n = docSoVN(raw);
    if (n === null) return { v: raw };
    return String(n) === String(raw) ? { v: n } : { v: n, doi: `"${raw}" → ${n}` };
  }
  if (k === 'ngay') {
    if (laSo(raw)) {
      const iso = serialSangNgay(raw);
      return iso ? { v: iso, doi: `số ngày Excel ${raw} → ${iso}` } : { v: String(raw) };
    }
    const s = String(raw);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return { v: s };
    const m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
    if (m) {
      const iso = `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
      return ngayHopLe(iso) ? { v: iso, doi: `"${s}" → ${iso}` } : { v: s };
    }
    return { v: s };
  }
  if (k === 'ds') {
    const list = dsCua(col);
    if (list.includes(raw)) return { v: raw };
    const goc = String(raw);
    const nk = (x) => String(x).toLowerCase().normalize('NFC').replace(/\s+/g, ' ').replace(/\s*([+/()])\s*/g, '$1').trim();
    const khop = list.find((x) => nk(x) === nk(goc));
    if (khop !== undefined) return { v: khop, doi: `"${goc}" → "${khop}"` };
    return { v: laSo(raw) ? raw : goc };
  }
  return { v: typeof raw === 'string' ? raw.normalize('NFC') : String(raw) };
}

/**
 * Đọc số kiểu Việt Nam lẫn kiểu Excel: "1.904" (phân cách nghìn) → 1904,
 * "1,5" → 1.5, "1.904,5" → 1904.5, "2600" → 2600. Không phải số → null.
 */
export function docSoVN(raw) {
  let s = String(raw).replace(/\s/g, '');
  if (s === '') return null;
  // Ưu tiên cách viết Việt Nam: dấu chấm phân cách nghìn, dấu phẩy thập phân.
  // Kiểu Anh chỉ nhận khi KHÔNG thể là số Việt ("1,234,567" hoặc "1,234.5").
  if (/^[+-]?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^[+-]?\d{1,3}(,\d{3}){2,}(\.\d+)?$/.test(s) || /^[+-]?\d{1,3}(,\d{3})+\.\d+$/.test(s)) s = s.replace(/,/g, '');
  else if (/^[+-]?\d+,\d+$/.test(s)) s = s.replace(',', '.');
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const ngayHopLe = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
};
/** Số ngày kiểu Excel (hệ 1900) → 'yyyy-mm-dd'. */
export function serialSangNgay(n) {
  if (!laSo(n) || n < 1 || n > 2958465) return null;
  return new Date(Date.UTC(1899, 11, 30) + Math.round(n) * 86400000).toISOString().slice(0, 10);
}

// ─── mô hình dữ liệu ────────────────────────────────────────────────────────
export const EMPTY_VTVL = { v: 1, donVi: '', ky: '', quyGio: QUY_GIO_PP2, bieu: {}, capNhat: '' };

/** DANH SÁCH TRẮNG — chỉ giữ cột NHẬP đã khai trong BIEU. */
export function chuanHoaVTVL(d) {
  const src = d && typeof d === 'object' ? d : {};
  const out = {
    v: 1,
    donVi: typeof src.donVi === 'string' ? src.donVi : '',
    ky: typeof src.ky === 'string' ? src.ky : '',
    quyGio: laSo(src.quyGio) && src.quyGio > 0 ? src.quyGio : QUY_GIO_PP2,
    bieu: {},
    capNhat: typeof src.capNhat === 'string' ? src.capNhat : '',
  };
  for (const b of bieuNhap()) {
    const rows = Array.isArray(src.bieu?.[b.id]) ? src.bieu[b.id] : [];
    out.bieu[b.id] = rows.filter((r) => r && typeof r === 'object').map((r) => {
      const o = { _id: typeof r._id === 'string' && r._id ? r._id : newId() };
      for (const col of cotNhap(b)) {
        const v = r[col.k];
        o[col.k] = rong(v) ? '' : (laSo(v) || typeof v === 'string' ? v : String(v));
      }
      return o;
    });
  }
  return out;
}

export const soDong = (doc, id) => (doc?.bieu?.[id] || []).length;

// ─── ③ CÔNG THỨC ────────────────────────────────────────────────────────────
/** Chỉ mục kiểu MATCH(…,0): khóa → vị trí dòng ĐẦU TIÊN có khóa đó. */
function chiMucDau(rows, k) {
  const m = new Map();
  rows.forEach((r, i) => { const key = kk(r[k]); if (key && !m.has(key)) m.set(key, i); });
  return m;
}
function demTheo(rows, keyFn) {
  const m = new Map();
  for (const r of rows) { const key = keyFn(r); if (key === null) continue; m.set(key, (m.get(key) || 0) + 1); }
  return m;
}
function congTheo(rows, keyFn, valFn) {
  const m = new Map();
  for (let i = 0; i < rows.length; i++) {
    const key = keyFn(rows[i], i); if (key === null) continue;
    m.set(key, (m.get(key) || 0) + so0(valFn(rows[i], i)));
  }
  return m;
}
const hasPP = (b, p) => String(b ?? '').toUpperCase().includes(p);
/** INDEX(cột, MATCH(...)) với lớp bọc IF(…="","",…) của bộ biểu. */
const traCuu = (idx, rows, key, col) => {
  const i = idx.get(kk(key));
  if (i === undefined) return '';
  const v = rows[i][col];
  return rong(v) ? '' : v;
};

/**
 * Tính toàn bộ các cột xám. Trả về:
 *  tinh[bieuId] = mảng (song song với doc.bieu[bieuId]) các object {chữ cột: giá trị}
 *  B2  = các dòng của biểu B2_ThayDoi (mỗi mã công việc một dòng)
 *  DOI = các dòng của DOI_CHIEU_NV
 *  kiemTra = 13 chỉ tiêu của K_KiemTra · tienDo = dòng 3 của T_TienDo · tongHop = số liệu tổng quan
 */
export function tinhToan(docIn) {
  const doc = docIn?.bieu ? docIn : chuanHoaVTVL(docIn);
  const quyGio = laSo(doc.quyGio) ? doc.quyGio : QUY_GIO_PP2;
  const R = (id) => doc.bieu[id] || [];
  const A2 = R('A2'), B1 = R('B1'), B2CT = R('B2CT'), C1 = R('C1'), C3 = R('C3'), D1 = R('D1'), DU = R('DU'), D2 = R('D2');
  const DM = R('DM'), NGNV = R('NGNV');

  const idxA2 = chiMucDau(A2, 'A');
  const idxDM = chiMucDau(DM, 'A');
  const idxC1 = chiMucDau(C1, 'A');
  const vtvlCua = (maCV) => (rong(maCV) ? '' : traCuu(idxA2, A2, maCV, 'C'));

  // ── B1_KhoiLuong ──
  const tB1 = B1.map((r) => {
    if (rong(r.A)) return {};
    const B = vtvlCua(r.A);
    const M = rong(r.L) ? '' : traCuu(idxDM, DM, r.L, 'D');
    const N = rong(r.L) ? '' : traCuu(idxDM, DM, r.L, 'E');
    const O = rong(r.L) ? '' : traCuu(idxDM, DM, r.L, 'G');
    const chuanOK = laSo(N) && N > 0 && O === 'Đã xác nhận';
    const dungChuan = chuanOK && rong(r.S);
    let P = '';
    if (dungChuan) P = N;
    else if (laSo(r.D) && r.D > 0 && (r.J === 'Kiểm đếm, ước lượng thực tế' || (r.J === 'Có định mức' && !rong(r.I)))) P = r.D;
    let Q = '';
    if (P !== '') {
      if (dungChuan) Q = `Định mức danh mục: ${traCuu(idxDM, DM, r.L, 'F')}`;
      else if (r.J === 'Có định mức') Q = `Định mức: ${r.I}`;
      else Q = `Ước lượng thực tế${rong(r.I) ? '' : `; ${r.I}`}`;
    }
    const chiGioBoSung = rong(r.C) && laSo(r.E) && r.E > 0;
    let Rr;
    if (B === '') Rr = 'THIẾU MÃ VTVL';
    else if (rong(r.H)) Rr = 'THIẾU NGUỒN SẢN LƯỢNG/CÔNG VIỆC';
    else if (rong(r.K)) Rr = 'THIẾU KỲ';
    else if (chiGioBoSung && !rong(r.I)) Rr = 'ĐẠT';
    else if (rong(r.C)) Rr = 'THIẾU SẢN LƯỢNG';
    else if (rong(r.J)) Rr = 'CHƯA CHỌN TRẠNG THÁI';
    else if (chuanOK && !rong(r.S) && !String(r.S).trim().toUpperCase().startsWith('ĐÃ XÁC NHẬN:')) Rr = 'CHỜ XÁC NHẬN KHÁC CHUẨN';
    else if (rong(r.I) && !dungChuan) Rr = 'THIẾU NGUỒN THỜI GIAN';
    else if (P === '') Rr = 'THIẾU THỜI GIAN';
    else Rr = 'ĐẠT';
    let F = '';
    if (Rr === 'ĐẠT') F = chiGioBoSung ? 0 : so0(r.C) * so0(P) / 60;
    const G = laSo(F) ? F + so0(r.E) : '';
    return { B, F, G, M, N, O, P, Q, R: Rr };
  });

  // Gom B1 theo mã công việc (SUMIF … B1!A) và theo mã VTVL (SUMIFS … B1!B).
  const b1CTheoCV = congTheo(B1, (r) => (rong(r.A) ? null : kk(r.A)), (r) => r.C);
  const b1GTheoCV = congTheo(B1, (r) => (rong(r.A) ? null : kk(r.A)), (_r, i) => tB1[i].G);
  const b1DatTheoVT = new Map(); const b1GDatTheoVT = new Map(); const b1ChuaDatTheoVT = new Map();
  B1.forEach((r, i) => {
    const t = tB1[i]; if (rong(r.A) || rong(t.B)) return;
    const key = kk(t.B);
    if (t.R === 'ĐẠT') {
      b1DatTheoVT.set(key, (b1DatTheoVT.get(key) || 0) + 1);
      b1GTheoVTcong(b1GDatTheoVT, key, t.G);
    } else b1ChuaDatTheoVT.set(key, (b1ChuaDatTheoVT.get(key) || 0) + 1);
  });

  // ── B2_CT_TacDong ──
  const demCongDoan = demTheo(B2CT, (r) => (rong(r.A) ? null : `${kk(r.A)}\u0001${kk(r.D)}\u0001${kk(r.K)}`));
  const tB2CT = B2CT.map((r) => {
    if (rong(r.A)) return {};
    const B = vtvlCua(r.A);
    const H = (!laSo(r.E) || !laSo(r.F) || !laSo(r.G) || r.F < r.G) ? '' : r.E * (r.F - r.G) / 60;
    return { B, H };
  });
  const hTheoCV = congTheo(B2CT, (r) => (rong(r.A) ? null : kk(r.A)), (r, i) => tB2CT[i].H);
  B2CT.forEach((r, i) => {
    const t = tB2CT[i]; if (rong(r.A)) return;
    const { B, H } = t;
    let P;
    if (r.M === 'Ước lượng tham khảo') P = 'THAM KHẢO – KHÔNG TÍNH';
    else if (B === '' || rong(r.D) || rong(r.J) || rong(r.K) || rong(r.L) || r.M !== 'Đã kiểm chứng') P = 'CHƯA ĐỦ CĂN CỨ';
    else if (!DS.LOAI_TD.includes(r.C)) P = 'LOẠI TÁC ĐỘNG KHÔNG HỢP LỆ';
    else if (r.S !== 'Đã đối chiếu') P = 'CHỜ SOÁT TRÙNG';
    else if ((demCongDoan.get(`${kk(r.A)}\u0001${kk(r.D)}\u0001${kk(r.K)}`) || 0) > 1) P = 'TRÙNG CÔNG ĐOẠN';
    else if (H === '' && rong(r.I)) P = 'THIẾU GIỜ TÁC ĐỘNG';
    else if (H !== '' && (rong(r.E) || r.E <= 0)) P = 'THIẾU SẢN PHẨM ÁP DỤNG';
    else if (H !== '' && r.E > (b1CTheoCV.get(kk(r.A)) || 0)) P = 'SẢN PHẨM ÁP DỤNG VƯỢT B1';
    else if (!rong(r.F) && !rong(r.G) && r.F < r.G && (rong(r.I) || r.I <= 0)) P = 'THỜI GIAN TĂNG CHƯA GHI GIỜ MỚI';
    else if (r.L === 'Trước thay đổi, có điều chỉnh' && (hTheoCV.get(kk(r.A)) || 0) > (b1GTheoCV.get(kk(r.A)) || 0)) P = 'GIỜ GIẢM VƯỢT GIỜ B1';
    else P = 'ĐẠT';
    t.P = P;
    t.N = (P === 'ĐẠT' && r.L === 'Trước thay đổi, có điều chỉnh' && H !== '') ? H : 0;
    t.O = (P === 'ĐẠT' && !rong(r.I)) ? so0(r.I) : 0;
  });

  // ── B2_ThayDoi (tổng hợp theo mã công việc, thứ tự xuất hiện đầu tiên) ──
  const nhomB2 = new Map();
  B2CT.forEach((r, i) => {
    if (rong(r.A)) return;
    const key = kk(r.A);
    if (!nhomB2.has(key)) nhomB2.set(key, { A: r.A, dong: [] });
    nhomB2.get(key).dong.push(i);
  });
  const B2 = [...nhomB2.values()].map(({ A, dong }) => {
    let C = 0, tongN = 0, E = 0, dat = 0;
    for (const i of dong) {
      const r = B2CT[i], t = tB2CT[i];
      tongN += so0(t.N); E += so0(t.O);
      if (r.C === 'Số hóa' || r.C === 'Cải tiến quy trình') C += so0(t.N);
      if (t.P === 'ĐẠT') dat++;
    }
    const D = tongN - C;
    const F = E - C - D;
    const H = dong.length;
    const G = dat === 0 ? 'Chưa có dòng đạt' : dat === H ? 'Đã kiểm chứng' : 'Kiểm chứng một phần';
    const I = G === 'Đã kiểm chứng' ? 'ĐẠT' : G === 'Kiểm chứng một phần' ? 'CÓ DÒNG CHƯA ĐẠT – CHỈ TÍNH DÒNG ĐẠT' : 'CHƯA CÓ DÒNG ĐẠT – KHÔNG TÍNH TÁC ĐỘNG';
    return { A, B: vtvlCua(A), C, D, E, F, G, H, I, dong };
  });
  const b2FTheoVT = congTheo(B2, (r) => (rong(r.B) ? null : kk(r.B)), (r) => r.F);
  // COUNTIFS(B2_CT!B, mã, B2_CT!M, "<>Ước lượng tham khảo", B2_CT!P, "<>ĐẠT")
  const b2ChuaDatTheoVT = demTheo(B2CT.map((r, i) => ({ r, t: tB2CT[i] })),
    ({ r, t }) => (rong(r.A) || rong(t.B) || r.M === 'Ước lượng tham khảo' || t.P === 'ĐẠT' ? null : kk(t.B)));

  // ── C1_VTVL ──
  const tC1 = C1.map((r) => {
    if (rong(r.A)) return {};
    let E = '';
    if (r.J === 'Phổ biến (40 giờ/tuần)' || r.J === 'Đặc thù') {
      if (r.J === 'Đặc thù' || !rong(r.H)) E = (laSo(r.H) && r.H > 0 && !rong(r.F) && r.I === 'Đã kiểm chứng') ? r.H : '';
      else E = quyGio;
    }
    let K;
    if (rong(r.J)) K = 'CHƯA CHỌN CHẾ ĐỘ LÀM VIỆC';
    else if (r.J !== 'Phổ biến (40 giờ/tuần)' && r.J !== 'Đặc thù') K = 'CHẾ ĐỘ KHÔNG HỢP LỆ';
    else if (r.J === 'Đặc thù' && E === '') K = 'THIẾU GIỜ ĐẶC THÙ';
    else if (!rong(r.H) && E === '') K = 'GIỜ CHƯA XÁC NHẬN';
    else if (E === '') K = 'THIẾU MẪU SỐ';
    else K = 'ĐẠT';
    return { E, K };
  });
  const demC1 = demTheo(C1, (r) => (rong(r.A) ? null : kk(r.A)));
  const c1Cot = (ma, col) => { const i = idxC1.get(kk(ma)); return i === undefined ? '' : (tC1[i][col] ?? ''); };

  // ── C3_NhuCau ──
  const demC3 = demTheo(C3, (r) => (rong(r.A) ? null : kk(r.A)));
  const tC3 = C3.map((r) => {
    if (rong(r.A)) return {};
    const key = kk(r.A);
    const C = (b1DatTheoVT.get(key) || 0) === 0 ? '' : (b1GDatTheoVT.get(key) || 0);
    const D = b2FTheoVT.get(key) || 0;
    const E = C === '' ? '' : C + D;
    const F = c1Cot(r.A, 'E');
    const pp2 = hasPP(r.B, 'PP2');
    const G = (!pp2 || E === '' || F === '' || E < 0) ? '' : (F > 0 ? E / F : '');
    const N = b1ChuaDatTheoVT.get(key) || 0;
    let M;
    const soC1 = demC1.get(key) || 0;
    // Excel kiểm "phương pháp không hợp lệ" bằng COUNTIF(danh sách, B)=0 nên ô
    // trống cũng rơi vào nhánh này; ta báo đúng tình trạng hơn (xem KHAC_EXCEL).
    if (rong(r.B)) M = 'CHƯA CHỌN PHƯƠNG PHÁP';
    else if (!DS.PP.includes(r.B)) M = 'PHƯƠNG PHÁP KHÔNG HỢP LỆ';
    else if (soC1 > 1) M = 'TRÙNG MÃ VTVL Ở C1';
    else if (pp2 && c1Cot(r.A, 'K') !== 'ĐẠT') M = 'PP2: C1 CHƯA ĐỦ CĂN CỨ';
    else if (soC1 === 0) M = 'MÃ VTVL CHƯA CÓ Ở C1';
    else if ((demC3.get(key) || 0) > 1) M = 'TRÙNG MÃ VTVL';
    else if (pp2 && E !== '' && E < 0) M = 'GIỜ RÒNG ÂM – KIỂM TRA B2';
    else if (pp2 && G === '') M = 'PP2: THIẾU GIỜ B1 HOẶC QUỸ GIỜ';
    else if (pp2 && N > 0) M = 'PP2: CÒN DÒNG B1 CHƯA ĐẠT';
    else if (pp2 && (b2ChuaDatTheoVT.get(key) || 0) > 0) M = 'PP2: B2 CHƯA ĐỦ CĂN CỨ';
    else if (hasPP(r.B, 'PP1') && rong(r.H)) M = 'PP1: THIẾU SỐ NGƯỜI';
    else if (hasPP(r.B, 'PP3') && rong(r.I)) M = 'PP3: THIẾU SỐ NGƯỜI';
    else if (rong(r.K)) M = 'THIẾU NGUỒN/GIẢI TRÌNH';
    else if (rong(r.J)) M = 'CHƯA KẾT LUẬN NGƯỜI CẦN BỐ TRÍ';
    else if (r.L !== 'Đã kiểm chứng') M = 'CHỜ XÁC NHẬN NGHIỆP VỤ';
    else M = 'ĐẠT';
    return { C, D, E, F, G, M, N };
  });
  const idxC3 = chiMucDau(C3, 'A');
  const c3XacNhan = demTheo(C3.map((r, i) => ({ r, t: tC3[i] })),
    ({ r, t }) => (rong(r.A) || r.L !== 'Đã kiểm chứng' || t.M !== 'ĐẠT' ? null : kk(r.A)));
  const c3Cot = (ma, col, laTinh) => {
    const i = idxC3.get(kk(ma)); if (i === undefined) return '';
    const v = laTinh ? tC3[i][col] : C3[i][col];
    return rong(v) ? '' : v;
  };

  // ── D1_NhanLuc ──
  const demD1 = demTheo(D1, (r) => (rong(r.A) ? null : kk(r.A)));
  const tD1 = D1.map((r) => {
    const D = rong(r.B) ? '' : (laSo(r.K) ? r.K : c1Cot(r.B, 'E'));
    if (rong(r.A)) return { D };
    let J;
    if ((demD1.get(kk(r.A)) || 0) > 1) J = 'TRÙNG MÃ NGUỒN LỰC';
    else if (rong(r.G)) J = 'THIẾU NƠI TÍNH BIÊN CHẾ';
    else if (D === '' || rong(r.E) || rong(r.F) || rong(r.H) || r.I !== 'Đã kiểm chứng') J = 'Chưa đủ căn cứ';
    else if (so0(r.E) + so0(r.F) > D) J = 'Vượt quỹ giờ';
    else J = 'Đạt';
    return { D, J };
  });

  // ── DU_BAO_5_NAM ──
  const namHopLe = (b) => laSo(b) && Number.isInteger(b) && b >= NAM_TU && b <= NAM_DEN;
  const demDU = demTheo(DU, (r) => (rong(r.A) ? null : `${kk(r.A)}\u0001${r.B}`));
  const tDU = DU.map((r) => {
    if (rong(r.A)) return {};
    const G = (c3XacNhan.get(kk(r.A)) || 0) !== 1 ? '' : c3Cot(r.A, 'J', false);
    let I;
    if (!namHopLe(r.B)) I = 'NĂM KHÔNG HỢP LỆ';
    else if ((demDU.get(`${kk(r.A)}\u0001${r.B}`) || 0) > 1) I = 'TRÙNG MÃ VTVL – NĂM';
    else if (G === '') I = 'C3 CHƯA ĐƯỢC XÁC NHẬN';
    else if (!laSo(r.C)) I = 'THIẾU BIẾN ĐỘNG (NHẬP 0 NẾU KHÔNG ĐỔI)';
    else if (so0(G) + r.C < 0) I = 'NHU CẦU ÂM';
    else if (rong(r.D) || rong(r.E)) I = 'THIẾU GIẢI TRÌNH/NGUỒN';
    else if (r.F !== 'Đã kiểm chứng') I = 'CHƯA KIỂM CHỨNG DỰ BÁO';
    else I = 'ĐẠT';
    const H = I === 'ĐẠT' ? so0(G) + r.C : '';
    return { G, H, I };
  });
  const duDat = new Map(); // `${mã}|năm` → {dem, tong}
  DU.forEach((r, i) => {
    if (rong(r.A) || tDU[i].I !== 'ĐẠT') return;
    const key = `${kk(r.A)}\u0001${r.B}`;
    const o = duDat.get(key) || { dem: 0, tong: 0 };
    o.dem++; o.tong += so0(tDU[i].H); duDat.set(key, o);
  });

  // ── D2_PhuongAn ──
  const demD2 = demTheo(D2, (r) => (rong(r.A) ? null : `${kk(r.A)}\u0001${r.B}`));
  const tD2 = D2.map((r) => {
    if (rong(r.A)) return {};
    const du = duDat.get(`${kk(r.A)}\u0001${r.B}`);
    const C = du && du.dem === 1 ? du.tong : '';
    const K = c3Cot(r.A, 'G', true);
    const L = c3Cot(r.A, 'J', false);
    let M;
    if (rong(r.H)) M = 'THIẾU GIẢI TRÌNH';
    else if (C === '') M = 'CHƯA CÓ DỰ BÁO NĂM';
    else if (rong(r.D)) M = 'THIẾU NGƯỜI CÙNG ĐƠN VỊ TÍNH';
    else if (!laSo(C) || !laSo(r.D)) M = 'C/D PHẢI TÍNH THEO NGƯỜI';
    else if (C < 0 || r.D < 0) M = 'SỐ NGƯỜI ÂM';
    else if (L !== '' && C !== L) M = 'THAY ĐỔI SO VỚI NĂM CƠ SỞ – CÓ DỰ BÁO';
    else M = 'ĐỐI CHIẾU XONG';
    let J;
    if (!namHopLe(r.B)) J = 'NĂM KHÔNG HỢP LỆ';
    else if ((demD2.get(`${kk(r.A)}\u0001${r.B}`) || 0) > 1) J = 'TRÙNG MÃ VTVL – NĂM';
    else if (rong(r.I)) J = 'CHƯA CHỌN TRẠNG THÁI';
    else if (!DS.TT_D2.includes(r.I)) J = 'TRẠNG THÁI KHÔNG HỢP LỆ';
    else if ((c3XacNhan.get(kk(r.A)) || 0) !== 1) J = 'C3 CHƯA ĐƯỢC XÁC NHẬN';
    else if (!du || du.dem !== 1) J = 'CHƯA CÓ DỰ BÁO NĂM ĐÃ KIỂM CHỨNG';
    else if (C === '' || rong(r.D) || rong(r.G) || rong(r.H)) J = 'THIẾU PHƯƠNG ÁN';
    else if (['THIẾU GIẢI TRÌNH', 'THIẾU NGƯỜI CÙNG ĐƠN VỊ TÍNH', 'C/D PHẢI TÍNH THEO NGƯỜI', 'SỐ NGƯỜI ÂM'].includes(M)) J = 'CHƯA ĐỦ CĂN CỨ';
    else if (r.I === 'Đang xây dựng') J = 'ĐANG XÂY DỰNG';
    else if (r.I === 'Đã hoàn thành ở đơn vị') J = 'SẴN SÀNG THẨM ĐỊNH';
    else if (rong(r.N)) J = 'THIẾU VĂN BẢN THẨM ĐỊNH/QUYẾT ĐỊNH';
    else if (r.I === 'Đã thẩm định') J = 'ĐÃ THẨM ĐỊNH';
    else J = 'ĐÃ QUYẾT ĐỊNH';
    return { C, J, K, L, M };
  });

  // ── DOI_CHIEU_NV (đối chiếu NGUON_NHIEM_VU) ──
  const demNG = demTheo(NGNV, (r) => (rong(r.A) ? null : kk(r.A)));
  const DOI = NGNV.filter((r) => !rong(r.A)).map((r) => {
    let H;
    if (kk(r.A).startsWith('VD-')) H = 'KHÔNG TỔNG HỢP – VÍ DỤ';
    else if (rong(r.B)) H = 'THIẾU TÊN NHIỆM VỤ';
    else if (rong(r.C)) H = 'THIẾU CƠ QUAN';
    else if (rong(r.D)) H = 'THIẾU CĂN CỨ';
    else if (rong(r.I)) H = 'THIẾU KỲ';
    else if ((demNG.get(kk(r.A)) || 0) > 1) H = 'TRÙNG MÃ NGUỒN';
    else if (r.J !== 'Đã xác nhận') H = 'CHỜ XÁC NHẬN';
    else H = 'ĐỦ ĐIỀU KIỆN ĐỐI CHIẾU';
    return { _id: r._id, A: r.A, B: r.B, C: r.C, D: r.D, E: r.I, F: r.J, G: r.K, H };
  });

  // ── K_KiemTra (khu vực "kiểm tra nhanh" G3:H15) ──
  const demKhac = (rows, t, col, dat) => rows.reduce((s, r, i) => s + (!rong(r.A) && !dat.includes(t[i][col]) ? 1 : 0), 0);
  const kiemTra = [
    { ma: 'B1', chiTieu: 'B1: số dòng chưa ĐẠT', kq: demKhac(B1, tB1, 'R', ['ĐẠT']), xuLy: 'Xem cột R biểu B1, bổ sung số liệu/nguồn', luuY: 'Dòng chưa ĐẠT không được tính sang C3' },
    { ma: 'B2CT', chiTieu: 'B2_CT: số dòng tác động chưa ĐẠT', kq: demKhac(B2CT, tB2CT, 'P', ['ĐẠT']), xuLy: 'Xem cột P biểu B2_CT', luuY: 'Dòng ước lượng tham khảo không vào phép tính' },
    { ma: 'C1', chiTieu: 'C1: VTVL còn lỗi chế độ/quỹ giờ PP2', kq: demKhac(C1, tC1, 'K', ['ĐẠT']), xuLy: 'Xác nhận chế độ và quỹ giờ', luuY: 'Không tự nhập hệ số' },
    { ma: 'C3', chiTieu: 'C3: VTVL còn cảnh báo', kq: demKhac(C3, tC3, 'M', ['ĐẠT']), xuLy: 'Xem cột M biểu C3', luuY: 'Không coi thiếu dữ liệu = 0' },
    { ma: 'D1', chiTieu: 'D1: bản ghi nhân lực chưa đạt/vượt quỹ giờ', kq: demKhac(D1, tD1, 'J', ['Đạt']), xuLy: 'Xem cột J biểu D1', luuY: 'Bản ghi chưa xác nhận không dùng làm nguồn lực chính thức' },
    { ma: 'D2', chiTieu: 'D2: phương án chưa thẩm định/quyết định', kq: demKhac(D2, tD2, 'J', TT_DAT.D2), xuLy: 'Bổ sung căn cứ phương án', luuY: 'Không tự làm tròn thành biên chế' },
    { ma: 'C1', chiTieu: 'C1: chưa chọn chế độ làm việc', kq: tC1.filter((t) => t.K === 'CHƯA CHỌN CHẾ ĐỘ LÀM VIỆC').length, xuLy: 'Kiểm tra cột J và K của C1', luuY: 'Chỉ tính dòng có mã' },
    { ma: 'C1', chiTieu: 'C1: thiếu quỹ giờ/mẫu số', kq: tC1.filter((t) => t.K === 'THIẾU MẪU SỐ' || t.K === 'THIẾU GIỜ ĐẶC THÙ').length, xuLy: 'Bổ sung căn cứ, xác nhận quỹ giờ', luuY: 'Không đồng nhất giờ quy đổi với biên chế' },
    { ma: 'D2', chiTieu: 'D2: sai năm hoặc trùng mã–năm', kq: tD2.filter((t) => t.J === 'NĂM KHÔNG HỢP LỆ' || String(t.J || '').startsWith('TRÙNG MÃ VTVL')).length, xuLy: 'Kiểm tra cột B và trùng cặp A–B', luuY: 'Không quyết định nhiều lần một VTVL/năm' },
    { ma: 'DU', chiTieu: 'Dự báo năm: số dòng chưa đủ điều kiện', kq: demKhac(DU, tDU, 'I', ['ĐẠT']), xuLy: 'Kiểm tra cột I DU_BAO_5_NAM', luuY: 'Không chuyển số chưa kiểm chứng sang D2' },
  ];

  // ── T_TienDo (dòng 3) ──
  const soNV = R('A1').filter((r) => !rong(r.A)).length;
  const soVT = C1.filter((r) => !rong(r.A)).length;
  const soVTDu = C3.filter((r, i) => tC3[i].M === 'ĐẠT' && r.L === 'Đã kiểm chứng').length;
  const tienDo = {
    donVi: doc.donVi, ky: doc.ky, soNV, soVT, soVTDu,
    tyLe: soVT === 0 ? null : soVTDu / soVT,
    trangThai: soVT === 0 ? 'Chưa kê khai VTVL' : soVTDu === soVT ? 'Đủ căn cứ toàn bộ VTVL' : 'Đang hoàn thiện',
  };

  // ── số liệu tổng quan cho giao diện ──
  const tongHop = {
    gioB1: tB1.reduce((s, t) => s + (t.R === 'ĐẠT' ? so0(t.G) : 0), 0),
    gioTacDong: B2.reduce((s, r) => s + so0(r.F), 0),
    nguoiQuyDoi: tC3.reduce((s, t) => s + so0(t.G), 0),
    nguoiCanBoTri: C3.reduce((s, r, i) => s + (tC3[i].M === 'ĐẠT' ? so0(r.J) : 0), 0),
    quyGio,
  };

  return {
    tinh: { B1: tB1, B2CT: tB2CT, C1: tC1, C3: tC3, D1: tD1, DU: tDU, D2: tD2 },
    B2, DOI, kiemTra, tienDo, tongHop,
  };
}
function b1GTheoVTcong(m, key, g) { m.set(key, (m.get(key) || 0) + so0(g)); }

/** Giá trị một ô (cột nhập lấy từ dòng, cột tính lấy từ kết quả tinhToan). */
export function giaTriO(b, r, t, col) {
  if (col.kieu !== 'tinh') return r[col.k];
  return t ? (t[col.k] ?? '') : '';
}

/** Các dòng hiển thị của một biểu (biểu tự tính lấy thẳng từ kết quả). */
export function dongHienThi(doc, kq, id) {
  if (id === 'B2') return kq.B2.map((r, i) => ({ row: { _id: `b2-${i}` }, t: r }));
  if (id === 'DOI') return kq.DOI.map((r) => ({ row: { _id: r._id }, t: r }));
  const rows = doc.bieu[id] || [];
  const t = kq.tinh[id];
  return rows.map((r, i) => ({ row: r, t: t ? t[i] : null }));
}

// ─── ④ KIỂM TRA ─────────────────────────────────────────────────────────────
// muc: 'loi' (đỏ) · 'canh' (cảnh báo nghiệp vụ, vàng) · 'tt' (thông tin)
// chan: true = sai định dạng/sai danh sách/thiếu mã/trùng mã — khi nhập từ tệp
//       dòng như vậy bị bỏ qua (nếu chọn); mã liên kết chưa có thì KHÔNG chặn,
//       vì có thể biểu đích sẽ được bổ sung sau (vd nhập A2 trước C1).
const LOI_EXCEL = /^#(N\/A|VALUE!|REF!|DIV\/0!|NAME\?|NUM!|NULL!|SPILL!|CALC!|GETTING_DATA)$/i;

/** Kiểm tra MỘT ô (không cần ngữ cảnh các biểu khác). */
export function kiemTraO(col, v) {
  if (col.kieu === 'tinh' || rong(v)) return null;
  if (typeof v === 'string' && LOI_EXCEL.test(v.trim())) return { muc: 'loi', chan: true, chu: `Ô chứa lỗi công thức Excel (${v}) — nhập lại giá trị.` };
  if (col.kieu === 'so') {
    if (!laSo(v)) return { muc: 'loi', chan: true, chu: `"${v}" không phải là số.` };
    if (col.nguyen && !Number.isInteger(v)) return { muc: 'loi', chan: true, chu: 'Phải là số nguyên.' };
    if (col.duong && v <= 0) return { muc: 'loi', chan: true, chu: 'Phải lớn hơn 0.' };
    if (col.min === 0 && v < 0) return { muc: 'loi', chan: true, chu: 'Không được là số âm.' };
  }
  if (col.kieu === 'nam') {
    if (!laSo(v) || !Number.isInteger(v) || v < NAM_TU || v > NAM_DEN) return { muc: 'loi', chan: true, chu: `Năm phải là số nguyên từ ${NAM_TU} đến ${NAM_DEN}.` };
  }
  if (col.kieu === 'ngay' && !(typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && ngayHopLe(v))) {
    return { muc: 'loi', chan: true, chu: `"${v}" không phải ngày hợp lệ (ghi dạng ngày/tháng/năm).` };
  }
  if (col.kieu === 'ds' && !dsCua(col).includes(v)) {
    return { muc: 'loi', chan: true, chu: `"${v}" không có trong danh sách chọn (${dsCua(col).join(' · ')}).` };
  }
  if (col.kieu === 'ma' && kk(v).startsWith('VD-')) {
    return { muc: 'canh', chan: false, chu: 'Mã ví dụ (VD-…): chỉ để minh họa, không được dùng làm số liệu tổng hợp.' };
  }
  return null;
}

/**
 * Kiểm tra toàn bộ dữ liệu. Trả:
 *  ds         — mảng {bieu, id, dong (thứ tự 1..n), cot, muc, chan, chu}
 *  theoDong   — Map(_id → mảng vấn đề)
 *  demBieu    — {bieuId: {loi, canh, tt}}
 */
export function kiemTraDuLieu(doc, kq = tinhToan(doc)) {
  const ds = [];
  const add = (bieu, r, i, cot, v) => ds.push({ bieu, id: r._id, dong: i + 1, cot, ...v });
  const maCo = {};
  const tapMa = (id) => {
    if (!maCo[id]) maCo[id] = new Set((doc.bieu[id] || []).map((r) => kk(r.A)).filter(Boolean));
    return maCo[id];
  };

  for (const b of bieuNhap()) {
    const rows = doc.bieu[b.id] || [];
    const khoa = cotKhoa(b);
    const daGap = new Map();
    rows.forEach((r, i) => {
      if (!dongCoDuLieu(b, r)) { add(b.id, r, i, null, { muc: 'tt', chan: false, chu: 'Dòng trống — sẽ được bỏ qua khi tổng hợp.' }); return; }
      for (const col of cotNhap(b)) {
        const v = r[col.k];
        const loi = kiemTraO(col, v);
        if (loi) add(b.id, r, i, col.k, loi);
        if (!loi && col.ref && !rong(v) && !tapMa(col.ref).has(kk(v))) {
          const dich = BIEU_THEO_ID[col.ref];
          add(b.id, r, i, col.k, { muc: 'loi', chan: false, chu: `Mã "${v}" chưa có ở biểu ${dich.ma} (${dich.ten}) — thêm mã đó ở ${dich.ma} hoặc sửa lại.` });
        }
      }
      if (khoa && rong(r[khoa.k])) {
        add(b.id, r, i, khoa.k, { muc: 'loi', chan: true, chu: `Dòng có dữ liệu nhưng thiếu "${khoa.ten}" — Excel bỏ qua cả dòng khi thiếu cột này.` });
      }
      if (b.duyNhat && b.duyNhat.every((k) => !rong(r[k]))) {
        const key = b.duyNhat.map((k) => kk(r[k])).join('\u0001');
        if (daGap.has(key)) {
          const ten = b.duyNhat.map((k) => b.cot.find((x) => x.k === k).ten).join(' + ');
          add(b.id, r, i, b.duyNhat[0], { muc: 'loi', chan: true, chu: `Trùng ${ten} với dòng ${daGap.get(key) + 1}.` });
        } else daGap.set(key, i);
      }
    });

    // Cảnh báo nghiệp vụ = chính các cột cảnh báo của bộ biểu.
    const tt = cotTrangThai(b);
    const t = kq.tinh[b.id];
    if (tt && t) {
      rows.forEach((r, i) => {
        const val = t[i]?.[tt.k];
        if (rong(val) || !dongCoDuLieu(b, r)) return;
        if ((TT_DAT[b.id] || []).includes(val)) return;
        const tin = (TT_THONG_TIN[b.id] || []).includes(val);
        add(b.id, r, i, tt.k, { muc: tin ? 'tt' : 'canh', chan: false, chu: val });
      });
    }
    // D2 còn một cột kiểm soát thứ hai (M) — chỉ nêu những trạng thái làm J chưa đủ căn cứ.
    if (b.id === 'D2') {
      rows.forEach((r, i) => {
        const m = kq.tinh.D2[i]?.M;
        if (['THIẾU NGƯỜI CÙNG ĐƠN VỊ TÍNH', 'C/D PHẢI TÍNH THEO NGƯỜI', 'SỐ NGƯỜI ÂM'].includes(m)) add('D2', r, i, 'M', { muc: 'canh', chan: false, chu: m });
      });
    }
  }
  kq.DOI.forEach((r) => {
    if (TT_DAT.DOI.includes(r.H)) return;
    ds.push({ bieu: 'NGNV', id: r._id, dong: (doc.bieu.NGNV || []).findIndex((x) => x._id === r._id) + 1, cot: 'A', muc: TT_THONG_TIN.DOI.includes(r.H) ? 'tt' : 'canh', chan: false, chu: `Đối chiếu: ${r.H}` });
  });

  const theoDong = new Map();
  const demBieu = {};
  for (const x of ds) {
    if (!theoDong.has(x.id)) theoDong.set(x.id, []);
    theoDong.get(x.id).push(x);
    const d = demBieu[x.bieu] || (demBieu[x.bieu] = { loi: 0, canh: 0, tt: 0 });
    d[x.muc]++;
  }
  return { ds, theoDong, demBieu };
}

// ─── nhật ký (biểu S) ───────────────────────────────────────────────────────
/** Dòng đã "được xác nhận" — sửa dòng này thì phải lưu vết vào biểu S (HD: "Chỉ ghi khi sửa dữ liệu đã xác nhận"). */
export function dongDaXacNhan(bieuId, r, t) {
  if (!r) return false;
  const dat = TT_DAT[bieuId];
  const tt = cotTrangThai(BIEU_THEO_ID[bieuId] || { cot: [] });
  if (dat && tt && t && dat.includes(t[tt.k])) return true;
  return ['Đã kiểm chứng', 'Đã xác nhận', 'Đã thẩm định', 'Đã được quyết định'].some((x) => Object.values(r).includes(x));
}

export function dongNhatKy({ ky = '', bieu = '', ma = '', truong = '', cu = '', moi = '', nguon = '', nguoi = '', ngay, phienBan = '' }) {
  return { _id: newId(), A: ky, B: bieu, C: String(ma ?? ''), D: truong, E: rong(cu) ? '' : String(cu), F: rong(moi) ? '' : String(moi), G: nguon, H: nguoi, I: ngay || new Date().toISOString().slice(0, 10), J: phienBan };
}

// ─── ghi chú đối chiếu với tệp Excel ────────────────────────────────────────
/**
 * Những chỗ bộ biểu Excel tự mâu thuẫn mà phần mềm phải chọn một cách hiểu.
 * Hiển thị công khai ở tab Hướng dẫn để cơ quan chủ trì rà lại bản phát hành.
 */
export const KHAC_EXCEL = [
  {
    cho: 'C3 cột M — ô Phương pháp để trống',
    excel: 'Công thức kiểm COUNTIF(danh sách PP, B)=0 TRƯỚC nên ô trống báo "PHƯƠNG PHÁP KHÔNG HỢP LỆ"; nhánh "CHƯA CHỌN PHƯƠNG PHÁP" phía sau không bao giờ chạy tới.',
    phanMem: 'Báo "CHƯA CHỌN PHƯƠNG PHÁP" khi ô trống; mọi trường hợp khác giữ nguyên thứ tự kiểm tra của Excel.',
  },
  {
    cho: 'B1 cột I — Nguồn thời gian khi "Kiểm đếm, ước lượng thực tế"',
    excel: 'HD_DIEN_BIEU ghi "khuyến khích" ghi cách đo, nhưng công thức cột R vẫn báo "THIẾU NGUỒN THỜI GIAN" nếu I trống (trừ khi dùng phút chuẩn của danh mục).',
    phanMem: 'Theo CÔNG THỨC (chặt hơn): ghi cách đo vào cột I thì dòng mới ĐẠT.',
  },
  {
    cho: 'D1 cột F — Giờ việc khác',
    excel: 'Hướng dẫn ghi "Nhập khi có" nhưng cột J coi ô trống là "Chưa đủ căn cứ".',
    phanMem: 'Theo công thức: không có việc khác thì nhập 0.',
  },
  {
    cho: 'D2 cột C — chú thích ô tiêu đề',
    excel: 'Chú thích ô C2 ghi "Lấy từ C3 cột J", nhưng công thức thực tế lấy từ DU_BAO_5_NAM (dòng ĐẠT); số C3 chỉ hiện ở cột L.',
    phanMem: 'Theo công thức và HD_DIEN_BIEU (lấy từ dự báo đã kiểm chứng).',
  },
  {
    cho: 'Mã liên kết chưa có ở biểu đích',
    excel: 'Ô chọn mã (A2!B,C · B1!A,L · C3!A …) "bật báo lỗi" nên Excel không cho gõ mã chưa có; nhưng dán dữ liệu thì Excel KHÔNG kiểm tra.',
    phanMem: 'Kiểm tra cả khi dán và khi nhập từ tệp; báo lỗi nhưng vẫn cho lưu để bổ sung biểu đích sau (trình tự 8 bước đặt C1 sau A2).',
  },
];

// ─── hướng dẫn nhanh (trang THAO_TAC_NHANH) ─────────────────────────────────
export const TAM_BUOC = [
  { buoc: 1, bieu: 'A1', lam: 'Đối chiếu nhiệm vụ đã có, ghi chỉ phần mới/thay đổi', khong: 'Không nhập lại dữ liệu đã xác nhận' },
  { buoc: 2, bieu: 'A2', lam: 'Xác định công việc, sản phẩm, trách nhiệm và mã VTVL', khong: 'Không tách từng hồ sơ hoặc công đoạn thành nhiệm vụ' },
  { buoc: 3, bieu: 'B1', lam: 'Điền số SP (C), phút đo (D) nếu cần, giờ định kỳ (E), nguồn và trạng thái', khong: 'Giờ SP tính từ cột P; không sửa F, G, M–R' },
  { buoc: 4, bieu: 'B2CT', lam: 'Nhập tác động, nguồn, kỳ, căn cứ B1; đối chiếu trùng ở S', khong: 'Chỉ dòng P = ĐẠT mới được cộng giờ; dùng giờ sau số hóa thì không trừ lại' },
  { buoc: 5, bieu: 'C1', lam: 'Đối chiếu VTVL đã phê duyệt, yêu cầu năng lực (C2), giờ riêng nếu có', khong: 'C1 cột E tự tính 1.904 hoặc giờ riêng có xác nhận; không dùng lương/ngạch để tính' },
  { buoc: 6, bieu: 'C3', lam: 'Chọn PP1/PP2/PP3 hoặc kết hợp; nhập căn cứ K, kết quả người bố trí J', khong: 'PP2 dùng tổng giờ ròng ÷ giờ từ C1; không làm tròn thành biên chế' },
  { buoc: 7, bieu: 'D1', lam: 'Đối chiếu nguồn lực, phân công (D1), dự báo (DU_BAO) và phương án theo từng năm (D2)', khong: 'D2 cột C và D đều tính theo người; K là số quy đổi chỉ để tham khảo' },
  { buoc: 8, bieu: 'K', lam: 'Rà soát lỗi, xác nhận nguồn, ghi tiến độ và lưu thay đổi', khong: '0 lỗi khi chưa chạy kiểm tra không có nghĩa là đạt; không tự phê duyệt' },
];

export const SAU_NHOM = [
  ['I', 'Rất đơn giản, thao tác theo quy trình hoặc biểu mẫu ổn định'],
  ['II', 'Đơn giản, có bước kiểm tra hoặc đối chiếu thông tin'],
  ['III', 'Nghiệp vụ thông thường, có xử lý và kiểm chứng'],
  ['IV', 'Tương đối phức tạp, xử lý nhiều nguồn thông tin'],
  ['V', 'Phức tạp, chuyên môn sâu hoặc thẩm định nhiều chiều'],
  ['VI', 'Đặc biệt phức tạp, liên ngành hoặc yêu cầu chuyên môn cao (có thể chuyển PP3 nếu không đo được tin cậy)'],
];

/**
 * Bộ số liệu GIẢ ĐỊNH của trang KT_GIA_DINH — CHỈ để thử công thức, mọi mã đều
 * mang tiền tố VD- nên không bao giờ được tính là số liệu thật. Kỳ vọng:
 * giờ gốc 6000×30/60 = 3000 · giảm số hóa 500 · giảm thuê dịch vụ 100 · việc mới
 * 200 → giờ ròng 2600 → 2600 / 1904 ≈ 1,3655 người quy đổi.
 */
export function viDuKiemThu() {
  const r = (o) => ({ _id: newId(), ...o });
  const chung = { J: 'Biên bản đo thời gian (giả định)', K: '2026', L: 'Trước thay đổi, có điều chỉnh', M: 'Đã kiểm chứng', S: 'Đã đối chiếu', Q: '', R: '', I: '' };
  return chuanHoaVTVL({
    donVi: 'Đơn vị ví dụ (giả định)', ky: '2026',
    bieu: {
      A1: [r({ A: 'VD-NV-01', B: 'Nhiệm vụ ví dụ', C: 'Cơ quan ví dụ', D: 'Văn bản giả định', E: '2026', F: 'Tiếp tục thực hiện', G: 'KT_GIA_DINH' })],
      A2: [r({ A: 'VD-CV-01', B: 'VD-NV-01', C: 'VD-VTVL-01', D: 'Xử lý hồ sơ ví dụ', E: 'Hồ sơ', F: 'hồ sơ', G: 'Đúng hạn', H: 'KT_GIA_DINH' })],
      B1: [r({ A: 'VD-CV-01', C: 6000, D: 30, E: '', H: 'Sổ theo dõi (giả định)', I: 'Phiếu đo (giả định)', J: 'Kiểm đếm, ước lượng thực tế', K: '2026', L: '', S: '' })],
      B2CT: [
        r({ ...chung, A: 'VD-CV-01', C: 'Số hóa', D: 'Nhập liệu', E: 2000, F: 30, G: 15 }),
        r({ ...chung, A: 'VD-CV-01', C: 'Thuê dịch vụ/đặt hàng', D: 'Sao chụp hồ sơ', E: 400, F: 30, G: 15 }),
        r({ ...chung, A: 'VD-CV-01', C: 'Công việc mới phát sinh', D: 'Quản trị dữ liệu', E: '', F: '', G: '', I: 200 }),
      ],
      C1: [r({ A: 'VD-VTVL-01', B: 'Vị trí ví dụ', C: 'Công chức', D: 'Quyết định giả định', F: 'Mức chung 1.904 giờ', G: 'Tiếp tục sử dụng', H: '', I: '', J: 'Phổ biến (40 giờ/tuần)' })],
      C3: [r({ A: 'VD-VTVL-01', B: 'PP2', H: '', I: '', J: 1.5, K: 'Giờ ròng ÷ quỹ giờ (giả định)', L: 'Đã kiểm chứng' })],
    },
  });
}
