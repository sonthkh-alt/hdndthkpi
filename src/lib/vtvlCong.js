// ============================================================================
//  CHUYỂN BỘ BIỂU VTVL SANG MẪU NỘP LÊN CỔNG CỦA BAN TỔ CHỨC TRUNG ƯƠNG
//  (btctw.ueb.edu.vn — "Kê khai vị trí việc làm") — LOGIC THUẦN, chạy bằng Node.
//
//  ⚠️ VÌ SAO PHẢI TÁCH THÀNH TỆP RIÊNG CHO TỪNG BIỂU
//  Bộ biểu của Ban là MỘT tệp Excel nhiều trang (A1 → D2 nối nhau bằng mã).
//  Cổng lại nhận theo PHIẾU: mỗi biểu một phiếu, mỗi phiếu nạp MỘT tệp .xlsx
//  chỉ chứa biểu đó. Vì vậy bước nộp là tách 1 → 9 tệp, đúng tên trang, đúng
//  tên cột, đúng thứ tự cột của cổng.
//
//  ⚠️ MẪU CỦA CỔNG MANG THEO "GIẤY TỜ TÙY THÂN" CỦA PHIẾU
//  Mẫu trống tải từ cổng có 2 trang ẩn (veryHidden) mà mắt thường không thấy:
//    • `_thong_tin` — khai báo phiên bản mẫu, MÃ BIỂU, mã + tên đơn vị, mã kỳ,
//      `ho_so_nop_id`, `phieu_nop_id`, tên trang dữ liệu, dòng tên cột, và
//      DANH SÁCH CỘT (thứ tự · tên trường · nhãn). Đây là thứ cổng dùng để nhận
//      ra tệp thuộc phiếu nào — KHÔNG thể tự bịa ra.
//    • `_danh_muc` — các danh sách chọn và các mã được phép của biểu gốc, khóa
//      theo `<mã biểu>.<tên trường>`.
//  → Phần mềm KHÔNG dựng tệp từ đầu mà ĐIỀN VÀO mẫu tải từ cổng, giữ nguyên hai
//    trang ẩn đó. Dựng từ đầu thì cổng gần như chắc chắn từ chối.
//
//  ⚠️ CỘT MÁY TỰ TÍNH thì để TRỐNG
//  Tên trường bắt đầu bằng `@tinh.` là cột cổng tự tính. Hướng dẫn trong mẫu ghi
//  rõ: "số dán vào cột xám được bỏ qua, cổng tính lại khi ghi tệp vào hồ sơ".
//  Ghi số của ta vào đó chỉ gây hiểu lầm khi đối chiếu, nên để trống.
//
//  ⚠️ HAI CỘT ẨN `@ma` / `@rv` LÀ MÃ DÒNG — GHÉP SAI LÀ SỬA SAI BẢN GHI
//  Mẫu tải về của đơn vị ĐÃ nhập sẽ mang theo mã dòng ở 2 cột ẩn cuối. Nếu ta
//  đổ dữ liệu từ dòng 3 theo thứ tự của mình thì mã dòng cũ sẽ dính vào dòng
//  KHÁC → cổng cập nhật sai bản ghi. Vì vậy `ghepDong` khớp theo MÃ KHÓA của
//  từng biểu rồi mới mang mã dòng theo; dòng cũ không còn khớp thì GIỮ LẠI
//  nguyên vẹn (không tự xóa — xóa dòng trên cổng là xóa bản ghi).
// ============================================================================
import {
  BIEU_THEO_ID, dongCoDuLieu, kk, rong, laSo, tinhToan, kiemTraDuLieu,
} from './vtvl.js';

export const CONG_PHIEN_BAN = 'CONG-2';
export const CONG_TEN_MIEN = 'btctw.ueb.edu.vn';

/** Tên trường của cổng → cột máy tự tính. */
export const laCotTinh = (truong) => String(truong || '').startsWith('@tinh.');

const b = (maBieu, bieu, sheet, tenBieu, tenTep, buoc, truong, { dai = {}, so = [], khoa = ['A'] } = {}) =>
  ({ maBieu, bieu, sheet, tenBieu, tenTep, buoc, truong, dai, so, khoa });

/**
 * 09 BIỂU NGHIỆP VỤ của cổng (Hướng dẫn 07-HD/BTCTW).
 * `truong` xếp theo ĐÚNG thứ tự cột của cổng, đọc từ trang `_thong_tin` của mẫu
 * thật; `dai`/`so` là giới hạn cổng đặt sẵn ở phần kiểm tra dữ liệu của mẫu
 * (textLength / decimal) — nêu trước cho đơn vị sửa, khỏi bị cổng trả về.
 */
export const CONG_BIEU = [
  b('VT_A1', 'A1', '1. A1_NhiemVu', 'Biểu A1 – Danh mục nhiệm vụ', 'A1_NhiemVu', 1,
    ['ma_nhiem_vu', 'ten_nhiem_vu', 'ten_co_quan', 'can_cu', '@tinh.ky', 'trang_thai_id', 'nguon'],
    { dai: { A: 100, C: 500 } }),
  b('VT_A2', 'A2', '2. A2_CongViec', 'Biểu A2 – Công việc và sản phẩm', 'A2_CongViec', 2,
    ['ma_cong_viec', 'ma_nhiem_vu', 'ma_vtvl', 'ten_cong_viec', 'san_pham', 'don_vi_tinh', 'chat_luong', 'can_cu_nguon'],
    { dai: { A: 100, F: 200 } }),
  b('VT_B1', 'B1', '3. B1_KhoiLuong', 'Biểu B1 – Khối lượng và thời gian thực hiện công việc', 'B1_KhoiLuong', 3,
    ['ma_cong_viec', '@tinh.ma_vtvl', 'so_san_pham', 'phut_do_thuc_te', 'gio_bo_sung', '@tinh.gio_san_pham',
      '@tinh.gio_tong', 'nguon_san_luong', 'nguon_thoi_gian', 'trang_thai_can_cu_id', '@tinh.ky', 'ma_san_pham',
      '@tinh.nhom', '@tinh.phut_chuan', '@tinh.xac_nhan_chuan', '@tinh.phut_dung_tinh',
      '@tinh.nguon_thoi_gian_dung', '@tinh.canh_bao', 'giai_trinh_khac_chuan'],
    { dai: { L: 100 }, so: ['C', 'D', 'E'] }),
  b('VT_B2', 'B2CT', '4. B2_CT_TacDong', 'Biểu B2 – Tác động của chuyển đổi số, tự chủ, thuê dịch vụ và xã hội hóa', 'B2_TacDong', 4,
    ['ma_cong_viec', '@tinh.ma_vtvl', 'loai_tac_dong_id', 'cong_doan', 'san_pham_ap_dung', 'phut_truoc', 'phut_sau',
      '@tinh.gio_giam_truc_tiep', 'gio_viec_moi', 'nguon_bang_chung', '@tinh.ky', 'co_so_b1_id', 'trang_thai_id',
      '@tinh.gio_giam_hop_le', '@tinh.gio_tang_hop_le', '@tinh.kiem_tra', 'kinh_phi_truoc', 'kinh_phi_sau', 'doi_chieu_id'],
    { so: ['E', 'F', 'G', 'I', 'Q', 'R'], khoa: ['A', 'C', 'D'] }),
  b('VT_C1', 'C1', '6. C1_VTVL', 'Biểu C1 – Danh mục vị trí việc làm', 'C1_VTVL', 5,
    ['ma_vtvl', 'ten_vtvl', 'loai_nhan_luc_id', 'quyet_dinh', '@tinh.gio_chuan_pp2', 'can_cu_quy_gio',
      'trang_thai_id', 'gio_rieng', 'xac_nhan_gio_rieng_id', 'che_do_id', '@tinh.kiem_tra_quy_gio'],
    { dai: { A: 100 }, so: ['H'] }),
  b('VT_C2', 'C2', '7. C2_NangLuc', 'Biểu C2 – Bản mô tả công việc và khung năng lực', 'C2_NangLuc', 5,
    ['ma_vtvl', 'trach_nhiem', 'nang_luc_chung', 'chuyen_mon', 'lanh_dao', 'can_cu', 'nguon_ban_mo_ta']),
  b('VT_C3', 'C3', '8. C3_NhuCau', 'Biểu C3 – Xác định nhu cầu nhân lực', 'C3_NhuCau', 6,
    ['ma_vtvl', 'phuong_phap_id', '@tinh.gio_b1', '@tinh.gio_tac_dong_b2', '@tinh.gio_rong', '@tinh.gio_pp2_c1',
      '@tinh.nguoi_quy_doi_pp2', 'nguoi_pp1', 'nguoi_pp3', 'nguoi_can_bo_tri', 'nguon_giai_trinh', 'trang_thai_id',
      '@tinh.canh_bao', '@tinh.so_dong_b1_chua_dat'],
    { so: ['H', 'I', 'J'] }),
  b('VT_D1', 'D1', '9. D1_NhanLuc', 'Biểu D1 – Đối chiếu nguồn nhân lực hiện có', 'D1_NhanLuc', 7,
    ['ma_nguon_luc', 'ma_vtvl', 'loai_nhan_luc_id', '@tinh.gio_quy_doi', 'gio_cho_vtvl', 'gio_viec_khac',
      'noi_tinh_bien_che', 'nguon', 'trang_thai_id', '@tinh.canh_bao', 'gio_rieng_che_do'],
    { dai: { A: 100, G: 500 }, so: ['E', 'F', 'K'] }),
  b('VT_D2', 'D2', '10. D2_PhuongAn', 'Biểu D2 – Phương án biên chế giai đoạn 2027–2031', 'D2_PhuongAn', 7,
    ['ma_vtvl', 'nam_id', '@tinh.so_nguoi_can_trong_nam', 'so_nguoi_co_the_bo_tri', 'bien_che_duoc_giao',
      'dieu_chuyen_bo_tri', 'de_nghi_dieu_chinh', 'nguon_giai_trinh', 'trang_thai_id', '@tinh.kiem_tra',
      '@tinh.pp2_tham_khao', '@tinh.nguoi_c3_nam_co_so', '@tinh.kiem_soat_doi_chieu', 'van_ban_tham_dinh'],
    { so: ['D', 'E', 'G'], khoa: ['A', 'B'] }),
];

export const CONG_THEO_MA = Object.fromEntries(CONG_BIEU.map((x) => [x.maBieu, x]));
export const CONG_THEO_BIEU = Object.fromEntries(CONG_BIEU.map((x) => [x.bieu, x]));

/** "A" → 1, "AA" → 27. */
export const soCotCong = (L) => [...String(L)].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
export const chuCotCong = (n) => { let s = ''; let m = n; while (m > 0) { const r = (m - 1) % 26; s = String.fromCharCode(65 + r) + s; m = Math.floor((m - 1) / 26); } return s; };

/** Cột thứ `i` (1-based) của cổng ứng với cột nào của bộ biểu. */
export const cotBieuCua = (cb, i) => (BIEU_THEO_ID[cb.bieu]?.cot || [])[i - 1] || null;

/** Các cột đơn vị phải NHẬP (bỏ cột máy tự tính) — dùng cho phần đếm và hướng dẫn. */
export const truongNhap = (cb) => cb.truong.map((t, i) => ({ truong: t, cot: chuCotCong(i + 1) })).filter((x) => !laCotTinh(x.truong));

// ─── đọc mẫu tải từ cổng ────────────────────────────────────────────────────
const o2a = (row) => (Array.isArray(row) ? row : []);

/**
 * Đọc trang `_thong_tin` (mảng 2 chiều) → khai báo của phiếu.
 * Trang này là cách DUY NHẤT biết tệp thuộc phiếu nào, nên mọi suy luận về sau
 * đều dựa vào nó, không dựa vào tên tệp (người dùng đổi tên tệp là chuyện thường).
 */
export function docThongTin(rows) {
  const tt = { cot: [], sheet: '', dongNhan: 2 };
  for (const r0 of rows || []) {
    const r = o2a(r0);
    const k = String(r[0] ?? '').trim();
    if (!k) continue;
    if (k === 'cot') {
      const stt = Number(r[2]);
      if (Number.isFinite(stt) && stt > 0) tt.cot.push({ stt, truong: String(r[3] ?? ''), nhan: String(r[4] ?? '') });
    } else if (k === 'sheet') tt.sheet = String(r[2] ?? '');
    else if (k === 'dong_nhan') { const n = Number(r[2]); if (Number.isFinite(n) && n > 0) tt.dongNhan = n; }
    else tt[k] = typeof r[1] === 'number' ? r[1] : String(r[1] ?? '');
  }
  tt.cot.sort((x, y) => x.stt - y.stt);
  return tt;
}

/**
 * Đọc trang `_danh_muc` → { "VT_C1.loai_nhan_luc_id": ["Cán bộ", …] }.
 * Dòng 1 là khóa của từng cột; các dòng dưới là giá trị (cột ngắn thì để trống).
 * Trang này chứa CẢ danh sách chọn CẢ danh sách mã được phép của biểu gốc, nên
 * dùng chung một đường để kiểm tra — khỏi lệch với danh mục trong `vtvl.js`.
 */
export function docDanhMuc(rows) {
  const out = {};
  const head = o2a((rows || [])[0]);
  head.forEach((h, c) => {
    const key = String(h ?? '').trim();
    if (!key) return;
    const vals = [];
    for (let r = 1; r < (rows || []).length; r++) {
      const v = o2a(rows[r])[c];
      if (!rong(v)) vals.push(String(v).trim());
    }
    out[key] = vals;
  });
  return out;
}

/** Đọc trang "Mã biểu gốc" → [{cot, bieu, ma, ten}] (mã kèm tên, để hiện gợi ý). */
export function docMaGoc(rows) {
  const out = [];
  for (let r = 1; r < (rows || []).length; r++) {
    const x = o2a(rows[r]);
    const ma = String(x[2] ?? '').trim();
    if (!ma) continue;
    out.push({ cot: String(x[0] ?? ''), bieu: String(x[1] ?? ''), ma, ten: String(x[3] ?? '') });
  }
  return out;
}

/**
 * Mẫu có đúng là mẫu của cổng, và của biểu nào?
 * Trả { ok, cb, tt, loi[] }. `loi` là những chỗ KHÔNG cho phép điền tiếp
 * (sai mã biểu, lệch số cột, lệch tên cột) — điền vào mẫu lệch là nộp hỏng.
 */
export function kiemTraMau(tt, { maBieuMong = '' } = {}) {
  const loi = [];
  const cb = CONG_THEO_MA[tt?.ma_bieu];
  if (!tt?.ma_bieu) loi.push('Tệp không có trang khai báo "_thong_tin" — đây không phải mẫu tải từ cổng.');
  else if (!cb) loi.push(`Mã biểu "${tt.ma_bieu}" không thuộc 09 biểu nghiệp vụ mà phần mềm biết.`);
  if (cb && maBieuMong && cb.maBieu !== maBieuMong) loi.push(`Mẫu này là ${cb.maBieu} (${cb.tenBieu}), không phải ${maBieuMong}.`);
  if (cb) {
    if (tt.sheet && tt.sheet !== cb.sheet) loi.push(`Tên trang dữ liệu của mẫu là «${tt.sheet}», phần mềm chờ «${cb.sheet}».`);
    const chinh = tt.cot.map((c) => c.truong).filter((t) => t !== '@ma' && t !== '@rv');
    if (chinh.length !== cb.truong.length) {
      loi.push(`Mẫu có ${chinh.length} cột nghiệp vụ, phần mềm chờ ${cb.truong.length} — mẫu thuộc phiên bản khác, hãy tải lại mẫu mới nhất từ cổng.`);
    } else {
      chinh.forEach((t, i) => {
        if (t !== cb.truong[i]) loi.push(`Cột ${chuCotCong(i + 1)}: mẫu khai trường «${t}», phần mềm chờ «${cb.truong[i]}».`);
      });
    }
    if (tt.phien_ban_mau && tt.phien_ban_mau !== CONG_PHIEN_BAN) {
      loi.push(`Mẫu là phiên bản ${tt.phien_ban_mau}; phần mềm dựng theo ${CONG_PHIEN_BAN}. Hãy tải lại mẫu từ cổng rồi thử lại.`);
    }
  }
  return { ok: loi.length === 0, cb: cb || null, tt: tt || null, loi };
}

// ─── ghép dòng (mang mã dòng ẩn theo) ───────────────────────────────────────
/** Khóa ghép của một dòng: nối các cột khóa của biểu, không phân biệt hoa thường. */
export const khoaDongCong = (cb, lay) => cb.khoa.map((L) => kk(lay(L))).join('\u0001');

/**
 * Ghép dữ liệu của phần mềm vào mẫu, mang `@ma`/`@rv` của dòng cũ theo ĐÚNG mã khóa.
 *   dongMoi — [{ lay(cotLetter) → giá trị }] theo thứ tự muốn ghi.
 *   dongMau — các dòng đã có trong mẫu: [{ lay(cotLetter), ma, rv }].
 * Trả { ghep: [{ lay, ma, rv, loai }], moi, capNhat, giuLai, canhBao[] }.
 * Dòng cũ có mã dòng mà không khớp dòng nào của ta được GIỮ NGUYÊN ở cuối: bỏ
 * hẳn một bản ghi là việc phải cố ý làm (cổng dặn xóa cả dòng trong Excel), nên
 * phần mềm không tự ý xóa.
 */
export function ghepDong(cb, dongMoi, dongMau = []) {
  const theoKhoa = new Map();
  const conLai = new Set();
  dongMau.forEach((d, i) => {
    if (rong(d.ma)) return;
    conLai.add(i);
    const k = khoaDongCong(cb, d.lay);
    if (!theoKhoa.has(k)) theoKhoa.set(k, []);
    theoKhoa.get(k).push(i);
  });

  const ghep = [];
  let moi = 0; let capNhat = 0;
  for (const d of dongMoi) {
    const k = khoaDongCong(cb, d.lay);
    const hang = theoKhoa.get(k);
    if (hang && hang.length) {
      const i = hang.shift();
      conLai.delete(i);
      ghep.push({ lay: d.lay, ma: dongMau[i].ma, rv: dongMau[i].rv, loai: 'capNhat' });
      capNhat++;
    } else {
      ghep.push({ lay: d.lay, ma: '', rv: '', loai: 'moi' });
      moi++;
    }
  }
  const giu = [...conLai].sort((x, y) => x - y);
  for (const i of giu) ghep.push({ lay: dongMau[i].lay, ma: dongMau[i].ma, rv: dongMau[i].rv, loai: 'giuLai' });

  const canhBao = [];
  if (giu.length) {
    canhBao.push(`${giu.length} dòng đã có trên cổng không còn trong dữ liệu của phần mềm. Tệp GIỮ LẠI nguyên các dòng đó để không xóa mất bản ghi trên cổng. Nếu đúng là cần bỏ thì mở tệp, xóa cả dòng rồi mới nạp lên.`);
  }
  return { ghep, moi, capNhat, giuLai: giu.length, canhBao };
}

// ─── kiểm tra trước khi nộp ─────────────────────────────────────────────────
const doDai = (v) => [...String(v ?? '')].length;

/**
 * Soát dữ liệu của MỘT biểu theo đúng các phép kiểm mà cổng đặt sẵn trong mẫu:
 * quá số ký tự · ô số lại ghi chữ · giá trị ngoài danh sách chọn · mã liên kết
 * chưa có ở biểu gốc TRÊN CỔNG (khác với "chưa có trong phần mềm"!).
 * `danhMuc` lấy từ trang `_danh_muc` của chính mẫu nên luôn khớp cổng.
 */
export function soatTheoCong(cb, dongMoi, danhMuc = {}, tt = null) {
  const ds = [];
  const nhan = nhanCot(cb, tt);
  const them = (dong, cot, muc, chu) => ds.push({ dong, cot, muc, chu });
  dongMoi.forEach((d, idx) => {
    const n = idx + 1;
    cb.truong.forEach((tr, i) => {
      if (laCotTinh(tr)) return;
      const L = chuCotCong(i + 1);
      const v = d.lay(L);
      if (rong(v)) return;
      const gh = cb.dai[L];
      if (gh && doDai(v) > gh) them(n, L, 'loi', `Cột ${L} «${nhan[i]}» dài ${doDai(v)} ký tự, cổng chỉ nhận tối đa ${gh}.`);
      if (cb.so.includes(L) && !laSo(v)) them(n, L, 'loi', `Cột ${L} «${nhan[i]}» là ô số của cổng nhưng giá trị đang là chữ: "${String(v).slice(0, 40)}".`);
      const cho = danhMuc[`${cb.maBieu}.${tr}`];
      if (cho && cho.length && !cho.some((x) => kk(x) === kk(v))) {
        const laMa = /^ma_/.test(tr);
        them(n, L, laMa ? 'canh' : 'loi', laMa
          ? `Mã "${v}" ở cột ${L} chưa có ở biểu gốc TRÊN CỔNG lúc tải mẫu — nạp biểu gốc lên cổng trước, tải lại mẫu rồi nộp biểu này (Hướng dẫn 07: C1 trước A2, A2 trước B1).`
          : `Giá trị "${String(v).slice(0, 40)}" ở cột ${L} «${nhan[i]}» không có trong danh sách chọn của cổng.`);
      }
    });
  });
  return ds;
}

/**
 * Chuẩn bị dữ liệu nộp cho MỘT biểu, từ bộ biểu đang có trong phần mềm.
 *   doc — dữ liệu bộ biểu (đã qua `chuanHoaVTVL`)
 *   mau — { tt, danhMuc, dongMau } đọc từ mẫu tải về (`dongMau` có thể rỗng)
 * Trả { cb, rows, dong, moi, capNhat, giuLai, boQua, soat, canhBao }.
 * `rows` là mảng 2 chiều theo ĐÚNG cột của cổng: cột tự tính để `null`, hai cột
 * cuối là mã dòng ẩn.
 */
export function chuanBiNop(bieuId, doc, { tt = null, danhMuc = {}, dongMau = [], boQuaLoiChan = true, kq = null } = {}) {
  const cb = CONG_THEO_BIEU[bieuId];
  if (!cb) throw new Error(`Biểu "${bieuId}" không nằm trong 09 biểu nộp lên cổng.`);
  const bieu = BIEU_THEO_ID[cb.bieu];
  const tinh = kq || tinhToan(doc);
  const kt = kiemTraDuLieu(doc, tinh);

  const rowsGoc = doc?.bieu?.[cb.bieu] || [];
  const chanTheoId = new Set(kt.ds.filter((x) => x.bieu === cb.bieu && x.chan).map((x) => x.id));
  const nguon = [];
  let boQuaTrong = 0; let boQuaChan = 0;
  rowsGoc.forEach((r) => {
    if (!dongCoDuLieu(bieu, r)) { boQuaTrong++; return; }
    if (boQuaLoiChan && chanTheoId.has(r._id)) { boQuaChan++; return; }
    nguon.push({ lay: (L) => r[L], _id: r._id });
  });

  const g = ghepDong(cb, nguon, dongMau);
  const soat = soatTheoCong(cb, nguon, danhMuc, tt);

  const rows = g.ghep.map((d) => {
    const row = cb.truong.map((tr, i) => (laCotTinh(tr) ? null : d.lay(chuCotCong(i + 1)) ?? null));
    row.push(rong(d.ma) ? null : d.ma, rong(d.rv) ? null : d.rv);
    return row;
  });

  const canhBao = [...g.canhBao];
  if (boQuaChan) canhBao.push(`${boQuaChan} dòng có lỗi chặn nên không đưa vào tệp nộp (cổng từ chối cả tệp nếu còn lỗi). Sửa ở tab Kiểm tra lỗi rồi dựng lại tệp.`);
  if (!nguon.length) canhBao.push('Biểu này chưa có dòng nào để nộp.');

  return {
    cb, tt, rows, dong: nguon.length, moi: g.moi, capNhat: g.capNhat, giuLai: g.giuLai,
    boQua: { trong: boQuaTrong, chan: boQuaChan }, soat, canhBao,
    loiSoat: soat.filter((x) => x.muc === 'loi').length,
    canhSoat: soat.filter((x) => x.muc === 'canh').length,
  };
}

/**
 * Thứ tự nộp theo Hướng dẫn 07: biểu gốc trước, biểu dẫn chiếu sau.
 * Cổng chỉ nhận mã đã có trong hồ sơ của nó nên nộp sai thứ tự là bị trả về.
 */
export const THU_TU_NOP = ['VT_C1', 'VT_A1', 'VT_A2', 'VT_B1', 'VT_B2', 'VT_C2', 'VT_C3', 'VT_D1', 'VT_D2'];
export const congTheoThuTu = () => THU_TU_NOP.map((m) => CONG_THEO_MA[m]).filter(Boolean);

/** Tổng quan 09 biểu: số dòng trong phần mềm, lỗi chặn, cảnh báo. */
export function tongQuanNop(doc, kq = null) {
  const tinh = kq || tinhToan(doc);
  const kt = kiemTraDuLieu(doc, tinh);
  return congTheoThuTu().map((cb) => {
    const bieu = BIEU_THEO_ID[cb.bieu];
    const dong = (doc?.bieu?.[cb.bieu] || []).filter((r) => dongCoDuLieu(bieu, r)).length;
    const loiChan = kt.ds.filter((x) => x.bieu === cb.bieu && x.chan).length;
    const canhBao = kt.ds.filter((x) => x.bieu === cb.bieu && x.muc === 'canh').length;
    return { cb, dong, loiChan, canhBao, soCotNhap: truongNhap(cb).length };
  });
}

/** Tên tệp gợi ý khi dựng mẫu mới (mẫu tải từ cổng thì giữ nguyên tên tệp cũ). */
export function tenTepCong(cb, { tiepDau = '', tenDonVi = '' } = {}) {
  const slug = String(tenDonVi || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/Đ/g, 'D').replace(/đ/g, 'd')
    .replace(/[^0-9A-Za-z]+/g, '_').replace(/^_+|_+$/g, '');
  return `${[tiepDau, cb.tenTep, slug].filter(Boolean).join('_')}.xlsx`;
}

/** Nhãn cột của cổng (ưu tiên nhãn khai trong mẫu, không có thì lấy tên cột của bộ biểu). */
export function nhanCot(cb, tt) {
  return cb.truong.map((tr, i) => {
    const khai = tt?.cot?.find((c) => c.stt === i + 1);
    return khai?.nhan || cotBieuCua(cb, i + 1)?.ten || tr;
  });
}
