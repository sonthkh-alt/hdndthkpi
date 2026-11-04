// ============================================================================
//  BỘ BIỂU VỊ TRÍ VIỆC LÀM — BẢN KHAI CẤU TRÚC
//
//  Mọi khai báo ở đây đọc TỪ CHÍNH TỆP bộ biểu của Ban Tổ chức Trung ương
//  (bản UEB v2, tệp đầy đủ 30.000 dòng): tên trang, dòng tiêu đề, tên từng
//  cột theo đúng thứ tự A, B, C… và các danh sách chọn ở trang DM_THAM_SO.
//
//  ⚠️ Mỗi biểu chiếm dòng 3 → 30.002 của trang tương ứng; dòng 1 là tiêu đề,
//  dòng 2 là tên cột. Tệp KHÔNG lưu kết quả tính (ô công thức để trống, Excel
//  tính khi mở), nên phần mềm phải tự tính lại — xem `tinh.js`.
//
//  Quy ước của cột:
//    nhap  — người dùng nhập (ô trắng trong Excel)
//    tinh  — phần mềm tự tính, KHÔNG ghi vào tệp xuất ra (để Excel tự tính)
//    coDinh— lấy từ tệp, phần mềm KHÔNG cho sửa (A1, A2, C1, DM_SAN_PHAM)
// ============================================================================

/** Quỹ giờ quy đổi PP2, chế độ phổ biến: (261 − 11 − 12) × 8. DM_THAM_SO!B3. */
export const QUY_GIO_PP2 = 1904;

/** Dòng đầu và dòng cuối vùng dữ liệu của mọi biểu (DM_THAM_SO!B4). */
export const DONG_DAU = 3;
export const SUC_CHUA = 30000;

/** Các danh sách chọn — nguồn: trang DM_THAM_SO dòng 9 trở xuống. */
export const DS = {
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
  TT_A1: ['Tiếp tục thực hiện', 'Mới tiếp nhận', 'Đã chuyển giao', 'Không còn thực hiện'],
  NHOM: ['I', 'II', 'III', 'IV', 'V', 'VI', 'Không phân nhóm'],
  TT_DM: ['Đang kiểm chứng', 'Đã xác nhận', 'Không áp dụng'],
};

/** Bốn vùng của xã, phường, đặc khu — trang 12. CHIA_VUNG_CAP_XA. */
export const DS_VUNG = ['Vùng Đô thị đặc biệt', 'Vùng Đô thị', 'Vùng Đồng bằng', 'Vùng Miền núi'];

const c = (k, ten, kieu = 'chu', them = {}) => ({ k, ten, kieu, ...them });

// ─── Khai báo 12 biểu nghiệp vụ + các trang nguồn phần mềm có đọc ───────────
//  `vai`: coDinh = không sửa · nhap = nhập ở các bước · tinh = tự tính
export const BIEU = [
  {
    id: 'A1', trang: '1. A1_NhiemVu', ten: 'A1 — Nhiệm vụ', vai: 'coDinh',
    moTa: 'Danh mục nhiệm vụ của HĐND cấp xã. Cố định theo tệp của Ban.',
    cot: [
      c('A', 'Mã nhiệm vụ', 'ma', { khoa: true }), c('B', 'Tên nhiệm vụ', 'dai'), c('C', 'Cơ quan', 'dai'),
      c('D', 'Căn cứ', 'dai'), c('E', 'Kỳ'), c('F', 'Trạng thái', 'ds', { ds: 'TT_A1' }), c('G', 'Nguồn', 'dai'),
    ],
  },
  {
    id: 'A2', trang: '2. A2_CongViec', ten: 'A2 — Công việc', vai: 'coDinh',
    moTa: 'Mỗi công việc gắn đúng 01 mã VTVL. Cố định theo tệp của Ban.',
    cot: [
      c('A', 'Mã công việc', 'ma', { khoa: true }), c('B', 'Mã nhiệm vụ', 'ma', { ref: 'A1' }),
      c('C', 'Mã VTVL', 'ma', { ref: 'C1' }), c('D', 'Tên công việc', 'dai'), c('E', 'Sản phẩm', 'dai'),
      c('F', 'Đơn vị tính'), c('G', 'Chất lượng', 'dai'), c('H', 'Căn cứ (nguồn)', 'dai'),
    ],
  },
  {
    id: 'B1', trang: '3. B1_KhoiLuong', ten: 'B1 — Khối lượng', vai: 'nhap',
    moTa: 'Số sản phẩm trong kỳ và thời gian cho mỗi sản phẩm của từng công việc.',
    cot: [
      c('A', 'Mã công việc', 'ma', { khoa: true, ref: 'A2' }),
      c('B', 'Mã VTVL', 'ma', { tinh: true }),
      c('C', 'Số SP/năm', 'so', { nhap: true, buoc: 'B1' }),
      c('D', 'Trung bình phút/SP (đo thực tế)', 'so', { nhap: true, buoc: 'B1' }),
      c('E', 'Giờ bổ sung (công việc liên quan)', 'so', { nhap: true, buoc: 'B1' }),
      c('F', 'Giờ SP (tính)', 'so', { tinh: true }),
      c('G', 'Giờ tổng (tính)', 'so', { tinh: true }),
      c('H', 'Nguồn SL', 'dai'), c('I', 'Nguồn thời gian', 'dai'),
      c('J', 'Trạng thái căn cứ thời gian', 'ds', { ds: 'TT_B1' }), c('K', 'Kỳ'),
      c('L', 'Mã SP trong danh mục', 'ma', { ref: 'DM' }),
      c('M', 'Nhóm (tự tra)', 'chu', { tinh: true }),
      c('N', 'Phút/SP chuẩn (tự tra)', 'so', { tinh: true }),
      c('O', 'Xác nhận chuẩn (tự tra)', 'chu', { tinh: true }),
      c('P', 'Phút/SP dùng để tính', 'so', { tinh: true }),
      c('Q', 'Nguồn thời gian dùng tính', 'dai', { tinh: true }),
      c('R', 'Cảnh báo dữ liệu', 'chu', { tinh: true }),
      c('S', 'Giải trình khác chuẩn', 'dai'),
    ],
  },
  {
    id: 'B2CT', trang: '4. B2_CT_TacDong', ten: 'B2_CT — Tác động', vai: 'nhap',
    moTa: 'Từng công đoạn được số hóa, cải tiến, thuê dịch vụ… làm giảm hoặc tăng giờ.',
    cot: [
      c('A', 'Mã công việc', 'ma', { ref: 'A2' }),
      c('B', 'Mã VTVL', 'ma', { tinh: true }),
      c('C', 'Loại tác động', 'ds', { ds: 'LOAI_TD' }),
      c('D', 'Công đoạn', 'dai'),
      c('E', 'SP áp dụng', 'so', { nhap: true, buoc: 'B2' }),
      c('F', 'Phút trước', 'so', { nhap: true, buoc: 'B2' }),
      c('G', 'Phút sau', 'so', { nhap: true, buoc: 'B2' }),
      c('H', 'Giờ giảm trực tiếp', 'so', { tinh: true }),
      c('I', 'Giờ việc mới', 'so', { nhap: true, buoc: 'B2' }),
      c('J', 'Nguồn/bằng chứng', 'dai'), c('K', 'Kỳ'),
      c('L', 'Cơ sở B1', 'ds', { ds: 'CO_SO_B1' }),
      c('M', 'Trạng thái', 'ds', { ds: 'TT_B2CT' }),
      c('N', 'Giờ giảm hợp lệ', 'so', { tinh: true }),
      c('O', 'Giờ tăng hợp lệ', 'so', { tinh: true }),
      c('P', 'Kiểm tra', 'chu', { tinh: true }),
      c('Q', 'Kinh phí trước', 'dai'), c('R', 'Kinh phí sau', 'dai'),
      c('S', 'Đối chiếu trùng/phạm vi (cán bộ xác nhận)', 'ds', { ds: 'DOI_CHIEU' }),
    ],
  },
  {
    id: 'B2', trang: '5. B2_ThayDoi', ten: 'B2 — Thay đổi (tổng hợp)', vai: 'tinh',
    moTa: 'Gom tác động theo từng công việc. Toàn bộ do phần mềm tính.',
    cot: [
      c('A', 'Mã công việc', 'ma', { tinh: true }), c('B', 'Mã VTVL', 'ma', { tinh: true }),
      c('C', 'Giờ giảm số hóa', 'so', { tinh: true }), c('D', 'Giờ giảm thuê/TCh/XHH', 'so', { tinh: true }),
      c('E', 'Giờ việc mới', 'so', { tinh: true }), c('F', 'Giờ tác động ròng', 'so', { tinh: true }),
      c('G', 'Trạng thái', 'chu', { tinh: true }), c('H', 'Số dòng chi tiết', 'so', { tinh: true }),
      c('I', 'Cảnh báo', 'chu', { tinh: true }),
    ],
  },
  {
    id: 'C1', trang: '6. C1_VTVL', ten: 'C1 — Vị trí việc làm', vai: 'coDinh',
    moTa: 'Danh mục vị trí việc làm và quỹ giờ của từng vị trí. Cố định theo tệp.',
    cot: [
      c('A', 'Mã VTVL', 'ma', { khoa: true }), c('B', 'Tên VTVL', 'dai'),
      c('C', 'Loại nhân lực', 'ds', { ds: 'LOAI_NL' }), c('D', 'Quyết định', 'dai'),
      c('E', 'Giờ chuẩn PP2', 'so', { tinh: true }), c('F', 'Căn cứ xác định quỹ giờ', 'dai'),
      c('G', 'Trạng thái', 'ds', { ds: 'TT_C1' }),
      c('H', 'Giờ riêng được xác nhận', 'so'),
      c('I', 'Xác nhận giờ riêng', 'ds', { ds: 'KIEM_CHUNG' }),
      c('J', 'Chế độ làm việc', 'ds', { ds: 'CHE_DO' }),
      c('K', 'Kiểm tra quỹ giờ PP2', 'chu', { tinh: true }),
    ],
  },
  {
    id: 'C2', trang: '7. C2_NangLuc', ten: 'C2 — Năng lực', vai: 'coDinh',
    moTa: 'Trách nhiệm và khung năng lực của từng VTVL. Cố định theo tệp.',
    cot: [
      c('A', 'Mã VTVL', 'ma', { khoa: true, ref: 'C1' }), c('B', 'Trách nhiệm', 'dai'),
      c('C', 'Năng lực chung', 'dai'), c('D', 'Chuyên môn', 'dai'), c('E', 'Lãnh đạo', 'dai'),
      c('F', 'Căn cứ', 'dai'), c('G', 'Nguồn bản mô tả', 'dai'),
    ],
  },
  {
    id: 'C3', trang: '8. C3_NhuCau', ten: 'C3 — Nhu cầu nhân lực', vai: 'nhap',
    moTa: 'Số người của từng VTVL: máy tính theo giờ (PP2), người kết luận số cần bố trí.',
    cot: [
      c('A', 'Mã VTVL', 'ma', { khoa: true, ref: 'C1' }),
      c('B', 'Phương pháp', 'ds', { ds: 'PP' }),
      c('C', 'Giờ B1', 'so', { tinh: true }), c('D', 'Giờ tác động B2', 'so', { tinh: true }),
      c('E', 'Giờ ròng', 'so', { tinh: true }), c('F', 'Giờ PP2 (từ C1)', 'so', { tinh: true }),
      c('G', 'Người quy đổi PP2', 'so', { tinh: true }),
      c('H', 'Người PP1', 'so', { nhap: true, buoc: 'C3' }),
      c('I', 'Người PP3 (ước lượng, cần giải trình)', 'so', { nhap: true, buoc: 'C3' }),
      c('J', 'Người cần bố trí', 'so', { nhap: true, buoc: 'C3' }),
      c('K', 'Nguồn/giải trình', 'dai'),
      c('L', 'Trạng thái', 'ds', { ds: 'TT_C3' }),
      c('M', 'Cảnh báo', 'chu', { tinh: true }), c('N', 'Số dòng B1 chưa đạt', 'so', { tinh: true }),
    ],
  },
  {
    id: 'D1', trang: '9. D1_NhanLuc', ten: 'D1 — Nhân lực hiện có', vai: 'nhap',
    moTa: 'Từng người đang làm: bao nhiêu giờ cho VTVL này, bao nhiêu giờ cho việc khác.',
    cot: [
      c('A', 'Mã nguồn lực', 'ma', { khoa: true }),
      c('B', 'Mã VTVL', 'ma', { ref: 'C1' }),
      c('C', 'Loại nhân lực', 'ds', { ds: 'LOAI_NL' }),
      c('D', 'Giờ quy đổi/năm (tự lấy)', 'so', { tinh: true }),
      c('E', 'Giờ dành cho VTVL', 'so', { nhap: true, buoc: 'D1' }),
      c('F', 'Giờ việc khác', 'so', { nhap: true, buoc: 'D1' }),
      c('G', 'Nơi tính BC', 'dai'), c('H', 'Nguồn', 'dai'),
      c('I', 'Trạng thái', 'ds', { ds: 'KIEM_CHUNG' }),
      c('J', 'Cảnh báo', 'chu', { tinh: true }),
      c('K', 'Giờ riêng theo chế độ', 'so', { nhap: true, buoc: 'D1' }),
    ],
  },
  {
    id: 'DU', trang: 'DU_BAO_5_NAM', ten: 'Dự báo 5 năm', vai: 'nhap',
    moTa: 'Mỗi VTVL mỗi năm 2027–2031 tăng hay giảm bao nhiêu người so với năm cơ sở.',
    cot: [
      c('A', 'Mã VTVL', 'ma', { ref: 'C1' }), c('B', 'Năm', 'nam', { ds: 'NAM' }),
      c('C', 'Biến động so C3 (+/− người)', 'so', { nhap: true, buoc: 'DU' }),
      c('D', 'Nội dung thay đổi / xác nhận không đổi', 'dai'),
      c('E', 'Căn cứ nguồn và thời điểm', 'dai'),
      c('F', 'Trạng thái xác nhận', 'ds', { ds: 'KIEM_CHUNG' }),
      c('G', 'Người C3 năm cơ sở', 'so', { tinh: true }),
      c('H', 'Người cần bố trí trong năm', 'so', { tinh: true }),
      c('I', 'Kiểm tra, đối chiếu', 'chu', { tinh: true }),
      c('J', 'Ghi chú đầu mối', 'dai'),
    ],
  },
  {
    id: 'D2', trang: '10. D2_PhuongAn', ten: 'D2 — Phương án 2027–2031', vai: 'nhap',
    moTa: 'Mỗi VTVL mỗi năm: bố trí được bao nhiêu người, biên chế giao, đề nghị điều chỉnh.',
    cot: [
      c('A', 'Mã VTVL', 'ma', { ref: 'C1' }), c('B', 'Năm', 'nam', { ds: 'NAM' }),
      c('C', 'Số người cần bố trí trong năm phương án', 'so', { tinh: true }),
      c('D', 'Số người có thể bố trí (cùng đơn vị tính)', 'so', { nhap: true, buoc: 'D2' }),
      c('E', 'Biên chế được giao theo đúng cấp', 'so', { nhap: true, buoc: 'D2' }),
      c('F', 'Điều chuyển/bố trí lại', 'dai'),
      c('G', 'Đề nghị điều chỉnh', 'so', { nhap: true, buoc: 'D2' }),
      c('H', 'Nguồn/giải trình', 'dai'),
      c('I', 'Trạng thái', 'ds', { ds: 'TT_D2' }),
      c('J', 'Cảnh báo', 'chu', { tinh: true }),
      c('K', 'PP2: người quy đổi (tham khảo)', 'so', { tinh: true }),
      c('L', 'Người cần bố trí C3 năm cơ sở (tham khảo)', 'so', { tinh: true }),
      c('M', 'Kiểm soát cơ sở đối chiếu', 'chu', { tinh: true }),
      c('N', 'Văn bản thẩm định/quyết định (số, ngày, cơ quan)', 'dai'),
    ],
  },
  {
    id: 'DM', trang: '11. DM_SAN_PHAM', ten: 'Danh mục sản phẩm', vai: 'coDinh',
    moTa: 'Định mức phút cho mỗi sản phẩm chuẩn. CHỈ quản trị được sửa.',
    chiAdmin: true,
    cot: [
      c('A', 'Mã sản phẩm chuẩn', 'ma', { khoa: true }), c('B', 'Tên/loại sản phẩm', 'dai'),
      c('C', 'Khối/ngành/lĩnh vực', 'dai'), c('D', 'Nhóm I–VI (nếu áp dụng)', 'ds', { ds: 'NHOM' }),
      c('E', 'Phút/SP chuẩn', 'so', { nhap: true, buoc: 'DM' }),
      c('F', 'Văn bản/nguồn xác nhận', 'dai'),
      c('G', 'Trạng thái', 'ds', { ds: 'TT_DM' }),
      c('H', 'Cơ quan xác nhận', 'dai'), c('I', 'Ngày hiệu lực'), c('J', 'Phạm vi áp dụng/ghi chú', 'dai'),
    ],
  },
  {
    id: 'NGNL', trang: 'NGUON_NHAN_LUC', ten: 'Nguồn nhân lực', vai: 'coDinh',
    moTa: 'Biên chế được giao và số người có mặt theo cơ quan.',
    cot: [
      c('A', 'Cơ quan', 'dai'), c('B', 'Đơn vị/cấp giao', 'dai'),
      c('C', 'Loại nhân lực', 'ds', { ds: 'LOAI_NL' }),
      c('D', 'Biên chế giao', 'so'), c('E', 'Số có mặt', 'so'),
      c('F', 'Quyết định giao', 'dai'), c('G', 'Nguồn CV', 'dai'), c('H', 'Tệp/trang/ô'),
      c('I', 'Kỳ chốt'), c('J', 'Trạng thái xác nhận', 'ds', { ds: 'KIEM_CHUNG' }),
      c('K', 'Ghi chú phạm vi', 'dai'),
    ],
  },
];

export const BIEU_THEO_ID = Object.fromEntries(BIEU.map((b) => [b.id, b]));
export const BIEU_THEO_TRANG = Object.fromEntries(BIEU.map((b) => [b.trang, b]));

/** Các cột người dùng nhập của một biểu. */
export const cotNhap = (id) => (BIEU_THEO_ID[id]?.cot || []).filter((x) => x.nhap);
/** Các cột phần mềm tự tính (không ghi vào tệp xuất ra). */
export const cotTinh = (id) => (BIEU_THEO_ID[id]?.cot || []).filter((x) => x.tinh);
/** Tên cột theo thứ tự, để dựng dòng tiêu đề khi xuất tệp. */
export const tenCot = (id) => (BIEU_THEO_ID[id]?.cot || []).map((x) => x.ten);
/** Chỉ số cột trong Excel: A→0, B→1… */
export const soCot = (k) => k.split('').reduce((t, ch) => t * 26 + (ch.charCodeAt(0) - 64), 0) - 1;
export const chuCot = (i) => {
  let s = ''; let n = i + 1;
  while (n > 0) { const d = (n - 1) % 26; s = String.fromCharCode(65 + d) + s; n = Math.floor((n - 1) / 26); }
  return s;
};

/** Bộ biểu rỗng. */
export const boBieuTrong = () => ({
  donVi: '', ky: '', vung: '', tenTep: '',
  bieu: Object.fromEntries(BIEU.map((b) => [b.id, []])),
});
