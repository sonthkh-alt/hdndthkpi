// ============================================================================
//  TỦ SÁCH — MÔ HÌNH DỮ LIỆU & LOGIC THUẦN (chạy, kiểm thử được bằng Node)
//
//  Phân hệ giới thiệu các cuốn sách do cán bộ cơ quan biên soạn: trang bìa,
//  tóm tắt, mục lục, đối tượng bạn đọc, trích lời nói đầu, tiểu sử tác giả và
//  (nếu được phép) bản toàn văn để đọc, tải về.
//
//  ⚠️ CÔNG KHAI TOÀN VĂN LÀ QUYẾT ĐỊNH CỦA TÁC GIẢ, KHÔNG PHẢI MẶC ĐỊNH CỦA
//     PHẦN MỀM. Mỗi cuốn có cờ `choTai`: tắt thì phân hệ chỉ GIỚI THIỆU (bìa,
//     tóm tắt, mục lục) và ẩn hẳn nút Đọc/Tải. Trang web này công khai nên sách
//     đang chờ xuất bản hoặc có ràng buộc bản quyền với nhà xuất bản thì nên để
//     tắt. `tepToanVan` có thể để trống — phân hệ vẫn chạy bình thường.
// ============================================================================

const mang = (v) => (Array.isArray(v) ? v : []);
const chuoi = (v) => (v == null ? '' : String(v));
const so = (v) => { const n = Number(v); return isFinite(n) && n > 0 ? Math.round(n) : 0; };

// ---------------------------------------------------------------------------
//  DANH MỤC
// ---------------------------------------------------------------------------
export const TRANG_THAI = [
  { k: 'ban-thao', ten: 'Bản thảo', moTa: 'Đang hoàn thiện, chưa công bố rộng rãi.', tone: 'bg-slate-100 text-slate-600 border-slate-200' },
  { k: 'gioi-thieu', ten: 'Giới thiệu nội bộ', moTa: 'Đã hoàn thành bản thảo, giới thiệu trong cơ quan.', tone: 'bg-amber-50 text-amber-700 border-amber-200' },
  { k: 'da-xuatban', ten: 'Đã xuất bản', moTa: 'Đã được nhà xuất bản cấp phép, phát hành.', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];
export const trangThaiOf = (k) => TRANG_THAI.find((x) => x.k === k) || TRANG_THAI[0];

export const LOAI_MUC = [
  { k: 'mo-dau', ten: 'Mở đầu' },
  { k: 'chuong', ten: 'Chương' },
  { k: 'phu-luc', ten: 'Phụ lục' },
  { k: 'cuoi-sach', ten: 'Cuối sách' },
];
export const loaiMucOf = (k) => LOAI_MUC.find((x) => x.k === k) || LOAI_MUC[1];

export const THE_LOAI = ['Cẩm nang thực hành', 'Chuyên khảo', 'Giáo trình', 'Tài liệu bồi dưỡng', 'Sách tham khảo', 'Kỷ yếu'];

// ---------------------------------------------------------------------------
//  MỘT CUỐN SÁCH
// ---------------------------------------------------------------------------
export function newSach(v = {}) {
  return {
    id: '', ma: '', ten: '', phuDe: '',
    tacGia: '', hocVi: '', chucDanh: '',
    theLoai: THE_LOAI[0], namHoanThanh: '', nhaXB: '', isbn: '',
    soTrang: 0, soChuong: 0, soPhuLuc: 0,
    trangThai: 'ban-thao', noiBat: false,
    anhBia: '', tepToanVan: '', choTai: false,
    tomTat: '', diemNoiBat: [], doiTuong: [], mucLuc: [], tuKhoa: [],
    trichLoiNoiDau: '', tieuSuTacGia: '', lienKet: [],
    capNhat: '', ...v,
  };
}

export const chuanHoaSach = (s) => ({
  id: chuoi(s?.id), ma: chuoi(s?.ma), ten: chuoi(s?.ten), phuDe: chuoi(s?.phuDe),
  tacGia: chuoi(s?.tacGia), hocVi: chuoi(s?.hocVi), chucDanh: chuoi(s?.chucDanh),
  theLoai: chuoi(s?.theLoai), namHoanThanh: chuoi(s?.namHoanThanh), nhaXB: chuoi(s?.nhaXB), isbn: chuoi(s?.isbn),
  soTrang: so(s?.soTrang), soChuong: so(s?.soChuong), soPhuLuc: so(s?.soPhuLuc),
  trangThai: chuoi(s?.trangThai) || 'ban-thao', noiBat: !!s?.noiBat,
  anhBia: chuoi(s?.anhBia), tepToanVan: chuoi(s?.tepToanVan), choTai: !!s?.choTai,
  tomTat: chuoi(s?.tomTat),
  diemNoiBat: mang(s?.diemNoiBat).map(chuoi).filter(Boolean),
  doiTuong: mang(s?.doiTuong).map((d) => ({ ten: chuoi(d?.ten), moTa: chuoi(d?.moTa) })).filter((d) => d.ten),
  mucLuc: mang(s?.mucLuc).map((m) => ({
    loai: chuoi(m?.loai) || 'chuong', so: chuoi(m?.so), ten: chuoi(m?.ten),
    trang: so(m?.trang), moTa: chuoi(m?.moTa),
  })).filter((m) => m.ten),
  tuKhoa: mang(s?.tuKhoa).map(chuoi).filter(Boolean),
  trichLoiNoiDau: chuoi(s?.trichLoiNoiDau), tieuSuTacGia: chuoi(s?.tieuSuTacGia),
  lienKet: mang(s?.lienKet).map((l) => ({ ten: chuoi(l?.ten), url: chuoi(l?.url) })).filter((l) => l.ten && l.url),
  capNhat: chuoi(s?.capNhat),
});

export const EMPTY_TS = { sach: [], gioiThieu: '', capNhat: '' };

// ⚠️ DANH SÁCH TRẮNG: thêm trường mới vào cuốn sách thì PHẢI khai ở `chuanHoaSach`,
// nếu không trường đó bị gọt mất ngay lúc lưu (bài học "danh bạ lưu xong thì biến mất").
export const chuanHoaTS = (d) => ({
  sach: mang(d?.sach).map(chuanHoaSach),
  gioiThieu: chuoi(d?.gioiThieu),
  capNhat: chuoi(d?.capNhat),
});

// ---------------------------------------------------------------------------
//  TRUY VẤN, SẮP XẾP
// ---------------------------------------------------------------------------
/** Cuốn tiêu điểm: ưu tiên cờ `noiBat`, không có thì lấy cuốn đầu danh sách. */
export const sachNoiBat = (ds) => mang(ds).find((s) => s.noiBat) || mang(ds)[0] || null;

/** Sắp xếp: tiêu điểm trước, rồi tới năm hoàn thành mới nhất, rồi theo tên. */
export function sapXep(ds) {
  return [...mang(ds)].sort((a, b) =>
    (b.noiBat ? 1 : 0) - (a.noiBat ? 1 : 0)
    || chuoi(b.namHoanThanh).localeCompare(chuoi(a.namHoanThanh))
    || chuoi(a.ten).localeCompare(chuoi(b.ten), 'vi'));
}

/** Có bản toàn văn để đọc hay không — PHẢI có cả tệp lẫn sự cho phép của tác giả. */
export const docDuoc = (s) => !!(s && s.choTai && s.tepToanVan);

/** Gom mục lục theo loại để hiển thị thành từng khối (Chương · Phụ lục…). */
export function nhomMucLuc(mucLuc) {
  const ra = [];
  for (const m of mang(mucLuc)) {
    const nhom = ra.find((x) => x.loai === m.loai);
    if (nhom) nhom.muc.push(m);
    else ra.push({ loai: m.loai, ten: loaiMucOf(m.loai).ten, muc: [m] });
  }
  return ra;
}

/** Thống kê cho thẻ số liệu đầu phân hệ. */
export function thongKe(ds) {
  const d = mang(ds);
  return {
    tong: d.length,
    daXuatBan: d.filter((s) => s.trangThai === 'da-xuatban').length,
    docDuoc: d.filter(docDuoc).length,
    tongTrang: d.reduce((t, s) => t + so(s.soTrang), 0),
    tacGia: [...new Set(d.map((s) => s.tacGia).filter(Boolean))].length,
  };
}

// ---------------------------------------------------------------------------
//  TÌM KIẾM (không dấu) — cùng cách làm với các phân hệ khác
// ---------------------------------------------------------------------------
export function boDau(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
}

export function timSach(ds, tuKhoa) {
  const q = boDau(tuKhoa).trim();
  if (!q) return mang(ds);
  return mang(ds).filter((s) => boDau(
    [s.ten, s.phuDe, s.tacGia, s.theLoai, s.tomTat, (s.tuKhoa || []).join(' ')].join(' '),
  ).includes(q));
}

// ---------------------------------------------------------------------------
//  CHUYỂN QUA LẠI GIỮA Ô NHẬP NHIỀU DÒNG VÀ MẢNG (dùng cho biểu mẫu quản trị)
// ---------------------------------------------------------------------------
export const dongThanhMang = (s) => chuoi(s).split('\n').map((x) => x.trim()).filter(Boolean);
export const mangThanhDong = (a) => mang(a).join('\n');

/**
 * Mỗi dòng một mục lục, các cột ngăn bằng dấu "|":
 *   chuong | 1 | Tên chương | 7 | mô tả ngắn
 * Thiếu cột nào thì bỏ trống, loại mục sai thì tự quy về "chuong".
 */
export function dongThanhMucLuc(s) {
  return dongThanhMang(s).map((d) => {
    const c = d.split('|').map((x) => x.trim());
    const loai = LOAI_MUC.some((x) => x.k === c[0]) ? c[0] : 'chuong';
    return { loai, so: c[1] || '', ten: c[2] || '', trang: so(c[3]), moTa: c[4] || '' };
  }).filter((m) => m.ten);
}
export const mucLucThanhDong = (ml) =>
  mang(ml).map((m) => [m.loai, m.so, m.ten, m.trang || '', m.moTa].join(' | ')).join('\n');

/** Nhãn hiển thị của một mục lục: "Chương 1", "Phụ lục A"… */
export function nhanMuc(m) {
  if (!m) return '';
  const ten = loaiMucOf(m.loai).ten;
  return m.so ? `${ten} ${m.so}` : ten;
}

/** Đối tượng bạn đọc và liên kết cùng dạng "cột 1 | cột 2", mỗi dòng một mục. */
export function dongThanhCap(s, k1, k2) {
  return dongThanhMang(s).map((d) => {
    const c = d.split('|').map((x) => x.trim());
    return { [k1]: c[0] || '', [k2]: c.slice(1).join(' | ') || '' };
  }).filter((x) => x[k1]);
}
export const capThanhDong = (a, k1, k2) =>
  mang(a).map((x) => [x[k1], x[k2]].filter(Boolean).join(' | ')).join('\n');

/** Mã riêng cho cuốn sách mới thêm. */
export const newId = () => `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
