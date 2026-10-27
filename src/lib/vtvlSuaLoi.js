// ============================================================================
//  TỰ ĐỘNG SỬA LỖI khi nhập tệp — phân hệ "Bộ biểu Vị trí việc làm" (LOGIC THUẦN)
//
//  NGUYÊN TẮC: chỉ sửa khi ý người nhập là RÕ RÀNG, không bao giờ đoán số liệu.
//   ✔ Sửa được: gõ thiếu dấu / sai chính tả nhẹ / viết tắt của giá trị trong danh
//     sách chọn (chỉ khi khớp DUY NHẤT một giá trị) · số kèm đơn vị ("1.200 SP",
//     "15 phút") · năm kèm chữ ("Năm 2027") · ngày viết kiểu khác · mã liên kết
//     chỉ lệch dấu cách/gạch nối ("CV 01" → "CV-01" đang có) · ô chứa lỗi công
//     thức Excel (#N/A… → để trống) · STT sai → đánh lại theo thứ tự · dòng
//     trùng mã GIỐNG HỆT dòng trước (xóa bản lặp).
//   ✘ Không sửa (để người sửa): thiếu mã, số âm, trùng mã nhưng nội dung khác
//     nhau, giá trị không gần giá trị nào, mã liên kết không khớp mã nào, và mọi
//     cảnh báo nghiệp vụ (thiếu nguồn, chưa kiểm chứng… — phải có căn cứ thật).
//  Mỗi sửa đổi được ghi lại (ô, giá trị cũ → mới, lý do) để người dùng xem, bỏ
//  chọn từng mục và để in vào trang NHAT_KY_SUA của tệp đã sửa.
// ============================================================================
import { BIEU_THEO_ID, cotNhap, dsCua, kiemTraO, docSoVN, serialSangNgay, rong, kk } from './vtvl.js';
import { chuanTen } from './vtvlNhap.js';

const LA_MA = ['I', 'II', 'III', 'IV', 'V', 'VI'];

function khoangCach(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  let truoc = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const nay = [i];
    for (let j = 1; j <= n; j++) nay[j] = Math.min(truoc[j] + 1, nay[j - 1] + 1, truoc[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    truoc = nay;
  }
  return truoc[n];
}

/** Giá trị danh sách chọn mà người nhập muốn ghi — null nếu không chắc chắn. */
export function suaDanhSach(col, v) {
  const list = dsCua(col);
  const s = String(v);
  const n = chuanTen(s);
  if (!n) return null;
  // Nhóm sản phẩm ghi bằng số Ả Rập.
  if (col.ds === 'NHOM' && /^[1-6]$/.test(n)) return { moi: LA_MA[Number(n) - 1], lyDo: `nhóm ghi bằng số ${n} → số La Mã` };
  // Phương pháp: "PP2 + PP1", "PP1, PP2", "pp1 và pp3" → sắp xếp, nối bằng "+".
  if (col.ds === 'PP') {
    const pp = [...new Set((s.toUpperCase().match(/PP\s*[123]/g) || []).map((x) => x.replace(/\s/g, '')))].sort();
    const ghep = pp.join('+');
    if (pp.length && list.includes(ghep) && ghep !== s) return { moi: ghep, lyDo: 'viết lại phương pháp theo đúng danh sách (PP… nối bằng "+")' };
    return null;
  }
  const chuan = list.map((x) => ({ x, n: chuanTen(x) }));
  const trung = chuan.filter((c) => c.n === n);
  if (trung.length === 1) return { moi: trung[0].x, lyDo: 'gõ thiếu dấu / khác dấu câu' };
  if (n.length >= 4) {
    const chua = chuan.filter((c) => c.n.includes(n) || n.includes(c.n));
    if (chua.length === 1) return { moi: chua[0].x, lyDo: 'viết tắt/viết thừa — chỉ khớp đúng một giá trị trong danh sách' };
    // Khớp từ 2 giá trị trở lên ("Kiểm chứng" ⊂ "Đã…"/"Chưa kiểm chứng") là MƠ HỒ —
    // dừng hẳn, không thử so sai chính tả (sẽ chọn bừa và tự khẳng định "Đã kiểm chứng").
    if (chua.length > 1) return null;
    const kc = chuan.map((c) => ({ ...c, d: khoangCach(n, c.n) })).sort((a, b) => a.d - b.d);
    const tran = n.length <= 8 ? 1 : n.length <= 20 ? 2 : 3;
    if (kc[0].d <= tran && (kc.length === 1 || kc[1].d > kc[0].d)) return { moi: kc[0].x, lyDo: `sai chính tả (lệch ${kc[0].d} ký tự)` };
  }
  return null;
}

/** Số kèm chữ/đơn vị: lấy đúng MỘT con số có trong ô. */
export function suaSo(v) {
  let s = String(v).trim();
  if (/^[+-]?\d{1,3}( \d{3})+([.,]\d+)?$/.test(s)) s = s.replace(/ /g, '');
  const so = s.match(/[+-]?\d[\d.,]*/g) || [];
  if (so.length !== 1) return null;
  const n = docSoVN(so[0].replace(/[.,]$/, ''));
  if (n === null) return null;
  return { moi: n, lyDo: so[0] === s ? 'đổi chữ số thành số' : `bỏ chữ/đơn vị kèm theo, giữ số ${so[0]}` };
}

export function suaNam(v) {
  const m = String(v).match(/\b(20\d{2})\b/g);
  if (!m || new Set(m).size !== 1) return null;
  return { moi: Number(m[0]), lyDo: `lấy năm ${m[0]} trong "${v}"` };
}

export function suaNgay(v) {
  const s = String(v).trim();
  let d, mth, y;
  let m = s.match(/^(\d{1,2})[\s/.-]+(\d{1,2})[\s/.-]+(\d{4})$/);
  if (m) [, d, mth, y] = m;
  else if ((m = s.match(/^(\d{4})[/.-](\d{1,2})[/.-](\d{1,2})$/))) [, y, mth, d] = m;
  else if ((m = s.match(/ngày\s*(\d{1,2})\s*tháng\s*(\d{1,2})\s*năm\s*(\d{4})/i))) [, d, mth, y] = m;
  else if (/^\d{5}$/.test(s)) { const iso = serialSangNgay(Number(s)); return iso ? { moi: iso, lyDo: 'số ngày kiểu Excel → ngày' } : null; }
  else return null;
  return { moi: `${y}-${String(mth).padStart(2, '0')}-${String(d).padStart(2, '0')}`, lyDo: 'đổi về dạng ngày/tháng/năm' };
}

const LOI_EXCEL = /^#(N\/A|VALUE!|REF!|DIV\/0!|NAME\?|NUM!|NULL!|SPILL!|CALC!|GETTING_DATA)$/i;

/**
 * Lập danh sách đề xuất sửa cho các dòng đọc từ tệp.
 *  phanTich: kết quả `phanTichTep` · docHienTai: dữ liệu đang có (để dò mã liên kết)
 *  cheDo: 'thay' thì biểu có trong tệp KHÔNG lấy mã của dữ liệu đang có.
 * Trả mảng { id, bieu, trang, rowId, dongTep, cot, tenCot, cu, moi, lyDo, loai: 'o'|'xoaDong' }.
 */
export function deXuatSua(phanTich, docHienTai = {}, { cheDo = 'thay' } = {}) {
  const ds = [];
  let stt = 0;
  const them = (o) => ds.push({ id: `s${++stt}`, ...o });
  const maCua = new Map();
  const tapMa = (id) => {
    if (maCua.has(id)) return maCua.get(id);
    const tuTep = (phanTich.bieu[id]?.dong || []).map((d) => d.row.A);
    const coSan = phanTich.bieu[id] && cheDo === 'thay' ? [] : (docHienTai?.bieu?.[id] || []).map((r) => r.A);
    const m = [...new Set([...tuTep, ...coSan].filter((x) => !rong(x)).map(String))];
    maCua.set(id, m);
    return m;
  };

  for (const [bieuId, pt] of Object.entries(phanTich.bieu)) {
    const b = BIEU_THEO_ID[bieuId];
    const goc = { bieu: bieuId, trang: pt.trang };
    // ① Dòng lặp y hệt (cùng khóa, cùng mọi ô) → xóa bản lặp.
    const daThay = new Map();
    const xoa = new Set();
    if (b.duyNhat) {
      for (const d of pt.dong) {
        if (b.duyNhat.some((k) => rong(d.row[k]))) continue;
        const khoa = b.duyNhat.map((k) => kk(d.row[k])).join('\u0001');
        const dau = cotNhap(b).map((c) => kk(d.row[c.k])).join('\u0001');
        const truoc = daThay.get(khoa);
        if (truoc && truoc.dau === dau) {
          xoa.add(d.row._id);
          them({ ...goc, rowId: d.row._id, dongTep: d.dongTep, cot: b.duyNhat[0], tenCot: '(cả dòng)', cu: d.row[b.duyNhat[0]], moi: '', lyDo: `dòng lặp y hệt dòng ${truoc.dongTep} — xóa bản lặp`, loai: 'xoaDong' });
        } else if (!truoc) daThay.set(khoa, { dau, dongTep: d.dongTep });
      }
    }
    // ② Từng ô có lỗi.
    pt.dong.forEach((d, viTri) => {
      if (xoa.has(d.row._id)) return;
      for (const col of cotNhap(b)) {
        const v = d.row[col.k];
        if (rong(v)) continue;
        const loi = kiemTraO(col, v);
        let de = null;
        if (loi?.muc === 'loi') {
          if (typeof v === 'string' && LOI_EXCEL.test(v.trim())) de = { moi: '', lyDo: 'xóa giá trị lỗi công thức Excel — ô để trống, nhập lại nếu cột bắt buộc' };
          else if ((bieuId === 'VUNG' || bieuId === 'Y') && col.k === 'A') de = { moi: viTri + 1, lyDo: 'STT không hợp lệ — đánh lại theo thứ tự dòng' };
          else if (col.kieu === 'ds') de = suaDanhSach(col, v);
          else if (col.kieu === 'so') de = suaSo(v);
          else if (col.kieu === 'nam') de = suaNam(v);
          else if (col.kieu === 'ngay') de = suaNgay(v);
        } else if (!loi && col.ref) {
          const ma = tapMa(col.ref);
          if (!ma.some((x) => kk(x) === kk(v))) {
            const gan = ma.filter((x) => chuanTen(x) === chuanTen(v));
            if (gan.length === 1) de = { moi: gan[0], lyDo: `mã lệch dấu cách/gạch nối — khớp mã "${gan[0]}" đang có ở ${BIEU_THEO_ID[col.ref].ma}` };
          }
        }
        // Chỉ nhận đề xuất khi giá trị mới thực sự hết lỗi.
        if (de && de.moi !== v && (de.moi === '' || !kiemTraO(col, de.moi) || kiemTraO(col, de.moi).muc !== 'loi')) {
          them({ ...goc, rowId: d.row._id, dongTep: d.dongTep, cot: col.k, tenCot: col.ten, cu: v, moi: de.moi, lyDo: de.lyDo, loai: 'o' });
        }
      }
    });
  }
  return ds;
}

/** Áp các đề xuất được chọn → bản phân tích MỚI (không đụng bản cũ). */
export function apDungSua(phanTich, dsSua, chon = null) {
  const dung = dsSua.filter((x) => !chon || chon.has(x.id));
  const theoDong = new Map();
  for (const x of dung) {
    if (!theoDong.has(x.rowId)) theoDong.set(x.rowId, []);
    theoDong.get(x.rowId).push(x);
  }
  const bieu = {};
  for (const [id, pt] of Object.entries(phanTich.bieu)) {
    const dong = [];
    for (const d of pt.dong) {
      const sua = theoDong.get(d.row._id);
      if (!sua) { dong.push(d); continue; }
      if (sua.some((x) => x.loai === 'xoaDong')) continue;
      const row = { ...d.row };
      for (const x of sua) row[x.cot] = x.moi;
      dong.push({ ...d, row, doi: d.doi.filter((g) => !sua.some((x) => x.cot === g.cot)) });
    }
    bieu[id] = { ...pt, dong };
  }
  return { ...phanTich, bieu, daSua: [...(phanTich.daSua || []), ...dung] };
}

export const nhomSua = (ds) => {
  const m = {};
  for (const x of ds) m[x.bieu] = (m[x.bieu] || 0) + 1;
  return m;
};
