// ============================================================================
//  BIỂU QUYẾT ONLINE — MODEL + LOGIC THUẦN (không import React/Supabase nên
//  chạy và kiểm thử được bằng Node).
//
//  Đối tượng: 82 đại biểu HĐND tỉnh Thanh Hóa. Mỗi nội dung trình ra một
//  "phiên biểu quyết"; mỗi đại biểu bỏ đúng MỘT lá phiếu: Đồng ý · Không đồng ý
//  · Có ý kiến khác. Kết quả tính trên TỔNG SỐ ĐẠI BIỂU (82), không phải trên
//  số người đã bấm — đúng cách tính của cơ quan dân cử.
//
//  Điều kiện thông qua (Luật Tổ chức chính quyền địa phương số 72/2025/QH15):
//  nghị quyết được thông qua khi có QUÁ NỬA tổng số đại biểu tán thành; một số
//  nội dung đặc biệt đòi ÍT NHẤT HAI PHẦN BA tổng số đại biểu.
//
//  ⚠️ Danh sách đại biểu ở đây là danh sách ĐÁNH SỐ (Đại biểu số 01…82), KHÔNG
//     gắn họ tên người thật — bản demo không được gán lá phiếu cho cá nhân cụ thể.
// ============================================================================

export const TONG_DAI_BIEU = 82;
export const SO_TO = 10; // chia tổ đại biểu cho dễ theo dõi trên lưới kết quả

export const LUA_CHON = [
  { id: 'dongY', nhan: 'Đồng ý', mau: 'emerald' },
  { id: 'khongDongY', nhan: 'Không đồng ý', mau: 'rose' },
  { id: 'yKienKhac', nhan: 'Có ý kiến khác', mau: 'amber' },
];
export const LUA_CHON_IDS = LUA_CHON.map((c) => c.id);
export const nhanLuaChon = (id) => (LUA_CHON.find((c) => c.id === id) || {}).nhan || 'Chưa biểu quyết';
export const hopLe = (id) => LUA_CHON_IDS.includes(id);

/** Mã đại biểu: DB01 … DB82. */
export const maDaiBieu = (so) => `DB${String(so).padStart(2, '0')}`;

/** Danh sách 82 đại biểu (đánh số, chia tổ). */
export function danhSachDaiBieu(tong = TONG_DAI_BIEU) {
  return Array.from({ length: tong }, (_, i) => {
    const so = i + 1;
    return { ma: maDaiBieu(so), so, ten: `Đại biểu số ${String(so).padStart(2, '0')}`, to: (i % SO_TO) + 1 };
  });
}

// ---- Kỳ họp ----------------------------------------------------------------
//  Mỗi nội dung biểu quyết TRÌNH TẠI MỘT KỲ HỌP; giao diện chọn "Kỳ họp thứ x"
//  để xem và biểu quyết các nghị quyết của kỳ đó. Dữ liệu cũ chưa ghi kỳ họp
//  được gán về kỳ mặc định khi đọc (bieuQuyetStore.normalize).
//  HĐND tỉnh nhiệm kỳ 2026 - 2031 hiện đã bước sang KỲ HỌP THỨ 5.
export const KY_HOP_MAC_DINH = 5;
export const tenKyHop = (so) => `Kỳ họp thứ ${so}`;
export const kyHopCua = (p) => Number(p?.kyHop) || KY_HOP_MAC_DINH;

/** Danh sách kỳ họp có nội dung, kỳ mới nhất đứng trước. */
export function danhSachKyHop(list = []) {
  return [...new Set(list.map(kyHopCua))].sort((a, b) => b - a);
}

// ---- Phiên biểu quyết ------------------------------------------------------
export const TY_LE = {
  quanua: { id: 'quanua', nhan: 'Quá nửa tổng số đại biểu', tinh: (tong) => Math.floor(tong / 2) + 1 },
  haiphanba: { id: 'haiphanba', nhan: 'Ít nhất hai phần ba tổng số đại biểu', tinh: (tong) => Math.ceil((tong * 2) / 3) },
};
export const nguongThongQua = (tyLe = 'quanua', tong = TONG_DAI_BIEU) => (TY_LE[tyLe] || TY_LE.quanua).tinh(tong);

let seq = 1;
export const newPhienId = () => `bq${Date.now().toString(36)}${(seq++).toString(36)}`;

export function newPhien({ tieuDe = '', moTa = '', tyLe = 'quanua', tong = TONG_DAI_BIEU, kyHop = KY_HOP_MAC_DINH } = {}) {
  return {
    id: newPhienId(),
    tieuDe: String(tieuDe).trim(),
    moTa: String(moTa).trim(),
    tyLe: TY_LE[tyLe] ? tyLe : 'quanua',
    tong,
    kyHop: Number(kyHop) || KY_HOP_MAC_DINH,
    trangThai: 'mo', // 'mo' | 'dong'
    taoLuc: new Date().toISOString(),
    phieu: {}, // { DB01: { chon, moPhong, luc } }
  };
}

// ---- Bộ sinh số có hạt giống (để mọi máy thấy CÙNG một bộ phiếu mô phỏng) ---
function hatGiong(chuoi) {
  let h = 2166136261;
  for (let i = 0; i < chuoi.length; i += 1) {
    h ^= chuoi.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function boSinhSo(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sinh bộ phiếu MÔ PHỎNG cho các đại biểu còn lại (trừ những mã đã có phiếu thật
 * và mã dành cho người đang xem). Cùng một phiên thì mọi máy sinh ra kết quả
 * giống nhau vì dùng hạt giống lấy từ id phiên.
 */
export function sinhPhieuMoPhong(phien, { bo = [], tanThanh = 0.86 } = {}) {
  const rnd = boSinhSo(hatGiong(phien.id || 'bq'));
  const bochon = new Set(bo);
  const phieu = { ...(phien.phieu || {}) };
  for (const db of danhSachDaiBieu(phien.tong || TONG_DAI_BIEU)) {
    if (bochon.has(db.ma)) continue;
    if (phieu[db.ma] && phieu[db.ma].moPhong === false) continue; // giữ nguyên phiếu thật
    const r = rnd();
    const chon = r < tanThanh ? 'dongY' : r < tanThanh + (1 - tanThanh) * 0.55 ? 'yKienKhac' : 'khongDongY';
    phieu[db.ma] = { chon, moPhong: true, luc: phien.taoLuc || '' };
  }
  return { ...phien, phieu };
}

/** Ghi một lá phiếu THẬT (đè lên phiếu mô phỏng của cùng mã đại biểu). */
export function ghiPhieu(phien, ma, chon, luc = new Date().toISOString()) {
  if (!hopLe(chon)) return phien;
  return { ...phien, phieu: { ...(phien.phieu || {}), [ma]: { chon, moPhong: false, luc } } };
}

/**
 * Bỏ CÙNG MỘT lá phiếu cho TẤT CẢ nội dung ĐANG MỞ của một kỳ họp
 * (nút "… với tất cả nghị quyết"). Nội dung đã khóa và kỳ họp khác giữ nguyên;
 * sau đó vẫn mở từng nội dung để đổi lá phiếu riêng được.
 */
export function ghiPhieuCaKyHop(list = [], kyHop, ma, chon, luc = new Date().toISOString()) {
  if (!hopLe(chon)) return { list, soNoiDung: 0 };
  let soNoiDung = 0;
  const moi = list.map((p) => {
    if (kyHopCua(p) !== Number(kyHop) || p.trangThai !== 'mo') return p;
    soNoiDung += 1;
    return ghiPhieu(p, ma, chon, luc);
  });
  return { list: moi, soNoiDung };
}

/** Kết quả kiểm phiếu của một phiên. */
export function ketQua(phien) {
  const tong = phien?.tong || TONG_DAI_BIEU;
  const phieu = phien?.phieu || {};
  const dem = { dongY: 0, khongDongY: 0, yKienKhac: 0 };
  let thuc = 0; // số lá phiếu THẬT (người bấm), phần còn lại là mô phỏng
  for (const db of danhSachDaiBieu(tong)) {
    const p = phieu[db.ma];
    if (!p || !hopLe(p.chon)) continue;
    dem[p.chon] += 1;
    if (p.moPhong === false) thuc += 1;
  }
  const daBieuQuyet = dem.dongY + dem.khongDongY + dem.yKienKhac;
  const nguong = nguongThongQua(phien?.tyLe, tong);
  const pct = (n) => (tong ? Math.round((n / tong) * 1000) / 10 : 0);
  return {
    tong,
    ...dem,
    daBieuQuyet,
    chuaBieuQuyet: tong - daBieuQuyet,
    phieuThuc: thuc,
    tyLeDongY: pct(dem.dongY),
    tyLeKhongDongY: pct(dem.khongDongY),
    tyLeYKienKhac: pct(dem.yKienKhac),
    tyLeChua: pct(tong - daBieuQuyet),
    nguong,
    nhanTyLe: (TY_LE[phien?.tyLe] || TY_LE.quanua).nhan,
    thongQua: dem.dongY >= nguong,
    conThieu: Math.max(0, nguong - dem.dongY),
  };
}

/** Câu kết luận hiển thị dưới bảng kết quả. */
export function ketLuan(kq, trangThai = 'mo') {
  const dieuKien = `${kq.nhanTyLe.toLowerCase()} (${kq.nguong}/${kq.tong} đại biểu)`;
  if (kq.thongQua) {
    return {
      dat: true,
      chinh: 'Đã đủ điều kiện thông qua',
      phu: `Có ${kq.dongY}/${kq.tong} đại biểu tán thành (${kq.tyLeDongY}%), đạt yêu cầu ${dieuKien}.`,
    };
  }
  if (trangThai === 'dong') {
    return {
      dat: false,
      chinh: 'Không được thông qua',
      phu: `Chỉ có ${kq.dongY}/${kq.tong} đại biểu tán thành (${kq.tyLeDongY}%), chưa đạt yêu cầu ${dieuKien}.`,
    };
  }
  return {
    dat: false,
    chinh: 'Chưa đủ điều kiện thông qua',
    phu: `Hiện có ${kq.dongY}/${kq.tong} đại biểu tán thành, còn thiếu ${kq.conThieu} phiếu so với yêu cầu ${dieuKien}.`,
  };
}

/** Nội dung biên bản kết quả biểu quyết (dùng cho bản Word). */
export function vanBanKetQua(phien, kq) {
  const kl = ketLuan(kq, phien.trangThai);
  const ngay = phien.taoLuc ? new Date(phien.taoLuc) : new Date();
  return [
    `Nội dung biểu quyết: ${phien.tieuDe || '(chưa đặt tên)'}`,
    phien.moTa ? `Tóm tắt: ${phien.moTa}` : '',
    `Thời gian: ngày ${ngay.getDate()} tháng ${ngay.getMonth() + 1} năm ${ngay.getFullYear()}`,
    `Hình thức: biểu quyết trực tuyến, công khai.`,
    `Tổng số đại biểu HĐND tỉnh: ${kq.tong} đại biểu.`,
    '',
    `1. Số đại biểu tán thành (Đồng ý): ${kq.dongY}/${kq.tong} (${kq.tyLeDongY}%).`,
    `2. Số đại biểu không tán thành (Không đồng ý): ${kq.khongDongY}/${kq.tong} (${kq.tyLeKhongDongY}%).`,
    `3. Số đại biểu có ý kiến khác: ${kq.yKienKhac}/${kq.tong} (${kq.tyLeYKienKhac}%).`,
    `4. Số đại biểu chưa biểu quyết: ${kq.chuaBieuQuyet}/${kq.tong} (${kq.tyLeChua}%).`,
    '',
    `Điều kiện thông qua: ${kq.nhanTyLe} — tối thiểu ${kq.nguong}/${kq.tong} phiếu tán thành.`,
    `Kết luận: ${kl.chinh}. ${kl.phu}`,
  ].filter((d) => d !== '').join('\n');
}

/**
 * Nội dung mẫu để bản demo có sẵn việc mà xem: KỲ HỌP THỨ 5 đang biểu quyết,
 * các kỳ họp thứ 3 và 4 đã xong (mở ra chỉ xem kết quả).
 */
export const PHIEN_MAU = [
  // ---- Kỳ họp thứ 5 (đang diễn ra) ----------------------------------------
  {
    kyHop: 5,
    tieuDe: 'Nghị quyết về nhiệm vụ trọng tâm phát triển kinh tế - xã hội 6 tháng cuối năm 2026',
    moTa: 'Tờ trình của UBND tỉnh; Báo cáo thẩm tra của Ban Kinh tế - Ngân sách HĐND tỉnh.',
    tyLe: 'quanua',
  },
  {
    kyHop: 5,
    tieuDe: 'Nghị quyết về chủ trương đầu tư dự án đường giao thông kết nối các huyện miền núi phía Tây của tỉnh',
    moTa: 'Tờ trình của UBND tỉnh; Báo cáo thẩm tra của Ban Kinh tế - Ngân sách HĐND tỉnh.',
    tyLe: 'quanua',
  },
  {
    kyHop: 5,
    tieuDe: 'Nghị quyết về Chương trình giám sát của HĐND tỉnh năm 2027',
    moTa: 'Tờ trình của Thường trực HĐND tỉnh.',
    tyLe: 'quanua',
  },
  {
    kyHop: 5,
    tieuDe: 'Nghị quyết về chính sách hỗ trợ phát triển nông nghiệp ứng dụng công nghệ cao giai đoạn 2027 - 2030',
    moTa: 'Tờ trình của UBND tỉnh; Báo cáo thẩm tra của Ban Kinh tế - Ngân sách HĐND tỉnh.',
    tyLe: 'quanua',
  },
  // ---- Kỳ họp thứ 4 (đã biểu quyết xong) -----------------------------------
  {
    kyHop: 4,
    tieuDe: 'Nghị quyết về kế hoạch phát triển kinh tế - xã hội tỉnh Thanh Hóa 5 năm 2026 - 2030',
    moTa: 'Kỳ họp thường lệ — đã biểu quyết xong.',
    tyLe: 'quanua',
  },
  {
    kyHop: 4,
    tieuDe: 'Nghị quyết về giao biên chế công chức hành chính của tỉnh năm 2026',
    moTa: 'Kỳ họp thường lệ — đã biểu quyết xong.',
    tyLe: 'quanua',
  },
  {
    kyHop: 4,
    tieuDe: 'Nghị quyết về đặt tên đường, phố và công trình công cộng trên địa bàn một số phường, xã',
    moTa: 'Kỳ họp thường lệ — đã biểu quyết xong.',
    tyLe: 'quanua',
  },
  // ---- Kỳ họp thứ 3 (chuyên đề, đã biểu quyết xong) ------------------------
  {
    kyHop: 3,
    tieuDe: 'Nghị quyết về chủ trương chuyển mục đích sử dụng rừng sang mục đích khác để thực hiện các dự án đầu tư',
    moTa: 'Kỳ họp chuyên đề — đã biểu quyết xong.',
    tyLe: 'quanua',
  },
  {
    kyHop: 3,
    tieuDe: 'Nghị quyết về điều chỉnh mức thu một số loại phí, lệ phí trên địa bàn tỉnh',
    moTa: 'Kỳ họp chuyên đề — không đủ số phiếu tán thành, giao cơ quan trình hoàn thiện thêm.',
    tyLe: 'quanua',
  },
];
