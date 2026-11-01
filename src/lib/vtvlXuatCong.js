// ============================================================================
//  DỰNG TỆP .XLSX NỘP LÊN CỔNG BAN TỔ CHỨC TRUNG ƯƠNG
//  (btctw.ueb.edu.vn) — chạy được cả trong trình duyệt lẫn Node ≥ 18.
//
//  ⚠️ CÁCH LÀM: KHÔNG dựng tệp mới, mà MỔ ĐÚNG MỘT TRANG của mẫu tải từ cổng.
//  Mẫu của cổng mang theo nhiều thứ không thể dựng lại được bằng thư viện
//  thông thường và mất thứ nào cũng phiền:
//    • hai trang ẩn `_thong_tin` (phiếu nào, cột nào) và `_danh_muc`;
//    • các phép kiểm tra dữ liệu của Excel (danh sách chọn có mũi tên, giới hạn
//      số ký tự, lời nhắc "ô máy tự tính") + `definedNames` dm_1…ma_2 đi kèm;
//    • ghi chú ô ở dòng tên cột (tam giác đỏ — hướng dẫn ghi từng cột);
//    • định dạng, độ rộng cột, khóa cấu trúc sổ.
//  Thư viện xlsx thường đọc-ghi lại sẽ làm rơi gần hết những thứ đó. Vì vậy ở
//  đây ta làm "mổ": giải nén ĐÚNG tệp XML của trang dữ liệu, giữ nguyên dòng
//  tiêu đề và dòng tên cột, thay phần dòng dữ liệu, rồi đóng lại thành ZIP —
//  mọi mục khác trong tệp được CHÉP NGUYÊN SI ở dạng đã nén (không giải, không
//  nén lại) nên không sai một byte.
//
//  Ô chữ ghi theo kiểu `inlineStr` — đúng cách mẫu của cổng đang dùng, nên
//  không phải chạm vào `sharedStrings.xml` (chạm vào là phải đánh lại chỉ số
//  của mọi trang khác).
// ============================================================================
import { docMucLucZip, docChuMuc, bytesNenMuc, docXlsx } from './vtvlNhap.js';
import {
  docThongTin, docDanhMuc, docMaGoc, kiemTraMau, chuCotCong, laCotTinh,
} from './vtvlCong.js';

// ─── đọc mẫu tải từ cổng ────────────────────────────────────────────────────
const TRANG_AN = ['_thong_tin', '_danh_muc', 'Mã biểu gốc'];

/** Chuyển các dòng {r, o:{A:v}} của `docXlsx` thành mảng 2 chiều (chỉ số 0 = dòng 1). */
function thanhMaTran(dong, soCot) {
  const max = dong.reduce((m, d) => Math.max(m, d.r), 0);
  const out = Array.from({ length: max }, () => Array(soCot).fill(null));
  for (const d of dong) {
    for (const [L, v] of Object.entries(d.o)) {
      const i = [...L].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
      if (i >= 0 && i < soCot) out[d.r - 1][i] = v;
    }
  }
  return out;
}

/**
 * Đọc một mẫu .xlsx tải từ cổng.
 * Trả { ok, cb, tt, danhMuc, maGoc, dongMau, dongMauCoDuLieu, loi[] }.
 * `dongMau` CHỈ gồm các dòng đã có MÃ DÒNG (`@ma`) — đó là các bản ghi cổng
 * đang giữ; dòng trống mà cổng điền sẵn cột «Kỳ» không tính.
 */
export async function docMauCong(blob, { maBieuMong = '' } = {}) {
  const r = await docXlsx(blob, { chon: (ten) => TRANG_AN.includes(ten) || /^\d+\.\s/.test(ten) });
  const lay = (ten) => r.trang.find((t) => t.ten === ten);
  const tThongTin = lay('_thong_tin');
  if (!tThongTin) return { ok: false, loi: ['Tệp không có trang "_thong_tin" — đây không phải mẫu tải từ cổng kê khai VTVL.'] };

  const tt = docThongTin(thanhMaTran(tThongTin.dong, 6));
  const kt = kiemTraMau(tt, { maBieuMong });
  if (!kt.cb) return { ok: false, tt, loi: kt.loi };
  const cb = kt.cb;
  const soCot = cb.truong.length + 2;

  const tDm = lay('_danh_muc');
  const danhMuc = tDm ? docDanhMuc(thanhMaTran(tDm.dong, 12)) : {};
  const tMg = lay('Mã biểu gốc');
  const maGoc = tMg ? docMaGoc(thanhMaTran(tMg.dong, 4)) : [];

  const tData = lay(cb.sheet) || r.trang.find((t) => /^\d+\.\s/.test(t.ten));
  const loi = [...kt.loi];
  if (!tData) loi.push(`Tệp không có trang dữ liệu «${cb.sheet}».`);

  const dongMau = [];
  let dongMauCoDuLieu = 0;
  if (tData) {
    const mt = thanhMaTran(tData.dong, soCot);
    for (let i = tt.dongNhan; i < mt.length; i++) {
      const row = mt[i];
      const ma = row[cb.truong.length];
      const rv = row[cb.truong.length + 1];
      const coDl = cb.truong.some((tr, c) => !laCotTinh(tr) && row[c] !== null && row[c] !== '');
      if (coDl) dongMauCoDuLieu++;
      if (ma === null || ma === '') continue;
      dongMau.push({ lay: (L) => row[[...L].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1] ?? null, ma: String(ma), rv: rv === null ? '' : String(rv) });
    }
  }
  return { ok: loi.length === 0, cb, tt, danhMuc, maGoc, dongMau, dongMauCoDuLieu, loi };
}

// ─── mổ trang dữ liệu ───────────────────────────────────────────────────────
/**
 * Thoát chữ cho XML. Ký tự điều khiển (trừ tab và xuống dòng) KHÔNG hợp lệ trong
 * XML 1.0 nên phải bỏ, kẻo Excel báo tệp hỏng. Lọc theo MÃ KÝ TỰ chứ không bằng
 * biểu thức chính quy có dải ký tự điều khiển — cách đó khó đọc và dễ gõ sai.
 */
const thoatXml = (s) => [...String(s)]
  .filter((c) => { const m = c.codePointAt(0); return m > 31 || c === '\t' || c === '\n' || c === '\r'; })
  .join('')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const soCotGoc = (L) => [...String(L)].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
const laSoGhiDuoc = (v) => typeof v === 'number' && Number.isFinite(v) && Math.abs(v) < 1e15;
const soRaChu = (v) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(10))));

/**
 * Mã định dạng (`s=`) cho từng cột: lấy nền từ `<col style>` rồi để dòng dữ liệu
 * đầu của mẫu ghi đè. Nhờ vậy cột không xuất hiện ở dòng đó vẫn có định dạng
 * đúng, không bị trắng trơn giữa bảng.
 */
function kieuTheoCot(xml, dongDau, soCot, tien) {
  const kieu = Array(soCot).fill(null);
  const doc = (chuoi) => {
    const at = {};
    for (const m of chuoi.matchAll(/([\w:]+)="([^"]*)"/g)) at[m[1]] = m[2];
    return at;
  };
  for (const cm of xml.matchAll(new RegExp(`<${tien}col ([^>]*?)/>`, 'g'))) {
    const at = doc(cm[1]);
    const min = Number(at.min); const max = Number(at.max);
    if (!Number.isFinite(min) || at.style === undefined) continue;
    for (let i = min; i <= Math.min(max, soCot); i++) kieu[i - 1] = at.style;
  }
  const rm = xml.match(new RegExp(`<${tien}row [^>]*r="${dongDau}"[^>]*>([\\s\\S]*?)</${tien}row>`));
  if (rm) {
    for (const cm of rm[1].matchAll(new RegExp(`<${tien}c ([^>]*?)(?:/>|>)`, 'g'))) {
      const at = doc(cm[1]);
      const L = String(at.r || '').replace(/\d+/g, '');
      if (!L) continue;
      const i = [...L].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
      if (i >= 0 && i < soCot && at.s !== undefined) kieu[i] = at.s;
    }
  }
  return kieu;
}

/**
 * Dựng lại XML trang dữ liệu: giữ nguyên các dòng ≤ `dongNhan`, thay toàn bộ
 * dòng dưới bằng `rows`.
 */
export function moTrangXml(xmlGoc, { dongNhan, rows, soCot }) {
  const tien = /<x:worksheet/.test(xmlGoc) ? 'x:' : '';
  const moDau = `<${tien}sheetData`;
  let i = xmlGoc.indexOf(moDau);
  if (i < 0) throw new Error('Trang dữ liệu của mẫu không có khối <sheetData> — mẫu không đúng định dạng.');
  const dongTrong = xmlGoc.slice(i, i + moDau.length + 2) === `${moDau}/>`;
  const dauNoiDung = dongTrong ? i + moDau.length + 2 : xmlGoc.indexOf('>', i) + 1;
  const cuoi = dongTrong ? dauNoiDung : xmlGoc.indexOf(`</${tien}sheetData>`, dauNoiDung);
  if (cuoi < 0) throw new Error('Trang dữ liệu của mẫu thiếu thẻ đóng </sheetData>.');
  const than = dongTrong ? '' : xmlGoc.slice(dauNoiDung, cuoi);

  // Giữ các dòng tiêu đề và dòng tên cột đúng nguyên văn (kèm định dạng, chiều cao).
  let giu = '';
  for (const rm of than.matchAll(new RegExp(`<${tien}row [^>]*r="(\\d+)"[^>]*(?:/>|>[\\s\\S]*?</${tien}row>)`, 'g'))) {
    if (Number(rm[1]) <= dongNhan) giu += rm[0];
  }

  const kieu = kieuTheoCot(xmlGoc, dongNhan + 1, soCot, tien);
  const spans = `1:${soCot}`;
  const phan = [];
  rows.forEach((row, n) => {
    const r = dongNhan + 1 + n;
    let o = `<${tien}row r="${r}" spans="${spans}">`;
    for (let c = 0; c < soCot; c++) {
      const s = kieu[c] === null ? '' : ` s="${kieu[c]}"`;
      const ref = `${chuCotCong(c + 1)}${r}`;
      const v = row[c];
      if (v === null || v === undefined || v === '') { o += `<${tien}c r="${ref}"${s} />`; continue; }
      if (laSoGhiDuoc(v)) o += `<${tien}c r="${ref}"${s}><${tien}v>${soRaChu(v)}</${tien}v></${tien}c>`;
      else o += `<${tien}c r="${ref}"${s} t="inlineStr"><${tien}is><${tien}t xml:space="preserve">${thoatXml(v)}</${tien}t></${tien}is></${tien}c>`;
    }
    phan.push(`${o}</${tien}row>`);
  });

  const khoiMoi = `${moDau}>${giu}${phan.join('')}</${tien}sheetData>`;
  const truoc = xmlGoc.slice(0, i);
  const sau = xmlGoc.slice(dongTrong ? dauNoiDung : cuoi + `</${tien}sheetData>`.length);
  // Vùng dữ liệu: chỉ đổi DÒNG cuối, GIỮ cột cuối mà mẫu đã khai (mẫu của cổng
  // khai rộng hơn số cột nghiệp vụ; thu hẹp lại thì tệp đọc ra thiếu cột trống
  // cuối và khó đối chiếu với mẫu gốc).
  const dongCuoi = dongNhan + rows.length;
  const reDim = new RegExp(`<${tien}dimension ref="([A-Z]+)\\d+:([A-Z]+)\\d+"\\s*/>`);
  const cu = (truoc + khoiMoi + sau).match(reDim);
  const cotCuoi = cu && soCotGoc(cu[2]) >= soCot ? cu[2] : chuCotCong(soCot);
  return (truoc + khoiMoi + sau).replace(
    new RegExp(`<${tien}dimension ref="[^"]*"\\s*/>`),
    `<${tien}dimension ref="A1:${cotCuoi}${dongCuoi}" />`,
  );
}

// ─── đóng gói ZIP ───────────────────────────────────────────────────────────
let BANG_CRC = null;
function crc32(buf) {
  if (!BANG_CRC) {
    BANG_CRC = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      BANG_CRC[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = BANG_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

async function nenRaw(bytes) {
  if (typeof CompressionStream === 'undefined') return null;
  try {
    const cs = new CompressionStream('deflate-raw');
    const w = cs.writable.getWriter();
    w.write(bytes); w.close();
    return new Uint8Array(await new Response(cs.readable).arrayBuffer());
  } catch { return null; }
}

/**
 * Đóng danh sách mục thành tệp ZIP.
 * Mỗi mục: { ten, method, crc, full, raw } — `raw` là bytes ĐÃ nén theo `method`.
 */
function dongZip(mucs) {
  const utf8 = new TextEncoder();
  const phan = [];
  const cd = [];
  let off = 0;
  for (const m of mucs) {
    const ten = utf8.encode(m.ten);
    const lh = new Uint8Array(30 + ten.length);
    const dv = new DataView(lh.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 0x0800, true); // tên tệp mã hóa UTF-8
    dv.setUint16(8, m.method, true);
    dv.setUint16(10, 0, true); dv.setUint16(12, 0x21, true); // 1980-01-01, cố định cho tệp dựng lại giống nhau
    dv.setUint32(14, m.crc, true);
    dv.setUint32(18, m.raw.length, true);
    dv.setUint32(22, m.full, true);
    dv.setUint16(26, ten.length, true);
    dv.setUint16(28, 0, true);
    lh.set(ten, 30);
    phan.push(lh, m.raw);

    const ce = new Uint8Array(46 + ten.length);
    const dc = new DataView(ce.buffer);
    dc.setUint32(0, 0x02014b50, true);
    dc.setUint16(4, 20, true); dc.setUint16(6, 20, true);
    dc.setUint16(8, 0x0800, true);
    dc.setUint16(10, m.method, true);
    dc.setUint16(12, 0, true); dc.setUint16(14, 0x21, true);
    dc.setUint32(16, m.crc, true);
    dc.setUint32(20, m.raw.length, true);
    dc.setUint32(24, m.full, true);
    dc.setUint16(28, ten.length, true);
    dc.setUint32(42, off, true);
    ce.set(ten, 46);
    cd.push(ce);
    off += lh.length + m.raw.length;
  }
  const cdSize = cd.reduce((s, x) => s + x.length, 0);
  const eocd = new Uint8Array(22);
  const de = new DataView(eocd.buffer);
  de.setUint32(0, 0x06054b50, true);
  de.setUint16(8, mucs.length, true); de.setUint16(10, mucs.length, true);
  de.setUint32(12, cdSize, true); de.setUint32(16, off, true);

  const tong = off + cdSize + 22;
  const out = new Uint8Array(tong);
  let p = 0;
  for (const x of [...phan, ...cd, eocd]) { out.set(x, p); p += x.length; }
  return out;
}

/** Đường dẫn XML của một trang trong tệp .xlsx. */
async function duongTrang(blob, muc, tenTrang) {
  const wb = await docChuMuc(blob, muc.get('xl/workbook.xml'));
  const rels = muc.get('xl/_rels/workbook.xml.rels') ? await docChuMuc(blob, muc.get('xl/_rels/workbook.xml.rels')) : '';
  const dich = {};
  for (const m of rels.matchAll(/<Relationship\b([^>]*)\/?>/g)) {
    const at = {};
    for (const x of m[1].matchAll(/([\w:]+)="([^"]*)"/g)) at[x[1]] = x[2];
    if (at.Id) dich[at.Id] = at.Target?.startsWith('/') ? at.Target.slice(1) : `xl/${at.Target}`;
  }
  for (const m of wb.matchAll(/<(?:\w+:)?sheet\b([^>]*)\/?>/g)) {
    const at = {};
    for (const x of m[1].matchAll(/([\w:]+)="([^"]*)"/g)) at[x[1]] = x[2];
    const ten = String(at.name || '').replace(/&(lt|gt|amp|quot|apos);/g, (_, e) => ({ lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" }[e]));
    if (ten === tenTrang) return dich[at['r:id']] || null;
  }
  return null;
}

/**
 * Điền `rows` vào mẫu `blob` rồi trả về bytes của tệp .xlsx mới.
 * Mọi mục khác của tệp được chép nguyên si ở dạng đã nén.
 */
export async function dungTepCong(blob, { cb, tt, rows }) {
  const muc = await docMucLucZip(blob);
  const duong = (await duongTrang(blob, muc, cb.sheet)) || (tt?.sheet ? await duongTrang(blob, muc, tt.sheet) : null);
  if (!duong || !muc.get(duong)) throw new Error(`Không tìm được trang «${cb.sheet}» trong mẫu.`);

  const xml = await docChuMuc(blob, muc.get(duong));
  const moi = moTrangXml(xml, { dongNhan: tt?.dongNhan || 2, rows, soCot: cb.truong.length + 2 });
  const bytesMoi = new TextEncoder().encode(moi);
  const nen = await nenRaw(bytesMoi);

  const mucs = [];
  for (const [ten, m] of muc) {
    if (ten === duong) {
      mucs.push({ ten, method: nen ? 8 : 0, crc: crc32(bytesMoi), full: bytesMoi.length, raw: nen || bytesMoi });
    } else {
      mucs.push({ ten, method: m.method, crc: m.crc, full: m.full, raw: await bytesNenMuc(blob, m) });
    }
  }
  return dongZip(mucs);
}

