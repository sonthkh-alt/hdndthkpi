// ============================================================================
//  XUẤT TỆP cho phân hệ "Bộ biểu Vị trí việc làm".
//  Thư viện `xlsx` chỉ được tải khi bấm nút (lazy) để không làm nặng phân hệ.
//
//  Tệp xuất giữ ĐÚNG tên trang, dòng tiêu đề và vị trí cột của bộ biểu Excel
//  (A, B, C… như bản của Ban) → đọc lại được bằng chính chức năng "Nhập từ tệp",
//  và chép thẳng vùng nhập liệu sang tệp chính thức được. Cột tự tính được ghi
//  GIÁ TRỊ đã tính (không ghi công thức).
//  Các hàm `dung*` nhận module XLSX làm tham số để kiểm thử được bằng Node.
// ============================================================================
import { BIEU, BIEU_THEO_ID, bieuNhap, cotNhap, dsCua, dongHienThi, giaTriO, DS, tinhToan, QUY_GIO_PP2, chuanHoaVTVL } from './vtvl.js';
import { HD } from './vtvlHuongDan.js';
import { MUC_TEN } from './vtvlNhap.js';

const rongCot = (col) => ({ wch: col.dai ? 42 : col.kieu === 'ma' ? 16 : col.kieu === 'so' || col.kieu === 'nam' ? 12 : 22 });
const homNay = () => new Date().toISOString().slice(0, 10);
const tenTep = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^\w.-]+/g, '_');

function sheetBieu(XLSX, b, dong) {
  const aoa = [[b.tieuDe]];
  while (aoa.length < b.dongTieuDe - 1) aoa.push([]);
  aoa.push(b.cot.map((c) => c.ten));
  for (const d of dong) aoa.push(b.cot.map((c) => { const v = giaTriO(b, d.row, d.t, c); return v === undefined ? '' : v; }));
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = b.cot.map(rongCot);
  return ws;
}

/** Workbook chứa toàn bộ dữ liệu + các biểu tự tính + kiểm tra + tiến độ. */
export function dungSoDuLieu(XLSX, doc, kq = tinhToan(doc)) {
  const wb = XLSX.utils.book_new();
  for (const b of BIEU) XLSX.utils.book_append_sheet(wb, sheetBieu(XLSX, b, dongHienThi(doc, kq, b.id)), b.sheet);
  const k = XLSX.utils.aoa_to_sheet([
    ['Biểu K_ Kiểm tra (kết quả tính trên phần mềm)'],
    ['Chỉ tiêu kiểm tra', 'Kết quả', 'Yêu cầu xử lý', 'Lưu ý'],
    ...kq.kiemTra.map((x) => [x.chiTieu, x.kq, x.xuLy, x.luuY]),
    ['Quỹ giờ tham chiếu PP2 (giờ/người/năm)', kq.tongHop.quyGio, 'Sửa tại DM_THAM_SO (cơ quan chủ trì)', 'Áp dụng chế độ phổ biến, có ngoại lệ ở C1'],
  ]);
  k['!cols'] = [{ wch: 46 }, { wch: 10 }, { wch: 40 }, { wch: 46 }];
  XLSX.utils.book_append_sheet(wb, k, '13. K_KiemTra');
  const t = kq.tienDo;
  const ws = XLSX.utils.aoa_to_sheet([
    ['Biểu T_ Tiến độ'],
    ['Đơn vị', 'Kỳ', 'Số NV', 'Số VTVL', 'Số VTVL đủ căn cứ', 'Tỷ lệ đủ căn cứ', 'Trạng thái'],
    [t.donVi, t.ky, t.soNV, t.soVT, t.soVTDu, t.tyLe === null ? 'Không áp dụng' : t.tyLe, t.trangThai],
  ]);
  ws['!cols'] = [{ wch: 28 }, { wch: 12 }, { wch: 8 }, { wch: 9 }, { wch: 16 }, { wch: 14 }, { wch: 26 }];
  XLSX.utils.book_append_sheet(wb, ws, '14. T_TienDo');
  return wb;
}

/** Biểu mẫu nhập liệu trống + trang hướng dẫn từng cột + trang danh sách chọn. */
export function dungSoMau(XLSX) {
  const wb = XLSX.utils.book_new();
  const hd = [['HƯỚNG DẪN NHẬP LIỆU — dùng tệp này để nhập rồi tải lên phân hệ "Bộ biểu Vị trí việc làm"'],
    ['Quy ước: chỉ điền các cột NHẬP / CHỌN. Cột "Tự động" để trống — phần mềm tự tính lại theo đúng công thức của bộ biểu. Không đổi tên trang, không đổi dòng tiêu đề.'],
    [`Quỹ giờ quy đổi PP2 (chế độ phổ biến): ${QUY_GIO_PP2} giờ/người/năm = (261 − 11 − 12) × 8. Mức tham chiếu, không phải định mức biên chế.`],
    [],
    ['Trang', 'Cột', 'Tên trường', 'Loại thao tác', 'Giá trị được chọn', 'Điền nội dung gì', 'Cách ghi', 'Lưu ý/không được làm']];
  for (const b of bieuNhap()) {
    for (const c of b.cot) {
      const h = HD[b.id]?.cot?.[c.k] || {};
      const loai = c.kieu === 'tinh' ? 'Tự động – KHÔNG NHẬP' : c.kieu === 'ds' ? 'Chọn' : c.ref ? `Chọn mã có ở ${BIEU_THEO_ID[c.ref].ma}` : 'Nhập';
      hd.push([b.sheet, c.k, c.ten, loai, c.kieu === 'ds' ? dsCua(c).join(' · ') : c.kieu === 'nam' ? '2027 … 2031' : '', h.noiDung || '', h.cachGhi || '', h.luuY || '']);
    }
  }
  const wsHd = XLSX.utils.aoa_to_sheet(hd);
  wsHd['!cols'] = [{ wch: 20 }, { wch: 5 }, { wch: 30 }, { wch: 18 }, { wch: 34 }, { wch: 50 }, { wch: 50 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, wsHd, 'HUONG_DAN_NHAP');
  for (const b of bieuNhap()) XLSX.utils.book_append_sheet(wb, sheetBieu(XLSX, b, []), b.sheet);
  const ten = Object.keys(DS).filter((k) => k !== 'XAC_NHAN');
  const cao = Math.max(...ten.map((k) => DS[k].length));
  const aoa = [['DANH SÁCH LỰA CHỌN (sao từ DM_THAM_SO của bộ biểu)'], ten];
  for (let i = 0; i < cao; i++) aoa.push(ten.map((k) => DS[k][i] ?? ''));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), 'DANH_SACH_CHON');
  return wb;
}

/** Báo cáo lỗi khi nhập từ tệp — để chuyển cho đơn vị sửa đúng ô. */
export function dungSoBaoCaoLoi(XLSX, vanDe, { tenTepNguon = '' } = {}) {
  const aoa = [
    [`BÁO CÁO KIỂM TRA TỆP: ${tenTepNguon}`],
    [`Ngày kiểm tra: ${homNay()} · ${vanDe.filter((v) => v.muc === 'loi').length} lỗi · ${vanDe.filter((v) => v.muc === 'canh').length} cảnh báo`],
    [],
    ['STT', 'Trang (biểu)', 'Dòng trong tệp', 'Ô', 'Tên cột', 'Giá trị', 'Mức', 'Đã bỏ qua khi nhập', 'Nội dung', 'Cách xử lý (theo HD_DIEN_BIEU)'],
    ...vanDe.map((v, i) => [
      i + 1, v.trang, v.dongTep ?? (v.dongHienCo ? `(dữ liệu đang có, dòng ${v.dongHienCo})` : ''),
      v.cot && v.dongTep ? `${v.cot}${v.dongTep}` : v.cot, v.tenCot, v.giaTri ?? '',
      v.muc === 'loi' ? (v.chan ? 'Lỗi chặn' : 'Lỗi liên kết') : MUC_TEN[v.muc], v.boQua ? 'Có' : '', v.chu, v.cachXuLy,
    ]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 10 }, { wch: 7 }, { wch: 26 }, { wch: 22 }, { wch: 12 }, { wch: 10 }, { wch: 60 }, { wch: 60 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bao cao loi');
  return wb;
}

/**
 * Tệp của người dùng SAU KHI tự động sửa: chỉ các biểu có trong tệp, đúng tên trang
 * và vị trí cột của bộ biểu (đọc lại được), kèm trang NHAT_KY_SUA ghi từng ô đã đổi.
 * Cột tự tính được tính trên chính dữ liệu của tệp.
 */
export function dungSoTepDaSua(XLSX, phanTich, { tenTepNguon = '' } = {}) {
  const doc = chuanHoaVTVL({ bieu: Object.fromEntries(Object.entries(phanTich.bieu).map(([id, pt]) => [id, pt.dong.map((d) => d.row)])) });
  const kq = tinhToan(doc);
  const wb = XLSX.utils.book_new();
  for (const b of BIEU) if (phanTich.bieu[b.id]) XLSX.utils.book_append_sheet(wb, sheetBieu(XLSX, b, dongHienThi(doc, kq, b.id)), b.sheet);
  const ds = phanTich.daSua || [];
  const nk = XLSX.utils.aoa_to_sheet([
    [`NHẬT KÝ TỰ ĐỘNG SỬA LỖI — tệp gốc: ${tenTepNguon}`],
    [`Ngày sửa: ${homNay()} · ${ds.length} chỗ đã sửa. "Dòng trong tệp gốc" là số dòng ở tệp ban đầu (dòng lặp bị xóa làm các dòng sau dịch lên).`],
    [],
    ['STT', 'Trang', 'Dòng trong tệp gốc', 'Cột', 'Tên cột', 'Giá trị cũ', 'Giá trị mới', 'Lý do'],
    ...ds.map((x, i) => [i + 1, x.trang, x.dongTep, x.cot, x.tenCot, x.cu ?? '', x.loai === 'xoaDong' ? '(xóa dòng)' : x.moi, x.lyDo]),
  ]);
  nk['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 10 }, { wch: 5 }, { wch: 28 }, { wch: 26 }, { wch: 26 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, nk, 'NHAT_KY_SUA');
  return wb;
}

/** Danh sách vấn đề của dữ liệu đang có (tab Kiểm tra). */
export function dungSoVanDe(XLSX, ds, doc) {
  const aoa = [['DANH SÁCH LỖI, CẢNH BÁO CỦA DỮ LIỆU BỘ BIỂU VTVL'], [`Ngày xuất: ${homNay()}${doc.donVi ? ` · ${doc.donVi}` : ''}`], [],
    ['STT', 'Biểu', 'Dòng', 'Mã của dòng', 'Cột', 'Tên cột', 'Mức', 'Nội dung']];
  ds.forEach((v, i) => {
    const b = BIEU_THEO_ID[v.bieu];
    const r = (doc.bieu[v.bieu] || []).find((x) => x._id === v.id) || {};
    const khoa = cotNhap(b).find((c) => c.khoa);
    aoa.push([i + 1, b.sheet, v.dong, khoa ? r[khoa.k] ?? '' : '', v.cot || '', v.cot ? b.cot.find((c) => c.k === v.cot)?.ten : '', MUC_TEN[v.muc], v.chu]);
  });
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 6 }, { wch: 16 }, { wch: 5 }, { wch: 28 }, { wch: 10 }, { wch: 80 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Loi canh bao');
  return wb;
}

const napXLSX = () => import('xlsx');

export async function xuatDuLieu(doc, kq) {
  const XLSX = await napXLSX();
  XLSX.writeFile(dungSoDuLieu(XLSX, doc, kq), `Bo_bieu_VTVL_${tenTep(doc.donVi) || 'du_lieu'}_${homNay()}.xlsx`);
}
export async function xuatMau() {
  const XLSX = await napXLSX();
  XLSX.writeFile(dungSoMau(XLSX), 'Bieu_mau_nhap_VTVL.xlsx');
}
export async function xuatBaoCaoLoi(vanDe, tenTepNguon) {
  const XLSX = await napXLSX();
  XLSX.writeFile(dungSoBaoCaoLoi(XLSX, vanDe, { tenTepNguon }), `Bao_cao_loi_${tenTep(tenTepNguon).replace(/\.\w+$/, '') || 'tep'}_${homNay()}.xlsx`);
}
export async function xuatTepDaSua(phanTich, tenTepNguon) {
  const XLSX = await napXLSX();
  XLSX.writeFile(dungSoTepDaSua(XLSX, phanTich, { tenTepNguon }), `${tenTep(tenTepNguon).replace(/\.\w+$/, '') || 'tep'}_da_sua_${homNay()}.xlsx`);
}
export async function xuatVanDe(ds, doc) {
  const XLSX = await napXLSX();
  XLSX.writeFile(dungSoVanDe(XLSX, ds, doc), `Loi_canh_bao_VTVL_${homNay()}.xlsx`);
}

/** Bản sao lưu nguyên vẹn (JSON) — nạp lại được qua "Nhập từ tệp". */
export function xuatSaoLuu(doc) {
  const blob = new Blob([JSON.stringify({ loai: 'vtvl-sao-luu', luc: new Date().toISOString(), doc }, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Sao_luu_VTVL_${homNay()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
